import { BaseElement } from '@/elements/base-element'
import { IProductForm } from '@/types/interfaces'
import { SakuraLogger } from '@/utils/logger'
import { SakuraPS } from '@/utils/pubsub'
import {
  SakuraCartEvent,
  SakuraProductEvent,
  SakuraSubscriberCallback,
} from '@/types/events'
import { HTMLParser, HttpClient } from '@/utils/general'

/**
 * ProductForm
 * @extends BaseElement
 * @implements IProductForm
 */
class ProductForm extends BaseElement implements IProductForm {
  submitButton: HTMLButtonElement | undefined
  form: HTMLFormElement | undefined

  public init(): void {
    // Get elements
    this.getElements()

    this.debug && SakuraLogger.d('Found elements', this.submitButton, this.form)

    // Set hidden variant id input to enabled
    this.removeHiddenVariantId()

    // Set event listeners
    this.setListeners()
  }

  public disconnectedCallback(): void {
    this.removeListeners()
  }

  public onVariantUnavailable(): void {
    this.toggleSubmitButton({
      state: false,
      label: window.Shopify.strings.labels.variant.soldOut,
    })
  }

  public onVariantChange(data: unknown): void {
    // Get the ATC button from the data
    const atcButton: HTMLButtonElement | null = HTMLParser(
      data as string,
    ).querySelector(`[data-id=${this.identifier}-submit-button-${this.section}]`)

    if (atcButton?.hasAttribute('disabled')) {
      this.toggleSubmitButton({
        state: false,
        label: window.Shopify.strings.labels.variant.soldOut,
      })
    } else {
      this.toggleSubmitButton({
        state: true,
        label: window.Shopify.strings.labels.variant.addToCart,
      })
    }
  }

  public async onFormSubmit(event: Event): Promise<void> {
    // Prevent the default form submission
    event.preventDefault()

    try {
      // If submit button is disabled, return early
      if (this.submitButton?.hasAttribute('disabled')) return

      // Reset the error state
      this.toggleError(false, '')

      // Set loading state
      this.toggleLoading(true)

      const res: {
        status: boolean
        description: string
        sections: {
          'cart-drawer': string
        }
      } = await HttpClient.post(
        `${window.Shopify.strings.routes.cart.add}.js?sections=cart-drawer`,
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: new FormData(this.form),
        },
      ).then((res) => res.json())

      if (res.status) throw new Error(res.description)

      // Handle cart updates with PubSub
      // Drawer will handle the rest
      await SakuraPS.publish(SakuraCartEvent.ADD_ITEM, res.sections['cart-drawer'])
    } catch (error) {
      console.log(error)
      this.toggleError(true, (<Error>error).message)
    } finally {
      this.toggleLoading(false)
    }
  }

  public toggleSubmitButton(options: {
    state: boolean
    label?: string | undefined
  }): void {
    // If submit button is not found, return early
    if (!this.submitButton) return

    // Set the aria-disabled attribute
    this.submitButton.setAttribute('aria-disabled', options.state ? 'false' : 'true')

    // Toggle the disabled attribute
    this.submitButton.disabled = !options.state

    // Set the label if provided
    if (options.label) {
      const spanElement = this.submitButton.querySelector('span')
      if (spanElement) {
        spanElement.textContent = options.label
      }
    }
  }

  private setListeners(): void {
    // Set event listeners
    this.form?.addEventListener('submit', this.onFormSubmit.bind(this))

    // Subscribe to PubSub events
    SakuraPS.batchSubscribe([
      [
        SakuraProductEvent.VARIANT_CHANGE,
        <SakuraSubscriberCallback>this.onVariantChange.bind(this),
      ],
      [
        SakuraProductEvent.VARIANT_UNAVAILABLE,
        <SakuraSubscriberCallback>this.onVariantUnavailable.bind(this),
      ],
    ])
  }

  private removeListeners(): void {
    // Remove event listeners
    this.form?.removeEventListener('submit', this.onFormSubmit.bind(this))

    // Unsubscribe from PubSub events
    SakuraPS.unsubscribe(
      SakuraProductEvent.VARIANT_UNAVAILABLE,
      <SakuraSubscriberCallback>this.onVariantUnavailable.bind(this),
    )
    SakuraPS.unsubscribe(
      SakuraProductEvent.VARIANT_CHANGE,
      <SakuraSubscriberCallback>this.onVariantChange.bind(this),
    )
  }

  private getElements(): void {
    this.submitButton = this.querySelector(
      `[data-id=${this.identifier}-submit-button-${this.section}]`,
    ) as HTMLButtonElement
    this.form = this.querySelector(
      `[data-id=${this.identifier}-${this.section}]`,
    ) as HTMLFormElement
  }

  private removeHiddenVariantId(): void {
    this.querySelector(
      `[data-id=${this.identifier}-variant-id-${this.section}]`,
    )?.removeAttribute('disabled')
  }
}

export default ProductForm
