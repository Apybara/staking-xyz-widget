# Staking.xyz Widget

## Installation

It's advisable to employ a Node version manager that aligns with the `.nvmrc` or `package.json/engines/node` configurations, such as [nvm](https://github.com/nvm-sh/nvm), [asdf](https://github.com/asdf-vm/asdf), or [n](https://github.com/tj/n). For instance, the command below from [nvm](https://github.com/nvm-sh/nvm) provides step-by-step instructions to install and engage the right Node.js version:

```bash
$ nvm use
```

We use [`pnpm`](https://pnpm.io/installation) to manage packages.

```bash
$ pnpm install
```

## Development

To run the app locally, execute:

```bash
$ pnpm dev
```

### Environment variables

Valid environment variables are required to run the app. Please follow these steps:

1. Duplicate and rename the `.env.example` file to `.env`
2. Ask for the valid variables from the teammates and replace the placeholders in the newly created `.env` with the valid ones

## Quality check

To maintain code quality, we use [lint-staged](https://github.com/lint-staged/lint-staged) and [Husky](https://github.com/typicode/husky) to run TypeScript type checks against all staged TS files and [Prettier](https://prettier.io/) formatter against the staged files.
