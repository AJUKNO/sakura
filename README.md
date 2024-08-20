<p align="center">
  <img src="https://raw.githubusercontent.com/AJUKNO/ts-starter/develop/.github/assets/starter-banner.png" alt="Starter banner">
</p>

<p align="center">
A TypeScript starter project template with essential configurations and scripts for building, linting, formatting, and
testing.
</p>

<p align="center">
<a href="https://www.npmjs.com/package/@ajukno/ts-starter"><img src="https://img.shields.io/npm/v/%40ajukno%2Fts-starter?labelColor=%23C75B7A&color=3D3B40" alt="NPM Version"></a>
</p>

## Features

- TypeScript
- ESLint
- Prettier
- Vitest
- TSUP for bundling

## Getting Started

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/ajukno/ts-starter.git
    cd ts-starter
    ```

2. Install dependencies:
    ```sh
    pnpm install
    ```

### Scripts

- `build-fast`: Quickly build the project without generating type declarations.
    ```sh
    pnpm run build-fast
    ```

- `build`: Build the project with type declarations.
    ```sh
    pnpm run build
    ```

- `build:watch`: Watch for changes and rebuild the project.
    ```sh
    pnpm run build:watch
    ```

- `format`: Format the code using Prettier.
    ```sh
    pnpm run format
    ```

- `lint`: Lint the code using ESLint.
    ```sh
    pnpm run lint
    ```

- `lint:fix`: Lint and fix the code using ESLint.
    ```sh
    pnpm run lint:fix
    ```

- `test`: Run tests using Vitest.
    ```sh
    pnpm run test
    ```

## Project Structure

- `src/`: Source code directory.
- `tests/`: Test files directory.
- `dist/`: Distribution directory (generated after build).

## License

This project is licensed under the MIT License.
