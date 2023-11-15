export class Utils {
     private static formatBytes  (bytes: number, decimals = 2)  {
        if(bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        const result = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    
        return `${result} ${sizes[i]}`;
    }

    public static setFormAction (action: string)  {
        const form = document.getElementById('form') as HTMLFormElement;
    
        form.action = action;
    }

    public static showUploadSuccessMessage () {
        const { searchParams } = new URL(window.location.href);
        const message = searchParams.get('msg');

        if (message) {
            const successMessageElement = document.getElementById('msg') as HTMLOutputElement;
            successMessageElement.classList.add('alert','alert-success')
            successMessageElement.innerHTML = message;

            setTimeout(() => successMessageElement.hidden = true, 3000)
        }
    }

     public static updateStatusText  (bytesAmount: number)  {
        const text = `Pending to upload <strong>${this.formatBytes(bytesAmount)}</strong>`;
        const sizeElement = document.getElementById('size') as HTMLOutputElement;
    
        sizeElement.innerHTML = text;
    };
    
    
}