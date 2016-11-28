'use strict'
const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

function stubTmuxMode (moveOrThrow, paneCloser, focusedPane) {
  const paneCloserAction = !paneCloser
    ? () => { return {fakecloserMethod: 1} }
    : paneCloser
  const listeners = {listeners: 'listeners'}
  return proxyquire('../../lib/tmux-mode', {
    '../components/pane-importer-exporter': {tmuxMode: () => ({fakeImporterExporterMethod: 1})},
    '../components/pane-closer': paneCloserAction,
    '../lib/listeners': listeners,
    './utils': {moveOrThrow},
    'electron': {BrowserWindow: {getFocusedWindow: () => focusedPane}}
  })
}

test('TmuxMode state constructed properly', t => {
  t.plan(9)
  const TmuxMode = stubTmuxMode()
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: ['pane1', 'pane2'], maxAllPanes: sinon.spy()},
      {id: 2, panes: ['pane1', 'pane2'], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  t.equals(mode.id, displayId, 'state id set to displayId')
  t.deepEquals(mode.sGrid, sGrid, 'sGrid placed in state')
  t.equals(mode.wChanger, wChanger, 'wChanger placed in state')
  t.equals(mode.TerminalWindow, TerminalWindow, 'TerminalWindow placed in state')
  t.equals(mode.grid, sGrid.grids[0], 'proper grid placed in state')
  t.deepEquals(
    mode.winOpts,
    {frame: false, skipTaskbar: true, resizable: false},
    'proper win defaults placed in state'
  )
  t.equals(mode.resizeAmount, 30, 'proper resize amount defaults placed in state')
  t.ok(sGrid.grids[0].maxAllPanes.calledOnce, 'relevant grid had all its panes maxed')
  t.ok(sGrid.grids[1].maxAllPanes.notCalled, 'other grid did not have all its panes maxed')
})

test('TmuxMode state constructed properly with no existing panes', t => {
  t.plan(10)
  const TmuxMode = stubTmuxMode()
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  t.equals(mode.id, displayId, 'state id set to displayId')
  t.deepEquals(mode.sGrid, sGrid, 'sGrid placed in state')
  t.equals(mode.wChanger, wChanger, 'wChanger placed in state')
  t.equals(mode.TerminalWindow, TerminalWindow, 'TerminalWindow placed in state')
  t.equals(mode.grid, sGrid.grids[0], 'proper grid placed in state')
  t.deepEquals(
    mode.winOpts,
    {frame: false, skipTaskbar: true, resizable: false},
    'proper win defaults placed in state'
  )
  t.equals(mode.resizeAmount, 30, 'proper resize amount defaults placed in state')
  t.ok(sGrid.grids[0].maxAllPanes.calledOnce, 'relevant grid had all its panes maxed')
  t.ok(sGrid.grids[1].maxAllPanes.notCalled, 'other grid did not have all its panes maxed')
  t.ok(
    sGrid.createWindow.calledWith(
      displayId,
      TerminalWindow,
      Object.assign({}, mode.winOpts, {maxSize: true}),
      {listeners: 'listeners'}
    ),
    'window created full size'
  )
})

test('TmuxMode addPaneMain', t => {
  t.plan(1)
  const focusedPane = {id: 1, width: 1000, height: 1000, x: 0, y: 0}
  const TmuxMode = stubTmuxMode(null, null, focusedPane)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [focusedPane], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    splitWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneMain()
  t.ok(sGrid.splitWindow.calledWith(
    1,
    'TerminalWindow',
    { frame: false, skipTaskbar: true, resizable: false },
    'vertical', 1, {listeners: 'listeners'}
  ), 'addPaneMain calls splitWindow mehtod of sGrid vertically')
})

test('TmuxMode addPaneMain does not split window below minimum', t => {
  t.plan(1)
  const focusedPane = {id: 1, width: 60, height: 1000, x: 0, y: 0}
  const TmuxMode = stubTmuxMode(null, null, focusedPane)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [focusedPane], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    splitWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneMain()
  t.ok(sGrid.splitWindow.notCalled, 'no-op')
})

test('TmuxMode addPaneMain no op when no focused window', t => {
  t.plan(1)
  const focusedPane = null
  const TmuxMode = stubTmuxMode(null, null, focusedPane)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [focusedPane], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    splitWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneMain()
  t.ok(sGrid.splitWindow.notCalled, 'no-op')
})

test('TmuxMode addPaneMain with focused window outside screen', t => {
  t.plan(1)
  const focusedPane = {id: 1, width: 1000, height: 1000, x: 0, y: 0}
  const nonFocusedPane = {id: 2, width: 1000, height: 1000, x: 0, y: 0}
  const TmuxMode = stubTmuxMode(null, null, focusedPane)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [nonFocusedPane], maxAllPanes: sinon.spy()},
      {id: 2, panes: [focusedPane], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    splitWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneMain()
  t.ok(sGrid.splitWindow.calledWith(
    1,
    'TerminalWindow',
    { frame: false, skipTaskbar: true, resizable: false },
    'vertical',
    2
  ), 'addPaneMain calls splitWindow mehtod with an id inside its screen of focus is outside of it')
})

