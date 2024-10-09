import { LazyProvider } from '@/types';

export const lazy = <T>(
  provider: () => Promise<{ default: T }>
): LazyProvider<T> => {
  return {
    lazy: true,
    provider,
  };
};
