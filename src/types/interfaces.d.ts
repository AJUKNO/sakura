import { artValues } from '@/utils/general'
import { ISakuraPubSub } from '@/types/events'
import { Variant } from '@/types/shopify'
import { PaginatorNavigation } from '@/elements/paginator'
import { BaseElement } from '@/elements/base-element'
import { CursorState } from '@/elements/cursor'
import { IBaseElement } from '@/types/interfaces'
import { IDrawerElement } from '@/elements/drawer-element'

/**
 * Interface representing the main Sakura object with methods for initialization, custom element definition, and logging.
 */
export interface ISakura {
  customElementsRegistry: Map<string, CustomElementConstructor>
  options: ISakuraOptions
  logger: ILogger
  pubSub: ISakuraPubSub

  /**
   * Initialize Sakura
   * @param options - Options to initialize Sakura
   */
  init(options: ISakuraOptions): void

  /**
   * Define custom elements
   * @param elements - Array of custom elements to define
   */
  define(elements: ICustomElement[]): void

  /**
   * Reset Sakura, redefines custom elements
   */
  reset(): void

  /**
   * Log ASCII art and greeting
   * @param art - ASCII art to log
   * @param greeting - Optional greeting message
   */
  kawaii(art: SakuraArt, greeting?: string): void
}

/**
 * Type representing the possible values of ASCII art.
 */
export type SakuraArt = (typeof artValues)[number]

/**
 * Interface representing the options for initializing Sakura.
 */
export interface ISakuraOptions {
  barba?: boolean
  locomotive?: boolean
  debug?: boolean
  prefix?: string
  kawaii?: {
    art: SakuraArt
    greeting?: string
  }
}

/**
 * Interface representing a custom element with its tag name and constructor.
 */
export interface ICustomElement {
  tagName: string
  elementClass: CustomElementConstructor
}

/**
 * Interface representing a logger with methods for different log levels.
 */
export interface ILogger {
  d(message: string, ...data: unknown[]): void
  i(message: string, ...data: unknown[]): void
  e(message: string, ...data: unknown[]): void
  w(message: string, ...data: unknown[]): void

  /**
   * Starts a timer with a label
   * @param label - The label for the timer
   */
  time(label: string): void

  /**
   * Stops a timer with a label
   * @param label - The label for the timer
   */
  timeEnd(label: string): void
}

/**
 * Interface representing a base element with common methods and properties.
 */
export interface IBaseElement extends HTMLElement {
  identifier: string | undefined
  section: string | undefined
  debug: boolean | undefined
  loading: boolean | undefined
  error: boolean | undefined

  /**
   * Connected callback to initialize the element
   */
  connectedCallback(): void

  /**
   * Disconnected callback to clean up the element
   */
  disconnectedCallback(): void

  /**
   * Initialize the element
   */
  init(): void

  /**
   * Toggle loading state
   * @param state - The loading state to set
   */
  toggleLoading(state: boolean): void

  /**
   * Toggle error state
   * @param state - The error state to set
   * @param message - Optional error message
   */
  toggleError(state: boolean, message?: string | undefined): void

  /**
   * Set error message
   * @param message - The error message to set
   */
  setError(message: string): void
}

/**
 * Interface representing a product form element with specific methods related to product interactions.
 */
export interface IProductForm {
  submitButton: HTMLButtonElement | undefined
  form: HTMLFormElement | undefined

  /**
   * Toggles the submit button state.
   * @param {Object} options - The options object.
   * @param {boolean} options.state - The state to set for the submit button.
   * @param {string} [options.label] - The optional label to set for the submit button.
   * @returns {void}
   */
  toggleSubmitButton(options: { state: boolean; label?: string }): void

  /**
   * Handles the scenario when a variant is unavailable. Uses PubSub to receive relevant data.
   * @returns {void}
   */
  onVariantUnavailable(): void

  /**
   * Handles changes to the product variant. Uses PubSub to receive variant change data.
   * @param {unknown} data - The data related to the variant change.
   * @returns {void}
   */
  onVariantChange(data: unknown): void

  /**
   * Handles the form submission event asynchronously.
   * @param {Event} event - The form submission event.
   * @returns {Promise<void>} - A promise that resolves when the form submission handling is complete.
   */
  onFormSubmit(event: Event): Promise<void>
}

/**
 * Interface representing product information with various elements and methods to handle variant changes.
 */
export interface IProductInfo {
  elements:
    | {
        text: HTMLElement | undefined
        inventory: HTMLElement | undefined
        title: HTMLElement | undefined
        description: HTMLElement | undefined
        sku: HTMLElement | undefined
        collapsibleTab: HTMLElement | undefined
        quantitySelector: HTMLElement | undefined
        variantPicker: HTMLElement | undefined
        price: HTMLElement | undefined
        buyButtons: HTMLElement | undefined
        complementary: HTMLElement | undefined
      }
    | undefined

  /**
   * Handles changes to the product variant.
   * @param {...unknown} data - The data related to the variant change.
   */
  onVariantChange(...data: unknown[]): void

