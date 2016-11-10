const test = require('tape')
const sinon = require('sinon')
const proxyquire = require('proxyquire')

function stubPaneMover (id) {
  return proxyquire('../../components/pane-mover', {
    '../lib/mode-at-current-window': (modes) => modes[0],
    electron: {BrowserWindow: {getFocusedWindow: () => ({id})}}
  })
}

function stubPaneMoverNoMode () {
  return proxyquire('../../components/pane-mover', {
    '../lib/mode-at-current-window': (modes) => {}
  })
}

test('movePanePrimary(direction): moves pane primary in direction if there is room', t => {
  t.plan(2)
  try {
    const paneMover = stubPaneMover()
    const modes = [ {movePaneMain: sinon.spy()}, {movePaneMain: sinon.spy()} ]
    const { movePanePrimary } = paneMover({modes})
    movePanePrimary('left')
    t.ok(modes[0].movePaneMain.calledWith('left'), 'movePaneMain of current mode called')
    t.ok(modes[1].movePaneMain.notCalled, 'movePaneMain of other mode not called')
  } catch (e) {
    t.fail(e)
  }
})

test('movePanePrimary(direction): no-op when no focused window', t => {
  t.plan(1)
  try {
    const paneMover = stubPaneMoverNoMode()
    const modes = [ {movePaneMain: sinon.spy()}, {movePaneMain: sinon.spy()} ]
    const { movePanePrimary } = paneMover({modes})
    movePanePrimary('left')
    t.ok(modes.every(m => m.movePaneMain.notCalled), 'no movePaneMain method called')
  } catch (e) {
    t.fail(e)
  }
})

test('movePanePrimary(direction): skips pane to next grid if it exists', t => {
  t.plan(1)
  try {
    const paneMover = stubPaneMover(9)
    const modes = [
      {
        id: 0,
        grid: {id: 0},
        movePaneMain: sinon.stub.throws(),
        canImport: sinon.spy(),
        importPane: sinon.spy(),
        exportPane: () => 'I am a pane'
      },
      {
        id: 1,
        grid: {id: 1},
        movePaneMain: sinon.spy(),
        canImport: () => true,
        importPane: sinon.spy(),
        exportPane: sinon.spy()
      }
    ]
    const sGrid = {
      adjacentGrids: [{left: {id: 1}}]
    }
    const { movePanePrimary } = paneMover({modes, sGrid})
    movePanePrimary('left')
    t.ok(modes[1].importPane.calledWith('I am a pane', 'left'), 'pane properly imported into adjacent grid')
  } catch (e) {
    t.fail(e)
  }
})

test('movePanePrimary(direction): no op if no room for grid and no adjacent grid', t => {
  t.plan(2)
  try {
    const paneMover = stubPaneMover(9)
    const modes = [
      {
        id: 0,
        grid: {id: 0},
        movePaneMain: sinon.stub.throws(),
        canImport: sinon.spy(),
        importPane: sinon.spy(),
        exportPane: sinon.spy()
      },
      {
        id: 1,
        grid: {id: 1},
        movePaneMain: sinon.spy(),
        canImport: () => true,
        importPane: sinon.spy(),
        exportPane: sinon.spy()
      }
    ]
    const sGrid = {
      adjacentGrids: [{right: {id: 1}}]
    }
    const { movePanePrimary } = paneMover({modes, sGrid})
    movePanePrimary('left')
    t.ok(modes[0].exportPane.notCalled, 'pane not exported from grid')
    t.ok(modes[1].importPane.notCalled, 'pane not imported to non-adjacent grid')
  } catch (e) {
    t.fail(e)
  }
})

test('movePanePrimary(direction): no op if adjacent grid cannot import pane', t => {
  t.plan(2)
  try {
    const paneMover = stubPaneMover(9)
    const modes = [
      {
        id: 0,
        grid: {id: 0},
        movePaneMain: sinon.stub.throws(),
        canImport: sinon.spy(),
        importPane: sinon.spy(),
        exportPane: sinon.spy()
      },
      {
        id: 1,
        grid: {id: 1},
        movePaneMain: sinon.spy(),
        canImport: () => false,
        importPane: sinon.spy(),
        exportPane: sinon.spy()
      }
    ]
    const sGrid = {
      adjacentGrids: [{left: {id: 1}}]
    }
    const { movePanePrimary } = paneMover({modes, sGrid})
    movePanePrimary('left')
    t.ok(modes[0].exportPane.notCalled, 'pane not exported from grid')
    t.ok(modes[1].importPane.notCalled, 'pane not imported to non-adjacent grid')
  } catch (e) {
    t.fail(e)
  }
})

