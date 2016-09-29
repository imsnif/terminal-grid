'use strict'

const electron = require('electron')

const app = electron.app
const ipcMain = electron.ipcMain
const globalShortcut = electron.globalShortcut
const BrowserWindow = electron.BrowserWindow

const Grid = require('grid')
const winChanger = require('./utils/win-changer')

function changeCurWindow (params) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // only change focused window
  const pane = winChanger.getPane(focusedWindow.id)
  if (params.x || params.y) {
    try {
      pane.changeLocation(
        params.x ? pane.x + parseInt(params.x) : pane.x,
        params.y ? pane.y + parseInt(params.y) : pane.y
      )
    } catch(e) {
      console.error(e)
      // TODO: some visual indication (flash border red?)
    }
  } else { // TODO: support both
    try {
      pane.changeSize(
        params.width ? pane.width + parseInt(params.width) : pane.width,
        params.height ? pane.height + parseInt(params.height) : pane.height
      )
    } catch(e) {
      console.error(e)
      // TODO: some visual indication (flash border red?)
    }
  }
}

function maxSize (params) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // only change focused window
  const pane = winChanger.getPane(focusedWindow.id)
  pane.maxSize(params)
}

function maxLoc (params) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // only change focused window
  const pane = winChanger.getPane(focusedWindow.id)
  pane.maxLoc(params)
}

app.on('ready', () => {
  const displays = electron.screen.getAllDisplays()
  displays.forEach((display, i) => {
    const bounds = display.bounds
    const workArea = display.workArea
    const gridOffset = {x: display.bounds.x, y: display.bounds.y}
    const grid = new Grid(bounds.width, bounds.height, gridOffset)
    if (workArea.y > bounds.y) {
      grid.add(null, {
        id: 'taskbarTop',
        width: bounds.width,
        height: workArea.y,
        x: 0,
        y: 0
      })
    } else if (workArea.x > bounds.x) {
      grid.add(null, {
        id: 'taskBarLeft',
        width: workArea.x,
        height: bounds.height,
        x: 0,
        y: 0
      })
    } else if (workArea.height < bounds.height) {
      grid.add(null, {
        id: 'taskBarBottom',
        width: bounds.width,
        height: bounds.height - workArea.height,
        x: 0,
        y: workArea.height
      })
    } else if (workArea.width < bounds.width) {
      grid.add(null, {
        id: 'taskBarRight',
        width: bounds.width - workArea.width,
        height: bounds.height,
        x: workArea.width,
        y: 0
      })
    }
    winChanger.addGrid(grid)
  })

  globalShortcut.register('Super+0', () => winChanger.createWindow(0))
  globalShortcut.register('Super+1', () => winChanger.createWindow(1))
  globalShortcut.register('Super+2', () => winChanger.createWindow(2))
  globalShortcut.register('Super+3', () => winChanger.createWindow(3))
  globalShortcut.register('Super+4', () => winChanger.createWindow(4))
  globalShortcut.register('Super+5', () => winChanger.createWindow(5))
  globalShortcut.register('Super+6', () => winChanger.createWindow(6))
  globalShortcut.register('Super+7', () => winChanger.createWindow(7))
  globalShortcut.register('Super+8', () => winChanger.createWindow(8))
  globalShortcut.register('Super+9', () => winChanger.createWindow(9))

  globalShortcut.register('Super+A', () => winChanger.toggleAllShow())
  globalShortcut.register('Super+Q', () => winChanger.switchWindow())
  globalShortcut.register('Super+X', () => winChanger.closeWindow())
  globalShortcut.register('Super+CommandOrControl+H', () => changeCurWindow({x: '-30'}))
  globalShortcut.register('Super+CommandOrControl+J', () => changeCurWindow({y: '30'}))
  globalShortcut.register('Super+CommandOrControl+K', () => changeCurWindow({y: '-30'}))
  globalShortcut.register('Super+CommandOrControl+L', () => changeCurWindow({x: '30'}))
  globalShortcut.register('Super+Alt+H', () => changeCurWindow({width: '-30'}))
  globalShortcut.register('Super+Alt+J', () => changeCurWindow({height: '30'}))
  globalShortcut.register('Super+Alt+K', () => changeCurWindow({height: '-30'}))
  globalShortcut.register('Super+Alt+L', () => changeCurWindow({width: '30'}))
  globalShortcut.register('Super+Shift+J', () => maxSize({down: true}))
  globalShortcut.register('Super+Shift+K', () => maxSize({up: true}))
  globalShortcut.register('Super+Shift+L', () => maxSize({right: true}))
  globalShortcut.register('Super+Shift+H', () => maxSize({left: true}))
  globalShortcut.register('Super+H', () => maxLoc({left: true}))
  globalShortcut.register('Super+J', () => maxLoc({down: true}))
  globalShortcut.register('Super+K', () => maxLoc({up: true}))
  globalShortcut.register('Super+L', () => maxLoc({right: true}))
})