test('TmuxMode addPaneSecondary', t => {
  t.plan(1)
  const focusedPane = {id: 1, width: 1000, height: 1000, x: 0, y: 0}
  const TmuxMode = stubTmuxMode(null, null, focusedPane)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [focusedPane], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    splitWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneSecondary()
  t.ok(sGrid.splitWindow.calledWith(
    1,
    'TerminalWindow',
    { frame: false, skipTaskbar: true, resizable: false },
    'horizontal',
    1,
    {listeners: 'listeners'}
  ), 'addPaneSecondary calls splitWindow mehtod of sGrid vertically')
})

test('TmuxMode addPaneSecondary does not split window below minimum', t => {
  t.plan(1)
  const focusedPane = {id: 1, width: 1000, height: 60, x: 0, y: 0}
  const TmuxMode = stubTmuxMode(null, null, focusedPane)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [focusedPane], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    splitWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneSecondary()
  t.ok(sGrid.splitWindow.notCalled, 'no-op')
})

test('TmuxMode addPaneSecondary no-op when no focused window', t => {
  t.plan(1)
  const focusedPane = null
  const TmuxMode = stubTmuxMode(null, null, focusedPane)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [focusedPane], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    splitWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneSecondary()
  t.ok(sGrid.splitWindow.notCalled, 'no-op')
})

test('TmuxMode addPaneSecondary with focused window outside screen', t => {
  t.plan(1)
  const focusedPane = {id: 1, width: 1000, height: 1000, x: 0, y: 0}
  const nonFocusedPane = {id: 2, width: 1000, height: 1000, x: 0, y: 0}
  const TmuxMode = stubTmuxMode(null, null, focusedPane)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [nonFocusedPane], maxAllPanes: sinon.spy()},
      {id: 2, panes: [focusedPane], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    splitWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneSecondary()
  t.ok(sGrid.splitWindow.calledWith(
    1,
    'TerminalWindow',
    { frame: false, skipTaskbar: true, resizable: false },
    'horizontal',
    2
  ), 'addPaneSecondary calls splitWindow mehtod of sGrid vertically')
})

test('TmuxMode movePaneMain', t => {
  t.plan(2)
  const moveOrThrow = sinon.stub().callsArg(1)
  const TmuxMode = stubTmuxMode(moveOrThrow)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    switchWindowContents: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.movePaneMain('right')
  t.ok(moveOrThrow.calledWith(sGrid), 'move method called moveOrThrow method')
  t.ok(
    sGrid.switchWindowContents.calledWith('right'),
    'move method switched window contents in desired direction'
  )
})

test('TmuxMode movePaneSecondary', t => {
  t.plan(1)
  const moveOrThrow = sinon.stub().callsArg(1)
  const TmuxMode = stubTmuxMode(moveOrThrow)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    switchWindowContents: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.movePaneMain('right')
  t.pass('no-op on move pane secondary of tmux mode')
})

test('TmuxMode increasePaneSize', t => {
  t.plan(1)
  const moveOrThrow = sinon.stub().callsArg(1)
  const TmuxMode = stubTmuxMode(moveOrThrow)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    increaseAndFillCurWinSize: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.increasePaneSize('right')
  t.ok(sGrid.increaseAndFillCurWinSize.calledWith('right', 30), 'sGrids proper method was called')
})

test('TmuxMode decreasePaneSize', t => {
  t.plan(1)
  const moveOrThrow = sinon.stub().callsArg(1)
  const TmuxMode = stubTmuxMode(moveOrThrow)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    decreaseAndFillCurWinSize: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.decreasePaneSize('right')
  t.ok(sGrid.decreaseAndFillCurWinSize.calledWith('right', 30), 'sGrids proper method was called')
})

test('TmuxMode switchPaneFocus', t => {
  t.plan(1)
  const moveOrThrow = sinon.stub().callsArg(1)
  const TmuxMode = stubTmuxMode(moveOrThrow)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    switchWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.switchPaneFocus('right')
  t.ok(sGrid.switchWindow.calledWith('right', true), 'sGrids proper method was called')
})

test('TmuxMode paneCloser', t => {
  t.plan(2)
  const moveOrThrow = sinon.stub().callsArg(1)
  const paneCloser = sinon.stub().callsArg(1)
  const TmuxMode = stubTmuxMode(moveOrThrow, paneCloser)
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [], maxAllPanes: sinon.spy(), findGaps: () => [{gap1: '1'}, {gap2: '2'}]},
      {id: 2, panes: [], maxAllPanes: sinon.spy(), findGaps: () => [{gap1: '1'}, {gap2: '2'}]}
    ],
    createWindow: sinon.spy(),
    switchWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  const firstGapFillCall = sGrid.createWindow.getCall(1)
  const secondGapFillCall = sGrid.createWindow.getCall(2)
  t.ok(firstGapFillCall.calledWith(
    1,
    TerminalWindow,
    { gap1: '1', frame: false, skipTaskbar: true, resizable: false },
    {listeners: 'listeners'}
  ), 'first gap filled with window')
  t.ok(secondGapFillCall.calledWith(
    1,
    TerminalWindow,
    { gap2: '2', frame: false, skipTaskbar: true, resizable: false },
    {listeners: 'listeners'}
  ), 'second gap filled with window')
})
