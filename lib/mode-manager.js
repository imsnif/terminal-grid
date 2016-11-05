'use strict'

const { BrowserWindow } = require('electron')

function modeAtCurrentWindow (modes) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // no-op
  return modes.filter(m => m.grid.panes.some(p => p.id === focusedWindow.id))[0]
}

module.exports = function ModeManager (sGrid, wChanger, TerminalWindow, modeConstructors) {
  let state = {
    modes: sGrid.grids.map((g, index) => index % 2
      ? new modeConstructors[0](g.id, sGrid, wChanger, TerminalWindow)
      : new modeConstructors[1](g.id, sGrid, wChanger, TerminalWindow) // TODO: get config from outside, until then - these can be switched around manually as needed
    )
  }
  return Object.assign(state, {
    movePanePrimary: (direction) => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      try {
        mode.movePaneMain(direction)
      } catch (e) {
        const adjacentGrid = sGrid.adjacentGrids[mode.grid.id][direction]
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (!adjacentGrid) return console.error('no grid found :(')
        const adjacentGridMode = state.modes.filter(m => m.id === adjacentGrid.id)[0]
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
        const adjacentGrid = sGrid.adjacentGrids[mode.grid.id][direction]
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (!adjacentGrid) return console.error('no grid found :(')
        const adjacentGridMode = state.modes.filter(m => m.id === adjacentGrid.id)[0]
        if (adjacentGridMode.canImport(focusedWindow)) {
          const pane = mode.exportPane(focusedWindow.id)
          adjacentGridMode.importPane(pane, direction)
        }
      }
    },
    increasePaneSize: (direction) => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      mode.increasePaneSize(direction)
    },
    decreasePaneSize: (direction) => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      mode.decreasePaneSize(direction)
    },
    switchPaneFocus: (direction) => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      mode.switchPaneFocus(direction)
    },
    addPaneMain: (screenIndex) => {
      const mode = state.modes[screenIndex]
      if (!mode) return // no-op
      mode.addPaneMain()
    },
    addPaneSecondary: (screenIndex) => {
      const mode = state.modes[screenIndex]
      if (!mode) return // no-op
      mode.addPaneSecondary()
    },
    closePane: () => {
      const mode = modeAtCurrentWindow(state.modes)
      if (!mode) return // no-op
      mode.closeCurrentPane()
    },
    togglePaneFullSize: () => {
      sGrid.toggleCurrentWinFullSize() // TODO: move this function here
    },
    toggleAllShow: () => {
      wChanger.toggleAllShow()
    }
  })
}
