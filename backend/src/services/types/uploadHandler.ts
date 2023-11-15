import http from 'http';
import {Response} from '../../globalTypes'

export type OnFinish = (res: Response, redirectTo: string) => void;
export type Headers = http.IncomingHttpHeaders;