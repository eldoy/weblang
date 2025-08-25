var dotpath = require('../../lib/dotpath.js')

test('simple', ({ t }) => {
  var result = dotpath('hello')
  t.deepEqual(result, ['hello'])
})

test('dotted', ({ t }) => {
  var result = dotpath('hello.world')
  t.deepEqual(result, ['hello', 'world'])
})
