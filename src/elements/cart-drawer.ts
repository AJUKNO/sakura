import { ICartDrawer } from '@/types/interfaces'
import { BaseElement } from '@/elements/base-element'
import { SakuraPS } from '@/utils/pubsub'
import { SakuraCartEvent, SakuraSubscriberCallback } from '@/types/events'
import { rerenderBySelector } from '@/utils/general'

/**
 * CartDrawer
 * @extends BaseElement
 * @implements ICartDrawer
 */
class CartDrawer extends BaseElement implements ICartDrawer {
  open: boolean | undefined
  elements:
    | {
        menu: HTMLElement | undefined
        title: HTMLElement | undefined
        items: HTMLElement | undefined
        footer: HTMLElement | undefined
        closeButton: HTMLButtonElement | undefined
        openButton: HTMLButtonElement | undefined
      }
    | undefined

  init(): void {
    // Get data attributes
    this.open = this.hasAttribute('data-open')

    // Get elements
    this.elements = {
      menu: this.querySelector(`[data-id=${this.identifier}-menu]`) as HTMLElement,
      title: this.querySelector(`[data-id=${this.identifier}-title]`) as HTMLElement,
      items: this.querySelector(`[data-id=${this.identifier}-items]`) as HTMLElement,
      footer: this.querySelector(
        `[data-id=${this.identifier}-footer]`,
      ) as HTMLElement,
      closeButton: this.querySelector(
        `[data-id=${this.identifier}-close-button]`,
      ) as HTMLButtonElement,
      openButton: document.querySelector(
        `[data-id=${this.identifier}-open-button]`,
      ) as HTMLButtonElement,
    }

    // Add event listeners
    this.elements.closeButton?.addEventListener('click', () => {
      this.toggleOpen(false)
    })
    this.elements.openButton?.addEventListener('click', () => {
      this.toggleOpen(true)
    })
    this.addEventListener('click', this.onOutsideClick.bind(this))
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.toggleOpen(false)
    })

    // Subscribe to events
    SakuraPS.batchSubscribe([
      [
        SakuraCartEvent.ADD_ITEM,
        <SakuraSubscriberCallback>this.onItemAdded.bind(this),
      ],
      [
        SakuraCartEvent.UPDATE_ITEM,
        <SakuraSubscriberCallback>this.onItemUpdated.bind(this),
      ],
    ])
  }

  disconnectedCallback(): void {
    // Remove event listeners
    this.elements?.closeButton?.removeEventListener('click', () => {
      this.toggleOpen(false)
    })
    this.elements?.openButton?.removeEventListener('click', () => {
      this.toggleOpen(true)
    })
    this.removeEventListener('click', this.onOutsideClick.bind(this))
    document.removeEventListener('keydown', (event) => {
      if (event.key === 'Escape') this.toggleOpen(false)
    })

    // Unsubscribe from events
    SakuraPS.unsubscribe(
      SakuraCartEvent.ADD_ITEM,
      <SakuraSubscriberCallback>this.onItemAdded.bind(this),
    )
    SakuraPS.unsubscribe(
      SakuraCartEvent.UPDATE_ITEM,
      <SakuraSubscriberCallback>this.onItemUpdated.bind(this),
    )
  }

  onItemAdded(data: unknown): void {
    // Open the drawer
    this.toggleOpen(true)

    // Rerender the cart drawer contents
    this.render(<string>data)
  }

  onItemUpdated(data: unknown): void {
    this.render(<string>data)
  }

  onOutsideClick(event: Event): void {
    // Close the cart drawer if the click is outside the drawer
    if (!this.elements?.menu?.contains(<Node>event.target)) {
      this.toggleOpen(false)
    }
  }

  render(html: string): void {
    // Rerender the cart drawer contents
    rerenderBySelector(`[data-id=${this.elements?.title?.dataset.id}]`, html)
    rerenderBySelector(`[data-id=${this.elements?.items?.dataset.id}]`, html)
    rerenderBySelector(`[data-id=${this.elements?.footer?.dataset.id}]`, html)
  }

  toggleOpen(state: boolean): void {
    this.open = state
    this.toggleAttribute('data-open', state)
  }
}

export default CartDrawer
