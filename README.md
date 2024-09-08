<p align="center">
  <img src="./.github/assets/sakura-banner.png" alt="Sakura banner">
</p>

<p align="center">
  Sakura is a flexible framework for managing custom elements and plugins. It is built with TypeScript and provides a robust API for element and plugin management.
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@ajukno/sakura"><img src="https://img.shields.io/npm/v/%40ajukno%2Fsakura?labelColor=%23C75B7A&color=3D3B40" alt="NPM Version"></a>
</p>

## Features

- Manages custom elements and plugins
- Provides a flexible API for initialization and event handling
- Supports asynchronous operations

## Usage

First, import Sakura into your project:

```typescript
import { sakura } from '@ajukno/sakura';
```

Then, initialize Sakura with the options you want to use:

```typescript
await sakura.init({
  elements: [
    { tagName: 'custom-element', element: CustomElementClass },
  ],
  plugins: [
    CustomPlugin,
  ],
  debug: true,
});
```

You can add custom elements and plugins using the `init` method:

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

## API

### `init(options: SakuraOptions<T, U, E>): Promise<void>`

Initializes Sakura with the given options. The `options` object should have the following properties:

- `elements`: An array of objects specifying the custom elements to define. Each object should have `tagName` and `element` properties.
- `plugins`: An array of plugins to install.
- `debug` (optional): A boolean to enable or disable debug mode.

### `debugMode(): boolean`

Returns the current debug mode status.

## Tests

Sakura has a suite of tests that can be run using Vitest. To run the tests, use the following command:

```bash
npm run test
```

## License

Sakura is licensed under the MIT license.