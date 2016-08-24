import commonjs from 'rollup-plugin-commonjs'
import nodeResolve from 'rollup-plugin-node-resolve'

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
  entry: 'lib/main.js',
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      include: ['node_modules/**', 'lib/**', 'addons/**', 'src/**'],
      extensions: [ '.js' ],
      ignoreGlobal: false,
      sourceMap: false,
    })
  ],
  external: external,
  targets: [
    {
      dest: pkg['main'],
      format: 'iife',
      moduleName: 'terminal',
      sourceMap: true
    }
  ]
};
