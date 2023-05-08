const { extract } = require('../../index.js')

it('should extract name without id', async ({ t }) => {
  let [key, ext, id] = extract('=hello')
  t.ok(key == '=hello')
  t.ok(ext == '')
  t.ok(id == '')
})

it('should extract name with id', async ({ t }) => {
  let [key, ext, id] = extract('=hello#sdiskr1qhwuci4baas2xz9zo')
  t.ok(key == '=hello')
  t.ok(ext == '')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should extract name without id, dotted', async ({ t }) => {
  let [key, ext, id] = extract('=hello.name.bye')
  t.ok(key == '=hello.name.bye')
  t.ok(ext == '')
  t.ok(id == '')
})

it('should extract name with id, dotted', async ({ t }) => {
  let [key, ext, id] = extract('=hello#sdiskr1qhwuci4baas2xz9zo.name.bye')
  t.ok(key == '=hello.name.bye')
  t.ok(ext == '')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should extract name with key, ext and id', async ({ t }) => {
  let [key, ext, id] = extract('=hello#sdiskr1qhwuci4baas2xz9zo@ext')
  t.ok(key == '=hello')
  t.ok(ext == 'ext')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should extract name with only ext and id', async ({ t }) => {
  let [key, ext, id] = extract('@ext#sdiskr1qhwuci4baas2xz9zo')
  t.ok(key == '')
  t.ok(ext == 'ext')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should extract name with key, ext and id, dotted', async ({ t }) => {
  let [key, ext, id] = extract('=hello#sdiskr1qhwuci4baas2xz9zo.name.bye@ext')
  t.ok(key == '=hello.name.bye')
  t.ok(ext == 'ext')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})

it('should extract name with key, ext and id, prespaced', async ({ t }) => {
  let [key, ext, id] = extract('  =hello#sdiskr1qhwuci4baas2xz9zo.name')
  t.ok(key == '=hello.name')
  t.ok(ext == '')
  t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
})
