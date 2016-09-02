'use strict'

const electron = require('electron')

const app = electron.app
const globalShortcut = electron.globalShortcut
const shorty = require('./utils/shorty')
const BrowserWindow = electron.BrowserWindow

const Grid = require('grid')
const grids = {}

let curScreen = 0

let id = 1

function switchScreen() {
  curScreen = grids[curScreen + 1] ? curScreen + 1 : 0
}

function switchWindow(curScreen) {
  if (grids[curScreen].panes.length > 0) {
    const paneIndex = grids[curScreen].curWindowIndex = grids[curScreen].curWindowIndex || 0
    grids[curScreen].curWindowIndex = grids[curScreen].panes[paneIndex + 1]
      ? paneIndex + 1
      : 0
  grids[curScreen].panes[grids[curScreen].curWindowIndex].wrapped.focus()
  }
}

function toggleAllShow(curScreen) {
  const curGrid = grids[curScreen]
  curGrid.minimized = curGrid.minimized || false
  if (curGrid.minimized) {
    grids[curGrid].panes.filter(w => w.wrapped && w.wrapped.restore).forEach(w => w.wrapped.restore())
  } else {
    grids[grid].panes.filter(w => w.wrapped && w.wrapped.minimize).forEach(w => w.wrapped.minimize())
  }
  curGrid.minimized = !curGrid.minimized
}

function createWindow (curScreen) {
  try {
    grids[curScreen].curWindowIndex = grids[curScreen].curWindowIndex !== undefined
      ? grids[curScreen].curWindowIndex + 1
      : 0
    grids[curScreen].add(BrowserWindow, {id: grids[curScreen].curWindowIndex, width: 400, height: 300, frame: false, skipTaskbar: true})

    const createdWindow = grids[curScreen].getPane(grids[curScreen].curWindowIndex)
    createdWindow.wrapped.loadURL(`file://${__dirname}/terminal/index.html`)

    // Open the DevTools.
    // createdWindow.wrapped.webContents.openDevTools()

  } catch (e) {
    console.error(e)
  }
}

function changeCurWindow (curScreen, params) {
  const pane = grids[curScreen].panes[grids[curScreen].curWindowIndex]
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
  const pane = grids[curScreen].panes[grids[curScreen].curWindowIndex || 0]
  pane.maxSize(params)
}

function maxLoc (params) {
  const pane = grids[curScreen].panes[grids[curScreen].curWindowIndex || 0]
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
    grids[i] = grid
  })
  // createWindow()

  shorty.register('F2', 'W', () => createWindow(curScreen))
  shorty.register('F2', 'S', () => switchScreen(curScreen))
  shorty.register('F2', 'A', () => toggleAllShow(curScreen))
  shorty.register('F2', 'Q', () => switchWindow(curScreen))
  shorty.register('F2', 'CommandOrControl+H', () => changeCurWindow(curScreen, {x: '-30'}))
  shorty.register('F2', 'CommandOrControl+J', () => changeCurWindow(curScreen, {y: '30'}))
  shorty.register('F2', 'CommandOrControl+K', () => changeCurWindow(curScreen, {y: '-30'}))
  shorty.register('F2', 'CommandOrControl+L', () => changeCurWindow(curScreen, {x: '30'}))
  shorty.register('F2', 'Alt+H', () => changeCurWindow(curScreen, {width: '-30'}))
  shorty.register('F2', 'Alt+J', () => changeCurWindow(curScreen, {height: '30'}))
  shorty.register('F2', 'Alt+K', () => changeCurWindow(curScreen, {height: '-30'}))
  shorty.register('F2', 'Alt+L', () => changeCurWindow(curScreen, {width: '30'}))
  shorty.register('F2', 'Shift+J', () => maxSize({down: true}))
  shorty.register('F2', 'Shift+K', () => maxSize({up: true}))
  shorty.register('F2', 'Shift+L', () => maxSize({right: true}))
  shorty.register('F2', 'Shift+H', () => maxSize({left: true}))
  shorty.register('F2', 'H', () => maxLoc({left: true}))
  shorty.register('F2', 'J', () => maxLoc({down: true}))
  shorty.register('F2', 'K', () => maxLoc({up: true}))
  shorty.register('F2', 'L', () => maxLoc({right: true}))
})
