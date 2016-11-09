const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubPaneResizer () {
  return proxyquire('../../components/pane-resizer', {
    '../lib/mode-at-current-window': (modes) => modes[0]
  })
}

function stubPaneResizerNoMode () {
  return proxyquire('../../components/pane-resizer', {
    '../lib/mode-at-current-window': (modes) => {}
  })
}

test('increasePaneSize(direction): does not call method when no focused window', t => {
  t.plan(1)
  try {
    const paneResizer = stubPaneResizerNoMode()
    const modes = [ {increasePaneSize: sinon.spy()}, {increasePaneSize: sinon.spy()} ]
    const { increasePaneSize } = paneResizer({modes})
    increasePaneSize('left')
    t.ok(modes.every(m => m.increasePaneSize.notCalled), 'no increasePaneSize methods of any mode called')
  } catch (e) {
    t.fail(e)
  }
})

test('increasePaneSize(direction): increases pane size in current mode', t => {
  t.plan(2)
  try {
    const paneResizer = stubPaneResizer()
    const modes = [ {increasePaneSize: sinon.spy()}, {increasePaneSize: sinon.spy()} ]
    const { increasePaneSize } = paneResizer({modes})
    increasePaneSize('left')
    t.ok(modes[0].increasePaneSize.calledOnce, 'increasePaneSize of current mode called')
    t.ok(modes[1].increasePaneSize.notCalled, 'increasePaneSize at other index not called')
  } catch (e) {
    t.fail(e)
  }
})

test('decreasePaneSize(direction): does not call method when no focused window', t => {
  t.plan(1)
  try {
    const paneResizer = stubPaneResizerNoMode()
    const modes = [ {decreasePaneSize: sinon.spy()}, {decreasePaneSize: sinon.spy()} ]
    const { decreasePaneSize } = paneResizer({modes})
    decreasePaneSize('left')
    t.ok(modes.every(m => m.decreasePaneSize.notCalled), 'no decreasePaneSize methods of any mode called')
  } catch (e) {
    t.fail(e)
  }
})

test('decreasePaneSize(direction): decreases pane size in current mode', t => {
  t.plan(2)
  try {
    const paneResizer = stubPaneResizer()
    const modes = [ {decreasePaneSize: sinon.spy()}, {decreasePaneSize: sinon.spy()} ]
    const { decreasePaneSize } = paneResizer({modes})
    decreasePaneSize('left')
    t.ok(modes[0].decreasePaneSize.calledOnce, 'decreasePaneSize of current mode called')
    t.ok(modes[1].decreasePaneSize.notCalled, 'decreasePaneSize at other index not called')
  } catch (e) {
    t.fail(e)
  }
})
