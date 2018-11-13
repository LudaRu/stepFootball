import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';

import { IndexRoute } from './routes/index';
import { IndexSocket } from './socket/IndexSocket';

const VIEW_PATH = '../client',
  PORT: number = 8080;
let server: Server,
  port: string | number,
  app: express.Application;
console.log(__dirname, VIEW_PATH);
app = express();
server = createServer(app);

// configApp
port = process.env.PORT || PORT;
app.use(express.static(path.join(__dirname, VIEW_PATH)));

// routes
let router: express.Router;
router = express.Router();
IndexRoute.create(router);
app.use(router);

// start listen
server.listen(port, () => {
  console.log(`сервер хез бин стартед http://127.0.0.1:${port}`);
});
new IndexSocket(socketIo(server));
