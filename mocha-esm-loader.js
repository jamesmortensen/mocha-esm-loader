// 

import { glob } from 'glob';

class MochaEsmLoader {

    constructor(mocha, logger) {
        // this is required to load describe, it, and other globals. https://www.vinnie.work/blog/2021-09-18-why-so-hard-testing-with-es6-imports
        mocha.suite.emit('pre-require', global, 'nofile', mocha);

        this.logger = typeof logger === 'undefined'
            ? console
            : logger;

        this.failures = [];
    }

    async import(fileMatchers) {
        await this.#importSpecFiles(fileMatchers)
    }

    async #importSpecFiles(fileMatchers) {
        fileMatchers = fileMatchers || [
            './test/**/*.spec.js',
            './test/**/*.test.js',
            './test/**/*.spec.cjs',
            './test/**/*.test.cjs',
            './test/**/*.spec.mjs',
            './test/**/*.test.mjs',
        ];

        const testFiles = await glob(fileMatchers, { ignore: 'node_modules/**' });
        const specFiles = [];

        for (let i = 0; i < testFiles.length; i++) {
            try {
                specFiles[i] = await import(`${process.env.PWD}/${testFiles[i].replace(/^([a-z]\/*)/, './$1')}`);
            } catch (e) {
                this.failures.push(testFiles[i]);
            }
        }

        return specFiles;
    }

    getFailures() {
        return this.failures;
    }
}

export default MochaEsmLoader;
