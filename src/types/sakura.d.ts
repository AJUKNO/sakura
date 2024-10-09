import {
  CustomElementManager,
  ElementDefinition,
  ElementProvider,
} from '@/types/element-manager';
import { PluginManager, PluginProvider } from '@/types/plugin-manager';
import { Logger } from '@/types/logger';
import { PubSub, SakuraEvent } from '@/types/pubsub';

export interface SakuraCore<
  E extends SakuraEvent<string>,
  T extends ElementProvider,
  P extends PluginProvider,
> {
  debugMode: boolean;
  elementManager: CustomElementManager<T>;
  pluginManager: PluginManager<P>;
  pubsub: PubSub<E>;
  logger: Logger;
}

export type LazyProvider<T> = {
  lazy: true;
  provider: () => Promise<{ readonly default: T }>;
};

export interface Installer<T> {
  install(items: T[] | T): void | Promise<void>;
}

export type SakuraConfig<
  E extends SakuraEvent<string>,
  T extends ElementProvider,
  P extends PluginProvider,
> = {
  debugMode?: boolean;
  elementManager?: CustomElementManager<T>;
  pluginManager?: PluginManager<P>;
  logger?: Logger;
  pubsub?: PubSub<E>;
  elements?: ElementDefinition<T>[] | ElementDefinition<T>;
  plugins?: P[] | P;
};

export type SakuraOptions<
  E extends SakuraEvent<string>,
  T extends ElementProvider,
  P extends PluginProvider,
> = Omit<
  SakuraConfig<E, T, P>,
  'pluginManager' | 'elementManager' | 'pubsub' | 'logger'
>;
