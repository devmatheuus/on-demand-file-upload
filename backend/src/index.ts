import 'dotenv/config'
import http from 'http';
import { AddressInfo } from 'net';
import { Server as SocketIoServer } from 'socket.io';
import { Routes } from './routes/Routes';
import { Response, Request } from './globalTypes';
import {logger} from './lib/pino'

const CORS_OPTIONS = { origin: '*', credentials: false};

const server = http.createServer((req, res) => {
  const defaultRoute = (req: Request, res: Response) => res.end('hello world')

  const routes = new Routes(io);

  if(req.method) {
    const method = req.method.toLowerCase();
    const chosen = routes[method] || defaultRoute;
    chosen.apply(routes, [req, res]);
  }
});

const io = new SocketIoServer(server, { cors: CORS_OPTIONS });

io.on('connection', (socket) => logger.info('a user connected ' + socket.id))

server.listen(process.env.PORT, () => {
  const { address, port } = server.address() as AddressInfo;

  logger.info(`server is running at http://${address}:${port}`)
});
