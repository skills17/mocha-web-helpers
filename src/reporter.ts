import TaskConfig from '@skills17/task-config';
import { TestRun, Group } from '@skills17/test-result';

export default (taskConfig: TaskConfig) =>
  class {
    private playIcon = '&#x2023;';

    private escape = window.mocha.Mocha.utils.escape;

    private constants = window.mocha.Mocha.Runner.constants;

    private report: HTMLElement;

    private htmlReporter: any;

    private testRun?: TestRun;

    constructor(runner: any, options: any) {
      // call base reporter which registers some utility events on the runner
      window.mocha.Mocha.reporters.Base.call(this, runner, options);

      // extend from html reporter
      const htmlEvents: Record<string, (arg: any) => void> = {};
      const htmlRunner = {
        on: (eventName: string, listener: (arg: any) => void) => {
          htmlEvents[eventName] = listener;
        },
      };
      this.htmlReporter = new window.mocha.Mocha.reporters.HTML(htmlRunner, options);
      this.report = document.getElementById('mocha-report') as HTMLElement;

      // create a new test run on the before all tests hook
      window.before(() => {
        this.testRun = taskConfig.createTestRun();
      });

      // update display and store the test run after all tests have been executed
      window.after(() => {
        // console.log(this.testRun?.toJSON());
      });

      // register mocha events
      runner.on(this.constants.EVENT_TEST_PASS, this.onTestFinished.bind(this));
      runner.on(this.constants.EVENT_TEST_FAIL, this.onTestFinished.bind(this));
    }

    /**
     * Adds test results to the HTML.
     *
     * @param mochaTest Instance of a mocha test result
     */
    private onTestFinished(mochaTest: any): void {
      const group = this.recordTest(mochaTest);

      if (!group) {
        return;
      }

      const groupElement = this.getGroupElement(group);
      this.updateGroupTests(group, groupElement, mochaTest);
    }

    /**
     * Records the test result for the current test run.
     *
     * @param test Instance of a mocha test result
     */
    private recordTest(mochaTest: any): Group | false | undefined {
      const titlePath = mochaTest.titlePath();

      return this.testRun?.recordTest(
        titlePath.filter((title: string) => title !== 'extra' && title !== 'Extra').join(' > '),
        mochaTest.title,
        titlePath.includes('extra') || titlePath.includes('Extra'),
        mochaTest.isPassed(),
      );
    }

    /**
     * Returns the HTML element of the specified group.
     * If it does not exist yet, the element will be created.
     *
     * @param group Test group
     */
    private getGroupElement(group: Group): Element {
      const groupId = this.testRun?.getGroups().indexOf(group);
      let groupElement = this.report?.querySelector(`.suite[data-group-id="${groupId}"]`);

      // create the element if it doesn't exist yet
      if (!groupElement) {
        const newGroup = this.createFragment(
          '<li class="suite" data-group-id="%s"><h1><a href="%s">%e</a></h1><ul></ul></li>',
          groupId,
          'url://todo',
          group.getDisplayName(),
        );

        this.report?.appendChild(newGroup);
        groupElement = this.report?.querySelector(`.suite[data-group-id="${groupId}"]`) as Element;
      }

      return groupElement;
    }

    /**
     * Updates all tests in the output of the specified group.
     * If new tests were recorded, the necessary elements will be created.
     *
     * @param group Test group
     * @param element HTML element of the group
     * @param mochaTest Instance of a mocha test result
     */
    private updateGroupTests(group: Group, element: Element, mochaTest: any): void {
      group.getTests().forEach((test, testId) => {
        let testElement = element.querySelector(`.test[data-test-id="${testId}"]`);

        // create a new element if it doesn't exist yet
        if (!testElement) {
          const newTest = this.createFragment(
            `<li class="test ${
              test.isSuccessful() ? 'pass' : 'fail'
            } %e" data-test-id="%s"><h2>%e<span class="duration">%ems</span><a href="%s" class="replay">${
              this.playIcon
            }</a></h2></li>`,
            mochaTest.speed,
            testId,
            test.getName(),
            mochaTest.duration,
            'url://todo',
          );

          element.querySelector('ul')?.appendChild(newTest);
          testElement = element.querySelector(`.test[data-test-id="${testId}"]`) as Element;

          // for failures, add the detailed test error
          if (!test.isSuccessful()) {
            this.addTestError(testElement, mochaTest);
          }
        }
      });
    }

    /**
     * Adds a detailed error and stack trace for a failed test.
     *
     * @param element HTML element of the test
     * @param mochaTest Instance of a mocha test result
     */
    private addTestError(element: Element, mochaTest: any): void {
      let stackString;
      const message = mochaTest.err.toString();

      // provide the stack trace if possible
      if (mochaTest.err.stack) {
        const indexOfMessage = mochaTest.err.stack.indexOf(mochaTest.err.message);
        if (indexOfMessage === -1) {
          stackString = mochaTest.err.stack;
        } else {
          stackString = mochaTest.err.stack.substr(mochaTest.err.message.length + indexOfMessage);
        }
        // otherwise, at least provide the source of the error
      } else if (mochaTest.err.sourceURL && mochaTest.err.line !== undefined) {
        stackString = `\n(${mochaTest.err.sourceURL}:${mochaTest.err.line})`;
      }

      stackString = stackString || '';

      // create the HTML elements
      if (mochaTest.err.htmlMessage && stackString) {
        element.appendChild(
          this.createFragment(
            '<div class="html-error">%s\n<pre class="error">%e</pre></div>',
            mochaTest.err.htmlMessage,
            stackString,
          ),
        );
      } else if (mochaTest.err.htmlMessage) {
        element.appendChild(
          this.createFragment('<div class="html-error">%s</div>', mochaTest.err.htmlMessage),
        );
      } else {
        element.appendChild(
          this.createFragment('<pre class="error">%e%e</pre>', message, stackString),
        );
      }
    }

    /**
     * Creates dom nodes from the provided HTML string and substitutes placeholders with the
     * provided arguments.
     *
     * %s will be substituted with the string value
     * %e will be substituted with the escaped value
     *
     * @param html HTML string
     * @param args Arguments
     */
    private createFragment(html: string, ...args: any): Node {
      const div = document.createElement('div');
      let i = 0;

      div.innerHTML = html.replace(/%([se])/g, (_, type) => {
        switch (type) {
          case 's':
            return String(args[i++]);
          case 'e':
            return this.escape(args[i++]);
          default:
            return '';
        }
      });

      return div.firstChild as Node;
    }
  };
