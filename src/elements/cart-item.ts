import { BaseElement } from '@/elements/base-element'
import { SakuraPS } from '@/utils/pubsub'
import { SakuraCartEvent } from '@/types/events'
import { ICartItem } from '@/types/interfaces'

/**
 * CartItem
 * @extends BaseElement
 * @implements ICartItem
 */
class CartItem extends BaseElement implements ICartItem {
  index: number | undefined
  variantId: string | undefined

  init(): void {
    this.index = parseInt(this.dataset.index || '0')
    this.variantId = this.dataset.variantId || undefined

    this.addEventListener('change', this.onQuantityChange.bind(this))
  }

  disconnectedCallback(): void {
    this.removeEventListener('change', this.onQuantityChange.bind(this))
  }

  async onQuantityChange(event: Event): Promise<void> {
    // Prevent default behavior
    event.preventDefault()

    // Publish event
    await SakuraPS.publish(SakuraCartEvent.QUANTITY_CHANGE, {
      item: this,
      quantity: parseInt((event.target as HTMLInputElement).value),
    })
  }
}

export default CartItem
