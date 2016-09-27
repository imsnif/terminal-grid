'use strict'

const electron = require('electron')

const app = electron.app
const ipcMain = electron.ipcMain
const globalShortcut = electron.globalShortcut
const BrowserWindow = electron.BrowserWindow
const TerminalWindow = require('electron-terminal-window')

const Grid = require('grid')
const grids = {}

const winChanger = require('./utils/win-changer')

const tracker = {
  currentScreenIndex: 0,
  currentWindowIndex: undefined
}

function switchScreen() {
  tracker.currentScreenIndex = Object.keys(grids).length > tracker.currentScreenIndex + 1
    ? tracker.currentScreenIndex + 1
    : 0
  tracker.currentWindowIndex = undefined
}

function changeCurWindow (curScreen, params) {
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

function maxSize (curScreen, params) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // only change focused window
  const pane = winChanger.getPane(focusedWindow.id)
  pane.maxSize(params)
}

function maxLoc (curScreen, params) {
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

  globalShortcut.register('Super+W', () => winChanger.createWindow())
  globalShortcut.register('Super+S', () => switchScreen(tracker.currentScreenIndex))
  globalShortcut.register('Super+A', () => winChanger.toggleAllShow())
  globalShortcut.register('Super+Q', () => winChanger.switchWindow())
  globalShortcut.register('Super+X', () => winChanger.closeWindow())
  globalShortcut.register('Super+CommandOrControl+H', () => changeCurWindow(tracker.currentScreenIndex, {x: '-30'}))
  globalShortcut.register('Super+CommandOrControl+J', () => changeCurWindow(tracker.currentScreenIndex, {y: '30'}))
  globalShortcut.register('Super+CommandOrControl+K', () => changeCurWindow(tracker.currentScreenIndex, {y: '-30'}))
  globalShortcut.register('Super+CommandOrControl+L', () => changeCurWindow(tracker.currentScreenIndex, {x: '30'}))
  globalShortcut.register('Super+Alt+H', () => changeCurWindow(tracker.currentScreenIndex, {width: '-30'}))
  globalShortcut.register('Super+Alt+J', () => changeCurWindow(tracker.currentScreenIndex, {height: '30'}))
  globalShortcut.register('Super+Alt+K', () => changeCurWindow(tracker.currentScreenIndex, {height: '-30'}))
  globalShortcut.register('Super+Alt+L', () => changeCurWindow(tracker.currentScreenIndex, {width: '30'}))
  globalShortcut.register('Super+Shift+J', () => maxSize(tracker.currentScreenIndex, {down: true}))
  globalShortcut.register('Super+Shift+K', () => maxSize(tracker.currentScreenIndex, {up: true}))
  globalShortcut.register('Super+Shift+L', () => maxSize(tracker.currentScreenIndex, {right: true}))
  globalShortcut.register('Super+Shift+H', () => maxSize(tracker.currentScreenIndex, {left: true}))
  globalShortcut.register('Super+H', () => maxLoc(tracker.currentScreenIndex, {left: true}))
  globalShortcut.register('Super+J', () => maxLoc(tracker.currentScreenIndex, {down: true}))
  globalShortcut.register('Super+K', () => maxLoc(tracker.currentScreenIndex, {up: true}))
  globalShortcut.register('Super+L', () => maxLoc(tracker.currentScreenIndex, {right: true}))
})
