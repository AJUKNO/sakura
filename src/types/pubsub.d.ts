/**
 * Base interface for events used in the publish-subscribe pattern.
 *
 * This interface represents a generic event with a type, optional payload, and an optional source.
 *
 * @interface
 */
export interface BaseEvent {
  /**
   * The type of the event. This is used to categorize or identify the event.
   *
   * @type {string}
   */
  type: string;

  /**
   * Optional data associated with the event. This can be any type of data related to the event.
   *
   * @type {unknown}
   */
  payload?: unknown;

  /**
   * Optional source of the event. This can be used to indicate where the event originated from.
   *
   * @type {string}
   */
  source?: string;
}

/**
 * Type for event handler functions.
 *
 * An `EventHandler` is a function that processes events of a specific type. The function receives
 * an event object as its argument.
 *
 * @template T - The type of event that the handler will process.
 * @param event - The event object of type `T` that is being handled.
 * @returns {void}
 */
export type EventHandler<T extends BaseEvent> = (event: T) => void;

/**
 * Interface for a publish-subscribe system.
 *
 * This interface defines methods for subscribing to, unsubscribing from, and publishing events,
 * as well as subscribing to multiple event types at once.
 *
 * @template T - The type of events supported by the pub-sub system, extending `BaseEvent`.
 * @interface
 */
export interface IPubSub<T extends BaseEvent> {
  /**
   * Subscribes to a specific event type with a handler function.
   *
   * When an event of the specified type is published, the handler will be invoked.
   *
   * @param eventType - The type of event to subscribe to.
   * @param handler - The handler function to call when the event is published.
   * @returns {void}
   */
  subscribe<E extends T['type']>(
    eventType: E,
    handler: EventHandler<Extract<T, { type: E }>>
  ): void;

  /**
   * Unsubscribes from a specific event type, removing the handler function.
   *
   * The handler will no longer be invoked when the event of the specified type is published.
   *
   * @param eventType - The type of event to unsubscribe from.
   * @param handler - The handler function to remove.
   * @returns {void}
   */
  unsubscribe<E extends T['type']>(
    eventType: E,
    handler: EventHandler<Extract<T, { type: E }>>
  ): void;

  /**
   * Publishes an event of a specific type to all subscribed handlers.
   *
   * This method triggers all handlers subscribed to the event type with the provided payload and source.
   *
   * @param eventType - The type of event to publish.
   * @param source - The source of the event.
   * @param payload - Optional data associated with the event.
   * @returns {void}
   */
  publish<E extends T['type']>(
    eventType: E,
    source: string,
    payload?: Extract<T, { type: E }>['payload']
  ): void;

  /**
   * Subscribes to multiple event types with a single handler function.
   *
   * The handler will be called for any of the specified event types.
   *
   * @param eventTypes - An array of event types to subscribe to.
   * @param handler - The handler function to call when any of the event types are published.
   * @returns {void}
   */
  subscribeAll<E extends T['type']>(
    eventTypes: E[],
    handler: EventHandler<Extract<T, { type: E }>>
  ): void;
}
