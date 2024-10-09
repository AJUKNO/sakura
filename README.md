# Sakura Framework

<p align="center">
  <img src="./.github/assets/sakura-banner.png" alt="Sakura banner">
</p>

<p align="center">
  Sakura is a robust and flexible framework for managing custom elements and plugins. Built with TypeScript, it provides a powerful API for initializing, managing, and interacting with elements and plugins within your project.
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@ajukno/sakura"><img src="https://img.shields.io/npm/v/%40ajukno%2Fsakura?labelColor=%23C75B7A&color=3D3B40" alt="NPM Version"></a>
</p>

## Key Features

- **Custom Element Management:** Add, define, and manage custom elements seamlessly.
- **Plugin Support:** Extend the framework with plugins that add extra functionality.
- **Lazy Loading:** Efficiently load elements and plugins when needed.
- **Event Handling (Pub/Sub System):** Built-in pub/sub system for event-driven interactions.
- **Debug Mode:** Enable detailed logging for development and debugging.
- **Asynchronous Support:** Handle initialization and plugin management asynchronously.

## Installation

To install Sakura via npm, run the following command:

```bash
npm install @ajukno/sakura
```

## Usage

### Importing Sakura

First, import Sakura into your project:

```typescript
import { sakura } from '@ajukno/sakura';
```

### Initializing Sakura

Initialize Sakura with your custom elements, plugins, and configuration options:

```typescript
await sakura.init({
  elements: [
    { tagName: 'custom-element', element: CustomElementClass },
  ],
  plugins: [
    CustomPlugin,
  ],
  debugMode: true,
});
```

You can add more custom elements and plugins later using the `init` method:

```typescript
await sakura.init({
  elements: [
    { tagName: 'another-element', element: AnotherElementClass },
  ],
  plugins: [
    AnotherPlugin,
  ],
});
```

## Custom Element Manager

The **Custom Element Manager** is responsible for defining and managing custom elements within Sakura. You can define,
get, and clear custom elements, as well as redefine them as needed.

### `define(tag: string, element: ElementProvider): Promise<void>`

Defines a custom element using the provided tag and element provider. It validates the element and handles lazy loading
if necessary.

```typescript
await sakura.elementManager.define('custom-element', CustomElementClass);
```

### `get(tag: string): ElementProvider | undefined`

Retrieves a defined element by its tag.

```typescript
const element = sakura.elementManager.get('custom-element');
```

### `clear(): void`

Clears all registered custom elements from the manager.

```typescript
sakura.elementManager.clear();
```

### `redefine(): Promise<void>`

Redefines all elements currently registered in the manager.

```typescript
await sakura.elementManager.redefine();
```

## Plugin Manager

The **Plugin Manager** is responsible for installing, uninstalling, and managing plugins within Sakura. Plugins can be
installed asynchronously and can be lazy-loaded as needed.

### `install(plugin: PluginProvider): Promise<void>`

Installs a plugin by creating an instance of the plugin and calling its `install` method. Supports lazy loading of
plugins.

```typescript
await sakura.pluginManager.install(CustomPlugin);
```

### `uninstall(name: string): void`

Uninstalls a plugin by its name, calling the `uninstall` method of the plugin instance.

```typescript
sakura.pluginManager.uninstall('CustomPlugin');
```

### `reset(): void`

Clears all installed plugins from the manager.

```typescript
sakura.pluginManager.reset();
```

### `reinstall(): Promise<void>`

Reinstalls all plugins currently registered in the manager.

```typescript
await sakura.pluginManager.reinstall();
```

## Lazy Loading and Code Splitting

Sakura supports **lazy loading** for both elements and plugins, which is particularly useful when dealing with large
components or plugins that should only be loaded when needed. To further optimize your project, you can use lazy loading
in combination with **code splitting**.

### Lazy Element Provider

A lazy provider is a function that loads the element or plugin asynchronously when it's needed. Sakura will
automatically handle this process for you.

### `lazy<T>(provider: () => Promise<{ default: T }>): LazyProvider<T>`

Defines a lazy provider that returns the default export from an asynchronous module. Use this function to lazily load
custom elements or plugins. This feature should be used in combination with **code splitting** to split your bundle and
improve loading times for your application.

#### Example of Lazy Loading with Code Splitting

For lazy loading, tools like **Webpack** or **Vite** handle code splitting automatically when dynamic `import()` is
used. Here’s how you can define a custom element or plugin with lazy loading:

