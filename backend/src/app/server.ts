import { createServer } from 'node:http';
import app from './app';
import { initSocket } from './socket';
import envConfig from './config/env.config';

async function main() {
  try {
    /* Init socket IO */
    const httpServer = createServer(app);

    initSocket(httpServer);

    httpServer.listen(5000, async () => {
      console.log('Server in running on port', 5000);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
