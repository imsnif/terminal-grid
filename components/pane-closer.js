'use strict'

const { BrowserWindow } = require('electron')

module.exports = function paneMover (state, closeAction) {
  return {
    closeCurrentPane: function closeCurrentPane () {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return
      const pane = state.grid.panes.filter(p => p.id === focusedWindow.id)[0]
      if (!pane) return // not part of this grid
      focusedWindow.close()
      if (closeAction) closeAction()
    }
  }
}
