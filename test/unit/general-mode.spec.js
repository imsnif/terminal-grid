'use strict'
const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubGeneralMode (moveOrThrow) {
  return proxyquire('../../lib/general-mode', {
    '../components/pane-importer-exporter': () => ({fakeImporterExporterMethod: 1}),
    '../components/pane-closer': () => ({fakecloserMethod: 1}),
    './utils': {moveOrThrow}
  })
}

test('GeneralMode state constructed properly', t => {
  t.plan(9)
  const GeneralMode = stubGeneralMode()
  const displayId = 1
  const sGrid = {
    grids: [{id: 1}, {id: 2}],
    createWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new GeneralMode(displayId, sGrid, wChanger, TerminalWindow)
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
  t.deepEquals(
    mode.smallWindowSize,
    {width: 400, height: 500},
    'proper small win defaults placed in state'
  )
  t.deepEquals(
    mode.largeWindowSize,
    {width: 600, height: 800},
    'proper large win defaults placed in state'
  )
  t.equals(mode.resizeAmount, 30, 'proper resize amount defaults placed in state')
})

test('GeneralMode api behaves properly', t => {
  t.plan(2)
  const moveOrThrow = sinon.spy()
  const GeneralMode = stubGeneralMode(moveOrThrow)
  const displayId = 1
  const sGrid = {
    grids: [{id: 1}, {id: 2}],
    createWindow: sinon.spy(),
    maxLoc: (...args) => console.log('argssss:', args)
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new GeneralMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneMain()
  mode.addPaneSecondary()
  t.ok(
    sGrid.createWindow.getCall(0).calledWith(
      1,
      'TerminalWindow',
      {frame: false, skipTaskbar: true, width: 400, height: 500}
    ),
    'main window created properly'
  )
  t.ok(sGrid.createWindow.getCall(1).calledWith(
    1,
    'TerminalWindow',
    {frame: false, skipTaskbar: true, width: 600, height: 800}
    ),
    'secondary window created properly'
  )
  // TODO: test the rest of the API methods
})
