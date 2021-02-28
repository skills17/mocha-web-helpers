import TaskConfig from '@skills17/task-config';
import { TestRun, Group, Test } from '@skills17/test-result';

export default (taskConfig: TaskConfig, initialWarnings: string[]) =>
  class {
    private playIcon = '&#x2023;';

    private escape = window.mocha.Mocha.utils.escape;

    private constants = window.mocha.Mocha.Runner.constants;

    private report: HTMLElement;

    private htmlReporter: any;

    private htmlRunner: any;

    private htmlEvents: Record<string, (arg: any) => void> = {};

    private testRun?: TestRun;

    private stats: Record<string, number> = {};

    private warnings = initialWarnings;

    constructor(private runner: any, options: any) {
      // call base reporter which registers some utility events on the runner
      window.mocha.Mocha.reporters.Base.call(this, runner, options);

      // extend from html reporter
      this.htmlRunner = {
        on: (eventName: string, listener: (arg: any) => void) => {
          this.htmlEvents[eventName] = listener;
        },
        stats: this.stats,
      };
      this.htmlReporter = new window.mocha.Mocha.reporters.HTML(this.htmlRunner, options);
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
      runner.on(this.constants.EVENT_SUITE_END, this.onSuiteEnd.bind(this));
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
      this.updateGroup(group, groupElement, mochaTest);
      this.updateStats();
    }

    /**
     * Update stats when suite has finished.
     *
     * @param suite Instance of a mocha test suite
     */
    private onSuiteEnd(suite: any): void {
      if (suite.root) {
        this.updateStats();
        this.displayWarnings();
      }
    }

    /**
     * Records the test result for the current test run.
     *
     * @param test Instance of a mocha test result
     */
    private recordTest(mochaTest: any): Group | false | undefined {
      const titlePath = mochaTest.titlePath();

      try {
        return this.testRun?.recordTest(
          titlePath.filter((title: string) => title !== 'extra' && title !== 'Extra').join(' > '),
          mochaTest.title,
          titlePath.includes('extra') || titlePath.includes('Extra'),
          mochaTest.isPassed(),
        );
      } catch (_) {
        return false;
      }
    }

    /**
     * Creates an url for the provided filter.
     *
     * @param grep Grep pattern to filter test
     */
    private createFilterUrl(grep: string, filter: 'group' | 'single'): string {
      let { search } = window.location;

      // remove previous grep query parameter if present
      if (search) {
        search = search.replace(/[?&]grep=[^&\s]*/g, '').replace(/^&/, '?');
      }

      return `${window.location.pathname + (search ? `${search}&` : '?')}grep=${encodeURIComponent(
        grep,
      )}&filter=${filter}`;
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
          '<li class="suite" data-group-id="%s"><h1><a href="%s">%e</a><span class="points"></span></h1><ul></ul></li>',
          groupId,
          this.createFilterUrl(`^${group.getPattern()}`, 'group'),
          group.getDisplayName(),
        );

        this.report?.appendChild(newGroup);
        groupElement = this.report?.querySelector(`.suite[data-group-id="${groupId}"]`) as Element;
      }

      // check if a manual check warning should be added
      if (group.requiresManualCheck() && !groupElement.querySelector('.manual-check-warning')) {
        groupElement
          .querySelector('h1')
          ?.appendChild(
            this.createFragment('<span class="manual-check-warning">manual check required</span>'),
          );
      }

      return groupElement;
    }

    /**
     * Creates the test in the HTML report.
     *
     * @param testId Test id
     * @param test Test instance
     * @param mochaTest Mocha test instance
     * @param groupElement HTML Element of the parent group
     */
    private createTestElement(
      testId: number,
      test: Test,
      mochaTest: any,
      groupElement: Element,
    ): Element {
      let testElement;

      // create successful test
      if (test.isSuccessful()) {
        testElement = this.createFragment(
          `<li class="test pass %e" data-test-id="%s"><h2>%e<span class="duration">%ems</span><a href="%s" class="replay">${this.playIcon}</a></h2></li>`,
          mochaTest.speed,
          testId,
          test.getName(),
          mochaTest.duration,
          this.createFilterUrl(`^${mochaTest.fullTitle()}$`, 'single'),
        ) as Element;

        groupElement.querySelector('ul')?.appendChild(testElement);

        // create failed test
      } else {
        testElement = this.createFragment(
          `<li class="test fail" data-test-id="%s"><h2>%e<a href="%s" class="replay">${this.playIcon}</a></h2></li>`,
          testId,
          test.getName(),
          this.createFilterUrl(`^${mochaTest.fullTitle()}$`, 'single'),
        ) as Element;

        groupElement.querySelector('ul')?.appendChild(testElement);

        // add the detailed test error
        this.addTestError(testElement, mochaTest);
      }

      // add code toggle
      this.htmlReporter.addCodeToggle(testElement, mochaTest.body);

      return testElement;
    }

    /**
     * Updates the group as well as all tests in the output of the specified group.
     * If new tests were recorded, the necessary elements will be created.
     *
     * @param group Test group
     * @param element HTML element of the group
     * @param mochaTest Instance of a mocha test result
     */
    private updateGroup(group: Group, element: Element, mochaTest: any): void {
      group.getTests().forEach((test, testId) => {
        let testElement = element.querySelector(`.test[data-test-id="${testId}"]`);
        const pointsElement = element.querySelector('h1 .points');

        // create a new element if it doesn't exist yet
        if (!testElement) {
          testElement = this.createTestElement(testId, test, mochaTest, element);
        }

        // update manual check warning
        if (test.requiresManualCheck() && !testElement.classList.contains('manual-check')) {
          testElement.classList.add('manual-check');
          const beforeElement = testElement.querySelector('h2 a');
          beforeElement?.parentNode?.insertBefore(
            this.createFragment(
              '<span class="manual-check-warning">please check manually for static return values and/or logical errors</span>',
            ),
            beforeElement,
          );
        }

        // update points display
        if (!window.location.search.includes('&filter=single')) {
          const points = `<span class="scored">${group.getPoints()}</span> / <span class="total">${group.getMaxPoints()}</span> point${
            group.getMaxPoints() !== 1 ? 's' : ''
          }`;

          let pointsClass = '';
          if (group.getPoints() >= group.getMaxPoints()) {
            pointsClass = 'all-points';
          } else if (group.getPoints() > 0) {
            pointsClass = 'partial-points';
          } else {
            pointsClass = 'no-points';
          }

          if (pointsElement) {
            pointsElement.innerHTML = points;
            pointsElement.className = `points ${pointsClass}`;
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

    /**
     * Update the stats.
     */
    private updateStats(): void {
      this.htmlRunner.total = this.runner.total;

      // the parent html reporter updates the stats on EVENT_SUITE_END called with root = true
      this.htmlEvents[this.constants.EVENT_SUITE_END].bind(this.htmlReporter)({ root: true });

      // update additional data attribute
      (document.querySelector('#mocha-stats .progress') as HTMLElement).dataset.progress = `${
        (this.stats.tests / this.runner.total) * 100
      }`;
    }

    /**
     * Display test warnings.
     */
    private displayWarnings(): void {
      const warnings = [...this.warnings, ...(this.testRun?.getWarnings() || [])];
      if (warnings?.length === 0) {
        return;
      }

      this.report.prepend(
        this.createFragment(`<li class="warnings"><h1>Warnings:</h1><ul></ul></li>`),
      );

      const warningsList = this.report.querySelector('li.warnings ul');
      warnings?.forEach((warning) => {
        warningsList?.appendChild(this.createFragment('<li><pre>%e</pre></li>', warning));
      });
    }
  };
