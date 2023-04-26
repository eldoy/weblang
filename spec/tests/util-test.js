const util = require('../../lib/util.js')

it('should split name without id', async ({ t }) => {
  let result = util.split('hello')
  t.ok(result[0] == 'hello')
  t.ok(result[1] == '')
})

it('should split name with id', async ({ t }) => {
  let result = util.split('hello#1234')
  t.ok(result[0] == 'hello')
  t.ok(result[1] == '1234')
})

it('should split name without id, dotted', async ({ t }) => {
  let result = util.split('hello.name.bye')
  t.ok(result[0] == 'hello.name.bye')
  t.ok(result[1] == '')
})

it('should split name with id, dotted', async ({ t }) => {
  let result = util.split('hello#1234.name.bye')
  t.ok(result[0] == 'hello.name.bye')
  t.ok(result[1] == '1234')
})

it('should parse pipe options', async ({ t }) => {
  let result = util.parsePipes([
    'join hello=1234&name=bye',
    'something b=1'
  ])
  t.ok(result['join'].hello == '1234')
  t.ok(result['join'].name == 'bye')
  t.ok(result['something'].b == '1')
})
