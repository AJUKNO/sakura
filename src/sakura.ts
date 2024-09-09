import {
  ElementData,
  ElementManager,
  ElementProvider,
} from '@/types/element-manager';
import { PluginManager, PluginProvider } from '@/types/plugin-manager';
import { ISakura, SakuraConstructor, SakuraOptions } from '@/types/sakura';
import { ILogger } from '@/types/logger';
import { BaseEvent, IPubSub } from '@/types/pubsub';

export default class Sakura<
  T extends ElementProvider,
  U extends PluginProvider,
  E extends BaseEvent,
> implements ISakura<T, U, E>
{
  debug?: boolean;
  elements?: ElementData<T>[];
  plugins?: U[];
  elementManager?: ElementManager<T>;
  pluginManager?: PluginManager<U>;
  logger?: ILogger;
  pubsub?: IPubSub<E>;

  constructor(options: SakuraConstructor<T, U, E>) {
    this.elementManager = options.elementManager;
    this.pluginManager = options.pluginManager;
    this.logger = options.logger;
    this.pubsub = options.pubsub;
  }

  init(options: SakuraOptions<T, U, E>): void {
    this.setOptions(options);

    // Install elements
    if (options.elements?.length) {
      for (const element of options.elements) {
        void this.elementManager?.defineElement(
          element.tagName,
          element.element
        );
      }
      if (this.debug) {
        this.logger?.d(
          `Defined ${options.elements.length.toString()} element(s)`
        );
      }
    }

    // Install plugins
    if (options.plugins?.length) {
      options.plugins.forEach((plugin) => {
        this.pluginManager?.installPlugin(plugin);
      });
      if (this.debug) {
        this.logger?.d(
          `Installed ${options.plugins.length.toString()} plugin(s)`
        );
      }
    }

    if (this.debug) {
      this.logger?.d('Sakura initialized with options:', options);
    }
  }

  debugMode(): boolean {
    // First check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('debug')) {
      const debug = urlParams.get('debug') === 'true';
      localStorage.setItem('debugMode', String(debug)); // Store the value in localStorage
      return debug;
    }

    // Fallback to localStorage
    return localStorage.getItem('debugMode') === 'true';
  }

  private setOptions(options: SakuraOptions<T, U, E>): void {
    this.debug = options.debug ?? this.debugMode();
    this.elements = options.elements ?? [];
    this.plugins = options.plugins ?? [];

    if (options.elementManager) {
      this.elementManager = options.elementManager;
    }

    if (options.pluginManager) {
      this.pluginManager = options.pluginManager;
    }

    if (options.logger) {
      this.logger = options.logger;
    }

    if (options.pubsub) {
      this.pubsub = options.pubsub;
    }
  }
}
