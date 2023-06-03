// mocha-esm-loader.spec.js

import MockedMochaRunner from 'mocked-mocha-runner';

import Mocha from 'mocha';
import TestEsmReporter from './test-esm-reporter.js';
import { expect } from 'chai';

const {
    EVENT_RUN_BEGIN,
    EVENT_RUN_END,
    EVENT_TEST_FAIL,
    EVENT_TEST_PASS,
    EVENT_TEST_PENDING,
    EVENT_TEST_END,
    EVENT_SUITE_BEGIN,
    EVENT_SUITE_END
} = Mocha.Runner.constants;

describe('Mocha Reporter Tests', function () {

    it('should report some results', () => {
        const mockedRunner = new MockedMochaRunner();
        const reporterOptionsWrapper = {
            "reporterOptions": {
                "option1": "value1",
                "option2": "value2",
                "logger": console
            }
        }
        const reporter = new TestEsmReporter(mockedRunner, reporterOptionsWrapper);

        const mochaEvents = [
            EVENT_RUN_BEGIN,
            EVENT_SUITE_BEGIN,
            EVENT_TEST_PASS,
            EVENT_TEST_PASS,
            EVENT_TEST_FAIL,
            EVENT_TEST_PASS,
            EVENT_TEST_PENDING,
            EVENT_SUITE_END,
            EVENT_RUN_END
        ];
        mochaEvents.forEach((mochaEvent) => {
            mockedRunner.fireEvent(mochaEvent);
        });

        expect(mockedRunner.hasEnded).to.equal(true);
    });
});

