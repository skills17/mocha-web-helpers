import TaskConfig from '@skills17/task-config';
import { TestRun } from '@skills17/test-result';

export default class TaskApi {
  private config?: Record<string, unknown>;

  constructor(private url: string) {}

  /**
   * Load the task config file from the api.
   */
  public async loadConfig(): Promise<boolean> {
    try {
      // abort the request after 2 seconds to prevent tests not starting because of a non-working api
      const controller = new AbortController();
      const abortTimeout = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${this.url}/config.json`, {
        signal: controller.signal,
      });

      // cancel the abort when it has been loaded
      clearTimeout(abortTimeout);

      if (res.status >= 200 && res.status < 300) {
        this.config = await res.json();
        return true;
      }

      if (res.status >= 400 && res.status < 500) {
        // eslint-disable-next-line no-console
        console.warn(
          `Task config API returned ${res.status}. The configured API '${this.url}' is maybe wrong.`,
        );
      }

      return false;
    } catch (_) {
      return false;
    }
  }

  /**
   * Stores the specified test run in the local history.
   *
   * @param testRun Test run to store
   */
  public async storeLocalHistory(testRun: TestRun): Promise<boolean> {
    try {
      const res = await fetch(`${this.url}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testRun),
      });

      const data = await res.json();

      return data.created;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return false;
    }
  }

  /**
   * Returns the TaskConfig instance from the loaded configuration.
   */
  public getConfig(): TaskConfig {
    if (!this.config) {
      throw new Error('Configuration is not yet loaded');
    }

    const taskConfig = new TaskConfig();
    taskConfig.load(this.config);
    return taskConfig;
  }
}
