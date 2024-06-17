import { BaseElement } from '@/elements/base-element'
import { IQuantitySelector } from '@/types/interfaces'

/**
 * QuantitySelector
 * @extends BaseElement
 * @implements IQuantitySelector
 */
class QuantitySelector extends BaseElement implements IQuantitySelector {
  elements:
    | {
        decreaseButton: HTMLButtonElement | undefined
        increaseButton: HTMLButtonElement | undefined
        input: HTMLInputElement | undefined
      }
    | undefined

  init(): void {
    // Get elements
    this.elements = {
      decreaseButton: this.querySelector(
        `[data-id=${this.identifier}-decrease-${this.section ?? ''}]`,
      ) as HTMLButtonElement,
      increaseButton: this.querySelector(
        `[data-id=${this.identifier}-increase-${this.section ?? ''}]`,
      ) as HTMLButtonElement,
      input: this.querySelector(
        `[data-id=${this.identifier}-input-${this.section ?? ''}]`,
      ) as HTMLInputElement,
    }

    // Set event listeners
    this.setListeners()
  }

  disconnectedCallback(): void {
    this.removeListeners()
  }

  onButtonClick(event: Event): void {
    event.preventDefault()

    const action = (event.currentTarget as HTMLButtonElement).name
    const previousValue = this.elements?.input?.value
    action === 'decrease' ? this.decrement() : this.increment()

    if (previousValue !== this.elements?.input?.value) {
      this.elements?.input?.dispatchEvent(new Event('change', { bubbles: true }))
    }
  }

  onInputChange(event: Event): void {
    event.preventDefault()
    this.validate()
  }

  validate(): void {}

  private setListeners(): void {
    this.elements?.decreaseButton?.addEventListener(
      'click',
      this.onButtonClick.bind(this),
    )
    this.elements?.increaseButton?.addEventListener(
      'click',
      this.onButtonClick.bind(this),
    )
    this.elements?.input?.addEventListener('change', this.onInputChange.bind(this))
  }

  private removeListeners(): void {
    this.elements?.decreaseButton?.removeEventListener(
      'click',
      this.onButtonClick.bind(this),
    )
    this.elements?.increaseButton?.removeEventListener(
      'click',
      this.onButtonClick.bind(this),
    )
    this.elements?.input?.removeEventListener(
      'change',
      this.onInputChange.bind(this),
    )
  }

  private increment(): void {
    this.elements?.input?.stepUp()
  }

  private decrement(): void {
    this.elements?.input?.stepDown()
  }
}

export default QuantitySelector
