const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubModeSwitcher () {
  return proxyquire('../../components/mode-switcher', {
    '../lib/mode-at-current-window': (modes) => modes[0]
  })
}

function stubModeSwitcherNoMode () {
  return proxyquire('../../components/mode-switcher', {
    '../lib/mode-at-current-window': (modes) => {}
  })
}

function stubState (spy1, spy2) {
  return {
    modes: [
      {grid: {id: 1}, constructor: {name: 'mode1'}},
      {grid: {id: 2}, constructor: {name: 'mode2'}}
    ],
    modeTypes: [
      function mode1 () { spy1(...arguments) },
      function mode2 () { spy2(...arguments) }
    ],
    sGrid: 'fakeSGrid',
    wChanger: 'fakeWChanger',
    TerminalWindow: 'fakeTerminalWindow'
  }
}

test('switchMode(): switches current mode', t => {
  t.plan(3)
  try {
    const spy1 = sinon.spy()
    const spy2 = sinon.spy()
    const state = stubState(spy1, spy2)
    const modeSwitcher = stubModeSwitcher()
    const { switchMode } = modeSwitcher(state)
    switchMode()
    t.ok(spy1.notCalled, 'first constructor not called')
    t.ok(
      spy2.calledWith(1, 'fakeSGrid', 'fakeWChanger', 'fakeTerminalWindow'),
      'second constructor called with right params'
    )
    t.deepEquals(
      state.modes,
      [{}, {grid: {id: 2}, constructor: {name: 'mode2'}}],
      'mode state updated'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('switchMode(): does not switch mode when win is not focused', t => {
  t.plan(3)
  try {
    const spy1 = sinon.spy()
    const spy2 = sinon.spy()
    const state = stubState(spy1, spy2)
    const modeSwitcher = stubModeSwitcherNoMode()
    const { switchMode } = modeSwitcher(state)
    switchMode()
    t.ok(spy1.notCalled, 'first constructor not called')
    t.ok(spy2.notCalled, 'second constructor not called')
    t.deepEquals(
      state.modes,
      [
        {grid: {id: 1}, constructor: {name: 'mode1'}},
        {grid: {id: 2}, constructor: {name: 'mode2'}}
      ],
      'mode state unchanged'
    )
  } catch (e) {
    t.fail(e)
  }
})
