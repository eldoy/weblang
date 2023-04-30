const util = require('../../lib/util.js')

it('should split name without id', async ({ t }) => {
  let result = util.split('hello')
  t.ok(result[0] == 'hello')
  t.ok(result[1] == '')
})

it('should split name with id', async ({ t }) => {
  let result = util.split('hello#sdiskr1qhwuci4baas2xz9zo')
  t.ok(result[0] == 'hello')
  t.ok(result[1] == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should split name without id, dotted', async ({ t }) => {
  let result = util.split('hello.name.bye')
  t.ok(result[0] == 'hello.name.bye')
  t.ok(result[1] == '')
})

it('should split name with id, dotted', async ({ t }) => {
  let result = util.split('hello#sdiskr1qhwuci4baas2xz9zo.name.bye')
  t.ok(result[0] == 'hello.name.bye')
  t.ok(result[1] == 'sdiskr1qhwuci4baas2xz9zo')
})
