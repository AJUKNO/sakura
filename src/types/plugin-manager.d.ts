/**
 * Interface representing a plugin with basic properties and methods for installation and uninstallation.
 *
 * @interface
 */
export interface Plugin {
  /**
   * The name of the plugin.
   *
   * This should be a unique identifier for the plugin.
   */
  name: string;

  /**
   * The version of the plugin.
   *
   * This indicates the current version of the plugin.
   */
  version: string;

  /**
   * Installs the plugin, setting it up for use.
   *
   * This method is called to initialize the plugin.
   *
   * @returns {void}
   */
  install(): void;

  /**
   * Uninstalls the plugin, removing it from use.
   *
   * This method is called to clean up the plugin and remove its effects.
   *
   * @returns {void}
   */
  uninstall(): void;
}

/**
 * Constructor type for creating instances of plugins.
 *
 * A `PluginConstructor` is a class constructor that can create instances of `Plugin`.
 *
 * @typedef {new (...params: any[]) => Plugin} PluginConstructor
 */
export interface PluginConstructor {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  new (...params: any[]): Plugin;
}

/**
 * Interface for managing a collection of plugins.
 *
 * This interface provides methods to install, uninstall, and reset plugins using a generic `T` type,
 * which extends `PluginProvider`.
 *
 * @template T - The type of plugin provider, extending `PluginProvider`.
 * @interface
 */
export interface PluginManager<T extends PluginProvider> {
  /**
   * A map storing plugins with their associated names.
   *
   * The keys are plugin names, and the values are the plugin instances or constructors.
   */
  plugins: Map<string, T>;

  /**
   * Installs a given plugin.
   *
   * This method adds the plugin to the manager and initializes it.
   *
   * @param plugin - The plugin to install, which can be an instance or constructor.
   * @returns {void}
   */
  installPlugin(plugin: T): void;

  /**
   * Uninstalls a given plugin.
   *
   * This method removes the plugin from the manager and cleans up any resources.
   *
   * @param plugin - The plugin to uninstall, which can be an instance or constructor.
   * @returns {void}
   */
  uninstallPlugin(plugin: T): void;

  /**
   * Resets the manager by removing all installed plugins.
   *
   * This method clears all plugins and may be used to prepare for a fresh set of plugins.
   *
   * @returns {void}
   */
  reset(): void;
}

/**
 * Type representing a provider for a plugin.
 *
 * A `PluginProvider` can be either a constructor function for creating `Plugin` instances
 * or an already instantiated `Plugin`.
 *
 * @typedef {PluginConstructor | Plugin} PluginProvider
 */
export type PluginProvider = PluginConstructor | Plugin;
