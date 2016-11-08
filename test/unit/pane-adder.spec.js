const test = require('tape')
const sinon = require('sinon')

const paneAdder = require('../../components/pane-adder')

test('addPaneMain(screenIndex): toggles addPaneMain of mode at screenIndex', t => {
  t.plan(2)
  try {
    const modes = [ {addPaneMain: sinon.spy()}, {addPaneMain: sinon.spy()} ]
    const { addPaneMain } = paneAdder({modes})
    addPaneMain(1)
    t.ok(modes[1].addPaneMain.calledOnce, 'addPaneMain at desired index called')
    t.ok(modes[0].addPaneMain.notCalled, 'addPaneMain at other index not called')
  } catch (e) {
    t.fail(e)
  }
})

test('addPaneMain(screenIndex): no-op when screenIndex not provided', t => {
  t.plan(1)
  try {
    const modes = [ {addPaneMain: sinon.spy()}, {addPaneMain: sinon.spy()} ]
    const { addPaneMain } = paneAdder({modes})
    addPaneMain()
    t.ok(modes.every(m => m.addPaneMain.notCalled), 'addPaneMain was not called on any node')
  } catch (e) {
    t.fail(e)
  }
})

test('addPaneSecondary(screenIndex): toggles addPaneSecondary of mode at screenIndex', t => {
  t.plan(2)
  try {
    const modes = [ {addPaneSecondary: sinon.spy()}, {addPaneSecondary: sinon.spy()} ]
    const { addPaneSecondary } = paneAdder({modes})
    addPaneSecondary(1)
    t.ok(modes[1].addPaneSecondary.calledOnce, 'addPaneSecondary at desired index called')
    t.ok(modes[0].addPaneSecondary.notCalled, 'addPaneSecondary at other index not called')
  } catch (e) {
    t.fail(e)
  }
})

test('addPaneSecondary(screenIndex): no-op when screenIndex not provided', t => {
  t.plan(1)
  try {
    const modes = [ {addPaneSecondary: sinon.spy()}, {addPaneSecondary: sinon.spy()} ]
    const { addPaneSecondary } = paneAdder({modes})
    addPaneSecondary()
    t.ok(modes.every(m => m.addPaneSecondary.notCalled), 'addPaneSecondary was not called on any node')
  } catch (e) {
    t.fail(e)
  }
})
