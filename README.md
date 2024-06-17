<p align="center">
  <img src="./.github/assets/sakura-banner.png" alt="Mite banner">
</p>

<p align="center">
Sakura is a TypeScript-based project designed to facilitate the development of custom components that extend HTMLElements. It provides a robust and flexible structure for creating and managing custom elements in your application.
</p>

## Features

- TypeScript written components
- Custom components extending HTMLElements
- Debugging and logging capabilities
- PubSub utility for event management
- Customizable ASCII art and greetings

## Usage

Here is a basic example of how to use Sakura:

```typescript
import { Sakura } from 'sakura';

const sakura = new Sakura({
  debug: true,
  kawaii: {
    art: 'cinnamoroll',
    greeting: 'Hello, Sakura!'
  },
  prefix: 'sakura'
});

sakura.define([
  {
    tagName: 'my-element',
    elementClass: MyElement
  }
]);
```

In the above example, a new instance of Sakura is created with debugging enabled, a custom ASCII art and greeting, and a prefix for the logger. Then, a custom element is defined.

## API

### Sakura

The `Sakura` class is the main export of the Sakura module. It provides methods for defining and managing custom elements, as well as utilities for logging and event management.

#### `constructor(options: ISakuraOptions)`

Creates a new instance of Sakura. The options parameter allows you to customize the behavior of Sakura.

#### `init(options: ISakuraOptions): void`

Initializes Sakura with the provided options.

#### `define(elements: ICustomElement[]): void`

Defines custom elements. The elements parameter is an array of objects, each containing a tagName and an elementClass.

#### `reset(): void`

Resets the custom elements registry, redefining all previously defined elements.

#### `kawaii(art: SakuraArt, greeting?: string): void`

Displays ASCII art and an optional greeting in the console.

## Contributing

Contributions are welcome! Please check the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the [MIT License](LICENSE).

# Shopify Foundation

Shopify Foundation is a starter template designed to facilitate the development of Shopify themes using TypeScript written components. These components extend HTMLElements to create custom components in the Liquid space, enabling seamless interaction between different parts of your Shopify theme.

## Features

- TypeScript written components
- Custom components extending HTMLElements
- Facilitates interaction between Liquid components

## Roadmap

| Sections             | Main | Snippets           | Scripts            | Schema |
| -------------------- | ---- | ------------------ | ------------------ | ------ |
| **article**          | ✓    | ✓                  | ✓                  | ✓      |
| blog                 | ✓    | ✓                  | ✓                  | ✓      |
| cart                 | ✓    | ✓                  | ✓                  | ✓      |
| collection           | ✓    | ✓                  | ✓                  | ✓      |
| **gift_card.liquid** | ✓    | ✓                  | ✓                  | ✓      |
| **index**            | ✗    | ✗                  | ✗                  | ✗      |
| **list-collections** | ✗    | ✗                  | ✗                  | ✗      |
| page                 | ✓    | <small>N/A</small> | <small>N/A</small> | ✓      |
| **password**         | ✓    | ✓                  | ✓                  | ✓      |
| product              | ✗    | ✓                  | ✓                  | ✓      |
| search               | ✓    | ✓                  | ✓                  | ✓      |
| 404                  | ✓    | <small>N/A</small> | <small>N/A</small> | ✓      |

### Out of scope

| Sections                   | Snippets | Scripts | Schema |
| -------------------------- | -------- | ------- | ------ |
| customers/account          | ✗        | ✗       | ✗      |
| customers/activate_account | ✗        | ✗       | ✗      |
| customers/addresses        | ✗        | ✗       | ✗      |
| customers/login            | ✗        | ✗       | ✗      |
| customers/order            | ✗        | ✗       | ✗      |
| customers/register         | ✗        | ✗       | ✗      |
| customers/reset_password   | ✗        | ✗       | ✗      |
| robots.txt.liquid          | ✗        | ✗       | ✗      |

## Getting Started

1. Clone this repository.
2. Install dependencies: `npm install`
3. Start the development server: `npm start`

## Contributing

Contributions are welcome! Please check the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the [MIT License](LICENSE).
