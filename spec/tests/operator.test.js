var operator = require('../../lib/operator.js')

test('simple', ({ t }) => {
  var result = operator('@p', 'hello')
  t.deepEqual(result, {})
})
