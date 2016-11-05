'use strict'

module.exports = function paneAdder (state) {
  return {
    addPaneMain: (screenIndex) => {
      const mode = state.modes[screenIndex]
      if (!mode) return // no-op
      mode.addPaneMain()
    },
    addPaneSecondary: (screenIndex) => {
      const mode = state.modes[screenIndex]
      if (!mode) return // no-op
      mode.addPaneSecondary()
    }
  }
}
