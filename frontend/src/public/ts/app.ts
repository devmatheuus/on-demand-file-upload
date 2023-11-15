import { Utils } from './utils/Utils';
import * as io from 'socket.io-client';
import { config } from '../../helpers/config';

let bytesAmount: number = 0;

const showSize = () => {
    const { files: fileElements } = document.getElementById('file') as HTMLInputElement;

    if (!fileElements?.length) return;

    const files = Array.from(fileElements);

    const { size } = files.reduce((prev, next) => ({ size: prev.size + next.size }), { size: 0 });

    bytesAmount = size;

    Utils.updateStatusText(bytesAmount);

};

window.showSize = showSize;

window.onload = () => {
    Utils.showUploadSuccessMessage();
    const ioClient = io.connect(config.API_URL, {withCredentials: false});
        
    ioClient.on('connect', () => {
        const targetUrl = `${config.API_URL}?socketId=${ioClient.id}`;
        Utils.setFormAction(targetUrl);
        
        console.log('client connected', ioClient.id)
    });
    
    ioClient.on(config.SOCKET_UPLOAD_FILE_EVENT, (bytesReceived: number) => {
        console.log('bytesReceived', bytesReceived)
        
        bytesAmount -= bytesReceived;
        Utils.updateStatusText(bytesAmount);
    })

    Utils.updateStatusText(bytesAmount);
};
