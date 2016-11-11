const test = require('tape')
const sinon = require('sinon')

test('moveOrThrow(sGrid, direction, move): moves pane and does not throw if it moved', t => {
  t.plan(2)
  try {
    const { moveOrThrow } = require('../../lib/utils')
    const currentPanePosition = sinon.stub()
    currentPanePosition.onCall(0).returns({x: 0, y: 0, width: 100, height: 100})
    currentPanePosition.onCall(1).returns({x: 10, y: 0, width: 100, height: 100})
    const sGrid = {currentPanePosition}
    const move = sinon.spy()
    moveOrThrow(sGrid, move)
    t.ok(currentPanePosition.calledTwice, 'position called twice')
    t.ok(move.calledOnce, 'move called once')
  } catch (e) {
    t.fail(e)
  }
})

test('moveOrThrow(sGrid, direction, move): throws if pane not moved', t => {
  t.plan(3)
  try {
    const { moveOrThrow } = require('../../lib/utils')
    const currentPanePosition = sinon.stub()
    currentPanePosition.onCall(0).returns({x: 0, y: 0, width: 100, height: 100})
    currentPanePosition.onCall(1).returns({x: 0, y: 0, width: 100, height: 100})
    const sGrid = {currentPanePosition}
    const move = sinon.spy()
    t.throws(
      () => moveOrThrow(sGrid, move),
      /location blocked/,
      'method thrown if pane not moved'
    )
    t.ok(currentPanePosition.calledTwice, 'position called twice')
    t.ok(move.calledOnce, 'move called once')
  } catch (e) {
    t.fail(e)
  }
})

test('moveOrThrow(sGrid, direction, move): moves pane and does not throw if it was resized', t => {
  t.plan(2)
  try {
    const { moveOrThrow } = require('../../lib/utils')
    const currentPanePosition = sinon.stub()
    currentPanePosition.onCall(0).returns({x: 0, y: 0, width: 100, height: 100})
    currentPanePosition.onCall(1).returns({x: 0, y: 0, width: 200, height: 100})
    const sGrid = {currentPanePosition}
    const move = sinon.spy()
    moveOrThrow(sGrid, move)
    t.ok(currentPanePosition.calledTwice, 'position called twice')
    t.ok(move.calledOnce, 'move called once')
  } catch (e) {
    t.fail(e)
  }
})

test('paneIsOnScreenEdge(pane, grid, direction): returns true for edge pane on left side', t => {
  t.plan(1)
  try {
    const { paneIsOnScreenEdge } = require('../../lib/utils')
    const pane = {x: 500, width: 500, height: 100, y: 10}
    const grid = {width: 1000, height: 500}
    t.ok(paneIsOnScreenEdge(pane, grid, 'left'), 'returns true for edge pane')
  } catch (e) {
    t.fail(e)
  }
})

test('paneIsOnScreenEdge(pane, grid, direction): returns true for edge pane on right side', t => {
  t.plan(1)
  try {
    const { paneIsOnScreenEdge } = require('../../lib/utils')
    const pane = {x: 0, width: 500, height: 100, y: 10}
    const grid = {width: 1000, height: 500}
    t.ok(paneIsOnScreenEdge(pane, grid, 'right'), 'returns true for edge pane')
  } catch (e) {
    t.fail(e)
  }
})

test('paneIsOnScreenEdge(pane, grid, direction): returns true for edge pane on top side', t => {
  t.plan(1)
  try {
    const { paneIsOnScreenEdge } = require('../../lib/utils')
    const pane = {x: 300, width: 500, height: 250, y: 250}
    const grid = {width: 1000, height: 500}
    t.ok(paneIsOnScreenEdge(pane, grid, 'up'), 'returns true for edge pane')
  } catch (e) {
    t.fail(e)
  }
})

test('paneIsOnScreenEdge(pane, grid, direction): returns true for edge pane on bottom side', t => {
  t.plan(1)
  try {
    const { paneIsOnScreenEdge } = require('../../lib/utils')
    const pane = {x: 300, width: 500, height: 250, y: 0}
    const grid = {width: 1000, height: 500}
    t.ok(paneIsOnScreenEdge(pane, grid, 'down'), 'returns true for edge pane')
  } catch (e) {
    t.fail(e)
  }
})

test('paneIsOnScreenEdge(pane, grid, direction): returns false if pane is not on edge', t => {
  t.plan(1)
  try {
    const { paneIsOnScreenEdge } = require('../../lib/utils')
    const pane = {x: 300, width: 500, height: 250, y: 10}
    const grid = {width: 1000, height: 500}
    t.notOk(paneIsOnScreenEdge(pane, grid, 'left'), 'returns true for edge pane')
  } catch (e) {
    t.fail(e)
  }
})

