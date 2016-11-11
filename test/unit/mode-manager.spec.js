'use strict'
const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubModeManager (paneMover, paneAdder, paneResizer, paneGridActions, minimizeToggler, modeSwitcher) {
  return proxyquire('../../lib/mode-manager', {
    '../components/pane-mover': paneMover,
    '../components/pane-adder': paneAdder,
    '../components/pane-resizer': paneResizer,
    '../components/pane-grid-actions': paneGridActions,
    '../components/minimize-toggler': minimizeToggler,
    '../components/mode-switcher': modeSwitcher
  })
}

test('ModeManager state constructed properly', t => {
  t.plan(15)
  const wChanger = 'wchanger'
  const TerminalWindow = 'TerminalWindow'
  const mode1 = sinon.stub()
  const mode2 = sinon.stub()
  const modeConstructors = [ mode1, mode2 ]
  const sGrid = {
    grids: [
      {id: 1},
      {id: 2}
    ],
    createWindow: sinon.spy()
  }
  const paneMover = sinon.stub().returns({paneMover: 'paneMover'})
  const paneAdder = sinon.stub().returns({paneAdder: 'paneAdder'})
  const paneResizer = sinon.stub().returns({paneResizer: 'paneResizer'})
  const paneGridActions = sinon.stub().returns({paneGridActions: 'paneGridActions'})
  const minimizeToggler = sinon.stub().returns({minimizeToggler: 'minimizeToggler'})
  const modeSwitcher = sinon.stub().returns({modeSwitcher: 'modeSwitcher'})
  const ModeManager = stubModeManager(paneMover, paneAdder, paneResizer, paneGridActions, minimizeToggler, modeSwitcher)
  const manager = new ModeManager(sGrid, wChanger, TerminalWindow, modeConstructors)
  t.deepEquals(manager.sGrid, sGrid, 'sGrid placed in state')
  t.equals(manager.wChanger, wChanger, 'wChanger placed in state')
  t.equals(manager.TerminalWindow, TerminalWindow, 'TerminalWindow placed in state')
  t.deepEquals(manager.modeTypes, modeConstructors, 'modeTypes in state set to modeConstructors')
  t.deepEquals(manager.modes, [{}, {}], 'constructed objects mapped to modes') // TODO: fix this
  t.ok(mode1.calledWith(1, sGrid, wChanger, TerminalWindow), 'mode1 called with proper args')
  t.ok(mode2.calledWith(2, sGrid, wChanger, TerminalWindow), 'mode2 called with proper args')
  t.ok(mode1.calledWithNew, 'mode1 constructed')
  t.ok(mode2.calledWithNew, 'mode2 constructed')
  t.equals(manager.paneMover, 'paneMover', 'paneMover added to state')
  t.equals(manager.paneAdder, 'paneAdder', 'paneAdder added to state')
  t.equals(manager.paneResizer, 'paneResizer', 'paneResizer added to state')
  t.equals(manager.paneGridActions, 'paneGridActions', 'paneGridActions added to state')
  t.equals(manager.minimizeToggler, 'minimizeToggler', 'minimizeToggler added to state')
  t.equals(manager.modeSwitcher, 'modeSwitcher', 'modeSwitcher added to state')
})
