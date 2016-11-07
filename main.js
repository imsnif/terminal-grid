'use strict'

const { app, globalShortcut } = require('electron')
const WinChanger = require('electron-win-changer')
const ScreenGrid = require('screen-grid')
const TerminalWindow = require('electron-terminal-window')
const TmuxMode = require('./lib/tmux-mode')
const GeneralMode = require('./lib/general-mode')
const ModeManager = require('./lib/mode-manager')

app.on('ready', () => {
  const sGrid = new ScreenGrid()
  const wChanger = new WinChanger()
  const manager = new ModeManager(sGrid, wChanger, TerminalWindow, [GeneralMode, TmuxMode])
  const directions = [
    {shortcut: 'H', directionName: 'left'},
    {shortcut: 'J', directionName: 'down'},
    {shortcut: 'K', directionName: 'up'},
    {shortcut: 'L', directionName: 'right'}
  ]
  directions.forEach(d => {
    globalShortcut.register(`Super+Ctrl+${d.shortcut}`, () => manager.movePanePrimary(d.directionName))
    globalShortcut.register(`Super+Ctrl+Shift+${d.shortcut}`, () => manager.movePaneSecondary(d.directionName))
    globalShortcut.register(`Super+Alt+${d.shortcut}`, () => manager.increasePaneSize(d.directionName))
    globalShortcut.register(`Super+Alt+Shift+${d.shortcut}`, () => manager.decreasePaneSize(d.directionName))
    globalShortcut.register(`Super+${d.shortcut}`, () => manager.switchPaneFocus(d.directionName))
  })
  manager.modes.forEach((m, index) => {
    globalShortcut.register(`Super+${index}`, () => manager.addPaneMain(index))
    globalShortcut.register(`Super+Shift+${index}`, () => manager.addPaneSecondary(index))
  })
  globalShortcut.register(`Super+S`, () => manager.switchMode())
  globalShortcut.register('Super+X', () => manager.closePane())
  globalShortcut.register('Super+Z', () => manager.togglePaneFullSize())
  globalShortcut.register('Super+A', () => manager.toggleAllShow())
})

app.on('window-all-closed', () => {}) // keep app open after all windows closed
