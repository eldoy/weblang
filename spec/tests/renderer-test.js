const weblang = require('../../index.js')

const md = function() {
  return 'nisse'
}

it('should return value if renderer not found', async ({ t }) => {
  const state = await weblang({})([
    '=hello: { a: 1 }',
    '@return: $hello |',
    '  ```md',
    '  Hello',
    '',
    '',
    '  Bye',
    '  ```'
  ].join('\n'))
  t.ok(state.return == 'Hello\n\nBye')
})

it('should support custom renderers', async ({ t }) => {
  const state = await weblang({
    renderers: { md }
  })([
    '=hello: { a: 1 }',
    '@return: $hello |',
    '  ```md',
    '  Hello',
    '',
    '',
    '  Bye',
    '  ```'
  ].join('\n'))
  t.ok(state.return == 'nisse')
})
