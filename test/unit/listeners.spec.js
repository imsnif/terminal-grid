const test = require('tape')
const sinon = require('sinon')

test('changeBounds(win, params): changed window bounds of provided window with provided params', t => {
  t.plan(1)
  try {
    const {changeBounds} = require('../../lib/listeners')
    const win = {setBounds: sinon.spy()}
    const params = {offset: {x: 10, y: 10}, x: 90, y: 90, width: 200, height: 200}
    changeBounds(win, params)
    t.ok(
      win.setBounds.calledWith({width: 200, height: 200, x: 100, y: 100}),
      'setBounds method of win called with proper params'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('close(win): calls close method of win', t => {
  t.plan(1)
  try {
    const {close} = require('../../lib/listeners')
    const win = {close: sinon.spy()}
    close(win)
    t.ok(
      win.close.calledOnce,
      'close method of win called once'
    )
  } catch (e) {
    t.fail(e)
  }
})
