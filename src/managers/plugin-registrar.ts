import { Installer, PluginManager, PluginProvider } from '@/types';

export default class PluginRegistrar<T extends PluginProvider>
  implements Installer<T>
{
  private manager: PluginManager<T>;

  constructor(manager: PluginManager<T>) {
    this.manager = manager;
  }

  async install(plugin: T | T[]) {
    if (Array.isArray(plugin)) {
      for (const item of plugin) {
        await this.manager.install(item);
      }
    } else {
      await this.manager.install(plugin);
    }
  }
}
