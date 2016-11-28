'use strict'

// these listeners serve to connect the various grid events to electron's api

module.exports = {
  changeBounds: (win, params) => {
    const offset = params.offset
    win.setBounds({
      width: params.width,
      height: params.height,
      x: params.x + offset.x,
      y: params.y + offset.y
    })
  },
  close: (win) => {
    win.close()
  }
}
