// const weblang = require('../../index.js')

// const md = function({ val }) {
//   return val
// }

// it('should support custom renderers', async ({ t }) => {
//   const state = await weblang({
//     renderers: { md }
//   })([
//     '=hello: { a: 1 }',
//     'return: $hello |',
//     '  ```md',
//     '  Hello',
//     '',
//     '  Bye',
//     '  ```'
//   ].join('\n'))
//   t.ok(state.vars.internal == 'Hello')
// })