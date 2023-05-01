// const util = require('../../lib/util.js')

// /**
//  * util.renderer
//  */

// it('should extract lang and body', async ({ t }) => {
//   const content = '```md Hello\nBye ```'
//   const [lang, body] = util.renderer(content)

//   t.ok(lang == 'md')
//   t.ok(body == 'Hello\nBye')
// })

// /**
//  * util.split
// */

// it('should split name without id', async ({ t }) => {
//   let [key, ext, id] = util.split('=hello')
//   t.ok(key == '=hello')
//   t.ok(ext == '')
//   t.ok(id == '')
// })

// it('should split name with id', async ({ t }) => {
//   let [key, ext, id] = util.split('=hello#sdiskr1qhwuci4baas2xz9zo')
//   t.ok(key == '=hello')
//   t.ok(ext == '')
//   t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
// })

// it('should split name without id, dotted', async ({ t }) => {
//   let [key, ext, id] = util.split('=hello.name.bye')
//   t.ok(key == '=hello.name.bye')
//   t.ok(ext == '')
//   t.ok(id == '')
// })

// it('should split name with id, dotted', async ({ t }) => {
//   let [key, ext, id] = util.split('=hello#sdiskr1qhwuci4baas2xz9zo.name.bye')
//   t.ok(key == '=hello.name.bye')
//   t.ok(ext == '')
//   t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
// })

// it('should split name with key, ext and id', async ({ t }) => {
//   let [key, ext, id] = util.split('=hello#sdiskr1qhwuci4baas2xz9zo@ext')
//   t.ok(key == '=hello')
//   t.ok(ext == 'ext')
//   t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
// })

// it('should split name with only ext and id', async ({ t }) => {
//   let [key, ext, id] = util.split('@ext#sdiskr1qhwuci4baas2xz9zo')
//   t.ok(key == '')
//   t.ok(ext == 'ext')
//   t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
// })

// it('should split name with key, ext and id, dotted', async ({ t }) => {
//   let [key, ext, id] = util.split('=hello#sdiskr1qhwuci4baas2xz9zo.name.bye@ext')
//   t.ok(key == '=hello.name.bye')
//   t.ok(ext == 'ext')
//   t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
// })

// it('should split name with key, ext and id, prespaced', async ({ t }) => {
//   let [key, ext, id] = util.split('  =hello#sdiskr1qhwuci4baas2xz9zo.name')
//   t.ok(key == '=hello.name')
//   t.ok(ext == '')
//   t.ok(id == 'sdiskr1qhwuci4baas2xz9zo')
// })
