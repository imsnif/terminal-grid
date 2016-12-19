const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubPaneGridActions () {
  return proxyquire('../../components/pane-grid-actions', {
    '../lib/mode-at-current-window': (modes) => modes[0]
  })
}

function stubPaneGridActionsNoMode () {
  return proxyquire('../../components/pane-grid-actions', {
    '../lib/mode-at-current-window': (modes) => {}
  })
}

test('switchPaneFocus(direction): switches pane focus to direction', t => {
  t.plan(2)
  try {
    const modes = [ {switchPaneFocus: sinon.spy()}, {switchPaneFocus: sinon.spy()} ]
    const paneGridActions = stubPaneGridActions()
    const { switchPaneFocus } = paneGridActions({modes})
    switchPaneFocus('right')
    t.ok(
      modes[0].switchPaneFocus.calledWith('right'),
      'switchPaneFocus method of relevant mode called with given direction'
    )
    t.ok(modes[1].switchPaneFocus.notCalled, 'switchPaneFocus of other mode not called')
  } catch (e) {
    t.fail(e)
  }
})

test('switchPaneFocus(direction): does not switch pane focus when no win is focused', t => {
  t.plan(1)
  try {
    const modes = [ {switchPaneFocus: sinon.spy()}, {switchPaneFocus: sinon.spy()} ]
    const paneGridActions = stubPaneGridActionsNoMode()
    const { switchPaneFocus } = paneGridActions({modes})
    switchPaneFocus('right')
    t.ok(modes.every(m => m.switchPaneFocus.notCalled), 'no switchFocus method called')
  } catch (e) {
    t.fail(e)
  }
})

test('closePane(): closes focused pane', t => {
  t.plan(2)
  try {
    const modes = [ {closeCurrentPane: sinon.spy()}, {closeCurrentPane: sinon.spy()} ]
    const paneGridActions = stubPaneGridActions()
    const { closePane } = paneGridActions({modes})
    closePane()
    t.ok(
      modes[0].closeCurrentPane.calledOnce,
      'closePane method of relevant mode called'
    )
    t.ok(modes[1].closeCurrentPane.notCalled, 'closePane of other mode not called')
  } catch (e) {
    t.fail(e)
  }
})

test('closePane(): does not close pane when no win is focused', t => {
  t.plan(1)
  try {
    const modes = [ {closeCurrentPane: sinon.spy()}, {closeCurrentPane: sinon.spy()} ]
    const paneGridActions = stubPaneGridActionsNoMode()
    const { closePane } = paneGridActions({modes})
    closePane()
    t.ok(modes.every(m => m.closeCurrentPane.notCalled), 'no closePane method called')
  } catch (e) {
    t.fail(e)
  }
})

test('openPaneMainInCurrentScreen(): calls addPaneMain of current mode', t => {
  t.plan(2)
  try {
    const modes = [ {addPaneMain: sinon.spy()}, {addPaneMain: sinon.spy()} ]
    const paneGridActions = stubPaneGridActions()
    const { openPaneMainInCurrentScreen } = paneGridActions({modes})
    openPaneMainInCurrentScreen()
    t.ok(
      modes[0].addPaneMain.calledOnce,
      'addPaneMain method of relevant mode called'
    )
    t.ok(modes[1].addPaneMain.notCalled, 'addPaneMain of other mode not called')
  } catch (e) {
    t.fail(e)
  }
})

test('openPaneMainInCurrentScreen(): no-op if no win is focused', t => {
  t.plan(1)
  try {
    const modes = [ {addPaneMain: sinon.spy()}, {addPaneMain: sinon.spy()} ]
    const paneGridActions = stubPaneGridActionsNoMode()
    const { openPaneMainInCurrentScreen } = paneGridActions({modes})
    openPaneMainInCurrentScreen()
    t.ok(modes.every(m => m.addPaneMain.notCalled), 'no addPaneMain method called')
  } catch (e) {
    t.fail(e)
  }
})

test('openPaneSecondaryInCurrentScreen(): calls addPaneSecondary of current mode', t => {
  t.plan(2)
  try {
    const modes = [ {addPaneSecondary: sinon.spy()}, {addPaneSecondary: sinon.spy()} ]
    const paneGridActions = stubPaneGridActions()
    const { openPaneSecondaryInCurrentScreen } = paneGridActions({modes})
    openPaneSecondaryInCurrentScreen()
    t.ok(
      modes[0].addPaneSecondary.calledOnce,
      'addPaneSecondary method of relevant mode called'
    )
    t.ok(modes[1].addPaneSecondary.notCalled, 'addPaneSecondary of other mode not called')
  } catch (e) {
    t.fail(e)
  }
})

test('openPaneSecondaryInCurrentScreen(): no-op if no win is focused', t => {
  t.plan(1)
  try {
    const modes = [ {addPaneSecondary: sinon.spy()}, {addPaneSecondary: sinon.spy()} ]
    const paneGridActions = stubPaneGridActionsNoMode()
    const { openPaneSecondaryInCurrentScreen } = paneGridActions({modes})
    openPaneSecondaryInCurrentScreen()
    t.ok(modes.every(m => m.addPaneSecondary.notCalled), 'no addPaneSecondary method called')
  } catch (e) {
    t.fail(e)
  }
})
