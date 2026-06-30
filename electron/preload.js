const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('laceitElectron', true);

contextBridge.exposeInMainWorld('laceitAPI', {
  saveDataUrl(defaultPath, dataUrl) {
    return ipcRenderer.invoke('save-data-url', { defaultPath, dataUrl });
  },
  saveText(defaultPath, mimeType, text) {
    return ipcRenderer.invoke('save-text', { defaultPath, mimeType, text });
  }
});
