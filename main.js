const { app, BrowserWindow, screen, ipcMain, Menu, Tray, nativeImage } = require('electron');
const path = require('path');

let shimejis = [];
let tray = null;

function createShimeji(x, y) {
  const win = new BrowserWindow({
    width: 160,
    height: 220,
    x: x || Math.floor(Math.random() * (screen.getPrimaryDisplay().workAreaSize.width - 160)),
    y: y || screen.getPrimaryDisplay().workAreaSize.height - 220,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    hasShadow: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    focusable: false,
  });

  win.setIgnoreMouseEvents(false);
  win.loadFile('shimeji.html');
  win.setAlwaysOnTop(true, 'screen-saver');

  shimejis.push(win);

  win.on('closed', () => {
    shimejis = shimejis.filter(w => w !== win);
  });

  return win;
}

app.whenReady().then(() => {
  // Create tray icon (small pink dot)
  const trayIcon = nativeImage.createEmpty();
  tray = new Tray(trayIcon);

  const menu = Menu.buildFromTemplate([
    { label: '🌸 Aeamaeth Shimeji', enabled: false },
    { type: 'separator' },
    { label: 'Spawn Another', click: () => createShimeji() },
    { label: 'Remove All', click: () => { shimejis.forEach(w => w.destroy()); shimejis = []; } },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  ]);

  tray.setContextMenu(menu);
  tray.setToolTip('Aeamaeth Shimeji');

  createShimeji();

  app.on('activate', () => {
    if (shimejis.length === 0) createShimeji();
  });
});

ipcMain.on('move-window', (event, x, y) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.setBounds({ x: Math.round(x), y: Math.round(y), width: 160, height: 220 });
});

ipcMain.on('get-screen-size', (event) => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  event.reply('screen-size', { width, height });
});

ipcMain.on('spawn-another', () => {
  createShimeji();
});

ipcMain.on('set-ignore-mouse', (event, ignore) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.setIgnoreMouseEvents(ignore, { forward: true });
});

app.on('window-all-closed', (e) => {
  e.preventDefault(); // Keep app alive even if all windows closed
});
