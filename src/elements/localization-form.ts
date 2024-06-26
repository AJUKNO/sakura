import { BaseElement } from '@/elements/base-element'
import { ILocalizationForm } from '@/types/interfaces'
import DrawerElement from '@/elements/drawer-element'

/**
 * LocalizationForm
 * @extends BaseElement
 * @implements ILocalizationForm
 */
class LocalizationForm extends DrawerElement implements ILocalizationForm {
  elements:
    | {
        input: HTMLInputElement | undefined
        button: HTMLButtonElement | undefined
        panel: HTMLElement | undefined
      }
    | undefined

  init(): void {
    super.init()

    // Get elements
    this.elements = {
      input: this.querySelector(
        'input[name="language_code"], input[name="country_code"]',
      ) as HTMLInputElement,
      button: this.querySelector('button') as HTMLButtonElement,
      panel: this.querySelector('ul') as HTMLElement,
    }

    // Add event listeners
    this.querySelectorAll('a').forEach((item) =>
      item.addEventListener('click', this.onItemClick.bind(this)),
    )
  }

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.querySelectorAll('a').forEach((item) =>
      item.removeEventListener('click', this.onItemClick.bind(this)),
    )
  }

  onItemClick(event: Event): void {
    event.preventDefault()
    const form = this.querySelector('form')
    if (this.elements?.input) {
      this.elements.input.value = (event.currentTarget as HTMLElement).dataset.value!
    }

    if (form) form.submit()
  }
}

export default LocalizationForm