test('paneOccupiesSameSpaceAtDirection(pane, winBounds, direction): ' +
     'returns true when appropriate left and up', t => {
  t.plan(1)
  try {
    const { paneOccupiesSameSpaceAtDirection } = require('../../lib/utils')
    const pane = {x: 900, width: 500, height: 250, y: 0}
    const winBounds = {x: 300, width: 100, y: 50, height: 100}
    t.ok(
      paneOccupiesSameSpaceAtDirection(pane, winBounds, 'left'),
      'returns true when occupied same directional space'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('paneOccupiesSameSpaceAtDirection(pane, winBounds, direction): ' +
     'returns true when appropriate left and down', t => {
  t.plan(1)
  try {
    const { paneOccupiesSameSpaceAtDirection } = require('../../lib/utils')
    const pane = {x: 900, width: 500, height: 250, y: 50}
    const winBounds = {x: 300, width: 100, y: 50, height: 100}
    t.ok(
      paneOccupiesSameSpaceAtDirection(pane, winBounds, 'left'),
      'returns true when occupied same directional space'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('paneOccupiesSameSpaceAtDirection(pane, winBounds, direction): ' +
     'returns true when appropriate right and up', t => {
  t.plan(1)
  try {
    const { paneOccupiesSameSpaceAtDirection } = require('../../lib/utils')
    const pane = {x: 300, width: 500, height: 250, y: 0}
    const winBounds = {x: 900, width: 100, y: 50, height: 100}
    t.ok(
      paneOccupiesSameSpaceAtDirection(pane, winBounds, 'right'),
      'returns true when occupied same directional space'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('paneOccupiesSameSpaceAtDirection(pane, winBounds, direction): ' +
     'returns true when appropriate right and down', t => {
  t.plan(1)
  try {
    const { paneOccupiesSameSpaceAtDirection } = require('../../lib/utils')
    const pane = {x: 900, width: 500, height: 250, y: 50}
    const winBounds = {x: 300, width: 100, y: 50, height: 100}
    t.ok(
      paneOccupiesSameSpaceAtDirection(pane, winBounds, 'right'),
      'returns true when occupied same directional space'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('paneOccupiesSameSpaceAtDirection(pane, winBounds, direction): ' +
     'returns true when appropriate up and right', t => {
  t.plan(1)
  try {
    const { paneOccupiesSameSpaceAtDirection } = require('../../lib/utils')
    const pane = {x: 300, width: 300, height: 250, y: 500}
    const winBounds = {x: 350, width: 400, y: 0, height: 100}
    t.ok(
      paneOccupiesSameSpaceAtDirection(pane, winBounds, 'up'),
      'returns true when occupied same directional space'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('paneOccupiesSameSpaceAtDirection(pane, winBounds, direction): ' +
     'returns true when appropriate up and left', t => {
  t.plan(1)
  try {
    const { paneOccupiesSameSpaceAtDirection } = require('../../lib/utils')
    const pane = {x: 300, width: 700, height: 250, y: 500}
    const winBounds = {x: 900, width: 100, y: 50, height: 100}
    t.ok(
      paneOccupiesSameSpaceAtDirection(pane, winBounds, 'up'),
      'returns true when occupied same directional space'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('paneOccupiesSameSpaceAtDirection(pane, winBounds, direction): ' +
     'returns true when appropriate down and right', t => {
  t.plan(1)
  try {
    const { paneOccupiesSameSpaceAtDirection } = require('../../lib/utils')
    const pane = {x: 350, width: 400, y: 0, height: 100}
    const winBounds = {x: 300, width: 300, height: 250, y: 500}
    t.ok(
      paneOccupiesSameSpaceAtDirection(pane, winBounds, 'down'),
      'returns true when occupied same directional space'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('paneOccupiesSameSpaceAtDirection(pane, winBounds, direction): ' +
     'returns true when appropriate up and left', t => {
  t.plan(1)
  try {
    const { paneOccupiesSameSpaceAtDirection } = require('../../lib/utils')
    const pane = {x: 900, width: 100, y: 50, height: 100}
    const winBounds = {x: 300, width: 700, height: 250, y: 500}
    t.ok(
      paneOccupiesSameSpaceAtDirection(pane, winBounds, 'down'),
      'returns true when occupied same directional space'
    )
  } catch (e) {
    t.fail(e)
  }
})

test('paneOccupiesSameSpaceAtDirection(pane, winBounds, direction): ' +
     'returns false when pane does not occupy same space', t => {
  t.plan(1)
  try {
    const { paneOccupiesSameSpaceAtDirection } = require('../../lib/utils')
    const pane = {x: 900, width: 100, y: 50, height: 100}
    const winBounds = {x: 300, width: 100, height: 100, y: 500}
    t.notOk(
      paneOccupiesSameSpaceAtDirection(pane, winBounds, 'left'),
      'returns true when occupied same directional space'
    )
  } catch (e) {
    t.fail(e)
  }
})
