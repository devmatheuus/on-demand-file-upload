import Busboy from 'busboy';
import { logger } from '../lib/pino'
import { Server } from 'socket.io';
import { IUploadHandler } from './contracts/UploadHandler.contract';
import { Headers, OnFinish } from './types/uploadHandler'
import { join, resolve } from 'path'
import { pipelineAsync } from '../lib/pipelineAsync';
import { createWriteStream } from 'fs'
import { Readable } from 'stream';

type FileData = {
    filename: string;
    encoding: string;
    mimetype: string;
}

export class UploadHandler implements IUploadHandler {
    private io: Server;
    private socketId: string;

    private __dirname = resolve()

    constructor(io: Server, socketId: string) {
        this.io = io;
        this.socketId = socketId;
    }

    registerEvents(headers: Headers, onFinish: OnFinish) {
        logger.info("-----------------------------------------")
        logger.info("Calling registerEvents function!")
        logger.info("-----------------------------------------")

        const busboy = Busboy({ headers });

        busboy.on("file", this.onFile.bind(this))
        
        busboy.on("finish", onFinish)
    
        return busboy;
    }

    private handleBytes(filename: string) {
        async function * handleData(this: UploadHandler, data: any){

            if(process.env.SOCKET_UPLOAD_FILE_EVENT){
                for await (const item of data) {
                    const size = item.length
                    this.io.to(this.socketId).emit(process.env.SOCKET_UPLOAD_FILE_EVENT, size)
                    yield item
                }
            }
        }

        return handleData.bind(this); 
    }

    private async onFile(fieldName: string, file: NodeJS.ReadableStream, {filename}: FileData) {
        logger.info("-----------------------------------------")
        logger.info("Calling onFile function!")
        logger.info(this.__dirname)
        logger.info("-----------------------------------------")


        const saveFileTo = join(this.__dirname, "downloads", `${filename} - ${Date.now()}`)            

        logger.info("-----------------------------------------")
        logger.info(`File [${filename}] uploading!`)
        logger.info("-----------------------------------------")

        await pipelineAsync(
            file,
            this.handleBytes(filename),
            createWriteStream(saveFileTo)
        );

        logger.info("-----------------------------------------")
        logger.info(`File [${saveFileTo}] finished!`)
        logger.info("-----------------------------------------")
    }
}