'use strict'

const { BrowserWindow } = require('electron')

const assert = require('assert')
const validate = require('validate.js')

function directionToRelation (direction, amount) {
  // TODO: remove this and fix sGrid's api
  if (direction === 'left') return {x: `${-amount}`}
  if (direction === 'right') return {x: amount}
  if (direction === 'up') return {y: `-${amount}`}
  if (direction === 'down') return {y: amount}
}

module.exports = function GeneralMode (displayId, sGrid, wChanger, TerminalWindow) {
  const grid = sGrid.grids.filter(g => g.id === displayId)[0]
  assert(validate.isDefined(grid), `grid with id ${displayId} not found`)
  let state = {
    grid,
    id: displayId,
    winOpts: {frame: false, skipTaskbar: true},
    smallWindowSize: {width: 400, height: 500},
    largeWindowSize: {width: 600, height: 800},
    resizeAmount: 30
  }
  return Object.assign(state, {
    addPaneMain: () => sGrid.createWindow(displayId, TerminalWindow, Object.assign({}, state.winOpts, state.smallWindowSize)),
    addPaneSecondary: () => sGrid.createWindow(displayId, TerminalWindow, Object.assign({}, state.winOpts, state.largeWindowSize)),
    movePaneMain: (direction) => sGrid.maxLoc({[direction]: true}), // TODO: fix sGrid's api
    movePaneSecondary: (direction) => sGrid.changeCurWindow(directionToRelation(direction, state.resizeAmount)),
    increasePaneSize: (direction) => sGrid.increaseCurWinSize(direction, state.resizeAmount),
    decreasePaneSize: (direction) => sGrid.decreaseCurWinSize(direction, state.resizeAmount),
    switchPaneFocus: (direction) => sGrid.switchWindow(direction),
    closeCurrentPane: () => {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return
      const pane = state.grid.panes.filter(p => p.id === focusedWindow.id)[0]
      if (!pane) return // not part of this grid
      focusedWindow.close()
    }
  })
}
