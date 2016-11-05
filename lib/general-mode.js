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

function paneMoved (firstPosition, secondPosition) {
  if (
    firstPosition.x === secondPosition.x &&
    firstPosition.y === secondPosition.y &&
    firstPosition.width === secondPosition.width &&
    firstPosition.height === secondPosition.height
  ) return false
  return true
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
    movePaneMain: (direction) => {
      const previousPosition = sGrid.currentPanePosition()
      if (!previousPosition) return // no focused window
      sGrid.maxLoc({[direction]: true}) // TODO: fix sGrid's api
      const currentPosition = sGrid.currentPanePosition()
      if (!paneMoved(previousPosition, currentPosition)) throw new Error('location blocked')
    },
    movePaneSecondary: (direction) => {
      const previousPosition = sGrid.currentPanePosition()
      if (!previousPosition) return // no focused window
      sGrid.changeCurWindow(directionToRelation(direction, state.resizeAmount))
      const currentPosition = sGrid.currentPanePosition()
      if (!paneMoved(previousPosition, currentPosition)) throw new Error('location blocked')
    },
    increasePaneSize: (direction) => sGrid.increaseCurWinSize(direction, state.resizeAmount),
    decreasePaneSize: (direction) => sGrid.decreaseCurWinSize(direction, state.resizeAmount),
    switchPaneFocus: (direction) => sGrid.switchWindow(direction, true),
    closeCurrentPane: () => {
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return
      const pane = state.grid.panes.filter(p => p.id === focusedWindow.id)[0]
      if (!pane) return // not part of this grid
      focusedWindow.close()
    },
    canImport: (win) => {
      const gaps = state.grid.findGaps()
      if (gaps.length > 0) return true
      return false
    },
    importPane: (win, direction) => {
      const gaps = state.grid.findGaps()
      const winBounds = win.getBounds()
      const gapsLargerThanWin = gaps.filter(g => {
        return (
          g.width >= winBounds.width &&
          g.height >= winBounds.height
        )
      })
      if (gapsLargerThanWin.length > 0) {
        const space = gapsLargerThanWin[0]
        sGrid.createWindow(
          state.id,
          win,
          {
            width: winBounds.width,
            height: winBounds.height,
            x: space.x,
            y: space.y
          }
        )
      } else {
        const largestSpace = gaps.sort((a, b) => {
          return (a.width * a.height > b.width * b.height ? 1 : -1)
        })[0]
        sGrid.createWindow(
          state.id,
          win,
          largestSpace
        )
      }
    },
    exportPane: (paneId) => {
      return state.grid.expel(paneId)
    }
  })
}
