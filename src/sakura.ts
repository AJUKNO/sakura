import {
  CustomElementManager,
  ElementProvider,
  Logger,
  PluginManager,
  PluginProvider,
  SakuraConfig,
  SakuraCore,
  SakuraEvent,
  SakuraOptions,
} from '@/types';
import SakuraLogger from '@/utils/logger';
import { SAKURA_LOGGER_OPTIONS } from '@/utils/constants';
import CustomElementManagerImpl from '@/managers/custom-element-manager';
import PluginManagerImpl from '@/managers/plugin-manager';
import ElementRegistrar from '@/managers/element-registrar';
import PluginRegistrar from '@/managers/plugin-registrar';
import { PubSub } from '@/types/pubsub';
import { PubSubImpl } from '@/utils/pubsub';

export default class Sakura<
  E extends SakuraEvent<string>,
  T extends ElementProvider = ElementProvider,
  P extends PluginProvider = PluginProvider,
> implements SakuraCore<E, T, P>
{
  debugMode: boolean;
  elementManager: CustomElementManager<T>;
  pluginManager: PluginManager<P>;
  logger: Logger;
  pubsub: PubSub<E>;

  constructor(props?: SakuraConfig<E, T, P>) {
    this.debugMode = props?.debugMode || false;
    this.elementManager =
      props?.elementManager ??
      (new CustomElementManagerImpl() as unknown as CustomElementManager<T>);
    this.pluginManager =
      props?.pluginManager ??
      (new PluginManagerImpl() as unknown as PluginManager<P>);
    this.logger = props?.logger ?? new SakuraLogger(SAKURA_LOGGER_OPTIONS);
    this.pubsub =
      props?.pubsub ?? (new PubSubImpl<E>() as unknown as PubSub<E>);
  }

  async init(options: SakuraOptions<E, T, P>) {
    if (options.debugMode) {
      this.debugMode = options.debugMode;
    }

    if (options.elements) {
      await new ElementRegistrar(this.elementManager).install(options.elements);
    }

    if (options.plugins) {
      await new PluginRegistrar(this.pluginManager).install(options.plugins);
    }

    if (this.debugMode) {
      console.log('Sakura initialized with options:', options);
    }
  }
}
