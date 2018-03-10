'use strict'

import { app, BrowserWindow, ipcMain, dialog, Menu, MenuItem } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    webPreferences: {webSecurity: false},
    height: 563,
    useContentSize: true,
    width: 1000,
    minHeight: 500,
    minWidth: 600,
    backgroundColor: '#F2F6FC',
    title: '评分系统'
  })

  mainWindow.loadURL(winURL)
  mainWindow.flag = false

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  function closeWindow (event) {
    if (!mainWindow.flag) {
      event.preventDefault()
      const options = {
        type: 'info',
        title: '通知',
        message: '关闭窗口会导致您断开连接，是否确认？',
        buttons: ['是', '否']
      }
      dialog.showMessageBox(options, function (index) {
        if (index === 0) {
          mainWindow.flag = true
          mainWindow.close()
        }
      })
    }
  }
  mainWindow.on('close', closeWindow)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
  // createWindow()
})

ipcMain.on('login-success', () => {
  mainWindow.maximize()
  mainWindow.setResizable(false)
})

// 创建上下文菜单
const menu = new Menu()
menu.append(new MenuItem({label: '修改',
  submenu: [
    {
      label: '剪切',
      accelerator: 'CmdOrCtrl+X',
      selector: 'cut:',
      role: 'cut'
    },
    {
      type: 'separator'
    },
    {
      label: '复制',
      accelerator: 'CmdOrCtrl+C',
      selector: 'copy:',
      role: 'copy'
    },
    {
      type: 'separator'
    },
    {
      label: '粘贴',
      accelerator: 'CmdOrCtrl+V',
      selector: 'paste:',
      role: 'paste'
    },
    {
      type: 'separator'
    },
    {
      label: '全选',
      accelerator: 'CmdOrCtrl+A',
      selector: 'selectAll:',
      role: 'selectall'
    }
  ]}))
menu.append(new MenuItem({label: '视图',
  submenu: [
    {
      label: '重新载入',
      accelerator: 'CmdOrCtrl+R',
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.reload()
        }
      }
    }/* ,
    {
      label: 'Toggle Developer Tools',
      accelerator: (function () {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I'
        }
        return 'Ctrl+Shift+I'
      }()),
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    } */
  ]}))

app.on('browser-window-created', function (event, win) {
  win.webContents.on('context-menu', function (e, params) {
    menu.popup(win, params.x, params.y)
  })
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
