import {
  LazyProvider,
  Plugin,
  PluginConstructor,
  PluginManager,
  PluginProvider,
} from '@/types';

export default class PluginManagerImpl
  implements PluginManager<PluginProvider>
{
  plugins: Map<
    string,
    {
      active: boolean;
      provider: PluginProvider;
    }
  > = new Map();

  async install(plugin: PluginProvider): Promise<void> {
    try {
      const instance = await this.createPluginInstance(plugin);
      instance.install();
      this.plugins.set(instance.name, {
        active: true,
        provider: instance,
      });
    } catch (error) {
      this.handleInstallError(plugin, error);
    }
  }

  uninstall(name: string): void {
    const pluginEntry = this.plugins.get(name);
    if (
      pluginEntry &&
      pluginEntry.active &&
      this.isPlugin(pluginEntry.provider)
    ) {
      pluginEntry.provider.uninstall();
      this.plugins.delete(name);
    }
  }

  reset(): void {
    this.plugins.clear();
  }

  async reinstall(): Promise<void> {
    for (const [, pluginEntry] of this.plugins) {
      await this.install(pluginEntry.provider);
    }
  }

  private async createPluginInstance(
    provider: PluginProvider
  ): Promise<Plugin> {
    if (this.isLazyProvider(provider)) {
      const { default: PluginConstructor } = await provider.provider();
      return new PluginConstructor();
    } else if (this.isPluginConstructor(provider)) {
      return new provider();
    } else if (this.isPlugin(provider)) {
      return provider;
    }
    throw new Error('Invalid plugin provider');
  }

  private handleInstallError(plugin: PluginProvider, error: unknown): void {
    console.error('Failed to install plugin:', error);
    this.plugins.set(crypto.randomUUID(), {
      active: false,
      provider: plugin,
    });
  }

  private isPlugin(provider: PluginProvider): provider is Plugin {
    return (
      typeof provider === 'object' &&
      'install' in provider &&
      'uninstall' in provider
    );
  }

  private isPluginConstructor(
    provider: PluginProvider
  ): provider is PluginConstructor {
    return provider instanceof Function;
  }

  private isLazyProvider(
    provider: PluginProvider
  ): provider is LazyProvider<PluginConstructor> {
    return 'lazy' in provider && provider.lazy;
  }
}