  /**
   * Handles the scenario when a variant is unavailable.
   */
  onVariantUnavailable(): void
}

/**
 * Interface representing a variant picker with methods to handle variant updates and selections.
 */
export interface IVariantPicker {
  variants: Variant[] | undefined
  selectedOptions: string[] | undefined
  selectedVariant: Variant | undefined
  updateUrl: boolean | undefined
  url: string | undefined

  /**
   * Handles changes to the variant.
   */
  onVariantChange(): void

  /**
   * Updates the selected options.
   * @returns {string[]} - The updated options.
   */
  updateOptions(): string[]

  /**
   * Updates the statuses of variants.
   */
  updateStatuses(): void

  /**
   * Updates the selected variant.
   * @returns {Variant | undefined} - The updated selected variant.
   */
  updateSelectedVariant(): Variant | undefined

  /**
   * Updates the forms with the current variant data.
   */
  updateForms(): void

  /**
   * Updates the URL with the current variant data.
   */
  updateURL(): void

  /**
   * Fetches the product information.
   */
  fetchProductInfo(): void
}

/**
 * Interface representing a quantity selector with methods to handle quantity changes and validation.
 */
export interface IQuantitySelector {
  elements:
    | {
        decreaseButton: HTMLButtonElement | undefined
        increaseButton: HTMLButtonElement | undefined
        input: HTMLInputElement | undefined
      }
    | undefined

  /**
   * Handles button click events for quantity changes.
   * @param {Event} event - The button click event.
   */
  onButtonClick(event: Event): void

  /**
   * Handles input change events for quantity changes.
   * @param {Event} event - The input change event.
   */
  onInputChange(event: Event): void

  /**
   * Validates the quantity input.
   */
  validate(): void
}

/**
 * Interface representing a paginator with methods to handle pagination and load more content.
 */
export interface IPaginator {
  elements:
    | {
        pagination: PaginatorNavigation | undefined
        container: HTMLElement | undefined
        previous: HTMLElement | undefined
      }
    | undefined
  enabled: boolean | undefined
  page: number | undefined
  observer: IntersectionObserver | undefined

  /**
   * Loads more content for pagination.
   * @returns {Promise<void>} - A promise that resolves when more content is loaded.
   */
  loadMore(): Promise<void>

  /**
   * Handles intersection events for pagination.
   * @param {IntersectionObserverEntry[]} entries - The intersection entries.
   */
  handleIntersection(entries: IntersectionObserverEntry[]): void

  /**
   * Sets the pagination data.
   * @param {PaginatorNavigation} pagination - The pagination navigation data.
   */
  setPagination(pagination: PaginatorNavigation): void
}

/**
 * Interface representing pagination navigation with methods to set the next URL and render HTML content.
 */
export interface IPaginatorNavigation {
  nextUrl: string | undefined

  /**
   * Sets the next URL for pagination.
   * @param {string} url - The next URL.
   */
  setNextUrl(url: string): void

  /**
   * Renders the HTML content for pagination.
   * @param {string} html - The HTML content to render.
   */
  render(html: string): void
}

/**
 * Interface representing an accordion element with methods to handle toggling.
 */
export interface IAccordion {
  elements?:
    | {
        header: HTMLElement | undefined
        content: HTMLElement | undefined
      }
    | undefined

  expanded: boolean | undefined

  /**
   * Handles the toggle event for the accordion.
   * @param {Event} event - The toggle event.
   */
  onToggle(event: Event): void
}

/**
 * Interface representing a cart item element with methods to handle quantity changes.
 */
export interface ICartItem extends IBaseElement {
  index: number | undefined
  variantId: string | undefined

  /**
   * Handles the quantity change event for a cart item.
   * @param {Event} event - The quantity change event.
   * @returns {Promise<void>} - A promise that resolves when the quantity change is handled.
   */
  onQuantityChange(event: Event): Promise<void>
}

/**
 * Interface representing a cart with methods to handle item removal and quantity changes.
 */
export interface ICart {
  /**
   * Handles the removal of an item from the cart.
   * @param {ICartItem} item - The cart item to remove.
   * @returns {Promise<void>} - A promise that resolves when the item is removed.
   */
  onRemoveItem(item: ICartItem): Promise<void>

  /**
   * Handles the quantity change for a cart item.
   * @param {Object} params - The parameters object.
   * @param {ICartItem} params.item - The cart item.
   * @param {number} params.quantity - The new quantity.
   * @returns {Promise<void>} - A promise that resolves when the quantity change is handled.
   */
  onQuantityChange({
    item,
    quantity,
  }: {
    item: ICartItem
    quantity: number
  }): Promise<void>

  /**
   * Updates the quantity of a specific line item in the cart.
   * @param {Object} params - The parameters object.
   * @param {number} params.line - The line item index.
   * @param {number} params.quantity - The new quantity.
   * @returns {Promise<void>} - A promise that resolves when the quantity is updated.
   */
  updateQuantity({
    line,
    quantity,
  }: {
    line: number
    quantity: number
  }): Promise<void>
}