```typescript
import { lazy } from '@ajukno/sakura';

// Lazy load a custom element with code splitting
await sakura.elementManager.define(
  'lazy-element',
  lazy(() => import(/* ESbuild chunk: "LazyElement-chunk" */ './components/LazyElement'))
);

// Lazy load a plugin with code splitting
await sakura.pluginManager.install(
  lazy(() => import(/* ESbuild chunk: "LazyPlugin-chunk" */ './plugins/LazyPlugin'))
);
```

By utilizing **code splitting** with lazy loading, only the required elements and plugins will be loaded when needed,
reducing the initial load time of your application.

## PubSub API

Sakura includes a **publish-subscribe (pub/sub)** system that allows communication between custom elements, plugins, and
other components using strongly typed events.

### Event Definition

Events in Sakura are defined using the `SakuraEvent` type. Each event includes:

- **`type`**: A string representing the event's name.
- **`payload`**: The associated data passed with the event.
- **`source`** (optional): A string representing the event's source (optional).

Example event types:

```typescript
type CursorStateRemoveEvent = SakuraEvent<'cursor:state:remove', CursorStateRemove>;
type SakuraRefreshElementsEvent = SakuraEvent<'sakura:refresh-elements'>;
```

You can combine multiple event types into a union to allow Sakura's `pubsub` system to manage all events seamlessly:

```typescript
type Events = CursorStateRemoveEvent | SakuraRefreshElementsEvent;
const sakura = new Sakura<Events>();
```

### PubSub Methods

The `PubSub` system provides three key methods: `subscribe`, `unsubscribe`, and `publish`. Each method is fully typed,
ensuring type safety and autocompletion in your editor.

#### 1. **`subscribe`**

Subscribes to one or more events, providing a callback that is invoked when the event is published.

```typescript
sakura.pubsub.subscribe('cursor:state:remove', (event) => {
  console.log('Cursor state removed:', event.payload);
});
```

- **Parameters**:
    - `events`: A string or array of strings representing the event types to subscribe to.
    - `callback`: A function that is called when the specified event is published, receiving the event object as an
      argument.

#### 2. **`unsubscribe`**

Unsubscribes a callback from one or more events.

```typescript
const handleRemove = (event) => {
  console.log('Cursor state removed:', event.payload);
};

sakura.pubsub.subscribe('cursor:state:remove', handleRemove);
sakura.pubsub.unsubscribe('cursor:state:remove', handleRemove);  // Unsubscribe the callback
```

- **Parameters**:
    - `events`: A string or array of strings representing the event types to unsubscribe from.
    - `callback`: The function that was previously subscribed to the event.

#### 3. **`publish`**

Publishes an event, notifying all listeners subscribed to that event.

```typescript
sakura.pubsub.publish('cursor:state:remove', { stateId: '123' });
```

- **Parameters**:
    - `event`: The event type (string) to be published.
    - `payload`: The payload data to pass along with the event. The type is automatically inferred based on the event
      type.
    - `source` (optional): An optional string representing the source of the event.

### Example Usage

Here’s an example demonstrating how to use the `PubSub` system to handle events:

```typescript
// Define the events
type CursorStateRemoveEvent = SakuraEvent<'cursor:state:remove', { stateId: string }>;
type SakuraRefreshElementsEvent = SakuraEvent<'sakura:refresh-elements'>;
type Events = CursorStateRemoveEvent | SakuraRefreshElementsEvent;

const sakura = new Sakura<Events>();

// Subscribe to events
sakura.pubsub.subscribe('cursor:state:remove', (event) => {
  console.log('Cursor state removed:', event.payload.stateId);
});

// Publish an event
sakura.pubsub.publish('cursor:state:remove', { stateId: '123' });

// Unsubscribe from the event
const removeHandler = (event) => console.log('Cursor state removed:', event.payload.stateId);
sakura.pubsub.subscribe('cursor:state:remove', removeHandler);
sakura.pubsub.unsubscribe('cursor:state:remove', removeHandler);
```

In this example:

- `CursorStateRemoveEvent` has a payload that includes `stateId`.
- `SakuraRefreshElementsEvent` has no payload.
- The `subscribe`, `publish`, and `unsubscribe` methods are used to handle events and their associated data.

### Automatic Type Inference

Sakura's `PubSub` system automatically infers event names and payload types, ensuring type safety at compile time. This
makes the development process smoother, as you don’t need to manually manage event typing.

## Testing

Sakura includes a suite of tests that ensure the framework behaves as expected. You can run the tests using Vitest:

```bash
npm run test
```

## License

Sakura is licensed under the [MIT License](./LICENSE).