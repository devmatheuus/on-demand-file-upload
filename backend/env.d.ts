declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            SOCKET_UPLOAD_FILE_EVENT: string;
        }
    }
}

export {}