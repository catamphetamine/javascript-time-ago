import commonjs from 'rollup-plugin-commonjs'
// import json from 'rollup-plugin-json'
import node from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'

export default [
  // (deprecated)
  // Old bundle: old file name (with ".min")
  // and exports `window['javascript-time-ago'].default` variable.
  {
    input: 'index.js',
    plugins: [
      node(),
      commonjs(),
      // json(),
      terser()
    ],
    output: {
      format: 'umd',
      name: 'javascript-time-ago', // Should be "TimeAgo".
      file: 'bundle/javascript-time-ago.min.js',
      sourcemap: true,
      // exports: 'default'
    }
  },
  // New bundle: new file name (without ".min")
  // and exports `TimeAgo` global variable.
  {
    input: 'modules/TimeAgo.js',
    plugins: [
      node(),
      commonjs(),
      // json(),
      terser()
    ],
    output: {
      format: 'umd',
      name: 'TimeAgo',
      file: 'bundle/javascript-time-ago.js',
      // exports: 'default',
      sourcemap: true
    }
  }
]