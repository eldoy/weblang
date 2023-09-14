var tag = require('../../lib/tag.js')

it('should add tag to simple extension', async ({ t }) => {
  var code = '@db: user'
  var result = tag(code)
  var matcher = /@db#[a-z0-9]+?:/gm
  t.ok(matcher.test(result))
})
