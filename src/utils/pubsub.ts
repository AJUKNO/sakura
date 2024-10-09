import { PubSub, SakuraEvent } from '@/types/pubsub';

export class PubSubImpl<E extends SakuraEvent<string>> implements PubSub<E> {
  private listeners: {
    [K in E['type']]?: Array<(event: Extract<E, { type: K }>) => void>; // Listeners for each event type
  } = {};

  // Method to subscribe to one or more events
  subscribe<T extends E['type']>(
    events: T | T[],
    callback: (event: Extract<E, { type: T }>) => void
  ): void {
    const eventList = Array.isArray(events) ? events : [events];
    eventList.forEach((event) => {
      if (!this.listeners[event]) {
        this.listeners[event] = [];
      }
      this.listeners[event].push(callback);
    });
  }

  // Method to unsubscribe from one or more events
  unsubscribe<T extends E['type']>(
    events: T | T[],
    callback: (event: Extract<E, { type: T }>) => void
  ): void {
    const eventList = Array.isArray(events) ? events : [events];
    eventList.forEach((event) => {
      if (!this.listeners[event]) return;

      this.listeners[event] = this.listeners[event].filter(
        (listener) => listener !== callback
      );
    });
  }

  // Method to publish an event to one or more listeners
  publish<T extends E['type']>(
    event: T,
    payload: Extract<E, { type: T }>['payload'],
    source?: string
  ): void {
    if (!this.listeners[event]) return;

    const eventObj: Extract<E, { type: T }> = {
      type: event,
      payload, // This will be of the correct type based on the extracted type
      source, // Allow source to be undefined, since it's optional
    } as Extract<E, { type: T }>; // Use type assertion to satisfy TypeScript

    // Call all subscribed listeners with the event object
    this.listeners[event].forEach((listener) => {
      listener(eventObj);
    });
  }
}

// export class PubSubImpl<T extends Record<string, any>> implements PubSub<T> {
//   private handlers: {
//     [K in keyof T]?: Array<(event: SakuraEvent<T[K]>) => void>;
//   } = {};
//
//   // Subscribe to one or more events (single or array)
//   subscribe<E extends keyof T>(
//     eventType: E | E[],
//     handler: (event: SakuraEvent<T[E]>) => void
//   ): void {
//     const eventTypes = Array.isArray(eventType) ? eventType : [eventType];
//
//     eventTypes.forEach((e) => {
//       if (!this.handlers[e]) {
//         this.handlers[e] = [];
//       }
//       this.handlers[e].push(handler);
//     });
//   }
//
//   // Unsubscribe from one or more events (single or array)
//   unsubscribe<E extends keyof T>(
//     eventType: E | E[],
//     handler: (event: SakuraEvent<T[E]>) => void
//   ): void {
//     const eventTypes = Array.isArray(eventType) ? eventType : [eventType];
//
//     eventTypes.forEach((e) => {
//       if (!this.handlers[e]) return;
//       this.handlers[e] = this.handlers[e].filter((h) => h !== handler);
//     });
//     for (const e of eventTypes) {
//       if (this.handlers[e]?.length === 0) {
//         delete this.handlers[e];
//       }
//     }
//   }
//
//   // Publish an event with optional payload and source
//   publish<E extends keyof T>(
//     eventType: E,
//     payload?: T[E],
//     source?: string
//   ): void {
//     if (!this.handlers[eventType]) return;
//
//     for (const handler of this.handlers[eventType]) {
//       handler({ payload: payload as T[E], source });
//     }
//   }
// }
