const parse = require('../../lib/parse.js')

it('should parse a statement into value and pipes', async ({ t }) => {
  let [val, pipes] = parse('hello | join hello=1234 name=bye | something b=1')
  t.ok(val, 'hello')
  t.ok(pipes['join'].hello == '1234')
  t.ok(pipes['join'].name == 'bye')
  t.ok(pipes['something'].b == '1')
})
