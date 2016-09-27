'use strict'

const electron = require('electron')

const app = electron.app
const ipcMain = electron.ipcMain
const globalShortcut = electron.globalShortcut
const BrowserWindow = electron.BrowserWindow
const TerminalWindow = require('electron-terminal-window')

const Grid = require('grid')
const grids = {}

const tracker = {
  currentScreenIndex: 0,
  currentWindowIndex: undefined
}

const skippedInitial = {}

function switchScreen() {
  tracker.currentScreenIndex = Object.keys(grids).length > tracker.currentScreenIndex + 1
    ? tracker.currentScreenIndex + 1
    : 0
  tracker.currentWindowIndex = undefined
}

function switchWindow() {
  try {
    const allWindows = BrowserWindow.getAllWindows()
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (!focusedWindow) return allWindows[0].focus()
    const currentIndex = allWindows
      .map(w => w.id)
      .indexOf(focusedWindow.id)
    const lastIndex = allWindows.length - 1
    const nextIndex = currentIndex + 1 > lastIndex
      ? 0
      : currentIndex + 1
    console.log('nextIndex:', nextIndex)
    allWindows[nextIndex].focus()
  } catch (e) {
    console.error(e)
  }
}

function getGrid (winId) {
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

function closeWindow() {
  try {
    const allWindows = BrowserWindow.getAllWindows()
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (!focusedWindow) return // only close focused window
    const focusedGrid = getGrid(focusedWindow.id)
    focusedGrid.remove(focusedWindow.id)
    switchWindow()
  } catch (e) {
    console.error(e)
  }
}

function toggleAllShow(curScreen) {
  const curGrid = grids[curScreen]
  curGrid.minimized = curGrid.minimized || false
  const action = curGrid.minimized ? 'restore' : 'minimize'
  curGrid.panes.forEach(w => w.wrapped &&
    typeof w.wrapped[action]=== 'function' &&
    w.wrapped[action]()
  )
  curGrid.minimized = !curGrid.minimized
}

function createWindow () {
  try {
    const grid = getGrid()
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

function changeCurWindow (curScreen, params) {
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

function maxSize (curScreen, params) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // only change focused window
  const pane = getPane(focusedWindow.id)
  pane.maxSize(params)
}

function maxLoc (curScreen, params) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // only change focused window
  const pane = getPane(focusedWindow.id)
  pane.maxLoc(params)
}

app.on('ready', () => {
  const displays = electron.screen.getAllDisplays()
  displays.forEach((display, i) => {
    const bounds = display.bounds
    const workArea = display.workArea
    const gridOffset = {x: display.bounds.x, y: display.bounds.y}
    const grid = new Grid(bounds.width, bounds.height, gridOffset)
    skippedInitial[i] = 0
    if (workArea.y > bounds.y) {
      grid.add(null, {
        id: 'taskbarTop',
        width: bounds.width,
        height: workArea.y,
        x: 0,
        y: 0
      })
      skippedInitial[i] += 1
    } else if (workArea.x > bounds.x) {
      grid.add(null, {
        id: 'taskBarLeft',
        width: workArea.x,
        height: bounds.height,
        x: 0,
        y: 0
      })
      skippedInitial[i] += 1
    } else if (workArea.height < bounds.height) {
      grid.add(null, {
        id: 'taskBarBottom',
        width: bounds.width,
        height: bounds.height - workArea.height,
        x: 0,
        y: workArea.height
      })
      skippedInitial[i] += 1
    } else if (workArea.width < bounds.width) {
      grid.add(null, {
        id: 'taskBarRight',
        width: bounds.width - workArea.width,
        height: bounds.height,
        x: workArea.width,
        y: 0
      })
      skippedInitial[i] += 1
    }
    grids[i] = grid
  })

  globalShortcut.register('Super+W', () => createWindow())
  globalShortcut.register('Super+S', () => switchScreen(tracker.currentScreenIndex))
  globalShortcut.register('Super+A', () => toggleAllShow(tracker.currentScreenIndex))
  globalShortcut.register('Super+Q', () => switchWindow())
  globalShortcut.register('Super+X', () => closeWindow())
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
