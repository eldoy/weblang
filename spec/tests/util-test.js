const { load, clean } = require('../../lib/util.js')

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

it('should clean an object', async function({ t }) {
  let obj = {
    a: null,
    b: {
      c: null,
      d: 1
    },
    e: [1, 2, null, 3]
  }
  obj = clean(obj)
  t.ok(typeof obj.a == 'undefined')
  t.ok(typeof obj.b.c == 'undefined')
  t.ok(obj.b.d == 1)
  t.ok(obj.e[0] == 1)
  t.ok(obj.e[1] == 2)
  t.ok(obj.e[2] == 3)
})
