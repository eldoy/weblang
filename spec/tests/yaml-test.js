const yaml = require('../../lib/yaml.js')

it('should allow duplicate keys', async function({ t }) {
  const result = yaml([
    'hello@1: world',
    'hello@2: world'
  ].join('\n'))

  const keys = Object.keys(result)
  t.ok(keys.length == 2)
  t.ok(keys[0] == 'hello@1')
  t.ok(keys[1] == 'hello@2')
})
