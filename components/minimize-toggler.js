'use strict'

module.exports = function minimizeToggler (state) {
  return {
    togglePaneFullSize: () => {
      state.sGrid.toggleCurrentWinFullSize() // TODO: move this function here
    },
    toggleAllShow: () => {
      state.wChanger.toggleAllShow()
    }
  }
}
