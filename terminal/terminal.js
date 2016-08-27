'use strict'

const pty = require('pty.js')
const Terminal = require('xterm')

const termOpts = {
  cursorBlink: false
}

function ptyOpts (term) {
  return {
    name: 'xterm-color',
    cols: term.cols,
    rows: term.rows,
    cwd: process.env.PWD,
    env: process.env
  }
}

function fitTerminal (term, width, height) {
  term.resize(
    Math.floor(window.innerWidth / 8) - 1,
    Math.floor(window.innerHeight / 18)
  )
}

function attachTerminals(term, ptyTerm) {
  ptyTerm.on('data', function(data) {
    term.write(data);
  })
  term.on('data', function(data) {
    ptyTerm.write(data);
  })
  term.on('resize', (opts) => {
    ptyTerm.resize(opts.cols, opts.rows)
  })
}

module.exports = function createTerminal(terminalContainer, opts = {}) {
  const term = new Terminal(Object.assign({}, termOpts, opts))
  term.open(terminalContainer);
  const ptyTerm = pty.spawn(process.platform === 'win32' ? 'cmd.exe' : 'bash',
    [],
    Object.assign({}, ptyOpts(term), opts)
  )
  attachTerminals(term, ptyTerm)
  fitTerminal(term, window.innerWidth, window.innerHeight)
  window.addEventListener('resize', () => {
    fitTerminal(term, window.innerWidth, window.innerHeight)
  })
}
