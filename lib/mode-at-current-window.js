const { BrowserWindow } = require('electron')

module.exports = function modeAtCurrentWindow (modes) {
  const focusedWindow = BrowserWindow.getFocusedWindow()
  if (!focusedWindow) return // no-op
  return modes.filter(m => m.grid.panes.some(p => p.id === focusedWindow.id))[0]
}
