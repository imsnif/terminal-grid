'use strict'

// TODO: support multiple panels
// TODO: detect os and if xfconf-query exists

const command = require('command-promise')

module.exports = () => command('xfconf-query -c xfce4-panel -p /panels')
.then(o => {
  const lines = o[0].split(/\n/)
  return lines[2]
})
.then(panel => Promise.all([
  command(`xfconf-query -c xfce4-panel -p /panels/panel-${panel}/size`),
  command(`xfconf-query -c xfce4-panel -p /panels/panel-${panel}/position`)
]))
.then(([size, position]) => {
  const sizeLines = size[0].split(/\n/)
  const positionLines = position[0].split(/\n/)
  const actualSize = sizeLines[0]
  const actualPosition = positionLines[0]
  const x = parseInt(actualPosition.match(/x=(\d+)/)[1])
  const y = parseInt(actualPosition.match(/y=(\d+)/)[1])
  return {x, y, height: parseInt(x + actualSize), width: 0} // TODO: find out how to get width and height properly
})
.catch(e => console.error(e))
