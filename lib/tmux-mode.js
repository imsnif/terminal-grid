'use strict'

const { BrowserWindow } = require('electron')

const assert = require('assert')
const validate = require('validate.js')

const paneImporterExporter = require('../components/pane-importer-exporter')

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

function fillGapsInGrid (state) {
  state.grid.maxAllPanes()
  const gaps = state.grid.findGaps()
  gaps.forEach(g => state.sGrid.createWindow(
    state.id,
    state.TerminalWindow,
    Object.assign({}, g, state.winOpts)
  ))
}

module.exports = function TmuxMode (displayId, sGrid, wChanger, TerminalWindow) {
  const grid = sGrid.grids.filter(g => g.id === displayId)[0]
  assert(validate.isDefined(grid), `grid with id ${displayId} not found`)
  let state = {
    sGrid,
    wChanger,
    TerminalWindow,
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
    movePaneMain: (direction) => moveOrThrow(sGrid, direction, () => sGrid.switchWindowContents(direction)),
    movePaneSecondary: () => {},
    increasePaneSize: (direction) => sGrid.increaseAndFillCurWinSize(direction, state.resizeAmount),
    decreasePaneSize: (direction) => sGrid.decreaseAndFillCurWinSize(direction, state.resizeAmount),
    switchPaneFocus: (direction) => sGrid.switchWindow(direction, true),
    closeCurrentPane: () => {
      closeFocusedPaneInGrid(state.grid)
      fillGapsInGrid(state)
    }
  }, paneImporterExporter.tmuxMode(state))
}
