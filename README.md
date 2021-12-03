# skills17/mocha-web-helpers

<img src="https://cyrilwanner.github.io/packages/skills17/mocha-web-helpers/assets/output-preview.png" align="center">

This package provides some mocha web helpers for usage in a skills competition environment.
It includes:
- Custom HTML reporter
- Automatic mocha configuration
- Local history
- ... and more

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

To install this package, simply run the following command:

```bash
npm install @skills17/mocha-web-helpers
```

It requires to already have Mocha & Chai installed, if that is not the case yet, install them using:

```bash
npm install mocha chai
```

Also, to use the custom HTML reporter and all the features of this package, the
`@skills17/task-config-api` has to be running. For easier development, the package will fall back to the default mocha reporter if the API is not reachable.

For local task development, you can simply run `npx @skills17/task-config-api` within the task
directory which will automatically start the API.
For the production competition environment, it is suggested to install the API globally.
Read more about it [here](https://github.com/skills17/task-config-api#production-environment).

## Usage

After installation, create a new HTML file with the following content.
It is assumed that the file is created next to the `tests` and `node_modules` folder.
If the HTML file is created in a subdirectory, the referenced paths have to be updated.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Tests</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <script src="node_modules/@skills17/mocha-web-helpers/dist/main.js"></script>
    <script>
        skills17.setupMocha({
            api: 'http://localhost:4500/my-task-id',
            files: [
                'tests/first.test.js',
                'tests/seconds.test.js',
            ],
        });
    </script>
</body>
</html>
```

The `setupMocha` function supports the following options:

#### `api: string`

Default: `http://localhost:4500/js`

The endpoint of the task config api, which normally runs on port 4500 and has the `id` of the
`config.json` as the subpath.

#### `files: string[]`

Default: `[]`

All files that contain the tests or are required for the test files have to be specified here.
They will be loaded in the specified order to make sure all dependencies are met.

The other reason that they have to be specified is that the package will fall back to the default
mocha reporter if the API is unavailable. This ensures that the tests are still available during
the competition in the unlikely case that the API fails or for easier local task development.

#### `mochaAssets: string[]`

Default:
```typescript
[
  'node_modules/mocha/mocha.css',
  'node_modules/chai/chai.js',
  'node_modules/mocha/mocha.js',
]
```

This specifies which styles and scripts will be loaded before executing the tests.
The paths have to be updated if the HTML file is not next to the `node_modules` folder.

#### Mocha options

All other options will directly be passed to mocha.
The available options can be seen on the website of [mocha](https://mochajs.org/#browser-configuration).

### Grouping

A core concept is test groups. You usually don't want to test everything for one criterion in one test function but instead split it into multiple ones for a cleaner test class and a better overview.

In JS, tests are grouped by a test name prefix defined in the `config.yaml` file.

All `describe`s are concatenated with the actual test names before evaluation.

For example, the following test will have the name `Countries > Overview > lists all countries`:

```typescript
describe('Countries', () => {
  describe('Overview', () => {
    it('lists all countries', () => {
      // ...
    });
  });
});
```

To catch and group all tests within the `Overview` description, the group matcher can be set to `Countries > Overview > .+` for example. Each of the tests within that group will now award 1 point to the group.

### Extra tests

To prevent cheating, extra tests can be used.
They are not available to the competitors and should test exactly the same things as the normal tests do, but with different values.

For example, if your normal test contains a check to search the list of all countries by 'Sw*', copy the test into an extra test and change the search string to 'Ca*'.
Since the competitors will not know the extra test, it would detect statically returned values that were returned to simply satisfy the 'Sw*' tests instead of actually implement the search logic.

Extra tests are detected by their `describe`, which should equal `'Extra'` or `'extra'`. That means that you can simply wrap your test in an aditional extra `describe` like shown below. The other `describe`s and test names should exactly equal the ones from the normal tests. If they don't, a warning will be displayed.

```typescript
describe('Extra', () => {    // <-- only this describe has to be added
  describe('Countries', () => {
    it('lists all countries', () => {
      // ...
    });
  });
});
```

It usually makes sense to move the extra tests in a separate folder, so the folder can simply be deleted before the tasks are distributed to the competitors.
Nothing else needs to be done or configured.

If an extra test fails while the corresponding normal test passes, a warning will be displayed that a manual review of that test is required since it detected possible cheating.
The penalty then has to be decided manually from case to case, the points visible in the output assumed that the test passed and there was no cheating.

## License

[MIT](https://github.com/skills17/mocha-web-helpers/blob/master/LICENSE)
