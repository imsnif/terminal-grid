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
  // generalMode(sGrid, wChanger)
  tmuxMode(sGrid, wChanger)
})

function tmuxMode (sGrid, wChanger) {
  sGrid.createWindow(0, TerminalWindow, {maxSize: true, frame: false, skipTaskbar: true, fillOnClose: true})
  // TODO: if there are no windows, super+0 should create one
  globalShortcut.register('Super+0', () => sGrid.splitCurrentWindow(0, TerminalWindow, {frame: false, skipTaskbar: true, fillOnClose: true}, 'vertical'))
  globalShortcut.register('Super+Shift+0', () => sGrid.splitCurrentWindow(0, TerminalWindow, {frame: false, skipTaskbar: true, fillOnClose: true}, 'horizontal'))
  globalShortcut.register('Super+L', () => sGrid.switchWindow('right'))
  globalShortcut.register('Super+H', () => sGrid.switchWindow('left'))
  globalShortcut.register('Super+J', () => sGrid.switchWindow('down'))
  globalShortcut.register('Super+K', () => sGrid.switchWindow('up'))
  globalShortcut.register('Super+Alt+Shift+L', () => sGrid.increaseAndFillCurWinSize('right', 30))
  globalShortcut.register('Super+Alt+Shift+H', () => sGrid.increaseAndFillCurWinSize('left', 30))
  globalShortcut.register('Super+Alt+Shift+J', () => sGrid.increaseAndFillCurWinSize('down', 30))
  globalShortcut.register('Super+Alt+Shift+K', () => sGrid.increaseAndFillCurWinSize('up', 30))
  globalShortcut.register('Super+Alt+L', () => sGrid.decreaseAndFillCurWinSize('right', 30))
  globalShortcut.register('Super+Alt+H', () => sGrid.decreaseAndFillCurWinSize('left', 30))
  globalShortcut.register('Super+Alt+J', () => sGrid.decreaseAndFillCurWinSize('down', 30))
  globalShortcut.register('Super+Alt+K', () => sGrid.decreaseAndFillCurWinSize('up', 30))
  globalShortcut.register('Super+X', () => closeCurrentWindow())
  globalShortcut.register('Super+Z', () => sGrid.toggleCurrentWinFullSize())
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
  globalShortcut.register('Super+Alt+H', () => sGrid.decreaseCurWinSize('left', 30))
  globalShortcut.register('Super+Alt+J', () => sGrid.decreaseCurWinSize('down', 30))
  globalShortcut.register('Super+Alt+K', () => sGrid.decreaseCurWinSize('up', 30))
  globalShortcut.register('Super+Alt+L', () => sGrid.decreaseCurWinSize('right', 30))
  globalShortcut.register('Super+Alt+Shift+H', () => sGrid.increaseCurWinSize('left', 30))
  globalShortcut.register('Super+Alt+Shift+J', () => sGrid.increaseCurWinSize('down', 30))
  globalShortcut.register('Super+Alt+Shift+K', () => sGrid.increaseCurWinSize('up', 30))
  globalShortcut.register('Super+Alt+Shift+L', () => sGrid.increaseCurWinSize('right', 30))
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
