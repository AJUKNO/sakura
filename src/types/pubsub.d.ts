export interface SakuraEvent<T extends string, P = unknown> {
  type: T; // Mandatory type property
  payload: P; // Payload, can be required or optional
  source?: string; // Optional source
}

export interface PubSub<E extends SakuraEvent<string>> {
  /**
   * Subscribes to one or more events with a callback.
   * @param events - The event type(s) to subscribe to.
   * @param callback - The function to call when the event is published.
   */
  subscribe<T extends E['type']>(
    events: T | T[],
    callback: (event: Extract<E, { type: T }>) => void
  ): void;

  /**
   * Unsubscribes from one or more events.
   * @param events - The event type(s) to unsubscribe from.
   * @param callback - The callback function that was used to subscribe.
   */
  unsubscribe<T extends E['type']>(
    events: T | T[],
    callback: (event: Extract<E, { type: T }>) => void
  ): void;

  /**
   * Publishes an event to all subscribed listeners.
   * @param event - The event type to publish.
   * @param payload - The data associated with the event.
   * @param source - An optional source identifier for the event.
   */
  publish<T extends E['type']>(
    event: T,
    payload: Extract<E, { type: T }>['payload'],
    source?: string
  ): void;
}

// export interface PubSub<T extends Record<string, any>> {
//   // handlers: {
//   //   [K in keyof T]?: Array<(event: SakuraEvent<T[K]>) => void>;
//   // };
//
//   // Subscribe to one or more events (single or array)
//   subscribe<E extends keyof T>(
//     eventType: E | E[],
//     handler: (event: SakuraEvent<T[E]>) => void
//   ): void;
//
//   // Unsubscribe from one or more events (single or array)
//   unsubscribe<E extends keyof T>(
//     eventType: E | E[],
//     handler: (event: SakuraEvent<T[E]>) => void
//   ): void;
//
//   // Publish an event with optional payload and source
//   publish<E extends keyof T>(
//     eventType: E,
//     payload?: T[E],
//     source?: string
//   ): void;
// }
