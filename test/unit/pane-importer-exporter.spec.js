const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubPaneImporterExporter () {
  return proxyquire('../../components/pane-importer-exporter', {
    '../lib/utils': {
      paneIsOnScreenEdge: (pane) => pane.onScreenEdge,
      paneOccupiesSameSpaceAtDirection: (pane) => pane.occupiesSameSpaceAtDirection
    }
  })
}

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

test('tmuxMode.canImport(win): returns true', t => {
  t.plan(1)
  try {
    const paneImporterExporter = stubPaneImporterExporter()
    const { canImport } = paneImporterExporter.tmuxMode()
    t.ok(canImport('I am a window'), 'can always import pane')
  } catch (e) {
    t.fail(e)
  }
})

test('tmuxMode.importPane(win, direction): splits largest pane horizontally when importing left', t => {
  t.plan(1)
  try {
    const grid = {
      panes: [
        {id: 1, onScreenEdge: false},
        {id: 2, onScreenEdge: true, occupiesSameSpaceAtDirection: false},
        {id: 3, onScreenEdge: true, occupiesSameSpaceAtDirection: true, height: 10},
        {id: 4, onScreenEdge: true, occupiesSameSpaceAtDirection: true, height: 20}
      ]
    }
    const sGrid = {splitCurrentWindow: sinon.spy()}
    const id = 1
    const winOpts = 2
    const paneImporterExporter = stubPaneImporterExporter()
    const win = {id: 'I am a window', getBounds: () => {}}
    const { importPane } = paneImporterExporter.tmuxMode({grid, sGrid, id, winOpts})
    importPane(win, 'left')
    t.ok(
      sGrid.splitCurrentWindow.calledWith(1, win, 2, 'horizontal', 4),
      'current window split with imported window inserted'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('tmuxMode.importPane(win, direction): splits largest pane horizontally when importing right', t => {
  t.plan(1)
  try {
    const grid = {
      panes: [
        {id: 1, onScreenEdge: false},
        {id: 2, onScreenEdge: true, occupiesSameSpaceAtDirection: false},
        {id: 3, onScreenEdge: true, occupiesSameSpaceAtDirection: true, height: 10},
        {id: 4, onScreenEdge: true, occupiesSameSpaceAtDirection: true, height: 20}
      ]
    }
    const sGrid = {splitCurrentWindow: sinon.spy()}
    const id = 1
    const winOpts = 2
    const paneImporterExporter = stubPaneImporterExporter()
    const win = {id: 'I am a window', getBounds: () => {}}
    const { importPane } = paneImporterExporter.tmuxMode({grid, sGrid, id, winOpts})
    importPane(win, 'right')
    t.ok(
      sGrid.splitCurrentWindow.calledWith(1, win, 2, 'horizontal', 4),
      'current window split with imported window inserted'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('tmuxMode.importPane(win, direction): splits largest pane vertically when importing up', t => {
  t.plan(1)
  try {
    const grid = {
      panes: [
        {id: 1, onScreenEdge: false},
        {id: 2, onScreenEdge: true, occupiesSameSpaceAtDirection: false},
        {id: 3, onScreenEdge: true, occupiesSameSpaceAtDirection: true, width: 10},
        {id: 4, onScreenEdge: true, occupiesSameSpaceAtDirection: true, width: 20}
      ]
    }
    const sGrid = {splitCurrentWindow: sinon.spy()}
    const id = 1
    const winOpts = 2
    const paneImporterExporter = stubPaneImporterExporter()
    const win = {id: 'I am a window', getBounds: () => {}}
    const { importPane } = paneImporterExporter.tmuxMode({grid, sGrid, id, winOpts})
    importPane(win, 'up')
    t.ok(
      sGrid.splitCurrentWindow.calledWith(1, win, 2, 'vertical', 4),
      'current window split with imported window inserted'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('tmuxMode.importPane(win, direction): splits largest pane vertically when importing down', t => {
  t.plan(1)
  try {
    const grid = {
      panes: [
        {id: 1, onScreenEdge: false},
        {id: 2, onScreenEdge: true, occupiesSameSpaceAtDirection: false},
        {id: 3, onScreenEdge: true, occupiesSameSpaceAtDirection: true, width: 10},
        {id: 4, onScreenEdge: true, occupiesSameSpaceAtDirection: true, width: 20}
      ]
    }
    const sGrid = {splitCurrentWindow: sinon.spy()}
    const id = 1
    const winOpts = 2
    const paneImporterExporter = stubPaneImporterExporter()
    const win = {id: 'I am a window', getBounds: () => {}}
    const { importPane } = paneImporterExporter.tmuxMode({grid, sGrid, id, winOpts})
    importPane(win, 'down')
    t.ok(
      sGrid.splitCurrentWindow.calledWith(1, win, 2, 'vertical', 4),
      'current window split with imported window inserted'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('tmuxMode.exportPane(paneId): returns pane, maxes all windows and fills gaps', t => {
  t.plan(5)
  try {
    const win = 'I am a window'
    const grid = {
      maxAllPanes: sinon.spy(),
      expel: (paneId) => paneId === 1 ? win : 'I am not win!',
      findGaps: () => [{gap: 'gap1'}, {gap: 'gap2'}]
    }
    const sGrid = {createWindow: sinon.spy()}
    const id = 1
    const winOpts = {winOpts: 'I am some winOpts!'}
    const TerminalWindow = 'I am a TerminalWindow'
    const paneImporterExporter = stubPaneImporterExporter()
    const { exportPane } = paneImporterExporter.tmuxMode({grid, sGrid, id, winOpts, TerminalWindow})
    const exportedWin = exportPane(1)
    const firstCall = sGrid.createWindow.getCall(0)
    const secondCall = sGrid.createWindow.getCall(1)
    t.equals(exportedWin, win, 'win returned from export method')
    t.ok(grid.maxAllPanes.calledOnce, 'max all panes called when window exported')
    t.ok(grid.maxAllPanes.calledBefore(sGrid.createWindow), 'max all panes called before filling gaps')
    t.ok(
      firstCall.calledWith(1, TerminalWindow, {gap: 'gap1', winOpts: 'I am some winOpts!'}),
      'first gap filled'
    )
    t.ok(
      secondCall.calledWith(1, TerminalWindow, {gap: 'gap2', winOpts: 'I am some winOpts!'}),
      'second gap filled'
    )
  } catch (e) {
    t.fail(e)
  }
})
