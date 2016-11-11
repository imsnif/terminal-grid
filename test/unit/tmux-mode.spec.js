'use strict'
const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubTmuxMode (moveOrThrow, paneCloser) {
  const paneCloserAction = !paneCloser
    ? () => { return {fakecloserMethod: 1} }
    : paneCloser
  return proxyquire('../../lib/tmux-mode', {
    '../components/pane-importer-exporter': () => ({fakeImporterExporterMethod: 1}),
    '../components/pane-closer': paneCloserAction,
    './utils': {moveOrThrow}
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
    {frame: false, skipTaskbar: true},
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
    {frame: false, skipTaskbar: true},
    'proper win defaults placed in state'
  )
  t.equals(mode.resizeAmount, 30, 'proper resize amount defaults placed in state')
  t.ok(sGrid.grids[0].maxAllPanes.calledOnce, 'relevant grid had all its panes maxed')
  t.ok(sGrid.grids[1].maxAllPanes.notCalled, 'other grid did not have all its panes maxed')
  t.ok(
    sGrid.createWindow.calledWith(
      displayId,
      TerminalWindow,
      Object.assign({}, mode.winOpts, {maxSize: true})
    ),
    'window created full size'
  )
})

test('TmuxMode addPaneMain', t => {
  t.plan(1)
  const TmuxMode = stubTmuxMode()
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    splitCurrentWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneMain()
  t.ok(sGrid.splitCurrentWindow.calledWith(
    1,
    'TerminalWindow',
    { frame: false, skipTaskbar: true },
    'vertical'
  ), 'addPaneMain calls splitCurrentWindow mehtod of sGrid vertically')
})

test('TmuxMode addPaneSecondary', t => {
  t.plan(1)
  const TmuxMode = stubTmuxMode()
  const displayId = 1
  const sGrid = {
    grids: [
      {id: 1, panes: [], maxAllPanes: sinon.spy()},
      {id: 2, panes: [], maxAllPanes: sinon.spy()}
    ],
    createWindow: sinon.spy(),
    splitCurrentWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new TmuxMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneSecondary()
  t.ok(sGrid.splitCurrentWindow.calledWith(
    1,
    'TerminalWindow',
    { frame: false, skipTaskbar: true },
    'horizontal'
  ), 'addPaneMain calls splitCurrentWindow mehtod of sGrid vertically')
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
    { gap1: '1', frame: false, skipTaskbar: true }
  ), 'first gap filled with window')
  t.ok(secondGapFillCall.calledWith(
    1,
    TerminalWindow,
    { gap2: '2', frame: false, skipTaskbar: true }
  ), 'second gap filled with window')
})
