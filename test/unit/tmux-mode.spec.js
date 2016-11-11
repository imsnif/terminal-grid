'use strict'
const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubTmuxMode (moveOrThrow) {
  return proxyquire('../../lib/tmux-mode', {
    '../components/pane-importer-exporter': () => ({fakeImporterExporterMethod: 1}),
    '../components/pane-closer': () => ({fakecloserMethod: 1}),
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

// TODO: test api methods
