export enum SakuraCartEvent {
  ADD_ITEM = 'cart:add-item',
  REMOVE_ITEM = 'cart:remove-item',
  UPDATE_ITEM = 'cart:update-item',
  QUANTITY_CHANGE = 'cart:quantity-change',
}

export enum SakuraProductEvent {
  QUANTITY_CHANGE = 'product:quantity-change',
  VARIANT_CHANGE = 'product:variant-change',
  VARIANT_UNAVAILABLE = 'product:variant-unavailable',
  INFO_LOADING = 'product:info-loading',
}

export enum SakuraFilterEvent {
  CHANGE = 'filter:change',
}

export enum SakuraRecommendationEvent {
  RECOMMENDATION = 'recommendation:load',
}

export type SakuraEvent =
  | SakuraCartEvent
  | SakuraProductEvent
  | SakuraFilterEvent
  | SakuraRecommendationEvent

export interface SakuraSubscriberCallback {
  /**
   * Callback function
   * @param data
   */
  (...data: unknown[]): Promise<void>
}

export const combinedEvents = [
  ...Object.values(SakuraCartEvent),
  ...Object.values(SakuraProductEvent),
  ...Object.values(SakuraFilterEvent),
  ...Object.values(SakuraRecommendationEvent),
]

export interface ISakuraPubSub {
  /**
   * Subscribe to an event
   * @param event
   * @param callback
   */
  subscribe: (event: SakuraEvent, callback: SakuraSubscriberCallback) => void

  /**
   * Unsubscribe from an event
   * @param event
   * @param callback
   */
  unsubscribe: (event: SakuraEvent, callback: SakuraSubscriberCallback) => void

  /**
   * Publish an event
   * @param event
   * @param data
   */
  publish: (event: SakuraEvent, data?: unknown) => Promise<void>

  /**
   * Subscribe to multiple events with their respective callbacks.
   * @param {Array<[SakuraEvent, SakuraSubscriberCallback]>} subscriptions - Array of event-callback pairs to subscribe to.
   * @returns {Promise<void>}
   */
  batchSubscribe: (
    subscriptions: Array<[SakuraEvent, SakuraSubscriberCallback]>,
  ) => void

  /**
   * Clear all events
   */
  clear: () => Promise<void>
}
