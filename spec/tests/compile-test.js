const compile = require('../../lib/compile.js')

it('should compile undefined code', async ({ t }) => {
  const result = compile()
  t.ok(result == '')
})

it('should compile yaml with variable', async function({ t }) {
  const result = compile([
    '=hello: world'
  ].join('\n'))

  const keys = Object.keys(result)
  t.ok(keys.length == 1)
  t.ok(keys[0].startsWith('=hello#'))
})

it('should compile yaml multiple variables', async function({ t }) {
  const result = compile([
    '=hello: world',
    '=hello: moon'
  ].join('\n'))

  const keys = Object.keys(result)
  t.ok(keys.length == 2)
  t.ok(keys[0].startsWith('=hello#'))
  t.ok(keys[1].startsWith('=hello#'))
})

it('should compile extension functions', async function({ t }) {
  const result = compile([
    '@if:',
    '  name:',
    '    eq: hello',
    '@then:',
    '  =hello: moon',
    '@else:',
    '  =hello: sun'
  ].join('\n'))

  const keys = Object.keys(result)
  t.ok(keys.length == 3)
  t.ok(keys[0].startsWith('@if#'))
  t.ok(keys[1].startsWith('@then#'))
  t.ok(keys[2].startsWith('@else#'))

  // Check deeply
  const hello = Object.keys(result[keys[1]])
  t.ok(hello[0].startsWith('=hello#'))
})
