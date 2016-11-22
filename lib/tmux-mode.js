'use strict'

const assert = require('assert')
const validate = require('validate.js')

const paneImporterExporter = require('../components/pane-importer-exporter')
const paneCloser = require('../components/pane-closer')
const { moveOrThrow } = require('./utils')

const { BrowserWindow } = require('electron')

function fillGapsInGrid (state) {
  state.grid.maxAllPanes()
  const gaps = state.grid.findGaps()
  gaps.forEach(g => state.sGrid.createWindow(
    state.id,
    state.TerminalWindow,
    Object.assign({}, g, state.winOpts)
  ))
}

function getCurrentWindowInGrid (grid) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return
  return (grid.panes.find(p => p.id === focusedWindow.id) || grid.panes[0])
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
    winOpts: {frame: false, skipTaskbar: true, resizable: false},
    resizeAmount: 30,
    minimumPaneSize: {width: 50, height: 50}
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
    addPaneMain: () => {
      const currentWindowInGrid = getCurrentWindowInGrid(state.grid)
      if (!currentWindowInGrid || Math.floor(currentWindowInGrid.width / 2) < state.minimumPaneSize.width) return // no-op
      sGrid.splitWindow(displayId, TerminalWindow, state.winOpts, 'vertical', currentWindowInGrid.id)
    },
    addPaneSecondary: () => {
      const currentWindowInGrid = getCurrentWindowInGrid(state.grid)
      if (!currentWindowInGrid || Math.floor(currentWindowInGrid.height / 2) < state.minimumPaneSize.height) return // no-op
      sGrid.splitWindow(displayId, TerminalWindow, state.winOpts, 'horizontal', currentWindowInGrid.id)
    },
    movePaneMain: (direction) => moveOrThrow(sGrid, () => sGrid.switchWindowContents(direction)),
    movePaneSecondary: () => {},
    increasePaneSize: (direction) => sGrid.increaseAndFillCurWinSize(direction, state.resizeAmount, TerminalWindow, state.winOpts, displayId),
    decreasePaneSize: (direction) => sGrid.decreaseAndFillCurWinSize(direction, state.resizeAmount, TerminalWindow, state.winOpts, displayId),
    switchPaneFocus: (direction) => sGrid.switchWindow(direction, true)
  },
    paneCloser(state, () => fillGapsInGrid(state)),
    paneImporterExporter.tmuxMode(state),
    { constructor: TmuxMode }
  )
}
