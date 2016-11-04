'use strict'

const { BrowserWindow } = require('electron')

const assert = require('assert')
const validate = require('validate.js')

module.exports = function TmuxMode (displayId, sGrid, wChanger, TerminalWindow) {
  const grid = sGrid.grids.filter(g => g.id === displayId)[0]
  assert(validate.isDefined(grid), `grid with id ${displayId} not found`)
  let state = {
    grid,
    id: displayId,
    winOpts: {frame: false, skipTaskbar: true},
    resizeAmount: 30
  }
  if (grid.panes.length === 0) {
    sGrid.createWindow(
      displayId,
      TerminalWindow,
      Object.assign({}, state.winOpts, {maxSize: true})
    )
  }
  grid.maxAllPanes()
  return Object.assign(state, {
    addPaneMain: () => sGrid.splitCurrentWindow(displayId, TerminalWindow, state.winOpts, 'vertical'),
    addPaneSecondary: () => sGrid.splitCurrentWindow(displayId, TerminalWindow, state.winOpts, 'horizontal'),
    movePaneMain: (direction) => sGrid.switchWindowContents(direction),
    movePaneSecondary: () => {},
    increasePaneSize: (direction) => sGrid.increaseAndFillCurWinSize(direction, state.resizeAmount),
    decreasePaneSize: (direction) => sGrid.decreaseAndFillCurWinSize(direction, state.resizeAmount),
    switchPaneFocus: (direction) => sGrid.switchWindow(direction),
    closeCurrentPane: () => {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return
      const pane = state.grid.panes.filter(p => p.id === focusedWindow.id)[0]
      if (!pane) return // not part of this grid
      focusedWindow.close()
      state.grid.maxAllPanes()
      const gaps = state.grid.findGaps()
      if (gaps.length > 0) {
        gaps.forEach(g => sGrid.createWindow(
          state.id,
          TerminalWindow,
          Object.assign({}, g, state.winOpts)
        ))
      }
    }
  })
}
