'use strict'

const { BrowserWindow } = require('electron')

const assert = require('assert')
const validate = require('validate.js')
const paneImporterExporter = require('../components/pane-importer-exporter')

function directionToRelation (direction, amount) {
  // TODO: remove this and fix sGrid's api
  if (direction === 'left') return {x: `${-amount}`}
  if (direction === 'right') return {x: amount}
  if (direction === 'up') return {y: `-${amount}`}
  if (direction === 'down') return {y: amount}
}

function paneMoved (firstPosition, secondPosition) {
  if (
    firstPosition.x === secondPosition.x &&
    firstPosition.y === secondPosition.y &&
    firstPosition.width === secondPosition.width &&
    firstPosition.height === secondPosition.height
  ) return false
  return true
}

function moveOrThrow (sGrid, direction, move) {
  const previousPosition = sGrid.currentPanePosition()
  if (!previousPosition) return // no focused window
  move()
  const currentPosition = sGrid.currentPanePosition()
  if (!paneMoved(previousPosition, currentPosition)) throw new Error('location blocked')
}

function closeFocusedPaneInGrid (grid) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return
  const pane = grid.panes.filter(p => p.id === focusedWindow.id)[0]
  if (!pane) return // not part of this grid
  focusedWindow.close()
}

module.exports = function GeneralMode (displayId, sGrid, wChanger, TerminalWindow) {
  const grid = sGrid.grids.filter(g => g.id === displayId)[0]
  assert(validate.isDefined(grid), `grid with id ${displayId} not found`)
  let state = {
    sGrid,
    wChanger,
    TerminalWindow,
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
    movePaneMain: (direction) => moveOrThrow(sGrid, direction, () => sGrid.maxLoc({[direction]: true})), // TODO: fix sGrid's api
    movePaneSecondary: (direction) => moveOrThrow(sGrid, direction, () => sGrid.changeCurWindow(directionToRelation(direction, state.resizeAmount))),
    increasePaneSize: (direction) => sGrid.increaseCurWinSize(direction, state.resizeAmount),
    decreasePaneSize: (direction) => sGrid.decreaseCurWinSize(direction, state.resizeAmount),
    switchPaneFocus: (direction) => sGrid.switchWindow(direction, true),
    closeCurrentPane: () => closeFocusedPaneInGrid(state.grid)
  },
    paneImporterExporter.generalMode(state)
  )
}
