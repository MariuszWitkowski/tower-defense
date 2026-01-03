This document provides guidance for AI agents working with the codebase.

## Project Overview

This project is a tower defense game built with Phaser, TypeScript, and Vite, using Bun as the package manager.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Bun
  ```sh
  curl -fsSL https://bun.sh/install | bash
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username_/my-llm-tower-defense.git
   ```
2. Install dependencies
   ```sh
   bun install
   ```

## Available Scripts

In the project directory, you can run:

### `bun dev`

Runs the app in development mode.
Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### `bun build`

Builds the app for production to the `dist` folder.

### `bun preview`

Serves the production build locally.

### `bun run test`

Launches the test runner.

### `bun run lint`

Lints the code using Oxc.

### `bun run format`

Formats the code using Oxc.

## Testing

This project has a continuous integration (CI) pipeline that runs on every pull request to the `main` branch. The CI process, defined in `.github/workflows/pr-validation.yml`, performs the following checks to ensure code quality and correctness:

1.  **Install Dependencies:** Runs `bun install` to ensure all required packages are present.
2.  **Lint:** Runs `bun run lint` to check for code style issues.
3.  **Test:** Runs `bun run test` to execute the unit test suite.
4.  **Build:** Runs `bun run build` to ensure the project builds successfully.

All checks must pass before a pull request can be merged.

## Technologies Used

- [Bun](https://bun.sh/) - An all-in-one JavaScript runtime, bundler, transpiler, and package manager.
- [Phaser](https://phaser.io/) - A fast, free, and fun open source HTML5 game framework.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.
- [Vite](https://vitejs.dev/) - A modern frontend build tool.
- [tsyringe](https://github.com/microsoft/tsyringe) - A lightweight dependency injection container for TypeScript/JavaScript.
- [Zustand](https://github.com/pmndrs/zustand) - A small, fast and scaleable bearbones state-management solution.
- [Oxc](https://oxc.rs/) - A suite of high-performance tools for the JavaScript ecosystem.
- [Vitest](https://vitest.dev/) - A blazing fast unit-test framework powered by Vite.
