import { BaseElement } from '@/elements/base-element'
import { ILocalizationForm } from '@/types/interfaces'

/**
 * LocalizationForm
 * @extends BaseElement
 * @implements ILocalizationForm
 */
class LocalizationForm extends BaseElement implements ILocalizationForm {
  elements:
    | {
        input: HTMLInputElement | undefined
        button: HTMLButtonElement | undefined
        panel: HTMLElement | undefined
      }
    | undefined

  init(): void {
    // Get elements
    this.elements = {
      input: this.querySelector(
        'input[name="language_code"], input[name="country_code"]',
      ) as HTMLInputElement,
      button: this.querySelector('button') as HTMLButtonElement,
      panel: this.querySelector('ul') as HTMLElement,
    }

    // Add event listeners
    this.elements.button?.addEventListener('click', this.openSelector.bind(this))
    this.elements.button?.addEventListener('focusout', this.closeSelector.bind(this))
    this.addEventListener('keyup', this.onContainerKeyUp.bind(this))
    this.querySelectorAll('a').forEach((item) =>
      item.addEventListener('click', this.onItemClick.bind(this)),
    )
  }

  disconnectedCallback(): void {
    if (this.elements?.button) {
      this.elements.button.removeEventListener('click', this.openSelector.bind(this))
      this.elements.button.removeEventListener(
        'focusout',
        this.closeSelector.bind(this),
      )
    }
    this.removeEventListener('keyup', this.onContainerKeyUp.bind(this))
    this.querySelectorAll('a').forEach((item) =>
      item.removeEventListener('click', this.onItemClick.bind(this)),
    )
  }

  closeSelector(event: FocusEvent): void {
    const shouldClose =
      event.relatedTarget &&
      (event.relatedTarget as HTMLElement).nodeName === 'BUTTON'

    if (event.relatedTarget === null || shouldClose) {
      this.hidePanel()
    }
  }

  hidePanel(): void {
    this.elements?.button?.setAttribute('aria-expanded', 'false')
    this.elements?.panel?.setAttribute('hidden', 'true')
  }

  onContainerKeyUp(event: KeyboardEvent): void {
    if (event.code.toUpperCase() !== 'ESCAPE') return

    this.hidePanel()
    this.elements?.button?.focus()
  }

  onItemClick(event: Event): void {
    event.preventDefault()
    const form = this.querySelector('form')
    if (this.elements?.input) {
      this.elements.input.value = (event.currentTarget as HTMLElement).dataset.value!
    }

    if (form) form.submit()
  }

  openSelector(): void {
    this.elements?.button?.focus()
    this.elements?.panel?.toggleAttribute('hidden')
    this.elements?.button?.setAttribute(
      'aria-expanded',
      (this.elements.button.getAttribute('aria-expanded') === 'false').toString(),
    )
  }
}

export default LocalizationForm
