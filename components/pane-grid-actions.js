'use strict'

const modeAtCurrentWindow = require('../lib/mode-at-current-window')

module.exports = function paneGridActions (state) {
  return {
    switchPaneFocus: (direction) => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      mode.switchPaneFocus(direction)
    },
    closePane: () => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      mode.closeCurrentPane()
    }
  }
}
