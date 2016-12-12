const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire').noCallThru()

function stubMinimizeToggler (focusedPane) {
  return proxyquire('../../components/minimize-toggler', {
    'electron': {BrowserWindow: {getFocusedWindow: () => focusedPane}}
  })
}

test('togglePanefullSize(): toggles pane full size', t => {
  t.plan(1)
  try {
    const sGrid = {toggleCurrentWinFullSize: sinon.spy()}
    const { togglePaneFullSize } = stubMinimizeToggler()({sGrid})
    togglePaneFullSize()
    t.ok(sGrid.toggleCurrentWinFullSize.calledOnce, 'toggleCurrentWinFullSize called')
  } catch (e) {
    t.fail(e)
  }
})

test('toggleAllShow(): toggles all show when windows are minimized', t => {
  t.plan(2)
  try {
    const wChanger = {toggleAllShow: sinon.spy()}
    const focus = sinon.spy()
    const { toggleAllShow } = stubMinimizeToggler()({wChanger, lastFocusedWindow: {focus}})
    toggleAllShow()
    t.ok(wChanger.toggleAllShow.calledOnce, 'toggleAllShow called')
    t.ok(focus.calledOnce, 'last focused window focused again')
  } catch (e) {
    t.fail(e)
  }
})

test('toggleAllShow(): toggles all show when windows are restored', t => {
  t.plan(2)
  try {
    const wChanger = {toggleAllShow: sinon.spy()}
    let state = {wChanger}
    const { toggleAllShow } = stubMinimizeToggler({id: 1})(state)
    toggleAllShow()
    t.ok(wChanger.toggleAllShow.calledOnce, 'toggleAllShow called')
    t.deepEquals(state.lastFocusedWindow, {id: 1}, 'last focused window set on state')
  } catch (e) {
    t.fail(e)
  }
})
