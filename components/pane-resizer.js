'use strict'

const modeAtCurrentWindow = require('../lib/mode-at-current-window')

module.exports = function paneResizer (state) {
  return {
    increasePaneSize: (direction) => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      mode.increasePaneSize(direction)
    },
    decreasePaneSize: (direction) => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      mode.decreasePaneSize(direction)
    }
  }
}
