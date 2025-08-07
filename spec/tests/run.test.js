var parse = require('../../lib/parse.js')

test('parse undefined code', async ({ t }) => {
  var result = parse()
  t.ok(result == '')
})

test('parse yaml with variable', async function ({ t }) {
  var result = parse(['=hello: world'].join('\n'))

  var keys = Object.keys(result)
  t.ok(keys.length == 1)
  t.ok(keys[0].startsWith('=hello#'))
})

test('parse yaml multiple variables', async function ({ t }) {
  var result = parse(['=hello: world', '=hello: moon'].join('\n'))

  var keys = Object.keys(result)
  t.ok(keys.length == 2)
  t.ok(keys[0].startsWith('=hello#'))
  t.ok(keys[1].startsWith('=hello#'))
})

test('parse extension functions', async function ({ t }) {
  var result = parse(
    [
      '@if:',
      '  name:',
      '    eq: hello',
      '@then:',
      '  =hello: moon',
      '@else:',
      '  =hello: sun',
    ].join('\n'),
  )

  var keys = Object.keys(result)
  t.ok(keys.length == 3)
  t.ok(keys[0].startsWith('@if#'))
  t.ok(keys[1].startsWith('@then#'))
  t.ok(keys[2].startsWith('@else#'))

  // Check deeply
  var hello = Object.keys(result[keys[1]])
  t.ok(hello[0].startsWith('=hello#'))
})
