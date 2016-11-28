'use strict'

const { BrowserWindow } = require('electron')

module.exports = function paneMover (state, closeAction) {
  return {
    closeCurrentPane: function closeCurrentPane () {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return
      const pane = state.grid.panes.filter(p => p.id === focusedWindow.id)[0]
      if (!pane) return // not part of this grid
      const adjacentPanesInGrid = ['right', 'left', 'up', 'down']
        .map(d => state.sGrid.adjacentPaneInGrid(d))
        .filter(p => p)
      const adjacentPanesOutsideGrid = ['right', 'left', 'up', 'down']
        .map(d => state.sGrid.adjacentPane(d))
        .filter(p => p)
      state.sGrid.closeCurWindow()
      if (closeAction) closeAction()
      if (adjacentPanesInGrid.length > 0) return adjacentPanesInGrid[0].wrapped.focus()
      if (adjacentPanesOutsideGrid.length > 0) return adjacentPanesOutsideGrid[0].wrapped.focus()
    }
  }
}
