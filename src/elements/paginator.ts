import { BaseElement } from '@/elements/base-element'
import { HTMLParser, HttpClient } from '@/utils/general'
import { SakuraLogger } from '@/utils/logger'
import { IPaginator, IPaginatorNavigation } from '@/types/interfaces'
import { animations } from '@/utils/animations'

/**
 * Paginator
 * @extends BaseElement
 * @implements IPaginator
 */
class Paginator extends BaseElement implements IPaginator {
  elements:
    | {
        pagination: PaginatorNavigation | undefined
        container: HTMLElement | undefined
        previous: HTMLElement | undefined
      }
    | undefined
  enabled: boolean | undefined
  observer: IntersectionObserver | undefined
  page: number | undefined

  init(): void {
    // Get elements
    this.elements = {
      pagination: this.querySelector(
        `[data-id=${this.identifier}-navigation-${this.section}]`,
      ) as PaginatorNavigation,
      container: this.querySelector(
        `[data-id=${this.identifier}-container-${this.section}]`,
      ) as HTMLElement,
      previous: this.querySelector(
        `[data-id=${this.identifier}-previous-${this.section}]`,
      ) as HTMLElement,
    }

    // Set initial page number
    this.page = parseInt(
      new URL(window.location.href).searchParams.get('page') || '1',
    )
    this.enabled = this.hasAttribute('data-enabled')

    this.setListeners()
  }

  disconnectedCallback(): void {
    this.removeListeners()
  }

  async loadMore(): Promise<void> {
    try {
      // If there is no pagination or next URL, return
      if (!this.elements?.pagination || !this.elements?.pagination.nextUrl) return

      // Set loading to true
      this.toggleLoading(true)

      const html = await HttpClient.get(this.elements.pagination.nextUrl).then(
        (res) => res.text(),
      )

      // Parse the HTML
      const parsedHTML = HTMLParser(html)

      // Get the new grid and pagination elements
      const newGrid = parsedHTML.querySelector(
        `[data-id=${this.identifier}-container-${this.section}]`,
      )
      const newPagination = parsedHTML.querySelector(
        `[data-id=${this.identifier}-navigation-${this.section}]`,
      ) as PaginatorNavigation

      // If the new grid is not found, throw an error
      if (!newGrid) throw new Error('Grid not found')

      // Set the next URL and render the new pagination
      this.elements.pagination!.setNextUrl(newPagination?.dataset.nextUrl || '')
      this.elements.pagination!.render(newPagination?.innerHTML || '')

      // Append the new grid to the container
      this.elements.container!.insertAdjacentHTML('beforeend', newGrid.innerHTML)

      // Replace the old pagination with the new one
      this.elements.pagination?.replaceWith(this.elements.pagination)
    } catch (error) {
      SakuraLogger.e('Paginator', (<Error>error).message)
    } finally {
      animations()
      this.toggleLoading(false)
    }
  }

  handleIntersection(entries: IntersectionObserverEntry[]): void {
    // Iterate over the entries
    entries.forEach(async (entry) => {
      // If the entry is intersecting and not loading, load more
      if (entry.isIntersecting && !this.loading) {
        await this.loadMore()
      }
    })
  }

  setPagination(pagination: PaginatorNavigation): void {
    // If pagination is provided, set it
    if (pagination && this.elements) {
      this.elements.pagination = pagination
    }
  }

  private setListeners(): void {
    if (this.elements?.pagination && this.enabled) {
      this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      })

      this.observer.observe(this.elements.pagination)
    }
  }

  private removeListeners(): void {
    if (this.observer && this.elements?.pagination) {
      this.observer.unobserve(this.elements.pagination)
      this.observer.disconnect()
    }
  }
}

/**
 * PaginatorNavigation
 * @extends BaseElement
 * @implements IPaginatorNavigation
 */
class PaginatorNavigation extends BaseElement implements IPaginatorNavigation {
  nextUrl: string | undefined

  init(): void {
    this.nextUrl = this.dataset.nextUrl || undefined
  }

  disconnectedCallback(): void {}

  render(html: string): void {
    this.innerHTML = html
  }

  setNextUrl(url: string): void {
    this.setAttribute('data-next-url', url)
    this.nextUrl = url
  }
}

export { Paginator, PaginatorNavigation }
