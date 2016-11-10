'use strict'

const { BrowserWindow } = require('electron')
const modeAtCurrentWindow = require('../lib/mode-at-current-window')

module.exports = function paneMover (state) {
  return {
    movePanePrimary: (direction) => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      try {
        mode.movePaneMain(direction)
      } catch (e) {
        const adjacentGrid = state.sGrid.adjacentGrids[mode.grid.id][direction]
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (!adjacentGrid) return // no-op
        const adjacentGridMode = state.modes.find(m => m.id === adjacentGrid.id)
        if (adjacentGridMode.canImport(focusedWindow)) {
          const pane = mode.exportPane(focusedWindow.id)
          adjacentGridMode.importPane(pane, direction)
        }
      }
    },
    movePaneSecondary: (direction) => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      try {
        mode.movePaneSecondary(direction)
      } catch (e) {
        const adjacentGrid = state.sGrid.adjacentGrids[mode.grid.id][direction]
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (!adjacentGrid) return // no-op
        const adjacentGridMode = state.modes.find(m => m.id === adjacentGrid.id)
        if (adjacentGridMode.canImport(focusedWindow)) {
          const pane = mode.exportPane(focusedWindow.id)
          adjacentGridMode.importPane(pane, direction)
        }
      }
    }
  }
}
