const { split } = require('../../index.js')

it('should split name without id', async ({ t }) => {
  let [key, ext, id] = split('=hello')
  t.ok(key == '=hello')
  t.ok(ext == '')
  t.ok(id == '')
})

it('should split name with id', async ({ t }) => {
  let [key, ext, id] = split('=hello#sdiskr1qhwuci4baas2xz9zo')
  t.ok(key == '=hello')
  t.ok(ext == '')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should split name without id, dotted', async ({ t }) => {
  let [key, ext, id] = split('=hello.name.bye')
  t.ok(key == '=hello.name.bye')
  t.ok(ext == '')
  t.ok(id == '')
})

it('should split name with id, dotted', async ({ t }) => {
  let [key, ext, id] = split('=hello#sdiskr1qhwuci4baas2xz9zo.name.bye')
  t.ok(key == '=hello.name.bye')
  t.ok(ext == '')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should split name with key, ext and id', async ({ t }) => {
  let [key, ext, id] = split('=hello#sdiskr1qhwuci4baas2xz9zo@ext')
  t.ok(key == '=hello')
  t.ok(ext == 'ext')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should split name with only ext and id', async ({ t }) => {
  let [key, ext, id] = split('@ext#sdiskr1qhwuci4baas2xz9zo')
  t.ok(key == '')
  t.ok(ext == 'ext')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should split name with key, ext and id, dotted', async ({ t }) => {
  let [key, ext, id] = split('=hello#sdiskr1qhwuci4baas2xz9zo.name.bye@ext')
  t.ok(key == '=hello.name.bye')
  t.ok(ext == 'ext')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should split name with key, ext and id, prespaced', async ({ t }) => {
  let [key, ext, id] = split('  =hello#sdiskr1qhwuci4baas2xz9zo.name')
  t.ok(key == '=hello.name')
  t.ok(ext == '')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})
