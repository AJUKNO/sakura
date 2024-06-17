import { SakuraPS } from '@/utils/pubsub'
import { SakuraProductEvent, SakuraSubscriberCallback } from '@/types/events'
import { BaseElement } from '@/elements/base-element'
import { HttpClient } from '@/utils/general'
import { SakuraLogger } from '@/utils/logger'
import { IPickupAvailability } from '@/types/interfaces'

/**
 * PickupAvailability
 * @extends BaseElement
 * @implements IPickupAvailability
 */
class PickupAvailability extends BaseElement implements IPickupAvailability {
  variantId: string | undefined

  init(): void {
    // Get data attributes
    this.variantId = this.dataset.variantId || ''

    this.getAvailability()

    SakuraPS.subscribe(
      SakuraProductEvent.VARIANT_CHANGE,
      <SakuraSubscriberCallback>this.onVariantChange.bind(this),
    )
  }

  disconnectedCallback(): void {}

  async getAvailability(): Promise<void> {
    try {
      let rootUrl = window.Shopify.strings.routes.root

      if (!rootUrl.endsWith('/')) {
        rootUrl += '/'
      }

      const variantUrl = `${rootUrl}variants/${this.variantId}/?section_id=pickup-availability`

      this.innerHTML = await HttpClient.get(variantUrl).then((res) => res.text())
    } catch (error) {
      SakuraLogger.e('Error fetching pickup availability', error)
    }
  }

  async onVariantChange(): Promise<void> {
    await this.getAvailability()
  }
}

export default PickupAvailability
