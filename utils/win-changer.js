'use strict'

const grids = []

const state = {
  minimized: false
}

const TerminalWindow = require('electron-terminal-window')
const { BrowserWindow } = require('electron')

module.exports = {
  addGrid: function addGrid (grid) {
    grids.push(grid)
  },
  createWindow: function createWindow () {
    try {
      const grid = getGrid() || grids[0]
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
  toggleAllShow: function toggleAllShow () {
    const wins = BrowserWindow.getAllWindows()
    if (!state.minimized) {
      minimizeAll()
    } else {
      restoreAll()
    }
  },
  switchWindow: function switchWindow () {
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
      allWindows[nextIndex].focus()
    } catch (e) {
      console.error(e)
    }
  },
  closeWindow: function closeWindow() {
    try {
      const allWindows = BrowserWindow.getAllWindows()
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only close focused window
      const focusedGrid = getGrid(focusedWindow.id)
      focusedGrid.remove(focusedWindow.id)
      restoreAll()
      this.switchWindow()
    } catch (e) {
      console.error(e)
    }
  },
  getPane: function getPane (winId) {
    const grid = getGrid(winId)
    return grid.getPane(winId)
  }
}

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

function minimizeAll() {
  const wins = BrowserWindow.getAllWindows()
  wins.forEach(w => w.minimize())
  state.minimized = !state.minimized
}

function restoreAll() {
  const wins = BrowserWindow.getAllWindows()
  wins.forEach(w => w.restore())
  state.minimized = !state.minimized
}
