const test = require('tape')
const sinon = require('sinon')

const minimizeToggler = require('../../components/minimize-toggler')

test('togglePanefullSize(): toggles pane full size', t => {
  t.plan(1)
  try {
    const sGrid = {toggleCurrentWinFullSize: sinon.spy()}
    const { togglePaneFullSize } = minimizeToggler({sGrid})
    togglePaneFullSize()
    t.ok(sGrid.toggleCurrentWinFullSize.calledOnce, 'toggleCurrentWinFullSize called')
  } catch (e) {
    t.fail(e)
  }
})

test('toggleAllShow(): toggles all show', t => {
  t.plan(1)
  try {
    const wChanger = {toggleAllShow: sinon.spy()}
    const { toggleAllShow } = minimizeToggler({wChanger})
    toggleAllShow()
    t.ok(wChanger.toggleAllShow.calledOnce, 'toggleAllShow called')
  } catch (e) {
    t.fail(e)
  }
})
