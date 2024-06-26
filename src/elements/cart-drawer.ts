import { ICartDrawer } from '@/types/interfaces'
import { SakuraPS } from '@/utils/pubsub'
import { SakuraCartEvent, SakuraSubscriberCallback } from '@/types/events'
import { rerenderBySelector } from '@/utils/general'
import DrawerElement from '@/elements/drawer-element'

/**
 * CartDrawer
 * @extends BaseElement
 * @implements ICartDrawer
 */
class CartDrawer extends DrawerElement implements ICartDrawer {
  elements:
    | {
        title: HTMLElement | undefined
        items: HTMLElement | undefined
        footer: HTMLElement | undefined
      }
    | undefined

  init(): void {
    super.init()

    // Get elements
    this.elements = {
      title: this.querySelector(`[data-id=${this.identifier}-title]`) as HTMLElement,
      items: this.querySelector(`[data-id=${this.identifier}-items]`) as HTMLElement,
      footer: this.querySelector(
        `[data-id=${this.identifier}-footer]`,
      ) as HTMLElement,
    }

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
    super.disconnectedCallback()

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

  render(html: string): void {
    // Rerender the cart drawer contents
    this.renderOpenButton(html)
    rerenderBySelector(`[data-id=${this.elements?.title?.dataset.id}]`, html)
    rerenderBySelector(`[data-id=${this.elements?.items?.dataset.id}]`, html)
    rerenderBySelector(`[data-id=${this.elements?.footer?.dataset.id}]`, html)
  }

  private renderOpenButton(html: string): void {
    // Rerender the cart drawer open button
    if (this.elements) {
      this.openButton = rerenderBySelector(
        '[data-id=cart-drawer-open-button]',
        html,
      ) as HTMLButtonElement
    }
    this?.openButton?.addEventListener('click', () => {
      this.toggleOpen(true)
    })
  }
}

export default CartDrawer
