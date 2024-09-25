import { ElementData, ElementManager, ElementProvider } from '@/types/managers';
import { PluginManager, PluginProvider } from '@/types/plugin-manager';
import { ILogger } from '@/types/logger';
import { BaseEvent, IPubSub } from '@/types/pubsub';

/**
 * Interface representing the core functionality of the Sakura system.
 *
 * This interface defines the structure of a Sakura instance, including managers for elements and plugins,
 * a logging utility, a pub-sub system, and options for debugging and initializing elements and plugins.
 *
 * @template T - The type of element provider, extending `ElementProvider`.
 * @template U - The type of plugin provider, extending `PluginProvider`.
 * @template E - The type of events, extending `BaseEvent`.
 */
export interface ISakura<
  T extends ElementProvider,
  U extends PluginProvider,
  E extends BaseEvent,
> {
  /**
   * Initializes the Sakura instance with the given options.
   *
   * This method sets up the element manager, plugin manager, logger, pub-sub system, and any elements or
   * plugins provided in the options.
   *
   * @param options - The options to initialize the Sakura instance with.
   * @returns {void} A promise that resolves when the Sakura instance has been initialized.
   */
  init(options: SakuraOptions<T, U, E>): void;

  /**
   * Returns an array of the currently defined elements.
   *
   * This method provides access to the elements managed by the instance.
   *
   * @returns {ElementData<T>[]}
   */
  getElements(): ElementData<T>[];

  /**
   * Returns an array of the currently installed plugins.
   *
   * This method provides access to the plugins managed by the instance.
   *
   * @returns {U[]}
   */
  getPlugins(): U[];

  /**
   * Returns the element manager associated with this instance.
   *
   * @returns {ElementManager<T> | undefined}
   */
  getElementManager(): ElementManager<T> | undefined;

  /**
   * Returns the plugin manager associated with this instance.
   *
   * @returns {PluginManager<U> | undefined}
   */
  getPluginManager(): PluginManager<U> | undefined;

  /**
   * Returns the pub-sub system associated with this instance.
   *
   * @returns {IPubSub<E> | undefined}
   */
  getPubSub(): IPubSub<E> | undefined;

  /**
   * Returns the debugging status of the instance.
   *
   * @returns {boolean}
   */
  getDebug(): boolean;

  /**
   * Returns the logger associated with this instance.
   *
   * @returns {ILogger | undefined}
   */
  getLogger(): ILogger | undefined;
}

/**
 * Type for the constructor of a Sakura instance.
 *
 * This type defines the required properties for creating a Sakura instance, including managers for elements and
 * plugins, a logger, and a pub-sub system.
 *
 * @template T - The type of element provider, extending `ElementProvider`.
 * @template U - The type of plugin provider, extending `PluginProvider`.
 * @template E - The type of events, extending `BaseEvent`.
 * @typedef
 */
export type SakuraConstructor<
  T extends ElementProvider,
  U extends PluginProvider,
  E extends BaseEvent,
> = {
  /**
   * Manager for handling elements.
   *
   * @type {ElementManager<T>}
   */
  elementManager: ElementManager<T>;

  /**
   * Manager for handling plugins.
   *
   * @type {PluginManager<U>}
   */
  pluginManager: PluginManager<U>;

  /**
   * Logging utility.
   *
   * @type {ILogger}
   */
  logger: ILogger;

  /**
   * Publish-subscribe system.
   *
   * @type {IPubSub<E>}
   */
  pubsub: IPubSub<E>;
};

/**
 * Options for configuring a Sakura instance.
 *
 * This interface extends `Partial<SakuraConstructor>` and includes additional optional settings
 * such as debugging mode, initial elements, and plugins.
 *
 * @template T - The type of element provider, extending `ElementProvider`.
 * @template U - The type of plugin provider, extending `PluginProvider`.
 * @template E - The type of events, extending `BaseEvent`.
 * @interface
 */
export interface SakuraOptions<
  T extends ElementProvider,
  U extends PluginProvider,
  E extends BaseEvent,
> extends Partial<SakuraConstructor<T, U, E>> {
  /**
   * Optional flag to enable or disable debugging mode.
   *
   * If `true`, debugging features will be enabled.
   *
   * @type {boolean}
   */
  debug?: boolean;

  /**
   * Optional array of element data to initialize with.
   *
   * Each entry in the array contains data for defining and managing elements.
   *
   * @type {ElementData<T>[]}
   */
  elements?: ElementData<T>[];

  /**
   * Optional array of plugins to initialize with.
   *
   * Each entry in the array represents a plugin to be managed.
   *
   * @type {U[]}
   */
  plugins?: U[];
}
