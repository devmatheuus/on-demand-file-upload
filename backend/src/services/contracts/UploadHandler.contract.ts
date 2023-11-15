import Busboy from 'busboy';
import {Headers, OnFinish} from '../types/uploadHandler'

export interface IUploadHandler {
    registerEvents(headers: Headers, onFinish: OnFinish): Busboy.Busboy;
} 