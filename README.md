# Solid React Components

[![Gitter chat](https://badges.gitter.im/solid/react-components.png)](https://gitter.im/solid/chat)


## Table of Contents
1. [Getting started](#getting-started)
1. [Goals](#goals)
1. [Contributing](#contributing)
1. [Useful Commands](#useful-commands)

**[▲ Back to Top](#table-of-contents)**


## Getting started

To run the demo project locally, run the following steps:
1. Install dependencies:
    ```bash
    npm install
    ```
1. Start the demo server:
    ```bash
    npm start
    ```
1. View the site in your browser at: http://localhost:8081/

**[▲ Back to Top](#table-of-contents)**


## Goals

Coming Soon!

**[▲ Back to Top](#table-of-contents)**


## Contributing

If you're reading this, you're awesome! Thank you for helping us make this project great and being a part of the community. Here are a few guidelines that will help you along the way.

### Coding style

Please follow the coding style of the current code base. This project uses eslint, so if possible, enable linting in your editor to get real-time feedback. The linting rules can be run manually with `npm run lint`

### Testing

This project's tests can be ran in conjunction with the linting checks with `npm test`.  If you are developing a new feature you may find it useful to run `npm run test:dev` to have the tests rerun automatically every time you make a change.

Thanks to [husky](https://www.npmjs.com/package/husky), both the linting checks and unit tests are configured to run in your Git pre-commit hook automatically.

**[▲ Back to Top](#table-of-contents)**


## Useful Commands

| Command              | Description                                                      |
|----------------------|------------------------------------------------------------------|
| **Running**          |                                                                  |
| `npm start`          | Start the demo server                                            |
| **Building**         |                                                                  |
| `npm run build`      | Build all of the assets                                          |
| `npm run build:demo` | Build only the `demo` asset                                      |
| `npm run build:dist` | Build only the `dist` asset                                      |
| `npm run build:lib`  | Build only the `lib` asset                                       |
| **Developing**       |                                                                  |
| `npm test`           | Run all linters and tests                                        |
| `npm run test:dev`   | Watch files for changes and rerun tests related to changed files |
| `npm run jest`       | Run the unit tests                                               |
| `npm run lint`       | Run ESLint to check for code style violations.                   |

**[▲ Back to Top](#table-of-contents)**