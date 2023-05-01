const { init, renderer } = require('../../index.js')

const md = function() {
  return 'nisse'
}

it('should extract lang and body', async ({ t }) => {
  const content = '```md Hello\nBye ```'
  const [lang, body] = renderer(content)

  t.ok(lang == 'md')
  t.ok(body == 'Hello\nBye')
})

it('should return value if renderer not found', async ({ t }) => {
  const state = await init([
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
  const state = await init([
    '=hello: { a: 1 }',
    '@return: $hello |',
    '  ```md',
    '  Hello',
    '',
    '',
    '  Bye',
    '  ```'
  ].join('\n'), {
    renderers: { md }
  })
  t.ok(state.return == 'nisse')
})
