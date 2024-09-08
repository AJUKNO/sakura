import { describe, expect, it, vi } from 'vitest';
import CustomPubSub from '@/utils/pubsub';
import { BaseEvent } from '@/types';

interface OrderPlacedEvent extends BaseEvent {
  type: 'ORDER_PLACED';
  payload: { orderId: string; amount: number };
}

interface UserLoginEvent extends BaseEvent {
  type: 'USER_LOGIN';
  payload: { userId: string; timestamp: Date };
}

type TestEvents = OrderPlacedEvent | UserLoginEvent;

vi.mock('../src/index', () => ({
  sakura: {
    debug: true,
    logger: {
      d: vi.fn(),
    },
  },
}));

describe('CustomPubSub', () => {
  it('should subscribe to an event', () => {
    const pubSub = new CustomPubSub<TestEvents>();
    const handler = vi.fn();
    pubSub.subscribe('ORDER_PLACED', handler);

    pubSub.publish('ORDER_PLACED', 'source', { orderId: '123', amount: 123 });

    expect(handler).toHaveBeenCalledWith({
      type: 'ORDER_PLACED',
      source: 'source',
      payload: { orderId: '123', amount: 123 },
    });
  });

  it('should unsubscribe from an event', () => {
    const pubSub = new CustomPubSub<TestEvents>();
    const handler = vi.fn();
    pubSub.subscribe('ORDER_PLACED', handler);
    pubSub.unsubscribe('ORDER_PLACED', handler);

    pubSub.publish('ORDER_PLACED', 'source', { orderId: '123', amount: 123 });

    expect(handler).not.toHaveBeenCalled();
  });

  it('should publish an event', () => {
    const pubSub = new CustomPubSub<TestEvents>();
    const handler = vi.fn();
    pubSub.subscribe('ORDER_PLACED', handler);

    pubSub.publish('ORDER_PLACED', 'source', { orderId: '123', amount: 123 });

    expect(handler).toHaveBeenCalledWith({
      type: 'ORDER_PLACED',
      source: 'source',
      payload: { orderId: '123', amount: 123 },
    });
  });

  it('should subscribe to multiple events', () => {
    const pubSub = new CustomPubSub<TestEvents>();
    const handler = vi.fn();

    pubSub.subscribeAll(['ORDER_PLACED', 'USER_LOGIN'], handler);

    const date = new Date();

    pubSub.publish('ORDER_PLACED', 'source', {
      orderId: '123',
      amount: 123,
    });
    pubSub.publish('USER_LOGIN', 'source', { userId: '123', timestamp: date });

    expect(handler).toHaveBeenCalledWith({
      type: 'ORDER_PLACED',
      source: 'source',
      payload: { orderId: '123', amount: 123 },
    });

    expect(handler).toHaveBeenCalledWith({
      type: 'USER_LOGIN',
      source: 'source',
      payload: { userId: '123', timestamp: date },
    });
  });
});
