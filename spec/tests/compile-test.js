let compile = require('../../lib/compile.js')

it('should compile undefined code', async ({ t }) => {
  let result = compile()
  t.ok(result == '')
})

it('should compile yaml with variable', async function({ t }) {
  let result = compile([
    '=hello: world'
  ].join('\n'))

  let keys = Object.keys(result)
  t.ok(keys.length == 1)
  t.ok(keys[0].startsWith('=hello#'))
})

it('should compile yaml multiple variables', async function({ t }) {
  let result = compile([
    '=hello: world',
    '=hello: moon'
  ].join('\n'))

  let keys = Object.keys(result)
  t.ok(keys.length == 2)
  t.ok(keys[0].startsWith('=hello#'))
  t.ok(keys[1].startsWith('=hello#'))
})

it('should compile extension functions', async function({ t }) {
  let result = compile([
    '@if:',
    '  name:',
    '    eq: hello',
    '@then:',
    '  =hello: moon',
    '@else:',
    '  =hello: sun'
  ].join('\n'))

  let keys = Object.keys(result)
  t.ok(keys.length == 3)
  t.ok(keys[0].startsWith('@if#'))
  t.ok(keys[1].startsWith('@then#'))
  t.ok(keys[2].startsWith('@else#'))

  // Check deeply
  let hello = Object.keys(result[keys[1]])
  t.ok(hello[0].startsWith('=hello#'))
})
