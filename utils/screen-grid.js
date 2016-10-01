'use strict'

const electron = require('electron')
const BrowserWindow = electron.BrowserWindow
const TerminalWindow = require('electron-terminal-window')

const util = require('util')

const Grid = require('grid')

let grids = []

const detectTaskbars = require('../script/xfce4-panel-positions')

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
    return detectTaskbars().then((taskbar) => {
      const screen = electron.screen
      const displays = screen.getAllDisplays()
      displays.forEach((display, i) => {
        const bounds = display.bounds
        const workArea = display.workArea
        if (taskbar.x === bounds.x && taskbar.y === bounds.y) {
          // TODO: support multiple taskbars
          // and different taskbar types (horizontal, vertical, random blob in the middle of the screen, etc.)
          const gridOffset = {x: bounds.x, y: bounds.y}
          const grid = new Grid(bounds.width, bounds.height, gridOffset)
          grid.add(null, Object.assign({}, taskbar, {id: 'taskbar', width: bounds.width}))
          grids.push(grid)
        } else {
          const gridOffset = {x: bounds.x, y: bounds.y}
          const grid = new Grid(bounds.width, bounds.height, gridOffset)
          grids.push(grid)
        }
      })
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
