'use strict'

const electron = require('electron')

const app = electron.app
const globalShortcut = electron.globalShortcut

const WinChanger = require('electron-win-changer')
const ScreenGrid = require('screen-grid')

app.on('ready', () => {
  const sGrid = new ScreenGrid()
  const wChanger = new WinChanger()
  globalShortcut.register('Super+0', () => sGrid.createWindow(0))
  globalShortcut.register('Super+1', () => sGrid.createWindow(1))
  globalShortcut.register('Super+2', () => sGrid.createWindow(2))
  globalShortcut.register('Super+3', () => sGrid.createWindow(3))
  globalShortcut.register('Super+4', () => sGrid.createWindow(4))
  globalShortcut.register('Super+5', () => sGrid.createWindow(5))
  globalShortcut.register('Super+6', () => sGrid.createWindow(6))
  globalShortcut.register('Super+7', () => sGrid.createWindow(7))
  globalShortcut.register('Super+8', () => sGrid.createWindow(8))
  globalShortcut.register('Super+9', () => sGrid.createWindow(9))

  globalShortcut.register('Super+A', () => wChanger.toggleAllShow())
  globalShortcut.register('Super+Q', () => wChanger.switchWindow())
  globalShortcut.register('Super+X', () => wChanger.closeWindow())
  globalShortcut.register('Super+CommandOrControl+H', () => sGrid.changeCurWindow({x: '-30'}))
  globalShortcut.register('Super+CommandOrControl+J', () => sGrid.changeCurWindow({y: '30'}))
  globalShortcut.register('Super+CommandOrControl+K', () => sGrid.changeCurWindow({y: '-30'}))
  globalShortcut.register('Super+CommandOrControl+L', () => sGrid.changeCurWindow({x: '30'}))
  globalShortcut.register('Super+Alt+H', () => sGrid.changeCurWindow({width: '-30'}))
  globalShortcut.register('Super+Alt+J', () => sGrid.changeCurWindow({height: '30'}))
  globalShortcut.register('Super+Alt+K', () => sGrid.changeCurWindow({height: '-30'}))
  globalShortcut.register('Super+Alt+L', () => sGrid.changeCurWindow({width: '30'}))
  globalShortcut.register('Super+Shift+J', () => sGrid.maxSize({down: true}))
  globalShortcut.register('Super+Shift+K', () => sGrid.maxSize({up: true}))
  globalShortcut.register('Super+Shift+L', () => sGrid.maxSize({right: true}))
  globalShortcut.register('Super+Shift+H', () => sGrid.maxSize({left: true}))
  globalShortcut.register('Super+H', () => sGrid.maxLoc({left: true}))
  globalShortcut.register('Super+J', () => sGrid.maxLoc({down: true}))
  globalShortcut.register('Super+K', () => sGrid.maxLoc({up: true}))
  globalShortcut.register('Super+L', () => sGrid.maxLoc({right: true}))
})

app.on('window-all-closed', () => {}) // keep app open after all windows closed
