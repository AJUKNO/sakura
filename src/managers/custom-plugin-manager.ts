import { PluginManager, PluginProvider } from '@/types';

export default class CustomPluginManager
  implements PluginManager<PluginProvider>
{
  plugins: Map<string, PluginProvider>;

  constructor() {
    this.plugins = new Map();
  }

  installPlugin(plugin: PluginProvider): void {
    try {
      if (typeof plugin === 'function') {
        const newPlugin = new plugin();
        newPlugin.install();
        this.plugins.set(newPlugin.name, newPlugin);
      } else {
        plugin.install();
        this.plugins.set(plugin.name, plugin);
      }
    } catch (error) {
      console.error(
        `Failed to install plugin: ${(error as Error).message}`,
        error
      );
    }
  }

  uninstallPlugin(plugin: PluginProvider): void {
    try {
      // Find plugin that matches the type of plugin
      if (typeof plugin === 'function') {
        new plugin().uninstall();
      } else {
        plugin.uninstall();
      }

      this.plugins.delete(plugin.name);
    } catch (error) {
      console.error(
        `Failed to uninstall plugin: ${(error as Error).message}`,
        error
      );
    }
  }

  reset(): void {
    try {
      this.plugins.forEach((plugin) => {
        this.uninstallPlugin(plugin);
      });
      this.plugins.clear();
    } catch (error) {
      console.error(
        `Failed to reset plugins: ${(error as Error).message}`,
        error
      );
    }
  }
}
