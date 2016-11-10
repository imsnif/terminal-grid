const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubPaneImporterExporter () {
  return proxyquire('../../components/pane-importer-exporter', {
//    '../lib/mode-at-current-window': (modes) => modes[0],
//    electron: {BrowserWindow: {getFocusedWindow: () => ({id})}}
  })
}

// function stubPaneMoverNoMode () {
//   return proxyquire('../../components/pane-mover', {
//     '../lib/mode-at-current-window': (modes) => {}
//   })
// }

test('generalMode.canImport(win): returns true if gaps found in grid', t => {
  t.plan(1)
  try {
    const paneImporterExporter = stubPaneImporterExporter()
    const grid = {findGaps: () => ['I am a gap']}
    const { canImport } = paneImporterExporter.generalMode({grid})
    t.ok(canImport('I am a window'), 'can import pane when there is room in grid')
  } catch (e) {
    t.fail(e)
  }
})

test('generalMode.canImport(win): returns false if gaps not found in grid', t => {
  t.plan(1)
  try {
    const paneImporterExporter = stubPaneImporterExporter()
    const grid = {findGaps: () => []}
    const { canImport } = paneImporterExporter.generalMode({grid})
    t.notOk(canImport('I am a window'), 'cannot import pane when there is no room in grid')
  } catch (e) {
    t.fail(e)
  }
})

test('generalMode.importPane(win, direction): imports pane into a gap equal to the window if available', t => {
  t.plan(1)
  try {
    const paneImporterExporter = stubPaneImporterExporter()
    const winBounds = {x: 500, y: 500, width: 100, height: 100}
    const win = {getBounds: () => winBounds}
    const grid = {
      findGaps: () => [
        {x: 0, y: 0, width: 100, height: 100},
        {x: 100, y: 0, width: 10, height: 10}
      ]
    }
    const sGrid = {
      createWindow: sinon.spy()
    }
    const id = 1
    const { importPane } = paneImporterExporter.generalMode({grid, sGrid, id})
    importPane(win)
    t.ok(
      sGrid.createWindow.calledWith(1, win, {x: 0, y: 0, width: 100, height: 100}),
      'window created in the size and location of appropriate gap'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('generalMode.importPane(win, direction): imports pane by changing its size into smaller gap if none large enough are available', t => {
  t.plan(1)
  try {
    const paneImporterExporter = stubPaneImporterExporter()
    const winBounds = {x: 500, y: 500, width: 100, height: 100}
    const win = {getBounds: () => winBounds}
    const grid = {
      findGaps: () => [
        {x: 0, y: 0, width: 50, height: 50},
        {x: 50, y: 0, width: 10, height: 10}
      ]
    }
    const sGrid = {
      createWindow: sinon.spy()
    }
    const id = 1
    const { importPane } = paneImporterExporter.generalMode({grid, sGrid, id})
    importPane(win)
    t.ok(
      sGrid.createWindow.calledWith(1, win, {x: 0, y: 0, width: 50, height: 50}),
      'window created in the size and location of appropriate gap'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('generalMode.export(win): expels pane from grid', t => {
  t.plan(1)
  try {
    const paneImporterExporter = stubPaneImporterExporter()
    const grid = {expel: sinon.spy()}
    const { exportPane } = paneImporterExporter.generalMode({grid})
    exportPane('I am a paneId')
    t.ok(grid.expel.calledWith('I am a paneId'), 'expel method of grid called')
  } catch (e) {
    t.fail(e)
  }
})
