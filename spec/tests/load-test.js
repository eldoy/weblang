const load = require('../../lib/load.js')

it('should load yaml', async function({ t }) {
  const result = load([
    'hello@1: world',
    'hello@2: world'
  ].join('\n'))

  const keys = Object.keys(result)
  t.ok(keys.length == 2)
  t.ok(keys[0] == 'hello@1')
  t.ok(keys[1] == 'hello@2')
})

it('should load undefined code', async ({ t }) => {
  const result = load()
  t.ok(result == '')
})
