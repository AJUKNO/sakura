import { BaseElement } from '@/elements/base-element'
import { IAccordion } from '@/types/interfaces'

/**
 * Accordion
 * @extends BaseElement
 * @implements IAccordion
 */
class Accordion extends BaseElement implements IAccordion {
  elements:
    | { header: HTMLElement | undefined; content: HTMLElement | undefined }
    | undefined
  expanded: boolean | undefined

  disconnectedCallback(): void {}

  init(): void {
    // Get elements
    this.elements = {
      header: this.querySelector(
        `[data-id=${this.identifier}-header-${this.section}]`,
      ) as HTMLElement,
      content: this.querySelector(
        `[data-id=${this.identifier}-content-${this.section}]`,
      ) as HTMLElement,
    }

    // Set expanded state
    this.expanded = this.hasAttribute('data-expanded')

    // Add event listeners
    this.elements.header?.addEventListener('click', this.onToggle.bind(this))
  }

  onToggle(event: Event): void {
    // Prevent default behavior
    event.preventDefault()

    // Toggle the max-height of the content element
    if (this.elements?.content?.style.maxHeight) {
      this.elements?.content?.style.setProperty('max-height', null)
      this.elements?.content?.setAttribute('aria-hidden', 'true')
      this.elements?.header?.setAttribute('aria-expanded', 'false')
      this.expanded = false
      this.toggleAttribute('data-expanded', false)
    } else {
      this.elements?.content?.style.setProperty(
        'max-height',
        `${this.elements?.content?.scrollHeight}px`,
      )
      this.elements?.content?.setAttribute('aria-hidden', 'false')
      this.elements?.header?.setAttribute('aria-expanded', 'true')
      this.expanded = true
      this.toggleAttribute('data-expanded', true)
    }
  }
}

export default Accordion
