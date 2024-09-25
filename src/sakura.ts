import {
  ElementData,
  ElementManager,
  ElementProvider,
  Installer,
} from '@/types/managers';
import { PluginManager, PluginProvider } from '@/types/plugin-manager';
import { ISakura, SakuraConstructor, SakuraOptions } from '@/types/sakura';
import { ILogger } from '@/types/logger';
import { BaseEvent, IPubSub } from '@/types/pubsub';

// Responsible for managing elements
class ElementInstaller<T extends ElementProvider>
  implements Installer<ElementData<T>>
{
  private elementManager: ElementManager<T>;
  private readonly debug?: boolean;
  private logger?: ILogger;

  constructor(
    elementManager: ElementManager<T>,
    debug?: boolean,
    logger?: ILogger
  ) {
    this.elementManager = elementManager;
    this.debug = debug;
    this.logger = logger;
  }

  install(elements: ElementData<T>[]): void {
    for (const element of elements) {
      void this.elementManager.defineElement(element.tagName, element.element);
    }
    this.log(`Defined ${elements.length} element(s)`);
  }

  private log(message: string): void {
    if (this.debug) this.logger?.d(message);
  }
}

// Responsible for managing plugins
class PluginInstaller<U extends PluginProvider> implements Installer<U> {
  private pluginManager: PluginManager<U>;
  private readonly debug?: boolean;
  private logger?: ILogger;

  constructor(
    pluginManager: PluginManager<U>,
    debug?: boolean,
    logger?: ILogger
  ) {
    this.pluginManager = pluginManager;
    this.debug = debug;
    this.logger = logger;
  }

  install(plugins: U[]): void {
    plugins.forEach((plugin) => this.pluginManager.installPlugin(plugin));
    this.log(`Installed ${plugins.length.toString()} plugin(s)`);
  }

  private log(message: string): void {
    if (this.debug) this.logger?.d(message);
  }
}

// Handles debug mode logic
class DebugManager {
  constructor(private logger?: ILogger) {}

  getDebugMode(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('debug')) {
      const debug = urlParams.get('debug') === 'true';
      localStorage.setItem('debugMode', String(debug));
      return debug;
    }

    return localStorage.getItem('debugMode') === 'true';
  }

  logDebugMode(debug: boolean): void {
    if (debug) this.logger?.d('Debug mode enabled');
  }
}

// Main Sakura class that orchestrates element and plugin management
export default class Sakura<
  T extends ElementProvider,
  U extends PluginProvider,
  E extends BaseEvent,
> implements ISakura<T, U, E>
{
  private debug?: boolean;
  private elements?: ElementData<T>[];
  private plugins?: U[];
  private elementManager?: ElementManager<T>;
  private pluginManager?: PluginManager<U>;
  private logger?: ILogger;
  private pubsub?: IPubSub<E>;

  constructor(options: SakuraConstructor<T, U, E>) {
    this.elementManager = options.elementManager;
    this.pluginManager = options.pluginManager;
    this.logger = options.logger;
    this.pubsub = options.pubsub;

    // Attach the instance to the global window object
    window.sakura = this;
  }

  init(options: SakuraOptions<T, U, E>): void {
    this.setOptions(options);

    // Install elements and plugins using specific installer classes
    if (this.elementManager) {
      const elementInstaller = new ElementInstaller(
        this.elementManager,
        this.debug,
        this.logger
      );

      if (options.elements?.length) {
        elementInstaller.install(options.elements);
      }
    }

    if (this.pluginManager) {
      const pluginInstaller = new PluginInstaller(
        this.pluginManager,
        this.debug,
        this.logger
      );

      if (options.plugins?.length) {
        pluginInstaller.install(options.plugins);
      }
    }

    this.logInitialization(options);
  }

  // Make properties publicly accessible for use in the console or external scripts
  getElements(): ElementData<T>[] {
    return this.elements || [];
  }

  getPlugins(): U[] {
    return this.plugins || [];
  }

  getElementManager(): ElementManager<T> | undefined {
    return this.elementManager;
  }

  getPluginManager(): PluginManager<U> | undefined {
    return this.pluginManager;
  }

  getPubSub(): IPubSub<E> | undefined {
    return this.pubsub;
  }

  getDebug(): boolean {
    return this.debug ?? false;
  }

  getLogger(): ILogger | undefined {
    return this.logger;
  }

  private logInitialization(options: SakuraOptions<T, U, E>): void {
    if (this.debug) {
      this.logger?.d('Sakura initialized with options:', options);
    }
  }

  private setOptions(options: SakuraOptions<T, U, E>): void {
    const debugManager = new DebugManager(this.logger);
    this.debug = options.debug ?? debugManager.getDebugMode();
    debugManager.logDebugMode(this.debug);

    this.elements = options.elements ?? [];
    this.plugins = options.plugins ?? [];
    this.elementManager = options.elementManager ?? this.elementManager;
    this.pluginManager = options.pluginManager ?? this.pluginManager;
    this.logger = options.logger ?? this.logger;
    this.pubsub = options.pubsub ?? this.pubsub;
  }
}
