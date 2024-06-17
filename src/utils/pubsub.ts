import { ISakuraPubSub, SakuraEvent, SakuraSubscriberCallback } from '@/types/events'

class SakuraPubSub implements ISakuraPubSub {
  private static instance: ISakuraPubSub
  private events: Map<SakuraEvent, SakuraSubscriberCallback[]>

  private constructor() {
    this.events = new Map()
  }

  public static getInstance(): ISakuraPubSub {
    if (!SakuraPubSub.instance) {
      SakuraPubSub.instance = new SakuraPubSub()
    }
    return SakuraPubSub.instance
  }

  public async subscribe(
    event: SakuraEvent,
    callback: SakuraSubscriberCallback,
  ): Promise<void> {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event)?.push(callback)
  }

  public async unsubscribe(
    event: SakuraEvent,
    callback: SakuraSubscriberCallback,
  ): Promise<void> {
    const eventCallbacks = this.events.get(event)
    if (!eventCallbacks) return

    this.events.set(
      event,
      eventCallbacks.filter((cb) => cb !== callback),
    )
  }

  public async publish(event: SakuraEvent, data?: unknown): Promise<void> {
    const eventCallbacks = this.events.get(event)
    if (!eventCallbacks) return

    for (const callback of eventCallbacks) {
      await callback(data)
    }
  }

  public batchSubscribe(
    subscriptions: Array<[SakuraEvent, SakuraSubscriberCallback]>,
  ): void {
    subscriptions.forEach(([event, callback]) => {
      this.subscribe(event, callback)
    })
  }

  public async clear(): Promise<void> {
    this.events.clear()
  }
}

export const SakuraPS = SakuraPubSub.getInstance()
