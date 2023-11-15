import http from 'http';

export type Response = http.ServerResponse<http.IncomingMessage> & {
    req: http.IncomingMessage;
};

export type Request = http.IncomingMessage 