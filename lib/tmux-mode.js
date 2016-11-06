'use strict'

const { BrowserWindow } = require('electron')

const assert = require('assert')
const validate = require('validate.js')

function paneMoved (firstPosition, secondPosition) {
  if (
    firstPosition.x === secondPosition.x &&
    firstPosition.y === secondPosition.y &&
    firstPosition.width === secondPosition.width &&
    firstPosition.height === secondPosition.height
  ) return false
  return true
}

function paneIsOnScreenEdge (pane, grid, direction) {
  if (direction === 'left' && pane.x + pane.width === grid.width) return true
  if (direction === 'up' && pane.y + pane.height === grid.height) return true
  if (direction === 'right' && pane.x === 0) return true
  if (direction === 'up' && pane.y === 0) return true
  return false
}

function paneOccupiesSameSpaceAtDirection (pane, winBounds, direction) {
  if (
    direction === 'left' &&
    winBounds.y >= pane.y ||
    winBounds.y + winBounds.height <= pane.y + pane.height
  ) return true
  if (
    direction === 'up' &&
    winBounds.x >= pane.x ||
    winBounds.x + winBounds.width <= pane.x + pane.width
  ) return true
  if (
    direction === 'right' &&
    winBounds.y >= pane.y ||
    winBounds.y + winBounds.height <= pane.y + pane.height
  ) return true
  if (
    direction === 'down' &&
    winBounds.x >= pane.x ||
    winBounds.x + winBounds.width <= pane.x + pane.width
  ) return true
  return false
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
    },
    canImport: (win) => true, // TODO: when we have minimum pane size, we'll have to handle it here
    importPane: (win, direction) => {
      const winBounds = win.getBounds()
      const splitAxis = direction === 'left' || direction === 'right'
        ? 'horizontal'
        : 'vertical'
      const largestCandidate = state.grid.panes.filter(p =>
        paneIsOnScreenEdge(p, state.grid, direction) &&
        paneOccupiesSameSpaceAtDirection(p, winBounds, direction)
      )
      .sort((a, b) => {
        return direction === 'left' || direction === 'right'
          ? a.height > b.height ? -1 : 1
          : a.width > b.width ? -1 : 1
      })[0]
      return sGrid.splitCurrentWindow(state.id, win, state.winOpts, splitAxis, largestCandidate.id)
    },
    exportPane: (paneId) => {
      const win = state.grid.expel(paneId)
      state.grid.maxAllPanes()
      const gaps = state.grid.findGaps()
      gaps.forEach(g => sGrid.createWindow(
        state.id,
        TerminalWindow,
        Object.assign({}, g, state.winOpts)
      ))
      return win
    }
  })
}
