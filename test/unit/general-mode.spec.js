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
    createWindowCentered: sinon.spy()
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
    {frame: false, skipTaskbar: true, resizable: false},
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
  t.plan(7)
  const moveOrThrow = sinon.stub().callsArg(1)
  const GeneralMode = stubGeneralMode(moveOrThrow)
  const displayId = 1
  const sGrid = {
    grids: [{id: 1}, {id: 2}],
    createWindowCentered: sinon.spy(),
    maxLoc: sinon.spy(),
    increaseCurWinSize: sinon.spy(),
    decreaseCurWinSize: sinon.spy(),
    switchWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new GeneralMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.addPaneMain()
  mode.addPaneSecondary()
  mode.movePaneMain('right')
  mode.increasePaneSize('right')
  mode.decreasePaneSize('right')
  mode.switchPaneFocus('right')
  t.ok(
    sGrid.createWindowCentered.getCall(0).calledWith(
      1,
      'TerminalWindow',
      {frame: false, skipTaskbar: true, resizable: false, width: 400, height: 500}
    ),
    'main window created properly'
  )
  t.ok(sGrid.createWindowCentered.getCall(1).calledWith(
    1,
    'TerminalWindow',
    {frame: false, skipTaskbar: true, resizable: false, width: 600, height: 800}
    ),
    'secondary window created properly'
  )
  t.ok(moveOrThrow.calledWith(sGrid), 'move method called moveOrThrow method')
  t.ok(
    sGrid.maxLoc.calledWith('right'),
    'max loc called for move pane method'
  )
  t.ok(
    sGrid.increaseCurWinSize.calledWith('right', 30),
    'increaseCurWinSize called for increasePaneSize method with right args'
  )
  t.ok(
    sGrid.decreaseCurWinSize.calledWith('right', 30),
    'decreasePaneSize called for decreasePaneSize method with right args'
  )
  t.ok(
    sGrid.switchWindow.calledWith('right', true),
    'switchWindow called for switchPaneFocus method with right args'
  )
})

test('GeneralMode movePaneSecondary method', t => {
  t.plan(4)
  const moveOrThrow = sinon.stub().callsArg(1)
  const GeneralMode = stubGeneralMode(moveOrThrow)
  const displayId = 1
  const sGrid = {
    grids: [{id: 1}, {id: 2}],
    createWindowCentered: sinon.spy(),
    maxLoc: sinon.spy(),
    increaseCurWinSize: sinon.spy(),
    decreaseCurWinSize: sinon.spy(),
    changeCurWindow: sinon.spy()
  }
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode = new GeneralMode(displayId, sGrid, wChanger, TerminalWindow)
  mode.movePaneSecondary('right')
  mode.movePaneSecondary('left')
  mode.movePaneSecondary('up')
  mode.movePaneSecondary('down')
  const firstCall = sGrid.changeCurWindow.getCall(0)
  const secondCall = sGrid.changeCurWindow.getCall(1)
  const thirdCall = sGrid.changeCurWindow.getCall(2)
  const fourthCall = sGrid.changeCurWindow.getCall(3)
  t.ok(firstCall.calledWith('right', 30), 'can move secondary right')
  t.ok(secondCall.calledWith('left', 30), 'can move secondary left')
  t.ok(thirdCall.calledWith('up', 30), 'can move secondary up')
  t.ok(fourthCall.calledWith('down', 30), 'can move secondary down')
})
