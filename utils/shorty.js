const electron = require('electron')
const globalShortcut = electron.globalShortcut

const shortcuts = {}

function cbWrapper (cb) {
  return function () {
    cb()
    globalShortcut.unregisterAll()
    Object.keys(shortcuts).forEach(s => {
      globalShortcut.register(s, switchSet(shortcuts[s]))
    })
  }
}

function switchSet (actions) {
  return () => {
    globalShortcut.unregisterAll()
    actions.forEach(action => {
      globalShortcut.register(action.accelerator, action.cb)
    })
    globalShortcut.register('Esc', reset)
  }
}

function reset () {
  globalShortcut.unregisterAll()
  Object.keys(shortcuts).forEach(s => {
    globalShortcut.register(s, switchSet(shortcuts[s]))
  })
}

module.exports = {
  register: function(primaryAccelerator, secondaryAccelerator, cb) {
    shortcuts[primaryAccelerator] = shortcuts[primaryAccelerator] || []
    shortcuts[primaryAccelerator].push({accelerator: secondaryAccelerator, cb})
    globalShortcut.register(primaryAccelerator, switchSet(shortcuts[primaryAccelerator]))
  }
}
