import { BaseEvent, EventHandler, IPubSub } from '@/types/pubsub';
import { ILogger } from '@/index';

// Define a class that implements the IPubSub interface
export default class CustomPubSub<T extends BaseEvent> implements IPubSub<T> {
  private handlers: Map<string, Set<EventHandler<BaseEvent>>> = new Map();
  private readonly debug?: boolean;
  private readonly logger?: ILogger;

  constructor(debug?: boolean, logger?: ILogger) {
    if (debug) {
      this.debug = debug;
    }

    if (logger) {
      this.logger = logger;
    }

    if (debug && logger) {
      logger.d('PubSub initialized');
    }
  }

  // Method to subscribe to events
  subscribe<E extends T['type']>(
    eventType: E,
    handler: EventHandler<Extract<T, { type: E }>>
  ): void {
    if (this.debug) {
      this.logger?.d(`Subscribing to event: ${eventType}`);
    }
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)?.add(handler as EventHandler<BaseEvent>);
  }

  // Method to unsubscribe from events
  unsubscribe<E extends T['type']>(
    eventType: E,
    handler: EventHandler<Extract<T, { type: E }>>
  ): void {
    if (this.debug) {
      this.logger?.d(`Unsubscribing from event: ${eventType}`);
    }
    this.handlers.get(eventType)?.delete(handler as EventHandler<BaseEvent>);
  }

  // Method to publish events

  publish<E extends T['type']>(
    eventType: E,
    source?: string,
    payload?: Extract<T, { type: E }>['payload'] | undefined // Ensure payload is treated as undefined when optional
  ): void {
    if (this.debug) {
      this.logger?.d(
        `Publishing event: ${eventType} from source: ${source ?? 'unknown'}`,
        payload
      );
    }

    // Define the event as unknown first, then cast
    const event = {
      type: eventType,
      source,
      payload,
    } as unknown as Extract<T, { type: E }>;

    this.handlers.get(eventType)?.forEach((handler) => {
      (handler as EventHandler<Extract<T, { type: E }>>)(event);
    });
  }

  subscribeAll<E extends T['type']>(
    eventTypes: E[],
    handler: EventHandler<Extract<T, { type: E }>>
  ): void {
    for (const eventType of eventTypes) {
      this.subscribe(eventType, handler);
    }
  }

  unsubscribeAll<E extends T['type']>(
    eventTypes: E[],
    handler: EventHandler<Extract<T, { type: E }>>
  ): void {
    for (const eventType of eventTypes) {
      this.unsubscribe(eventType, handler);
    }
  }
}
