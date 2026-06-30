const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('fs/promises');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 960,
    minHeight: 700,
    title: 'Lace It',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile(path.join(__dirname, '..', 'index.html'));
}

async function pickSavePath(defaultPath, filters) {
  const result = await dialog.showSaveDialog({
    defaultPath,
    filters
  });
  return result.canceled ? null : result.filePath;
}

ipcMain.handle('save-data-url', async (_event, { defaultPath, dataUrl }) => {
  const filePath = await pickSavePath(defaultPath, [{ name: 'PNG Image', extensions: ['png'] }]);
  if (!filePath) return false;

  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  await fs.writeFile(filePath, Buffer.from(base64, 'base64'));
  return true;
});

ipcMain.handle('save-text', async (_event, { defaultPath, mimeType, text }) => {
  const filters = mimeType === 'image/svg+xml'
    ? [{ name: 'SVG Image', extensions: ['svg'] }]
    : [{ name: 'File', extensions: ['txt'] }];
  const filePath = await pickSavePath(defaultPath, filters);
  if (!filePath) return false;

  await fs.writeFile(filePath, text, 'utf8');
  return true;
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
