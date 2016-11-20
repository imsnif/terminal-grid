'use strict'

const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubPaneCloser (close, id) {
  return proxyquire('../../components/pane-closer', {
    electron: {BrowserWindow: {getFocusedWindow: () => ({id, close})}}
  })
}

function stubPaneCloserNoWin () {
  return proxyquire('../../components/pane-closer', {
    electron: {BrowserWindow: {getFocusedWindow: () => {}}}
  })
}

test('closeCurrentPane(): closes focused pane', t => {
  t.plan(1)
  try {
    const close = sinon.spy()
    const paneCloser = stubPaneCloser(close, 1)
    const grid = {panes: [{id: 1}, {id: 2}]}
    const sGrid = {adjacentPaneInGrid: () => {}, adjacentPane: () => {}}
    const { closeCurrentPane } = paneCloser({grid, sGrid})
    closeCurrentPane()
    t.ok(close.calledOnce, 'focused window closed')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('closeCurrentPane(): does nothing when focused window is not part of grid', t => {
  t.plan(1)
  try {
    const close = sinon.spy()
    const paneCloser = stubPaneCloser(close, 3)
    const grid = {panes: [{id: 1}, {id: 2}]}
    const sGrid = {adjacentPaneInGrid: () => {}, adjacentPane: () => {}}
    const { closeCurrentPane } = paneCloser({grid, sGrid})
    closeCurrentPane()
    t.ok(close.notCalled, 'window was not closed')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('closeCurrentPane(): does nothing when there is no focused window', t => {
  t.plan(1)
  try {
    const paneCloser = stubPaneCloserNoWin()
    const grid = {panes: [{id: 1}, {id: 2}]}
    const sGrid = {adjacentPaneInGrid: () => {}, adjacentPane: () => {}}
    const { closeCurrentPane } = paneCloser({grid, sGrid})
    closeCurrentPane()
    t.pass('no-op')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('closeCurrentPane(): closes focused pane and performs close action', t => {
  t.plan(1)
  try {
    const closeAction = sinon.spy()
    const paneCloser = stubPaneCloser(() => {}, 1)
    const grid = {panes: [{id: 1}, {id: 2}]}
    const sGrid = {adjacentPaneInGrid: () => {}, adjacentPane: () => {}}
    const { closeCurrentPane } = paneCloser({grid, sGrid}, closeAction)
    closeCurrentPane()
    t.ok(closeAction.calledOnce, 'closed action called')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('closeCurrentPane(): closes focused pane ' +
     'and focuses on adjacent pane if present', t => {
  t.plan(1)
  try {
    const paneCloser = stubPaneCloser(() => {}, 1)
    const grid = {panes: [{id: 1}, {id: 2}]}
    const adjacentPaneFocus = sinon.spy()
    const adjacentPaneInGridFocus = sinon.spy()
    const sGrid = {
      adjacentPaneInGrid: () => ({wrapped: {focus: adjacentPaneInGridFocus}}),
      adjacentPane: () => ({wrapped: {focus: adjacentPaneFocus}})
    }
    const { closeCurrentPane } = paneCloser({grid, sGrid})
    closeCurrentPane()
    t.ok(adjacentPaneInGridFocus.calledOnce, 'adjacentPane focused')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})

test('closeCurrentPane(): closes focused pane ' +
     'and focuses on adjacent pane in adjacent grid if present', t => {
  t.plan(1)
  try {
    const paneCloser = stubPaneCloser(() => {}, 1)
    const grid = {panes: [{id: 1}, {id: 2}]}
    const adjacentPaneFocus = sinon.spy()
    const sGrid = {
      adjacentPaneInGrid: () => {},
      adjacentPane: () => ({wrapped: {focus: adjacentPaneFocus}})
    }
    const { closeCurrentPane } = paneCloser({grid, sGrid})
    closeCurrentPane()
    t.ok(adjacentPaneFocus.calledOnce, 'adjacentPane focused')
  } catch (e) {
    t.fail(e)
    t.end()
  }
})
