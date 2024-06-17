import { BaseElement } from '@/elements/base-element'
import { rerenderBySelector } from '@/utils/general'
import { SakuraPS } from '@/utils/pubsub'
import { SakuraProductEvent, SakuraSubscriberCallback } from '@/types/events'
import { IProductInfo } from '@/types/interfaces'

/**
 * ProductInfo
 * @extends BaseElement
 * @implements IProductInfo
 */
class ProductInfo extends BaseElement implements IProductInfo {
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

  init(): void {
    // Get elements
    this.elements = {
      text: this.querySelector(
        `[data-id=${this.identifier}-text-${this.section}]`,
      ) as HTMLElement,
      inventory: this.querySelector(
        `[data-id=${this.identifier}-inventory-${this.section}]`,
      ) as HTMLElement,
      title: this.querySelector(
        `[data-id=${this.identifier}-title-${this.section}]`,
      ) as HTMLElement,
      description: this.querySelector(
        `[data-id=${this.identifier}-description-${this.section}]`,
      ) as HTMLElement,
      sku: this.querySelector(
        `[data-id=${this.identifier}-sku-${this.section}]`,
      ) as HTMLElement,
      collapsibleTab: this.querySelector(
        `[data-id=${this.identifier}-collapsible-tab-${this.section}]`,
      ) as HTMLElement,
      quantitySelector: this.querySelector(
        `[data-id=${this.identifier}-quantity-selector-${this.section}]`,
      ) as HTMLElement,
      variantPicker: this.querySelector(
        `[data-id=${this.identifier}-variant-picker-${this.section}]`,
      ) as HTMLElement,
      price: this.querySelector(
        `[data-id=${this.identifier}-price-${this.section}]`,
      ) as HTMLElement,
      buyButtons: this.querySelector(
        `[data-id=${this.identifier}-buy-buttons-${this.section}]`,
      ) as HTMLElement,
      complementary: this.querySelector(
        `[data-id=${this.identifier}-complementary-${this.section}]`,
      ) as HTMLElement,
    }

    // Set event listeners
    this.setListeners()
  }

  disconnectedCallback(): void {
    this.removeListeners()
  }

  onVariantChange(...data: unknown[]): void {
    const html = data as unknown as string

    // Update elements
    if (this.elements) {
      this.elements.inventory = rerenderBySelector(
        `[data-id=${this.elements.inventory?.dataset.id}]`,
        html,
      ) as HTMLElement
      this.elements.price = rerenderBySelector(
        `[data-id=${this.elements.price?.dataset.id}]`,
        html,
      ) as HTMLElement
      this.elements.sku = rerenderBySelector(
        `[data-id=${this.elements.sku?.dataset.id}]`,
        html,
      ) as HTMLElement
      this.elements.quantitySelector = rerenderBySelector(
        `[data-id=${this.elements.quantitySelector?.dataset.id}]`,
        html,
      ) as HTMLElement
      this.elements.complementary = rerenderBySelector(
        `[data-id=${this.elements.complementary?.dataset.id}]`,
        html,
      ) as HTMLElement
    }
  }

  onVariantUnavailable(): void {
    this.elements?.inventory?.classList.toggle('hidden', true)
    this.elements?.sku?.classList.toggle('hidden', true)
    this.elements?.price?.classList.toggle('hidden', true)
    this.elements?.complementary?.classList.toggle('hidden', true)
  }

  private setListeners(): void {
    SakuraPS.batchSubscribe([
      [
        SakuraProductEvent.VARIANT_CHANGE,
        <SakuraSubscriberCallback>this.onVariantChange.bind(this),
      ],
      [
        SakuraProductEvent.VARIANT_UNAVAILABLE,
        <SakuraSubscriberCallback>this.onVariantUnavailable.bind(this),
      ],
      [
        SakuraProductEvent.INFO_LOADING,
        <SakuraSubscriberCallback>this.toggleLoading.bind(this),
      ],
    ])
  }

  private removeListeners() {
    SakuraPS.unsubscribe(
      SakuraProductEvent.VARIANT_UNAVAILABLE,
      <SakuraSubscriberCallback>this.onVariantUnavailable.bind(this),
    )
    SakuraPS.unsubscribe(
      SakuraProductEvent.VARIANT_CHANGE,
      <SakuraSubscriberCallback>this.onVariantChange.bind(this),
    )
    SakuraPS.unsubscribe(
      SakuraProductEvent.INFO_LOADING,
      <SakuraSubscriberCallback>this.toggleLoading.bind(this),
    )
  }
}

export default ProductInfo
