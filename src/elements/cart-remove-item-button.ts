import { BaseElement } from '@/elements/base-element'
import { ICartItem, ICartRemoveItemButton } from '@/types/interfaces'
import { SakuraPS } from '@/utils/pubsub'
import { SakuraCartEvent, SakuraSubscriberCallback } from '@/types/events'

/**
 * CartRemoveItemButton
 * @extends BaseElement
 * @implements ICartRemoveItemButton
 */
class CartRemoveItemButton extends BaseElement implements ICartRemoveItemButton {
  elements: { item: ICartItem | undefined } | undefined

  init(): void {
    // Get the item element
    this.elements = {
      item: this.closest('cmp-cart-item') as ICartItem,
    }

    // Add event listeners
    this.addEventListener('click', this.onClick.bind(this))
  }

  disconnectedCallback(): void {
    // Remove event listeners
    this.removeEventListener('click', this.onClick.bind(this))

    // Unsubscribe from events
    SakuraPS.unsubscribe(
      SakuraCartEvent.REMOVE_ITEM,
      <SakuraSubscriberCallback>this.onClick.bind(this),
    )
  }

  async onClick(event: Event): Promise<void> {
    // Prevent the default action
    event.preventDefault()

    // Publish the remove item event to the Cart component
    await SakuraPS.publish(SakuraCartEvent.REMOVE_ITEM, this.elements?.item)
  }
}

export default CartRemoveItemButton
