'use strict'

const electron = require('electron')

const app = electron.app
const globalShortcut = electron.globalShortcut
const BrowserWindow = electron.BrowserWindow

const Grid = require('grid')
const grid = new Grid(1600, 900)

let curIndex = 0
let id = 1

let minimized = false

function switchWindow() {
  if (curIndex === grid.panes.length - 1) {
    curIndex = 1 // cycle back (first is always taskbar)
  } else {
    curIndex += 1
  }
  grid.panes[curIndex].wrapped.focus()
}

function toggleAllShow() {
  if (minimized) {
    grid.panes.filter(w => w.wrapped && w.wrapped.restore).forEach(w => w.wrapped.restore())
  } else {
    grid.panes.filter(w => w.wrapped && w.wrapped.minimize).forEach(w => w.wrapped.minimize())
  }
  minimized = !minimized
}

function createWindow () {
  try {
    let currentId = id += 1
    grid.add(BrowserWindow, {id: currentId, width: 400, height: 300, frame: false, skipTaskbar: true})
    curIndex = grid.panes.length - 1

    let createdWindow = grid.getPane(currentId)
    createdWindow.wrapped.loadURL(`file://${__dirname}/terminal/index.html`)

    // Open the DevTools.
    // createdWindow.wrapped.webContents.openDevTools()

  } catch (e) {
    console.error(e)
  }
}

function changeCurWindow (params) {
  const curWindow = grid.panes[curIndex]
  if (params.x || params.y) {
    try {
      grid.panes[curIndex].changeLocation(
        params.x ? curWindow.x + parseInt(params.x) : curWindow.x,
        params.y ? curWindow.y + parseInt(params.y) : curWindow.y
      )
    } catch(e) {
      console.error(e)
      // TODO: some visual indication (flash border red?)
    }
  } else { // TODO: support both
    try {
      grid.panes[curIndex].changeSize(
        params.width ? curWindow.width + parseInt(params.width) : curWindow.width,
        params.height ? curWindow.height + parseInt(params.height) : curWindow.height
      )
    } catch(e) {
      console.error(e)
      // TODO: some visual indication (flash border red?)
    }
  }
}

app.on('ready', () => {
  grid.add(null, {id, width: 1600, height: 40}) // taskbar
  createWindow()

  globalShortcut.register('CommandOrControl+W', () => {
    createWindow()
  })
  globalShortcut.register('CommandOrControl+A', toggleAllShow)
  globalShortcut.register('CommandOrControl+Q', switchWindow)
  globalShortcut.register('CommandOrControl+H', changeCurWindow.bind(this, {x: '-10'}))
  globalShortcut.register('CommandOrControl+J', changeCurWindow.bind(this, {y: '10'}))
  globalShortcut.register('CommandOrControl+K', changeCurWindow.bind(this, {y: '-10'}))
  globalShortcut.register('CommandOrControl+L', changeCurWindow.bind(this, {x: '10'}))
  globalShortcut.register('Alt+H', changeCurWindow.bind(this, {width: '-10'}))
  globalShortcut.register('Alt+J', changeCurWindow.bind(this, {height: '10'}))
  globalShortcut.register('Alt+K', changeCurWindow.bind(this, {height: '-10'}))
  globalShortcut.register('Alt+L', changeCurWindow.bind(this, {width: '10'}))
})
