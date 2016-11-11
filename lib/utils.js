'use strict'

module.exports = {
  moveOrThrow,
  paneIsOnScreenEdge,
  paneOccupiesSameSpaceAtDirection
}

function paneMoved (firstPosition, secondPosition) {
  if (
    firstPosition.x === secondPosition.x &&
    firstPosition.y === secondPosition.y &&
    firstPosition.width === secondPosition.width &&
    firstPosition.height === secondPosition.height
  ) return false
  return true
}

function moveOrThrow (sGrid, move) {
  const previousPosition = sGrid.currentPanePosition()
  if (!previousPosition) return // no focused window
  move()
  const currentPosition = sGrid.currentPanePosition()
  if (!paneMoved(previousPosition, currentPosition)) throw new Error('location blocked')
}

function paneIsOnScreenEdge (pane, grid, direction) {
  if (direction === 'left' && pane.x + pane.width === grid.width) return true
  if (direction === 'up' && pane.y + pane.height === grid.height) return true
  if (direction === 'right' && pane.x === 0) return true
  if (direction === 'down' && pane.y === 0) return true
  return false
}

function paneOccupiesSameSpaceAtDirection (pane, winBounds, direction) {
  if (
    (direction === 'left' || direction === 'right') &&
    (
      winBounds.y >= pane.y &&
      winBounds.y <= pane.y + pane.height
    ) ||
    (
      winBounds.y + winBounds.height <= pane.y + pane.height &&
      winBounds.y + winBounds.height > pane.y
    )
  ) return true
  if (
    (direction === 'up' || direction === 'down') &&
    (
      (
        winBounds.x >= pane.x &&
        winBounds.x <= pane.x + pane.width
      ) ||
      (
       winBounds.x + winBounds.width <= pane.x + pane.width &&
       winBounds.x + winBounds.width > pane.x
      )
    )
  ) return true
  return false
}
