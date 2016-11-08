'use strict'

const modeAtCurrentWindow = require('../lib/mode-at-current-window')

module.exports = function modeSwitcher (state) {
  return {
    switchMode: () => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      const { grid } = mode
      const NextMode = state.modeTypes.filter(m => m.name !== mode.constructor.name)[0]
      const newMode = new NextMode(grid.id, state.sGrid, state.wChanger, state.TerminalWindow)
      const index = state.modes.findIndex(m => m.id === mode.id)
      state.modes.splice(index, 1, newMode)
    }
  }
}