test('movePaneSecondary(direction): moves pane secondary in direction if there is room', t => {
  t.plan(2)
  try {
    const paneMover = stubPaneMover()
    const modes = [ {movePaneSecondary: sinon.spy()}, {movePaneSecondary: sinon.spy()} ]
    const { movePaneSecondary } = paneMover({modes})
    movePaneSecondary('left')
    t.ok(modes[0].movePaneSecondary.calledWith('left'), 'movePaneSecondary of current mode called')
    t.ok(modes[1].movePaneSecondary.notCalled, 'movePaneSecondary of other mode not called')
  } catch (e) {
    t.fail(e)
  }
})

test('movePaneSecondary(direction): no-op when no focused window', t => {
  t.plan(1)
  try {
    const paneMover = stubPaneMoverNoMode()
    const modes = [ {movePaneSecondary: sinon.spy()}, {movePaneSecondary: sinon.spy()} ]
    const { movePaneSecondary } = paneMover({modes})
    movePaneSecondary('left')
    t.ok(modes.every(m => m.movePaneSecondary.notCalled), 'no movePaneSecondary method called')
  } catch (e) {
    t.fail(e)
  }
})

test('movePaneSecondary(direction): skips pane to next grid if it exists', t => {
  t.plan(1)
  try {
    const paneMover = stubPaneMover(9)
    const modes = [
      {
        id: 0,
        grid: {id: 0},
        movePaneSecondary: sinon.stub.throws(),
        canImport: sinon.spy(),
        importPane: sinon.spy(),
        exportPane: () => 'I am a pane'
      },
      {
        id: 1,
        grid: {id: 1},
        movePaneSecondary: sinon.spy(),
        canImport: () => true,
        importPane: sinon.spy(),
        exportPane: sinon.spy()
      }
    ]
    const sGrid = {
      adjacentGrids: [{left: {id: 1}}]
    }
    const { movePaneSecondary } = paneMover({modes, sGrid})
    movePaneSecondary('left')
    t.ok(modes[1].importPane.calledWith('I am a pane', 'left'), 'pane properly imported into adjacent grid')
  } catch (e) {
    t.fail(e)
  }
})

test('movePaneSecondary(direction): no op if no room for grid and no adjacent grid', t => {
  t.plan(2)
  try {
    const paneMover = stubPaneMover(9)
    const modes = [
      {
        id: 0,
        grid: {id: 0},
        movePaneSecondary: sinon.stub.throws(),
        canImport: sinon.spy(),
        importPane: sinon.spy(),
        exportPane: sinon.spy()
      },
      {
        id: 1,
        grid: {id: 1},
        movePaneSecondary: sinon.spy(),
        canImport: () => true,
        importPane: sinon.spy(),
        exportPane: sinon.spy()
      }
    ]
    const sGrid = {
      adjacentGrids: [{right: {id: 1}}]
    }
    const { movePaneSecondary } = paneMover({modes, sGrid})
    movePaneSecondary('left')
    t.ok(modes[0].exportPane.notCalled, 'pane not exported from grid')
    t.ok(modes[1].importPane.notCalled, 'pane not imported to non-adjacent grid')
  } catch (e) {
    t.fail(e)
  }
})

test('movePaneSecondary(direction): no op if adjacent grid cannot import pane', t => {
  t.plan(2)
  try {
    const paneMover = stubPaneMover(9)
    const modes = [
      {
        id: 0,
        grid: {id: 0},
        movePaneSecondary: sinon.stub.throws(),
        canImport: sinon.spy(),
        importPane: sinon.spy(),
        exportPane: sinon.spy()
      },
      {
        id: 1,
        grid: {id: 1},
        movePaneSecondary: sinon.spy(),
        canImport: () => false,
        importPane: sinon.spy(),
        exportPane: sinon.spy()
      }
    ]
    const sGrid = {
      adjacentGrids: [{left: {id: 1}}]
    }
    const { movePaneSecondary } = paneMover({modes, sGrid})
    movePaneSecondary('left')
    t.ok(modes[0].exportPane.notCalled, 'pane not exported from grid')
    t.ok(modes[1].importPane.notCalled, 'pane not imported to non-adjacent grid')
  } catch (e) {
    t.fail(e)
  }
})
