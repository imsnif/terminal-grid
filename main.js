'use strict'

const { app, globalShortcut, BrowserWindow } = require('electron')
const WinChanger = require('electron-win-changer')
const ScreenGrid = require('screen-grid')
const TerminalWindow = require('electron-terminal-window')

function closeCurrentWindow () {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // only close focused window
  focusedWindow.close()
}

function winParams () {
  return {
    width: 400,
    height: 300,
    frame: false,
    skipTaskbar: true
  }
}

app.on('ready', () => {
  const sGrid = new ScreenGrid()
  const wChanger = new WinChanger()
  tmuxMode(sGrid, wChanger)
})

function tmuxMode (sGrid, wChanger) {
  sGrid.createWindow(0, TerminalWindow, {maxSize: true, frame: false, skipTaskbar: true})
  globalShortcut.register('Super+0', () => sGrid.splitCurrentWindow(0, TerminalWindow, {frame: false, skipTaskbar: true}, 'vertical'))
  globalShortcut.register('Super+Shift+0', () => sGrid.splitCurrentWindow(0, TerminalWindow, {frame: false, skipTaskbar: true}, 'horizontal'))
  globalShortcut.register('Super+L', () => sGrid.switchWindow('right'))
  globalShortcut.register('Super+H', () => sGrid.switchWindow('left'))
  globalShortcut.register('Super+J', () => sGrid.switchWindow('down'))
  globalShortcut.register('Super+K', () => sGrid.switchWindow('up'))
}

function generalMode (sGrid, wChanger) {
  globalShortcut.register('Super+0', () => sGrid.createWindow(0, TerminalWindow, winParams()))
  globalShortcut.register('Super+1', () => sGrid.createWindow(1, TerminalWindow, winParams()))
  globalShortcut.register('Super+2', () => sGrid.createWindow(2, TerminalWindow, winParams()))
  globalShortcut.register('Super+3', () => sGrid.createWindow(3, TerminalWindow, winParams()))
  globalShortcut.register('Super+4', () => sGrid.createWindow(4, TerminalWindow, winParams()))
  globalShortcut.register('Super+5', () => sGrid.createWindow(5, TerminalWindow, winParams()))
  globalShortcut.register('Super+6', () => sGrid.createWindow(6, TerminalWindow, winParams()))
  globalShortcut.register('Super+7', () => sGrid.createWindow(7, TerminalWindow, winParams()))
  globalShortcut.register('Super+8', () => sGrid.createWindow(8, TerminalWindow, winParams()))
  globalShortcut.register('Super+9', () => sGrid.createWindow(9, TerminalWindow, winParams()))

  globalShortcut.register('Super+A', () => wChanger.toggleAllShow())
  globalShortcut.register('Super+Q', () => wChanger.switchWindow())
  globalShortcut.register('Super+X', () => closeCurrentWindow())
  globalShortcut.register('Super+CommandOrControl+H', () => sGrid.changeCurWindow({x: '-30'}))
  globalShortcut.register('Super+CommandOrControl+J', () => sGrid.changeCurWindow({y: '30'}))
  globalShortcut.register('Super+CommandOrControl+K', () => sGrid.changeCurWindow({y: '-30'}))
  globalShortcut.register('Super+CommandOrControl+L', () => sGrid.changeCurWindow({x: '30'}))
  globalShortcut.register('Super+Alt+Shift+H', () => sGrid.decreaseCurWinSize('left', 30))
  globalShortcut.register('Super+Alt+Shift+J', () => sGrid.decreaseCurWinSize('down', 30))
  globalShortcut.register('Super+Alt+Shift+K', () => sGrid.decreaseCurWinSize('up', 30))
  globalShortcut.register('Super+Alt+Shift+L', () => sGrid.decreaseCurWinSize('right', 30))
  globalShortcut.register('Super+Alt+H', () => sGrid.changeCurWindow({width: '-30'}))
  globalShortcut.register('Super+Alt+J', () => sGrid.changeCurWindow({height: '30'}))
  globalShortcut.register('Super+Alt+K', () => sGrid.changeCurWindow({height: '-30'}))
  globalShortcut.register('Super+Alt+L', () => sGrid.changeCurWindow({width: '30'}))
  globalShortcut.register('Super+Shift+J', () => sGrid.maxSize({down: true}))
  globalShortcut.register('Super+Shift+K', () => sGrid.maxSize({up: true}))
  globalShortcut.register('Super+Shift+L', () => sGrid.maxSize({right: true}))
  globalShortcut.register('Super+Shift+H', () => sGrid.maxSize({left: true}))
  globalShortcut.register('Super+H', () => sGrid.maxLoc({left: true}))
  globalShortcut.register('Super+J', () => sGrid.maxLoc({down: true}))
  globalShortcut.register('Super+K', () => sGrid.maxLoc({up: true}))
  globalShortcut.register('Super+L', () => sGrid.maxLoc({right: true}))
}

app.on('window-all-closed', () => {}) // keep app open after all windows closed
