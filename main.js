'use strict'

const electron = require('electron')

const app = electron.app
const globalShortcut = electron.globalShortcut

const winChanger = require('./utils/win-changer')
const screenGrid = require('./utils/screen-grid')

app.on('ready', () => {
  screenGrid.init()
  .then(() => {
    globalShortcut.register('Super+0', () => screenGrid.createWindow(0))
    globalShortcut.register('Super+1', () => screenGrid.createWindow(1))
    globalShortcut.register('Super+2', () => screenGrid.createWindow(2))
    globalShortcut.register('Super+3', () => screenGrid.createWindow(3))
    globalShortcut.register('Super+4', () => screenGrid.createWindow(4))
    globalShortcut.register('Super+5', () => screenGrid.createWindow(5))
    globalShortcut.register('Super+6', () => screenGrid.createWindow(6))
    globalShortcut.register('Super+7', () => screenGrid.createWindow(7))
    globalShortcut.register('Super+8', () => screenGrid.createWindow(8))
    globalShortcut.register('Super+9', () => screenGrid.createWindow(9))

    globalShortcut.register('Super+A', () => winChanger.toggleAllShow())
    globalShortcut.register('Super+Q', () => winChanger.switchWindow())
    globalShortcut.register('Super+X', () => winChanger.closeWindow())
    globalShortcut.register('Super+CommandOrControl+H', () => screenGrid.changeCurWindow({x: '-30'}))
    globalShortcut.register('Super+CommandOrControl+J', () => screenGrid.changeCurWindow({y: '30'}))
    globalShortcut.register('Super+CommandOrControl+K', () => screenGrid.changeCurWindow({y: '-30'}))
    globalShortcut.register('Super+CommandOrControl+L', () => screenGrid.changeCurWindow({x: '30'}))
    globalShortcut.register('Super+Alt+H', () => screenGrid.changeCurWindow({width: '-30'}))
    globalShortcut.register('Super+Alt+J', () => screenGrid.changeCurWindow({height: '30'}))
    globalShortcut.register('Super+Alt+K', () => screenGrid.changeCurWindow({height: '-30'}))
    globalShortcut.register('Super+Alt+L', () => screenGrid.changeCurWindow({width: '30'}))
    globalShortcut.register('Super+Shift+J', () => screenGrid.maxSize({down: true}))
    globalShortcut.register('Super+Shift+K', () => screenGrid.maxSize({up: true}))
    globalShortcut.register('Super+Shift+L', () => screenGrid.maxSize({right: true}))
    globalShortcut.register('Super+Shift+H', () => screenGrid.maxSize({left: true}))
    globalShortcut.register('Super+H', () => screenGrid.maxLoc({left: true}))
    globalShortcut.register('Super+J', () => screenGrid.maxLoc({down: true}))
    globalShortcut.register('Super+K', () => screenGrid.maxLoc({up: true}))
    globalShortcut.register('Super+L', () => screenGrid.maxLoc({right: true}))
  })
})
