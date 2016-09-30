'use strict'

const state = {
  minimized: false
}

const { BrowserWindow } = require('electron')

module.exports = {
  toggleAllShow: function toggleAllShow () {
    const wins = BrowserWindow.getAllWindows()
    if (!state.minimized) {
      minimizeAll()
    } else {
      restoreAll()
    }
  },
  switchWindow: function switchWindow () {
    try {
      const allWindows = BrowserWindow.getAllWindows()
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return allWindows[0].focus()
      const currentIndex = allWindows
        .map(w => w.id)
        .indexOf(focusedWindow.id)
      const lastIndex = allWindows.length - 1
      const nextIndex = currentIndex + 1 > lastIndex
        ? 0
        : currentIndex + 1
      allWindows[nextIndex].focus()
    } catch (e) {
      console.error(e)
    }
  },
  closeWindow: function closeWindow() {
    try {
      const allWindows = BrowserWindow.getAllWindows()
      const focusedWindow = BrowserWindow.getFocusedWindow()
      if (!focusedWindow) return // only close focused window
      focusedWindow.close()
      restoreAll()
      this.switchWindow()
    } catch (e) {
      console.error(e)
    }
  },
}

function minimizeAll() {
  const wins = BrowserWindow.getAllWindows()
  wins.forEach(w => w.minimize())
  state.minimized = !state.minimized
}

function restoreAll() {
  const wins = BrowserWindow.getAllWindows()
  wins.forEach(w => w.restore())
  state.minimized = !state.minimized
}
