
import { Server as SocketIoServer } from 'socket.io';

import { Response, Request } from '../globalTypes';
import {parse} from 'url';
import { UploadHandler } from '../services/UploadHandler.service';
import { pipelineAsync } from '../lib/pipelineAsync';
import { logger } from '../lib/pino';

export class Routes {
    [key: string]: any;

    private io: SocketIoServer;
    
    constructor(io: SocketIoServer) {
        this.io = io;
    }

    async options(req:  Request, res: Response){
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS, POST'
        });

        res.end();
    }

    async post(req:  Request, res: Response) {
        logger.info("---------------------------------------")
        logger.info("Request received with success!")
        logger.info("---------------------------------------")

        const { headers } = req
        const {query: { socketId }}= parse(req.url ?? '', true);


        const uploadHandler = new UploadHandler(this.io, socketId as string);
            
        const onFinish = (res: Response, redirectTo: string) => () => {
            res.writeHead(303, {
                connection: 'close',
                Location: `${redirectTo}?msg=Files uploaded with success!`, 
            });

            res.end();
        };

        const busboy = uploadHandler.registerEvents(headers, onFinish(res, headers.origin ?? ''))

        await pipelineAsync(req, busboy);

        logger.info("Request finished with success!")
    }
}