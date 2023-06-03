# mocha-esm-loader

This module helps running Mocha programmatically when writing tests in an ES Module project.


## Installation

```
$ npm i mocha-esm-loader
```

## Usage

Load all *.spec.[c|m]js or *.test.[c|m]js files:
```
const mochaEsmLoader = new MochaEsmLoader(mocha, logger);
await mochaEsmLoader.import();

const suiteRun = mocha.run();
```

We also can override the default file match pattern:

```
const mochaEsmLoader = new MochaEsmLoader(mocha, logger);
await mochaEsmLoader.import(['./test/my-esm-test.js']);

const suiteRun = mocha.run();
```


## Example

This example uses a launcher.js ES module script to execute tests written in ESM. It uses mocha-multi to load both the spec reporter as well as a custom reporter. It also uses a fork of [mocha-multi](https://github.com/jamesmortensen/mocha-multi) to load multiple reporters. Mocha cannot load more than one reporter at a time.

For this example, install the following modules:
```
$ npm i mocha-esm-loader mocha
$ npm i github:jamesmortensen/mocha-multi
```

Execute the below script with:

```
$ node launcher.js
```

**launcher.js**
```javascript
import Mocha from 'mocha';

// library that loads ESM-spec files.
import MochaEsmLoader from 'mocha-esm-loader';

// These lines make "require" available
// see https://www.kindacode.com/article/node-js-how-to-use-import-and-require-in-the-same-file/
import { createRequire } from 'module';
global.require = createRequire(import.meta.url);

const Reporter = (await import('./custom-esm-reporter')).default;

const mocha = new Mocha({
    reporter: "mocha-multi",
    reporterOptions: {
            spec: "-",
            "custom-esm-reporter": {
                "constructorFn": Reporter,
                "stdout": "/tmp/mocha-reporter.out",
                "options": {
                    "option1": "value1"
                }
            }
    }
});

const mochaEsmLoader = new MochaEsmLoader(mocha, logger);
await mochaEsmLoader.import();

const suiteRun = mocha.run();

process.on('exit', (code) => {
    process.exit(suiteRun.stats.failures);
});
```

## License

Copyright (c) James Mortensen, 2023 MIT License
