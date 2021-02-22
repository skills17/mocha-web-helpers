import TaskApi from './taskApi';

type Options = {
  api?: string;
  mochaAssets?: string[];
  files: string[];
} & Record<string, unknown>;

class Mocha {
  private taskApi: TaskApi;

  constructor(
    apiUrl: string,
    private mochaAssets: string[],
    private testFiles: string[],
    private mochaOptions: Record<string, unknown>,
  ) {
    this.taskApi = new TaskApi(apiUrl);
  }

  /**
   * Injects all script and styles required by mocha.
   */
  private async injectMocha(): Promise<void> {
    // create mocha div
    const mochaDiv = document.createElement('div');
    mochaDiv.id = 'mocha';
    document.body.prepend(mochaDiv);

    // inject css
    this.mochaAssets
      .filter((asset) => asset.endsWith('.css'))
      .forEach((asset) => {
        const link = document.createElement('link');
        link.setAttribute('rel', 'stylesheet');
        link.setAttribute('href', asset);

        document.head.appendChild(link);
      });

    // inject js
    const jsPromises = this.mochaAssets
      .filter((asset) => asset.endsWith('.js'))
      .map(
        (asset) =>
          new Promise<void>((resolve, reject) => {
            // fail after 3 seconds
            const abortTimeout = setTimeout(
              () => reject(new Error(`${asset} did not load within 3 seconds`)),
              3000,
            );

            const script = document.createElement('script');
            script.addEventListener('load', () => {
              clearTimeout(abortTimeout);
              resolve();
            });
            script.addEventListener('error', (e) => {
              clearTimeout(abortTimeout);
              reject(e);
            });
            script.setAttribute('src', asset);

            document.body.appendChild(script);
          }),
      );

    await Promise.all(jsPromises);
  }

  /**
   * Inject all test files.
   */
  private async injectTestFiles(): Promise<void> {
    const promises = this.testFiles.map(
      (testFile) =>
        new Promise<void>((resolve, reject) => {
          // fail after 3 seconds
          const abortTimeout = setTimeout(
            () => reject(new Error(`${testFile} did not load within 3 seconds`)),
            3000,
          );

          const script = document.createElement('script');
          script.addEventListener('load', () => {
            clearTimeout(abortTimeout);
            resolve();
          });
          script.addEventListener('error', (e) => {
            clearTimeout(abortTimeout);
            reject(e);
          });
          script.setAttribute('src', testFile);

          document.body.appendChild(script);
        }),
    );

    await Promise.all(promises);
  }

  /**
   * Configure the correct expect statement to use
   */
  private configureExpect(): void {
    // chai
    if (this.mochaAssets.find((asset) => asset.indexOf('chai') >= 0)) {
      (window as any).expect = (window as any).chai.expect; // eslint-disable-line
    }
  }

  /**
   * Setup mocha
   */
  public async setup(): Promise<void> {
    await this.injectMocha();
    this.configureExpect();

    // mocha options
    const mochaOptions = {
      ui: 'bdd',
      ...this.mochaOptions,
    };

    // if the task config api is available, use the custom reporter
    if (await this.taskApi.loadConfig()) {
      // console.log('api available');
    }

    const mocha = (window as any).mocha; // eslint-disable-line

    // setup mocha
    mocha.setup(mochaOptions);

    // inject all task files required for the tests
    await this.injectTestFiles();

    // run mocha
    mocha.checkLeaks();
    mocha.run();
  }
}

export default ({
  api = 'http://localhost:4500/js',
  mochaAssets = [
    'node_modules/mocha/mocha.css',
    'node_modules/chai/chai.js',
    'node_modules/mocha/mocha.js',
  ],
  files = [],
  ...mochaOptions
}: Options): void => {
  (async () => {
    const mocha = new Mocha(api, mochaAssets, files, mochaOptions);
    await mocha.setup();
  })();
};
