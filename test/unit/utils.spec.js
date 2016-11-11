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

// test('movePanePrimary(direction): no-op when no focused window', t => {
//   t.plan(1)
//   try {
//     const paneMover = stubPaneMoverNoMode()
//     const modes = [ {movePaneMain: sinon.spy()}, {movePaneMain: sinon.spy()} ]
//     const { movePanePrimary } = paneMover({modes})
//     movePanePrimary('left')
//     t.ok(modes.every(m => m.movePaneMain.notCalled), 'no movePaneMain method called')
//   } catch (e) {
//     t.fail(e)
//   }
// })
//
// test('movePanePrimary(direction): skips pane to next grid if it exists', t => {
//   t.plan(1)
//   try {
//     const paneMover = stubPaneMover(9)
//     const modes = [
//       {
//         id: 0,
//         grid: {id: 0},
//         movePaneMain: sinon.stub.throws(),
//         canImport: sinon.spy(),
//         importPane: sinon.spy(),
//         exportPane: () => 'I am a pane'
//       },
//       {
//         id: 1,
//         grid: {id: 1},
//         movePaneMain: sinon.spy(),
//         canImport: () => true,
//         importPane: sinon.spy(),
//         exportPane: sinon.spy()
//       }
//     ]
//     const sGrid = {
//       adjacentGrids: [{left: {id: 1}}]
//     }
//     const { movePanePrimary } = paneMover({modes, sGrid})
//     movePanePrimary('left')
//     t.ok(modes[1].importPane.calledWith('I am a pane', 'left'), 'pane properly imported into adjacent grid')
//   } catch (e) {
//     t.fail(e)
//   }
// })
//
// test('movePanePrimary(direction): no op if no room for grid and no adjacent grid', t => {
//   t.plan(2)
//   try {
//     const paneMover = stubPaneMover(9)
//     const modes = [
//       {
//         id: 0,
//         grid: {id: 0},
//         movePaneMain: sinon.stub.throws(),
//         canImport: sinon.spy(),
//         importPane: sinon.spy(),
//         exportPane: sinon.spy()
//       },
//       {
//         id: 1,
//         grid: {id: 1},
//         movePaneMain: sinon.spy(),
//         canImport: () => true,
//         importPane: sinon.spy(),
//         exportPane: sinon.spy()
//       }
//     ]
//     const sGrid = {
//       adjacentGrids: [{right: {id: 1}}]
//     }
//     const { movePanePrimary } = paneMover({modes, sGrid})
//     movePanePrimary('left')
//     t.ok(modes[0].exportPane.notCalled, 'pane not exported from grid')
//     t.ok(modes[1].importPane.notCalled, 'pane not imported to non-adjacent grid')
//   } catch (e) {
//     t.fail(e)
//   }
// })
//
// test('movePanePrimary(direction): no op if adjacent grid cannot import pane', t => {
//   t.plan(2)
//   try {
//     const paneMover = stubPaneMover(9)
//     const modes = [
//       {
//         id: 0,
//         grid: {id: 0},
//         movePaneMain: sinon.stub.throws(),
//         canImport: sinon.spy(),
//         importPane: sinon.spy(),
//         exportPane: sinon.spy()
//       },
//       {
//         id: 1,
//         grid: {id: 1},
//         movePaneMain: sinon.spy(),
//         canImport: () => false,
//         importPane: sinon.spy(),
//         exportPane: sinon.spy()
//       }
//     ]
//     const sGrid = {
//       adjacentGrids: [{left: {id: 1}}]
//     }
//     const { movePanePrimary } = paneMover({modes, sGrid})
//     movePanePrimary('left')
//     t.ok(modes[0].exportPane.notCalled, 'pane not exported from grid')
//     t.ok(modes[1].importPane.notCalled, 'pane not imported to non-adjacent grid')
//   } catch (e) {
//     t.fail(e)
//   }
// })
//
// test('movePaneSecondary(direction): moves pane secondary in direction if there is room', t => {
//   t.plan(2)
//   try {
//     const paneMover = stubPaneMover()
//     const modes = [ {movePaneSecondary: sinon.spy()}, {movePaneSecondary: sinon.spy()} ]
//     const { movePaneSecondary } = paneMover({modes})
//     movePaneSecondary('left')
//     t.ok(modes[0].movePaneSecondary.calledWith('left'), 'movePaneSecondary of current mode called')
//     t.ok(modes[1].movePaneSecondary.notCalled, 'movePaneSecondary of other mode not called')
//   } catch (e) {
//     t.fail(e)
//   }
// })
//
// test('movePaneSecondary(direction): no-op when no focused window', t => {
//   t.plan(1)
//   try {
//     const paneMover = stubPaneMoverNoMode()
//     const modes = [ {movePaneSecondary: sinon.spy()}, {movePaneSecondary: sinon.spy()} ]
//     const { movePaneSecondary } = paneMover({modes})
//     movePaneSecondary('left')
//     t.ok(modes.every(m => m.movePaneSecondary.notCalled), 'no movePaneSecondary method called')
//   } catch (e) {
//     t.fail(e)
//   }
// })
//
// test('movePaneSecondary(direction): skips pane to next grid if it exists', t => {
//   t.plan(1)
//   try {
//     const paneMover = stubPaneMover(9)
//     const modes = [
//       {
//         id: 0,
//         grid: {id: 0},
//         movePaneSecondary: sinon.stub.throws(),
//         canImport: sinon.spy(),
//         importPane: sinon.spy(),
//         exportPane: () => 'I am a pane'
//       },
//       {
//         id: 1,
//         grid: {id: 1},
//         movePaneSecondary: sinon.spy(),
//         canImport: () => true,
//         importPane: sinon.spy(),
//         exportPane: sinon.spy()
//       }
//     ]
//     const sGrid = {
//       adjacentGrids: [{left: {id: 1}}]
//     }
//     const { movePaneSecondary } = paneMover({modes, sGrid})
//     movePaneSecondary('left')
//     t.ok(modes[1].importPane.calledWith('I am a pane', 'left'), 'pane properly imported into adjacent grid')
//   } catch (e) {
//     t.fail(e)
//   }
// })
//
// test('movePaneSecondary(direction): no op if no room for grid and no adjacent grid', t => {
//   t.plan(2)
//   try {
//     const paneMover = stubPaneMover(9)
//     const modes = [
//       {
//         id: 0,
//         grid: {id: 0},
//         movePaneSecondary: sinon.stub.throws(),
//         canImport: sinon.spy(),
//         importPane: sinon.spy(),
//         exportPane: sinon.spy()
//       },
//       {
//         id: 1,
//         grid: {id: 1},
//         movePaneSecondary: sinon.spy(),
//         canImport: () => true,
//         importPane: sinon.spy(),
//         exportPane: sinon.spy()
//       }
//     ]
//     const sGrid = {
//       adjacentGrids: [{right: {id: 1}}]
//     }
//     const { movePaneSecondary } = paneMover({modes, sGrid})
//     movePaneSecondary('left')
//     t.ok(modes[0].exportPane.notCalled, 'pane not exported from grid')
//     t.ok(modes[1].importPane.notCalled, 'pane not imported to non-adjacent grid')
//   } catch (e) {
//     t.fail(e)
//   }
// })
//
// test('movePaneSecondary(direction): no op if adjacent grid cannot import pane', t => {
//   t.plan(2)
//   try {
//     const paneMover = stubPaneMover(9)
//     const modes = [
//       {
//         id: 0,
//         grid: {id: 0},
//         movePaneSecondary: sinon.stub.throws(),
//         canImport: sinon.spy(),
//         importPane: sinon.spy(),
//         exportPane: sinon.spy()
//       },
//       {
//         id: 1,
//         grid: {id: 1},
//         movePaneSecondary: sinon.spy(),
//         canImport: () => false,
//         importPane: sinon.spy(),
//         exportPane: sinon.spy()
//       }
//     ]
//     const sGrid = {
//       adjacentGrids: [{left: {id: 1}}]
//     }
//     const { movePaneSecondary } = paneMover({modes, sGrid})
//     movePaneSecondary('left')
//     t.ok(modes[0].exportPane.notCalled, 'pane not exported from grid')
//     t.ok(modes[1].importPane.notCalled, 'pane not imported to non-adjacent grid')
//   } catch (e) {
//     t.fail(e)
//   }
// })
