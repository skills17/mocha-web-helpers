import path from 'path';
import fs from 'fs';
import rimraf from 'rimraf';
import TaskConfig from '@skills17/task-config';
import ApiServer from '@skills17/task-config-api';
import TaskServer from '@skills17/static-task-server';

let taskServer: TaskServer;
let apiServer: ApiServer;

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on) => {
  on('task', {
    'integration:prepare': async (testName: string) => {
      const taskPath = path.resolve(process.cwd(), 'integration', testName);

      if (taskServer || apiServer) {
        return null;
      }

      // clear history
      const historyDir = path.resolve(taskPath, '.history');
      if (fs.existsSync(historyDir)) {
        rimraf.sync(historyDir);
      }

      // load task config
      const config = new TaskConfig();
      config.loadFromFileSync(path.resolve(taskPath, 'config.json'));

      // start static task server
      taskServer = new TaskServer(config);
      await taskServer.serve(false);

      // start config api server
      apiServer = new ApiServer(
        4500,
        '127.0.0.1',
        [taskPath],
        { log: () => {}, error: console.error }, // eslint-disable-line
      );
      await apiServer.serve(false);

      return null;
    },
    'integration:reset': async () => {
      if (taskServer) {
        await taskServer.stop();
        taskServer = undefined;
      }

      if (apiServer) {
        await apiServer.stop();
        apiServer = undefined;
      }

      return null;
    },
    'history:get': async (testName: string) => {
      const taskPath = path.resolve(process.cwd(), 'integration', testName);

      // check if history exists
      const historyDir = path.resolve(taskPath, '.history');
      if (!fs.existsSync(historyDir)) {
        return [];
      }

      const historyFiles = fs.readdirSync(historyDir);
      const history = [];

      historyFiles.forEach((file) => {
        history.push(JSON.parse(fs.readFileSync(path.resolve(historyDir, file)).toString()));
      });

      return history;
    },
  });
};
