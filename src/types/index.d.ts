/**
 * Re-exports types and interfaces from various modules.
 *
 * This file acts as a central export hub, re-exporting symbols from different modules to provide a unified
 * interface for accessing types and interfaces related to the application. The re-exports include:
 *
 * - `sakura`: Types and interfaces related to the `sakura` functionality.
 * - `element-manager`: Types and interfaces for managing elements.
 * - `plugin-manager`: Types and interfaces for managing plugins.
 * - `logger`: Types and interfaces related to logging functionality.
 * - `pubsub`: Types and interfaces for the publish-subscribe pattern.
 *
 * @module
 */
import { ISakura } from '@/types/sakura';
import { ElementProvider } from './managers';
import { PluginProvider } from '@/types/plugin-manager';
import { BaseEvent } from './pubsub';

export * from './sakura';
export * from './managers';
export * from './plugin-manager';
export * from './logger';
export * from './pubsub';

declare global {
  interface Window {
    sakura: ISakura<ElementProvider, PluginProvider, BaseEvent>;
  }
}
