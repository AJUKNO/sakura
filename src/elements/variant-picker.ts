import { BaseElement } from '@/elements/base-element'
import { Variant } from '@/types/shopify'
import { SakuraPS } from '@/utils/pubsub'
import { SakuraProductEvent } from '@/types/events'
import { SakuraLogger } from '@/utils/logger'
import { HTMLParser, HttpClient } from '@/utils/general'
import { IVariantPicker } from '@/types/interfaces'
import { animations } from '@/utils/animations'

/**
 * VariantPicker
 * @extends BaseElement
 * @implements IVariantPicker
 */
class VariantPicker extends BaseElement implements IVariantPicker {
  selectedOptions: string[] | undefined
  selectedVariant: Variant | undefined
  updateUrl: boolean | undefined
  url: string | undefined
  variants: Variant[] | undefined

  public init(): void {
    // Get data attributes
    this.updateUrl = this.hasAttribute('data-update-url')
    this.url = this.getAttribute('data-url') || undefined

    // Get data from the JSON script tag
    const jsonData = this.querySelector('[type="application/json"]')
    if (jsonData) {
      this.variants = JSON.parse(jsonData.textContent!)
    }

    // Set event listeners
    this.addEventListener('change', this.onVariantChange.bind(this))
  }

  disconnectedCallback(): void {
    // Remove event listeners
    this.removeEventListener('change', this.onVariantChange.bind(this))
  }

  async fetchProductInfo(): Promise<void> {
    try {
      await SakuraPS.publish(SakuraProductEvent.INFO_LOADING, true)

      const html: string = await HttpClient.get(
        `${this.url}?variant=${this.selectedVariant!.id}&section_id=${this.section}`,
      ).then((res) => res.text())

      // const pickupAvailability = document.querySelector(
      //   'cmp-pickup-availability',
      // ) as
      //
      // pickupAvailability.variantId = this._selectedVariant!.id.toString()

      await SakuraPS.publish(SakuraProductEvent.VARIANT_CHANGE, html)

      const mediaSource = HTMLParser(html).querySelectorAll(
        '[data-id=product-gallery] [data-media-id]',
      )

      const currentMedia = document.querySelectorAll(
        `[data-id=product-gallery] [data-media-id]`,
      )

      if (
        (currentMedia[0] as HTMLElement).dataset.mediaId !==
        (mediaSource[0] as HTMLElement).dataset.mediaId
      ) {
        currentMedia[0].replaceWith(mediaSource[0])
      }
    } catch (error) {
      SakuraLogger.e('Error fetching product info', error)
    } finally {
      animations()
      await SakuraPS.publish(SakuraProductEvent.INFO_LOADING, false)
    }
  }

  async onVariantChange(): Promise<void> {
    this.updateOptions()
    this.updateSelectedVariant()
    this.updateStatuses()

    this.debug && SakuraLogger.d('Selected variant', this.selectedVariant)

    if (!this.selectedVariant) {
      this.debug && SakuraLogger.d('Variant unavailable')
      await SakuraPS.publish(SakuraProductEvent.VARIANT_UNAVAILABLE)
    } else {
      this.debug && SakuraLogger.d('Variant available')
      this.updateForms()
      this.updateURL()
      await this.fetchProductInfo()
    }
  }

  updateForms(): void {
    // Update the forms with the selected variant
    const forms = document.querySelectorAll(
      `#product-form-${this.section}, 
      #product-form-installment-${this.section}`,
    )

    forms.forEach((form) => {
      const hiddenInput = form.querySelector('input[name="id"]') as HTMLInputElement

      if (hiddenInput && this.selectedVariant) {
        hiddenInput.value = this.selectedVariant.id.toString()
        hiddenInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })
  }

  updateOptions(): string[] {
    // Store the selected value of every select element in an array
    this.selectedOptions = Array.from(this.querySelectorAll('select'), (select) => {
      return select.value
    })

    // Return the array
    return this.selectedOptions
  }

  updateSelectedVariant(): Variant | undefined {
    // Find the selected variant
    this.selectedVariant = this.variants?.find((variant: Variant) => {
      // For every option in the variant, check if it matches the selected option
      // If every option matches, return the variant
      return variant.options.every(
        (option: string, index: number) => option === this.selectedOptions?.[index],
      )
    })

    // Return the selected variant
    return this.selectedVariant
  }

  updateStatuses(): void {
    const selectedOption1 = this.variants?.filter(
      (variant: Variant) =>
        (this.querySelector(':checked') as HTMLInputElement)!.value ===
        variant.options[0],
    )

    const inputWrappers = [
      ...this.querySelectorAll(`[data-id=${this.identifier}-input]`),
    ]

    inputWrappers.forEach((option, index) => {
      if (index === 0) return

      const optionInputs = [
        ...option.querySelectorAll('input[type="radio"], option'),
      ]

      const previousOptionSelected = (
        inputWrappers[index - 1].querySelector(':checked') as HTMLInputElement
      ).value

      if (selectedOption1) {
        const availableOptions = selectedOption1
          .filter(
            (variant: Variant) =>
              variant.available &&
              variant[`option${index}`] === previousOptionSelected,
          )
          .map((variant) => variant[`option${index + 1}`])

        optionInputs.forEach((input: any) => {
          if (availableOptions.includes(input.getAttribute('value'))) {
            input.innerText = input.getAttribute('value')
          } else {
            input.innerText =
              window.Shopify.strings.labels.variant.unavailableWithOption.replace(
                '[value]',
                input.getAttribute('value'),
              )
          }
        })
      }
    })
  }

  updateURL(): void {
    // Update the URL with the selected variant
    if (this.updateUrl && this.selectedVariant) {
      window.history.replaceState(
        {},
        '',
        `${this.url}?variant=${this.selectedVariant.id}`,
      )
    }
  }
}

export default VariantPicker
