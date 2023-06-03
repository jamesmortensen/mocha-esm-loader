'use strict';

// These lines make "require" available
// see https://www.kindacode.com/article/node-js-how-to-use-import-and-require-in-the-same-file/
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const Mocha = require('mocha');
const { expect } = require('chai');

const {
  EVENT_RUN_BEGIN,
  EVENT_RUN_END,
  EVENT_TEST_BEGIN,
  EVENT_TEST_FAIL,
  EVENT_TEST_PASS,
  EVENT_TEST_PENDING,
  EVENT_TEST_END,
} = Mocha.Runner.constants;

class TestEsmReporter {
  constructor(runner, reporterOptionsWrapper) {  
    this.options = reporterOptionsWrapper.reporterOptions;
    const logger = this.options.logger || console;
    let testCount = 0;
    runner
      .once(EVENT_RUN_BEGIN, () => {
        logger.log('Starting the run');
        logger.log('option1: ' + this.options.option1);
        logger.log('option2: ' + this.options.option2);
        expect(this.options.option1).to.equal('value1');
        expect(this.options.option2).to.equal('value2');
      })
      .on(EVENT_TEST_BEGIN, () => {
        logger.info('Starting test');
        testCount++;
      })
      .on(EVENT_TEST_PASS, (test) => {
        logger.log(`Finished test ${test.title}: pass`);
        expect(test.title.substring(0,4)).to.equal(`Test`);
      })
      .on(EVENT_TEST_FAIL, (test) => {
        logger.log(`Finished test ${test.title}: fail`);
        expect(test.title.substring(0,4)).to.equal(`Test`);
      })
      .on(EVENT_TEST_PENDING, (test) => {
        logger.log(`Finished test ${test.title}: pending/skipped`);
      })
      .on(EVENT_TEST_END, () => {
        logger.log('EVENT_TEST_END');
        testCount++;
      })
      .once(EVENT_RUN_END, async () => {
        logger.log('EVENT_RUN_END');
        runner.hasEnded = true;
      });
  }
}

export default TestEsmReporter;
