'use strict'

const { app, globalShortcut, BrowserWindow } = require('electron')
const WinChanger = require('electron-win-changer')
const ScreenGrid = require('screen-grid')
const TerminalWindow = require('electron-terminal-window')
const TmuxMode = require('./lib/tmux-mode')
const GeneralMode = require('./lib/general-mode')

function closeCurrentWindow () {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // only close focused window
  focusedWindow.close()
}

function modeAtCurrentWindow (modes, action) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // no-op
  const mode = modes.filter(m => m.grid.panes.some(p => p.id === focusedWindow.id))[0]
  if (!mode) return // no-op
  return action(mode)
}

function currentPaneMoved (previousPosition, currentPosition) {
  if (
    previousPosition.x === currentPosition.x &&
    previousPosition.y === currentPosition.y &&
    previousPosition.width === currentPosition.width &&
    previousPosition.height === currentPosition.height
  ) return true
  return false
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

app.on('ready', () => {
  const sGrid = new ScreenGrid()
  const wChanger = new WinChanger()
  const modes = sGrid.grids.map((g, index) => index % 2
    ? new GeneralMode(g.id, sGrid, wChanger, TerminalWindow)
    : new TmuxMode(g.id, sGrid, wChanger, TerminalWindow) // TODO: get config from outside, until then - these can be switched around manually as needed
  )
  const directions = [
    {shortcut: 'H', directionName: 'left'},
    {shortcut: 'J', directionName: 'down'},
    {shortcut: 'K', directionName: 'up'},
    {shortcut: 'L', directionName: 'right'}
  ]
  directions.forEach(d => {
    globalShortcut.register(`Super+Ctrl+${d.shortcut}`, () => modeAtCurrentWindow(modes, (currentMode) => {
      const previousPosition = sGrid.currentPanePosition()
      if (!previousPosition) return // no focused window
      currentMode.movePaneMain(d.directionName)
      const currentPosition = sGrid.currentPanePosition()
      if (!paneMoved(previousPosition, currentPosition)) { // TODO: movePane should throw, and then we won't need this
        const adjacentGrid = sGrid.adjacentGrids[currentMode.grid.id][d.directionName]
        if (!adjacentGrid) return console.error('no grid found :(')
        const focusedWindow = BrowserWindow.getFocusedWindow()
        if (!focusedWindow) return // TODO: movePane should throw, and then we won't need this
        const adjacentGridMode = modes.filter(m => m.id === adjacentGrid.id)[0]
        if (adjacentGridMode.canImport(focusedWindow)) {
          const pane = currentMode.exportPane(focusedWindow.id)
          adjacentGridMode.importPane(pane, d.directionName)
        }
      }
    }))
    globalShortcut.register(`Super+Ctrl+Shift+${d.shortcut}`, () => modeAtCurrentWindow(modes, (m) => m.movePaneSecondary(d.directionName)))
    globalShortcut.register(`Super+Alt+${d.shortcut}`, () => modeAtCurrentWindow(modes, (m) => m.increasePaneSize(d.directionName)))
    globalShortcut.register(`Super+Alt+Shift+${d.shortcut}`, () => modeAtCurrentWindow(modes, (m) => m.decreasePaneSize(d.directionName)))
    globalShortcut.register(`Super+${d.shortcut}`, () => modeAtCurrentWindow(modes, (m) => m.switchPaneFocus(d.directionName)))
  })
  modes.forEach((m, index) => {
    globalShortcut.register(`Super+${index}`, m.addPaneMain)
    globalShortcut.register(`Super+Shift+${index}`, m.addPaneSecondary)
  })
  globalShortcut.register('Super+X', () => modeAtCurrentWindow(modes, (m) => m.closeCurrentPane()))
  globalShortcut.register('Super+Z', () => sGrid.toggleCurrentWinFullSize())
  globalShortcut.register('Super+A', () => wChanger.toggleAllShow())
})

app.on('window-all-closed', () => {}) // keep app open after all windows closed
