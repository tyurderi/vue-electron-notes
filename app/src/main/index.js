'use strict';

import { app, BrowserWindow } from 'electron'

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:${require('../../../config').port}`
    : `file://${__dirname}/index.html`;

function createWindow()
{
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        center: true,
        minWidth: 800,
        minHeight: 600
    });

    mainWindow.loadURL(winURL);

    mainWindow.on('closed', () => {
        mainWindow = null
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () =>
{
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    if (mainWindow === null)
    {
        createWindow()
    }
});
