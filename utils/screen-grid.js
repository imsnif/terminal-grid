'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const TerminalWindow = require('electron-terminal-window')

const Grid = require('grid')

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

module.exports = {
  init: function init () {
    const screen = electron.screen
    const displays = screen.getAllDisplays()
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
  },
  createWindow: function createWindow (gridId) {
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
  },
  changeCurWindow: function changeCurWindow (params) {
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
  },
  maxSize: function maxSize (params) {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (!focusedWindow) return // only change focused window
    const pane = getPane(focusedWindow.id)
    pane.maxSize(params)
  },
  maxLoc: function maxLoc (params) {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (!focusedWindow) return // only change focused window
    const pane = getPane(focusedWindow.id)
    pane.maxLoc(params)
  }
}
