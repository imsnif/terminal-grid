'use strict'

const paneMover = require('../components/pane-mover')
const paneAdder = require('../components/pane-adder')
const paneResizer = require('../components/pane-resizer')
const paneGridActions = require('../components/pane-grid-actions')
const minimizeToggler = require('../components/minimize-toggler')
const modeSwitcher = require('../components/mode-switcher')

module.exports = function ModeManager (sGrid, wChanger, TerminalWindow, modeConstructors) {
  let state = {
    sGrid,
    wChanger,
    TerminalWindow,
    modeTypes: modeConstructors,
    modes: sGrid.grids.map((g, index) => index % 2
      ? new modeConstructors[1](g.id, sGrid, wChanger, TerminalWindow)
      : new modeConstructors[0](g.id, sGrid, wChanger, TerminalWindow)
      // TODO: get config from outside, until then - these can be switched around manually as needed
    )
  }
  return Object.assign(state,
    paneMover(state),
    paneAdder(state),
    paneResizer(state),
    paneGridActions(state),
    minimizeToggler(state),
    modeSwitcher(state)
  )
}
