import {
  ElementData,
  ElementManager,
  ElementProvider,
} from '@/types/element-manager';
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
 * @interface
 */
export interface ISakura<
  T extends ElementProvider,
  U extends PluginProvider,
  E extends BaseEvent,
> {
  /**
   * Optional manager for handling elements.
   *
   * This manager provides methods for defining, retrieving, and managing elements.
   *
   * @type {ElementManager<T>}
   */
  elementManager?: ElementManager<T>;

  /**
   * Optional manager for handling plugins.
   *
   * This manager provides methods for installing, uninstalling, and managing plugins.
   *
   * @type {PluginManager<U>}
   */
  pluginManager?: PluginManager<U>;

  /**
   * Optional logging utility.
   *
   * This logger provides methods for logging messages at different levels (debug, info, warning, error).
   *
   * @type {ILogger}
   */
  logger?: ILogger;

  /**
   * Optional publish-subscribe system.
   *
   * This system enables subscribing to, publishing, and managing events.
   *
   * @type {IPubSub<E>}
   */
  pubsub?: IPubSub<E>;

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

  /**
   * Initializes the Sakura instance with the given options.
   *
   * This method sets up the element manager, plugin manager, logger, pub-sub system, and any elements or
   * plugins provided in the options.
   *
   * @param options - The options to initialize the Sakura instance with.
   * @returns {void | Promise<void>} A promise that resolves when the Sakura instance has been initialized.
   */
  init(options: SakuraOptions<T, U, E>): void | Promise<void>;

  /**
   * Returns whether debugging mode is enabled.
   *
   * This method checks the current debugging mode status.
   *
   * @returns {boolean} - `true` if debugging mode is enabled, otherwise `false`.
   */
  debugMode(): boolean;
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
