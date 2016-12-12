'use strict'

const { BrowserWindow } = require('electron')

module.exports = function minimizeToggler (state) {
  return {
    togglePaneFullSize: () => {
      state.sGrid.toggleCurrentWinFullSize() // TODO: move this function here
    },
    toggleAllShow: () => {
      const currentFocused = BrowserWindow.getFocusedWindow()
      state.wChanger.toggleAllShow()
      if (currentFocused) {
        state.lastFocusedWindow = currentFocused
      } else if (state.lastFocusedWindow) {
        state.lastFocusedWindow.focus()
      }
    }
  }
}
