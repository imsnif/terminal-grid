'use strict'

const electron = require('electron')

const app = electron.app
const ipcMain = electron.ipcMain
const globalShortcut = electron.globalShortcut
const BrowserWindow = electron.BrowserWindow

const Grid = require('grid')
const winChanger = require('./utils/win-changer')

const TerminalWindow = require('electron-terminal-window')

let grids = []

function getGrid (winId) {
  if (winId === undefined) {
    winId = BrowserWindow.getFocusedWindow()
    if (winId === null) return false
  }
  const gridIndex = Object.keys(grids)
    .filter(gridId => {
      const grid = grids[gridId]
      return grid.panes.some(p => {
        return p.wrapped.id === winId
      })
    })[0]
  return grids[gridIndex || 0]
}

function getPane (winId) {
  const grid = getGrid(winId)
  return grid.getPane(winId)
}

function createWindow (gridId) {
  try {
    const grid = typeof gridId === 'number' && typeof grids[gridId] === 'object'
      ? grids[gridId] : getGrid() || grids[0]
    grid.add(TerminalWindow, {
      width: 400,
      height: 300,
      frame: false,
      skipTaskbar: true
    })
  } catch (e) {
    console.error(e)
  }
}

function changeCurWindow (params) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // only change focused window
  const pane = getPane(focusedWindow.id)
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
  const pane = getPane(focusedWindow.id)
  pane.maxSize(params)
}

function maxLoc (params) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // only change focused window
  const pane = getPane(focusedWindow.id)
  pane.maxLoc(params)
}

app.on('quit', () => {
  console.log('quitting')
})

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
    grids.push(grid)
  })

  globalShortcut.register('Super+0', () => createWindow(0))
  globalShortcut.register('Super+1', () => createWindow(1))
  globalShortcut.register('Super+2', () => createWindow(2))
  globalShortcut.register('Super+3', () => createWindow(3))
  globalShortcut.register('Super+4', () => createWindow(4))
  globalShortcut.register('Super+5', () => createWindow(5))
  globalShortcut.register('Super+6', () => createWindow(6))
  globalShortcut.register('Super+7', () => createWindow(7))
  globalShortcut.register('Super+8', () => createWindow(8))
  globalShortcut.register('Super+9', () => createWindow(9))

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
