import { LazyProvider } from '@/types/sakura';

export interface Plugin {
  name: string;
  version: string;

  install(): void;

  uninstall(): void;
}

export interface PluginConstructor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  new (...params: any[]): Plugin;
}

export type PluginProvider =
  | LazyProvider<PluginConstructor>
  | PluginConstructor
  | Plugin;

export interface PluginManager<T> {
  plugins: Map<
    string,
    {
      active: boolean;
      provider: T;
    }
  >;

  install(plugin: T): void | Promise<void>;

  uninstall(name: string): void;

  reset(): void;

  reinstall(): void | Promise<void>;
}
