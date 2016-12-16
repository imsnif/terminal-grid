'use strict'

const { paneIsOnScreenEdge, paneOccupiesSameSpaceAtDirection } = require('../lib/utils')

module.exports = {
  generalMode: (state) => ({
    canImport: (win) => {
      const gaps = state.grid.findGaps()
      if (gaps.length > 0) return true
      return false
    },
    importPane: (win, direction) => {
      const gaps = state.grid.findGaps()
      const winBounds = win.getBounds()
      const gapsLargerThanWin = gaps.filter(g =>
        g.width >= winBounds.width &&
        g.height >= winBounds.height
      )
      const largestGap = gaps.sort((a, b) =>
        a.width * a.height > b.width * b.height ? -1 : 1
      )[0]
      state.sGrid.createWindow(
        state.id,
        win,
        Object.assign({}, winBounds,
          gapsLargerThanWin.length > 0
            ? {x: gapsLargerThanWin[0].x, y: gapsLargerThanWin[0].y}
            : largestGap
        ),
        state.listeners
      )
    },
    exportPane: (paneId) => state.grid.expel(paneId)
  }),
  tmuxMode: (state) => ({
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
      return state.sGrid.splitWindow(state.id, win, state.winOpts, splitAxis, largestCandidate.id, state.listeners)
    },
    exportPane: (paneId) => {
      const win = state.grid.expel(paneId)
      state.grid.maxAllPanes()
      const gaps = state.grid.findGaps()
      gaps.forEach(g => state.sGrid.createWindow(
        state.id,
        state.TerminalWindow,
        Object.assign({}, g, state.winOpts),
        state.listeners
      ))
      return win
    }
  })
}
