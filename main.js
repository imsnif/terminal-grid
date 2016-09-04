'use strict'

const electron = require('electron')

const app = electron.app
const globalShortcut = electron.globalShortcut
const shorty = require('./utils/shorty')
const winTracker = require('./utils/win-tracker')
const BrowserWindow = electron.BrowserWindow

const Grid = require('grid')
const gridTracker = {}
const grids = {}

let curScreen = 0
const curIds = {}
let id = 1

function switchScreen() {
  winTracker.switchScreen()
}

function switchWindow(curScreen) {
  if (grids[curScreen].panes.length > 0) {
    winTracker.nextWin()
    const currentPaneId = winTracker.getCurrentWin()
    grids[curScreen].getPane(currentPaneId).wrapped.focus()
  }
}

function closeWindow(curScreen) {
  if (grids[curScreen].panes.length > 0) {
    // const currentPaneId = winTracker.getCurrentWinIndex()
    const currentPaneId = winTracker.getCurrentWin()
    console.log('currentPaneId:', currentPaneId)
    grids[curScreen].remove(currentPaneId)
    winTracker.removeWin(currentPaneId)
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
    let paneId = winTracker.getLastWinIndex() 
    ? winTracker.getLastWinIndex() + 1
    : 1 // hard-coded taskbar, fix this
    grids[curScreen].add(BrowserWindow, {
      id: paneId,
      width: 400,
      height: 300,
      frame: false,
      skipTaskbar: true
    })

    const createdWindow = grids[curScreen].getPane(paneId)
    createdWindow.wrapped.loadURL(`file://${__dirname}/terminal/index.html`)
    winTracker.addWin(paneId)
    winTracker.switchWin(paneId)

    // Open the DevTools.
    // createdWindow.wrapped.webContents.openDevTools()

  } catch (e) {
    console.error(e)
  }
}

function changeCurWindow (curScreen, params) {
  const pane = grids[curScreen].getPane(gridTracker[curScreen].curWindow)
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
  const paneId = winTracker.getCurrentWinIndex()
  const pane = grids[curScreen].getPane(paneId)
  pane.maxSize(params)
}

function maxLoc (curScreen, params) {
  const paneId = winTracker.getCurrentWinIndex()
  const pane = grids[curScreen].getPane(paneId)
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
    winTracker.addScreen(i)
  })
  winTracker.switchScreen()
  // createWindow()

  shorty.register('F2', 'W', () => createWindow(winTracker.getCurrentScreen()))
  shorty.register('F2', 'S', () => switchScreen(winTracker.getCurrentScreen()))
  shorty.register('F2', 'A', () => toggleAllShow(winTracker.getCurrentScreen()))
  shorty.register('F2', 'Q', () => switchWindow(winTracker.getCurrentScreen()))
  shorty.register('F2', 'X', () => closeWindow(winTracker.getCurrentScreen()))
  shorty.register('F2', 'CommandOrControl+H', () => changeCurWindow(winTracker.getCurrentScreen(), {x: '-30'}))
  shorty.register('F2', 'CommandOrControl+J', () => changeCurWindow(winTracker.getCurrentScreen(), {y: '30'}))
  shorty.register('F2', 'CommandOrControl+K', () => changeCurWindow(winTracker.getCurrentScreen(), {y: '-30'}))
  shorty.register('F2', 'CommandOrControl+L', () => changeCurWindow(winTracker.getCurrentScreen(), {x: '30'}))
  shorty.register('F2', 'Alt+H', () => changeCurWindow(winTracker.getCurrentScreen(), {width: '-30'}))
  shorty.register('F2', 'Alt+J', () => changeCurWindow(winTracker.getCurrentScreen(), {height: '30'}))
  shorty.register('F2', 'Alt+K', () => changeCurWindow(winTracker.getCurrentScreen(), {height: '-30'}))
  shorty.register('F2', 'Alt+L', () => changeCurWindow(winTracker.getCurrentScreen(), {width: '30'}))
  shorty.register('F2', 'Shift+J', () => maxSize(winTracker.getCurrentScreen(), {down: true}))
  shorty.register('F2', 'Shift+K', () => maxSize(winTracker.getCurrentScreen(), {up: true}))
  shorty.register('F2', 'Shift+L', () => maxSize(winTracker.getCurrentScreen(), {right: true}))
  shorty.register('F2', 'Shift+H', () => maxSize(winTracker.getCurrentScreen(), {left: true}))
  shorty.register('F2', 'H', () => maxLoc(winTracker.getCurrentScreen(), {left: true}))
  shorty.register('F2', 'J', () => maxLoc(winTracker.getCurrentScreen(), {down: true}))
  shorty.register('F2', 'K', () => maxLoc(winTracker.getCurrentScreen(), {up: true}))
  shorty.register('F2', 'L', () => maxLoc(winTracker.getCurrentScreen(), {right: true}))
})
