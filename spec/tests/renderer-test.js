const { init, renderer } = require('../../index.js')
const { md, tomarkup } = require('../lib/renderers.js')

it('should extract lang and body', async ({ t }) => {
  const content = '```md Hello\nBye ```'
  const [lang, body] = renderer(content)

  t.ok(lang == 'md')
  t.ok(body == 'Hello\nBye')
})

it('should return value if renderer not found', async ({ t }) => {
  const code = [
    '=hello: { a: 1 }',
    '@return: $hello |',
    '  ```',
    '  Hello',
    '',
    '',
    '  Bye',
    '  ```'
  ].join('\n')
  const state = await init().run(code)
  t.ok(state.return == 'Hello\n\nBye')
})

it('should support custom renderers', async ({ t }) => {
  const code = [
    '=hello: { a: 1 }',
    '@return: $hello |',
    '  ```md',
    '  Hello',
    '',
    '',
    '  Bye',
    '  ```'
  ].join('\n')
  const state = await init({
    renderers: { md }
  }).run(code)
  t.ok(state.return == 'markdown')
})

it('should support renderers with data from val', async ({ t }) => {
  const code = [
    '=user: { name: "Bobby" }',
    '@return: $user |',
    '  ```tomarkup',
    '  <h1>Hi {{name}}</h1>',
    '  ```'
  ].join('\n')
  const state = await init({
    renderers: { tomarkup }
  }).run(code)
  t.ok(state.return == '<h1>Hi Bobby</h1>')
})

it('should return body on non-function renderers', async ({ t }) => {
  const code = [
    '=hello: { a: 1 }',
    '@return: $hello |',
    '  ```md',
    '  Hello',
    '  ```'
  ].join('\n')

  const state = await init({
    renderers: { md: '' }
  }).run(code)
  console.log(state.return)
  t.ok(state.return == 'Hello')
})