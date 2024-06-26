import { debounce, HTMLParser, HttpClient } from '@/utils/general'
import { SakuraLogger } from '@/utils/logger'
import { BaseElement } from '@/elements/base-element'
import { IBaseElement } from '@/types/interfaces'
import { animations } from '@/utils/animations'

export interface IPredictiveSearch extends IBaseElement {
  elements:
    | {
        input: HTMLInputElement | undefined
        container: HTMLElement | undefined
      }
    | undefined
  resultsOpen: boolean | undefined

  onChange(): Promise<void>
  getSearchResults(searchTerm: string): Promise<void>
  toggleResults(state: boolean): void
}

class PredictiveSearch extends BaseElement implements IPredictiveSearch {
  resultsOpen: boolean | undefined
  elements:
    | { input: HTMLInputElement | undefined; container: HTMLElement | undefined }
    | undefined

  disconnectedCallback() {
    this.elements?.input?.removeEventListener('input', this.inputHandler)
  }

  init() {
    // Get attributes
    this.resultsOpen = this.hasAttribute('data-results-open')

    // Get elements
    this.elements = {
      input: this.querySelector("input[type='search']") as HTMLInputElement,
      container: this.querySelector(
        `[data-id=${this.identifier}-container]`,
      ) as HTMLElement,
    }

    // Set event listeners
    this.elements?.input?.addEventListener(
      'input',
      debounce(async () => {
        await this.onChange()
      }, 300).bind(this),
    )
  }

  async onChange(): Promise<void> {
    const searchTerm = this.elements?.input?.value.trim()
    if (!searchTerm?.length) {
      this.toggleResults(false)
      return
    }

    await this.getSearchResults(searchTerm)
  }

  async getSearchResults(searchTerm: string): Promise<void> {
    try {
      const html = await HttpClient.get(
        `${window.Shopify.strings.routes.search.predictiveSearch}?q=${searchTerm}&section_id=predictive-search`,
      ).then((res) => {
        if (!res.ok) {
          throw new Error(res.status.toString())
        }

        return res.text()
      })

      const resultsMarkup = HTMLParser(html).querySelector(
        '#shopify-section-predictive-search',
      )?.innerHTML
      if (this.elements?.container && resultsMarkup) {
        this.elements.container.innerHTML = resultsMarkup
        this.toggleResults(true)
      }
    } catch (error) {
      this.toggleResults(false)
      SakuraLogger.e('Error fetching search results', (<Error>error).message)
    } finally {
      animations()
    }
  }

  toggleResults(state: boolean): void {
    this.resultsOpen = state
    this.toggleAttribute('data-results-open', state)
  }

  private inputHandler() {
    debounce(async () => {
      await this.onChange()
    }, 300).bind(this)
  }
}

// class PredictiveSearch extends HTMLElement {
//   constructor() {
//     super();
//
//     this.input = this.querySelector('input[type="search"]');
//     this.predictiveSearchResults = this.querySelector('#predictive-search');
//
//     this.input.addEventListener('input', this.debounce((event) => {
//       this.onChange(event);
//     }, 300).bind(this));
//   }
//
//   onChange() {
//     const searchTerm = this.input.value.trim();
//
//     if (!searchTerm.length) {
//       this.close();
//       return;
//     }
//
//     this.getSearchResults(searchTerm);
//   }
//
//   getSearchResults(searchTerm) {
//     fetch(`/search/suggest?q=${searchTerm}&section_id=predictive-search`)
//       .then((response) => {
//         if (!response.ok) {
//           var error = new Error(response.status);
//           this.close();
//           throw error;
//         }
//
//         return response.text();
//       })
//       .then((text) => {
//         const resultsMarkup = new DOMParser().parseFromString(text, 'text/html').querySelector('#shopify-section-predictive-search').innerHTML;
//         this.predictiveSearchResults.innerHTML = resultsMarkup;
//         this.open();
//       })
//       .catch((error) => {
//         this.close();
//         throw error;
//       });
//   }
//
//   open() {
//     this.predictiveSearchResults.style.display = 'block';
//   }
//
//   close() {
//     this.predictiveSearchResults.style.display = 'none';
//   }
//
//   debounce(fn, wait) {
//     let t;
//     return (...args) => {
//       clearTimeout(t);
//       t = setTimeout(() => fn.apply(this, args), wait);
//     };
//   }
// }
//
// customElements.define('predictive-search', PredictiveSearch);

export default PredictiveSearch