/**
 * Interface representing a cart drawer with methods to handle item updates and toggle visibility.
 */
export interface ICartDrawer extends IDrawerElement {
  elements:
    | {
        title: HTMLElement | undefined
        items: HTMLElement | undefined
        footer: HTMLElement | undefined
      }
    | undefined

  /**
   * Handles the event when an item is added to the cart.
   * @param {unknown} data - The data related to the item added.
   */
  onItemAdded(data: unknown): void

  /**
   * Handles the event when an item is updated in the cart.
   * @param {unknown} data - The data related to the item updated.
   */
  onItemUpdated(data: unknown): void

  /**
   * Renders the HTML content for the cart drawer.
   * @param {string} html - The HTML content to render.
   */
  render(html: string): void
}

/**
 * Interface representing a cart remove item button with methods to handle the click event.
 */
export interface ICartRemoveItemButton extends BaseElement {
  elements:
    | {
        item: ICartItem | undefined
      }
    | undefined

  /**
   * Handles the click event to remove an item from the cart.
   * @param {Event} event - The click event.
   * @returns {Promise<void>} - A promise that resolves when the item is removed.
   */
  onClick(event: Event): Promise<void>
}

/**
 * Interface representing a filter element with methods to handle filter toggling and changes.
 */
export interface IFilter extends IDrawerElement {
  filtering: boolean | undefined
  sorting: boolean | undefined

  /**
   * Handles the filter change event.
   * @param {Event} event - The filter change event.
   */
  handleFilterChange(event: Event): void
}

/**
 * Interface representing product recommendations with methods to handle intersection events.
 */
export interface IProductRecommendations extends IBaseElement {
  url: string | undefined
  observer: IntersectionObserver | undefined

  /**
   * Handles intersection events to load product recommendations.
   * @returns {Promise<void>} - A promise that resolves when the handling is complete.
   */
  handleIntersection(): Promise<void>

  /**
   * Handles the intersection entries.
   * @param {IntersectionObserverEntry[]} entries - The intersection entries.
   * @returns {Promise<void>} - A promise that resolves when the handling is complete.
   */
  onIntersection(entries: IntersectionObserverEntry[]): Promise<void>
}
/**
 * Interface representing a localization form with methods to handle user interactions and panel visibility.
 */
export interface ILocalizationForm extends IBaseElement {
  elements:
    | {
        input: HTMLInputElement | undefined
      }
    | undefined

  /**
   * Handles the item click event.
   * @param {Event} event - The item click event.
   */
  onItemClick(event: Event): void
}

/**
 * Interface representing pickup availability with methods to handle variant changes and availability checks.
 */
export interface IPickupAvailability extends IBaseElement {
  variantId: string | undefined

  /**
   * Fetches the pickup availability for the current variant.
   * @returns {Promise<void>} - A promise that resolves when the availability information is fetched.
   */
  getAvailability(): Promise<void>

  /**
   * Handles the variant change event and updates the pickup availability accordingly.
   * @returns {Promise<void>} - A promise that resolves when the variant change handling is complete.
   */
  onVariantChange(): Promise<void>
}

/**
 * Interface representing a cursor element with methods to handle cursor animations and text display.
 */
export interface ICursor extends IBaseElement {
  /**
   * Object representing the cursor position.
   */
  position: {
    /**
     * Target position of the cursor.
     */
    target: { x: number; y: number }
    /**
     * Current position of the cursor.
     */
    current: { x: number; y: number }
    /**
     * Previous horizontal position of the cursor.
     */
    previous: { x: number }
  }

  /**
   * Current state of the cursor.
   */
  state: Array<CursorState>

  /**
   * Updates the target position of the cursor based on the mouse event.
   * @param e - The mouse event containing the new cursor position.
   */
  updateCursorPosition(e: MouseEvent): void

  /**
   * Animates the cursor movement using linear interpolation.
   */
  animateCursor(): void

  /**
   * Expands the cursor size.
   */
  expandCursor(): void

  /**
   * Shrinks the cursor size.
   */
  shrinkCursor(): void

  /**
   * Displays text associated with the cursor.
   * @param e - The mouse event containing the element with the text to display.
   */
  displayText(e: MouseEvent): void

  /**
   * Clears the text displayed by the cursor.
   */
  clearText(): void

  /**
   * Handles various events related to the cursor.
   */
  manageEvents(): void
}

export interface IDrawerElement {
  open: boolean | undefined
  closeButton: HTMLButtonElement | undefined
  openButton: HTMLButtonElement | undefined

  /**
   * Toggles the open state of the cart drawer.
   * @param {boolean} state - The state to set for the cart drawer.
   */
  toggleOpen(state: boolean): void

  /**
   * Handles the click event outside the cart drawer to close it.
   * @param {Event} event - The click event.
   */
  onOutsideClick(event: MouseEvent): void
}
