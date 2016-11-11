const test = require('tape')
const proxyquire = require('proxyquire')

function stubModeAtCurrentWindow (id) {
  return proxyquire('../../lib/mode-at-current-window', {
    electron: {BrowserWindow: {getFocusedWindow: () => ({id})}}
  })
}

function stubModeAtCurrentWindowNoFocusedWindow (id) {
  return proxyquire('../../lib/mode-at-current-window', {
    electron: {BrowserWindow: {getFocusedWindow: () => {}}}
  })
}

test('modeAtCurrentWindow(modes): returns mode of screen containing focused window', t => {
  t.plan(1)
  try {
    const modeAtCurrentWindow = stubModeAtCurrentWindow(3)
    const modes = [
      {
        grid: {
          panes: [ {id: 1}, {id: 2} ]
        }
      },
      {
        grid: {
          panes: [ {id: 3}, {id: 4} ]
        }
      }
    ]
    t.equals(modeAtCurrentWindow(modes), modes[1], 'mode equals second mode')
  } catch (e) {
    t.fail(e)
  }
})

test('modeAtCurrentWindow(modes): returns nothing if there is no focused window', t => {
  t.plan(1)
  try {
    const modeAtCurrentWindow = stubModeAtCurrentWindowNoFocusedWindow()
    const modes = [
      {
        grid: {
          panes: [ {id: 1}, {id: 2} ]
        }
      },
      {
        grid: {
          panes: [ {id: 3}, {id: 4} ]
        }
      }
    ]
    t.equals(modeAtCurrentWindow(modes), undefined)
  } catch (e) {
    t.fail(e)
  }
})
