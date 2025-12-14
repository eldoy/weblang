var build = require('../../lib/build.js')

test('object', ({ t }) => {
  var irt = {
    hello: {}
  }
  var result = build(irt)
  t.deepEqual(result, [])
})

test('simple', ({ t }) => {
  var irt = {
    '@p_ID_s-1-1-1-1_ID_': {}
  }
  var result = build(irt)
  t.equal(result[0].id, 's-1-1-1-1')
})

test('multiple', ({ t }) => {
  var irt = {
    '@p_ID_s-1-1-1-1_ID_': {},
    '@a_ID_s-1-2-1-1_ID_': {}
  }
  var result = build(irt)
  t.equal(result[0].id, 's-1-1-1-1')
  t.equal(result[1].id, 's-1-2-1-1')
})

test('nested', ({ t }) => {
  var irt = {
    '@p_ID_s-1-1-1-1_ID_': {
      '@a_ID_s-1-2-1-2_ID_': {}
    }
  }
  var result = build(irt)
  t.equal(result[0].id, 's-1-1-1-1')
  t.equal(result[0].children[0].id, 's-1-2-1-2')
})
