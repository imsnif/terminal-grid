'use strict'

const windows = {} // screenId: [winId, winId, winId, ...]
let curScreenIndex = false
let curWinIndex = false

module.exports = {
  getCurrentWinIndex: function () {
    return curWinIndex
  },
  getLastWinIndex: function () {
    if (!windows[curScreenIndex]) {
      return false
    }
    const curWindows = windows[curScreenIndex]
    return curWindows[curWindows.length]
  },
  getCurrentScreen: function () {
    return curScreenIndex
  },
  nextWin: function () {
    curWinIndex = windows[curScreenIndex][curWinIndex + 1] ? curWinIndex + 1 : 0
  },
  getCurrentWin: function () {
    console.log('curScreenIndex:', curScreenIndex)
    return curWinIndex
  },
  removeWin: function (winId) {
    const winIndex = windows[curScreenIndex].indexOf(winId)
    windows[curScreenIndex].slice(winIndex, 1)
    curWinIndex = winIndex > 1
      ? winIndex
      : false
  },
  addWin: function (winId) {
    console.log('winId:', winId)
    const curScreen = Object.keys(windows)[curScreenIndex]
    windows[curScreen].push(winId)
  },
  switchWin: function (winId) {
    curWinIndex = windows[curScreenIndex].indexOf(winId)
    console.log('setting curwinIndex to:', curWinIndex)
  },
  addScreen: function (screenId) {
    windows[screenId] = []
  },
  switchScreen: function () {
    curScreenIndex = curScreenIndex !== undefined && Object.keys(windows)[curScreenIndex + 1]
      ? curScreenIndex + 1
      : 0
  }
}
