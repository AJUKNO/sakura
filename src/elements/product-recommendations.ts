import { IProductRecommendations } from '@/types/interfaces'
import { BaseElement } from '@/elements/base-element'
import { HTMLParser, HttpClient } from '@/utils/general'
import { SakuraLogger } from '@/utils/logger'
import { animations } from '@/utils/animations'
import { SakuraPS } from '@/utils/pubsub'
import { SakuraRecommendationEvent } from '@/types/events'

/**
 * ProductRecommendations
 * @extends BaseElement
 * @implements IProductRecommendations
 */
class ProductRecommendations extends BaseElement implements IProductRecommendations {
  observer: IntersectionObserver | undefined
  url: string | undefined

  init(): void {
    // Get data attributes
    this.url = this.dataset.url || undefined

    // Set the observer
    this.observer = new IntersectionObserver(this.onIntersection.bind(this))
    this.observer.observe(this)
  }

  disconnectedCallback(): void {
    this.observer?.disconnect()
  }

  async handleIntersection(): Promise<void> {
    try {
      if (!this.url) return

      const html = await HttpClient.get(this.url).then((response) => response.text())
      const parsedHTML = HTMLParser(html)
      const recommendations = parsedHTML.querySelector('cmp-product-recommendations')
      recommendations && (this.innerHTML = recommendations.innerHTML)
      await SakuraPS.publish(SakuraRecommendationEvent.RECOMMENDATION)
      animations()
    } catch (error) {
      SakuraLogger.e('Error fetching product recommendations', error)
    }
  }

  async onIntersection(entries: IntersectionObserverEntry[]): Promise<void> {
    if (!entries[0].isIntersecting) return
    this.observer?.unobserve(this)
    await this.handleIntersection()
  }
}

export default ProductRecommendations
