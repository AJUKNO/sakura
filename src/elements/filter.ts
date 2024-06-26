import { IFilter } from '@/types/interfaces'
import DrawerElement from '@/elements/drawer-element'

/**
 * Filter
 * @extends BaseElement
 * @implements IFilter
 */
class Filter extends DrawerElement implements IFilter {
  filtering: boolean | undefined
  sorting: boolean | undefined

  init(): void {
    super.init()

    // Get data attributes
    this.filtering = this.hasAttribute('data-filtering')
    this.sorting = this.hasAttribute('data-sorting')

    this.addEventListener('change', this.handleFilterChange.bind(this))
  }

  disconnectedCallback(): void {
    // Remove event listeners
    super.init()
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

    this.toggleOpen(false)

    // Update the URL
    window.location.href = newUrl
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
