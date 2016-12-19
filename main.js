'use strict'

const { app, globalShortcut, Menu, Tray } = require('electron')
const path = require('path')
const WinChanger = require('electron-win-changer')
const ScreenGrid = require('screen-grid')
const TerminalWindow = require('electron-terminal-window')
const TmuxMode = require('./lib/tmux-mode')
const GeneralMode = require('./lib/general-mode')
const ModeManager = require('./lib/mode-manager')
const ShortE = require('shorte')

let tray

app.on('ready', () => {
  tray = new Tray(path.join(__dirname, 'icons', 'amoeba.png'))
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Quit', click: () => app.quit()}
  ])
  tray.setToolTip('AmoebaTerm')
  tray.setContextMenu(contextMenu)
  const sGrid = new ScreenGrid()
  const wChanger = new WinChanger()
  const manager = new ModeManager(sGrid, wChanger, TerminalWindow, [GeneralMode, TmuxMode])
  const directions = [
    {shortcut: 'H', directionName: 'left'},
    {shortcut: 'J', directionName: 'down'},
    {shortcut: 'K', directionName: 'up'},
    {shortcut: 'L', directionName: 'right'}
  ]
  const shortcuts = new ShortE(globalShortcut, 'Ctrl+B', {debounceTime: 500, cancel: 'F2'})
  directions.forEach(d => {
    shortcuts.register(`Ctrl+${d.shortcut}`, () => manager.movePanePrimary(d.directionName))
    shortcuts.register(`Ctrl+Shift+${d.shortcut}`, () => manager.movePaneSecondary(d.directionName))
    shortcuts.register(`Alt+${d.shortcut}`, () => manager.increasePaneSize(d.directionName))
    shortcuts.register(`Alt+Shift+${d.shortcut}`, () => manager.decreasePaneSize(d.directionName))
    shortcuts.register(`${d.shortcut}`, () => manager.switchPaneFocus(d.directionName))
  })
  manager.modes.forEach((m, index) => {
    shortcuts.register(`${index}`, () => manager.addPaneMain(index))
    shortcuts.register(`Shift+${index}`, () => manager.addPaneSecondary(index))
  })
  shortcuts.register(`S`, () => manager.switchMode())
  shortcuts.register('X', () => manager.closePane())
  shortcuts.register('Z', () => manager.togglePaneFullSize())
  shortcuts.register('A', () => manager.toggleAllShow())
})

app.on('window-all-closed', () => {}) // keep app open after all windows closed
