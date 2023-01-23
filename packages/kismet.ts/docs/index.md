# Kismet.ts

## Packages

To get started with coding kismet, install the package(s) you will need for your purpose:

| Package      | Description                            | Example implementations                             |
| ------------ | -------------------------------------- | --------------------------------------------------- |
| core         | Base classes for projects, nodes, etc. | Create a custom wrapper, custom nodes               |
| items        | UDK and Rocket League kismet items     | Populate sequences with items to be copied into UDK |
| parsers      | Create sequences from text             | Create a node item from a class name                |
| parsers-node | Parsers for creating item definitions  | Create `@kismet.ts/items` from `.upk` files         |
| shared       | Miscellaneous kismet utilities         | Destructure a default property                      |
| util         | Miscellaneous utilities for Node.js    | Write sequences to a clipboard                      |

The most common packages are `core` and `items` from this list.
Furthermore, `kismet.ts`, installed without a scope, reexports all the packages listed above.

## Prerequisites

- [Node.js v16.6.0+](https://nodejs.org/)
- [UDK 2015][rlmm] (recommended)

## Installation

1. Create a new project

```sh
mkdir kismet-code
cd kismet-code

git init
npm init
```

2. After choosing the packages install them:

```sh
npm install @kismet.ts/{package}
```

Or if you will likely need all packages listed above:

```sh
npm install kismet.ts
```

3. Create some sequences. For more details check out the [template](https://github.com/ghostrider-05/kismet.ts-template) or some of the examples in the package(s) you installed.

[rlmm]: https://rocketleaguemapmaking.com