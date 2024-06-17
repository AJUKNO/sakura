import { BaseElement } from '@/elements/base-element'
import { IFilter } from '@/types/interfaces'

/**
 * Filter
 * @extends BaseElement
 * @implements IFilter
 */
class Filter extends BaseElement implements IFilter {
  elements:
    | {
        openButton: HTMLButtonElement | undefined
        closeButton: HTMLButtonElement | undefined
      }
    | undefined
  filtering: boolean | undefined
  open: boolean | undefined
  sorting: boolean | undefined

  init(): void {
    // Get elements
    this.elements = {
      openButton: document.querySelector(
        `[data-id=${this.identifier}-open-${this.section}]`,
      ) as HTMLButtonElement,
      closeButton: this.querySelector(
        `[data-id=${this.identifier}-close-${this.section}]`,
      ) as HTMLButtonElement,
    }

    // Get data attributes
    this.open = this.hasAttribute('data-open')
    this.filtering = this.hasAttribute('data-filtering')
    this.sorting = this.hasAttribute('data-sorting')

    // Init listeners
    if (this.elements.openButton) {
      this.elements.openButton.addEventListener('click', (event) =>
        this.toggleFilter(event, true),
      )
    }
    if (this.elements.closeButton) {
      this.elements.closeButton.addEventListener('click', (event) =>
        this.toggleFilter(event, false),
      )
    }
    this.addEventListener('click', this.handleOutsideClick.bind(this))
    this.addEventListener('change', this.handleFilterChange.bind(this))
  }

  disconnectedCallback(): void {
    // Remove event listeners
    this.elements?.openButton?.removeEventListener('click', (event) =>
      this.toggleFilter(event, true),
    )
    this.elements?.closeButton?.removeEventListener('click', (event) =>
      this.toggleFilter(event, false),
    )
    this.removeEventListener('click', this.handleOutsideClick.bind(this))
    this.removeEventListener('change', this.handleFilterChange.bind(this))
  }

  handleFilterChange(event: Event): void {
    // Prevent default form submission
    event.preventDefault()

    // Get the new query parameter
    const newQueryParam = new QueryParam(
      (event.target as HTMLInputElement).name,
      (event.target as HTMLInputElement).value,
    )

    // Get the URL search parameters
    const urlParams = new URLSearchParams(window.location.search)

    if (this.filtering) {
      // Check if the new query parameter already exists in the URL parameters
      if (urlParams.has(newQueryParam.key, newQueryParam.value)) {
        // Remove the existing query parameter
        urlParams.delete(newQueryParam.key, newQueryParam.value)
      } else {
        // Add the new query parameter
        urlParams.append(newQueryParam.key, newQueryParam.value)
      }
    }

    if (this.sorting && newQueryParam.key === 'sort_by') {
      // Check if the new query parameter already exists in the URL parameters
      if (urlParams.has(newQueryParam.key)) {
        // Replace the existing sort_by parameter
        urlParams.set(newQueryParam.key, newQueryParam.value)
      } else {
        // Add the new query parameter
        urlParams.append(newQueryParam.key, newQueryParam.value)
      }
    }

    // Construct the new URL with the updated query parameters
    let newUrl = `${window.location.origin}${window.location.pathname}`
    if (urlParams.toString() !== '') {
      newUrl += `?${urlParams.toString()}`
    }

    this.toggleFilter(event, false)

    // Update the URL
    window.location.href = newUrl
  }

  handleOutsideClick(event: Event): void {
    // Check if the click event is outside the filter drawer
    if (
      event.target != null &&
      (event.target as HTMLElement).closest(
        `[data-id=${this.identifier}-drawer-${this.section}]`,
      )
    )
      return

    this.toggleFilter(event, false)
  }

  toggleFilter(event: Event, state: boolean): void {
    // Prevent default form submission
    event.preventDefault()

    // Toggle the filter state
    this.open = state
    this.toggleAttribute('data-open', state)
  }
}

/**
 * QueryParam
 * Used to represent a query parameter
 */
class QueryParam {
  public key: string
  public value: string

  constructor(key: string, value: string) {
    this.key = key
    this.value = value
  }

  equals(other: QueryParam): boolean {
    return this.key === other.key && this.value === other.value
  }
}

export default Filter
