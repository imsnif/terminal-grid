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
    switchPaneFocus: (direction) => sGrid.switchWindow(direction, true),
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
    },
    canImport: (win) => true, // TODO: when we have minimum pane size, we'll have to handle it here
    importPane: (win, direction) => {
      const winBounds = win.getBounds()
      if (direction === 'left') {
        const paneCandidates = state.grid.panes.filter(p => {
          return (
            p.x + p.width === state.grid.width &&
            (
              winBounds.y >= p.y ||
              winBounds.y + winBounds.height <= p.y + p.height
            )
          )
        })
        const largestCandidate = paneCandidates.sort((a, b) => {
          return a.height > b.height ? -1 : 1
        })[0]
        return sGrid.splitCurrentWindow(state.id, win, state.winOpts, 'vertical', largestCandidate.id)
      }
      if (direction === 'up') {
        const paneCandidates = state.grid.panes.filter(p => {
          return (
            p.y + p.height === state.grid.height &&
            (
              winBounds.x >= p.x ||
              winBounds.x + winBounds.width <= p.x + p.width
            )
          )
        })
        const largestCandidate = paneCandidates.sort((a, b) => {
          return a.width > b.width ? -1 : 1
        })[0]
        return sGrid.splitCurrentWindow(state.id, win, state.winOpts, 'vertical', largestCandidate.id)
      }
      if (direction === 'right') {
        const paneCandidates = state.grid.panes.filter(p => {
          return (
            p.x === 0 &&
            (
              winBounds.y >= p.y ||
              winBounds.y + winBounds.height <= p.y + p.height
            )
          )
        })
        const largestCandidate = paneCandidates.sort((a, b) => {
          return a.height > b.height ? -1 : 1
        })[0]
        return sGrid.splitCurrentWindow(state.id, win, state.winOpts, 'horizontal', largestCandidate.id)
      }
      if (direction === 'down') {
        const paneCandidates = state.grid.panes.filter(p => {
          return (
            p.y === 0 &&
            (
              winBounds.x >= p.x ||
              winBounds.x + winBounds.width <= p.x + p.width
            )
          )
        })
        const largestCandidate = paneCandidates.sort((a, b) => {
          return a.width > b.width ? -1 : 1
        })[0]
        return sGrid.splitCurrentWindow(state.id, win, state.winOpts, 'vertical', largestCandidate.id)
      }
    },
    exportPane: (paneId) => {
      const win = state.grid.expel(paneId)
      state.grid.maxAllPanes()
      const gaps = state.grid.findGaps()
      if (gaps.length > 0) {
        gaps.forEach(g => sGrid.createWindow(
          state.id,
          TerminalWindow,
          Object.assign({}, g, state.winOpts)
        ))
      }
      return win
    }
  })
}
