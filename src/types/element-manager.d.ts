import { LazyProvider } from '@/types/sakura';

export type EagerElementProvider = CustomElementConstructor;

export type ElementProvider =
  | LazyProvider<CustomElementConstructor>
  | EagerElementProvider;

export type ElementDefinition<T extends ElementProvider> = {
  name: string;
  element: T;
};

export interface CustomElementManager<T> {
  elements: Map<
    string,
    {
      active: boolean;
      provider: T;
    }
  >;

  define(tag: string, element: T): Promise<void>;

  get(tag: string): T | undefined;

  clear(): void;

  redefine(): Promise<void>;
}
