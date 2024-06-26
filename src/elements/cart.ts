import { BaseElement } from '@/elements/base-element'
import { SakuraPS } from '@/utils/pubsub'
import { SakuraCartEvent, SakuraSubscriberCallback } from '@/types/events'
import { HttpClient, rerenderBySelector } from '@/utils/general'
import { ICart, ICartItem } from '@/types/interfaces'

/**
 * Cart
 * @extends BaseElement
 * @implements ICart
 */
class Cart extends BaseElement implements ICart {
  init(): void {
    SakuraPS.batchSubscribe([
      [
        SakuraCartEvent.QUANTITY_CHANGE,
        <SakuraSubscriberCallback>this.onQuantityChange.bind(this),
      ],
      [
        SakuraCartEvent.REMOVE_ITEM,
        <SakuraSubscriberCallback>this.onRemoveItem.bind(this),
      ],
    ])
  }

  disconnectedCallback(): void {
    SakuraPS.unsubscribe(
      SakuraCartEvent.QUANTITY_CHANGE,
      <SakuraSubscriberCallback>this.onQuantityChange.bind(this),
    )
    SakuraPS.unsubscribe(
      SakuraCartEvent.REMOVE_ITEM,
      <SakuraSubscriberCallback>this.onRemoveItem.bind(this),
    )
  }

  async onQuantityChange({
    item,
    quantity,
  }: {
    item: ICartItem
    quantity: number
  }): Promise<void> {
    // Set loading state of the item
    item.toggleLoading(true)

    // Update the quantity of the item in the cart
    await this.updateQuantity({
      line: item.index!,
      quantity: quantity,
    })

    // Reset the loading state of the item
    item.toggleLoading(false)
  }

  async onRemoveItem(item: ICartItem): Promise<void> {
    // Remove the item from the cart by
    // setting the quantity to 0
    await this.updateQuantity({
      line: item.index!,
      quantity: 0,
    })
  }

  async updateQuantity({
    line,
    quantity,
  }: {
    line: number
    quantity: number
  }): Promise<void> {
    try {
      // Reset any previous errors
      this.toggleError(false, '')

      // Set the loading state
      this.toggleLoading(true)

      const res: {
        status: boolean
        description: string
        sections: Record<string, string>
      } = await HttpClient.post(`${window.Shopify.strings.routes.cart.change}.js`, {
        body: JSON.stringify({
          line,
          quantity,
          sections: [this.section, 'cart-drawer', 'cart-button'],
          sections_url: window.location.pathname,
        }),
      }).then((res) => res.json())

      // If an error occurred, display it
      if (res.status) throw new Error(res.description)

      // If the cart drawer is present, update it, else update the cart page
      if (
        document.querySelector('cmp-cart-drawer') !== null &&
        document.querySelector('[data-id=cart]') === null
      ) {
        await SakuraPS.publish(
          SakuraCartEvent.UPDATE_ITEM,
          res.sections['cart-drawer'] + res.sections['cart-button'],
        )
      } else if (this.section) {
        rerenderBySelector('[data-id=cart-form]', res.sections[this.section])
        rerenderBySelector('[data-id=cart-footer]', res.sections[this.section])
        rerenderBySelector('[data-id=cart-header]', res.sections[this.section])
      }
    } catch (error) {
      this.toggleError(true, (<Error>error).message)
    } finally {
      this.toggleLoading(false)
    }
  }
}

export default Cart
