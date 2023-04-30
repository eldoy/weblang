const util = require('../../lib/util.js')

it('should extract lang and body', async ({ t }) => {
  const content = [
    '```md',
    'Hello',
    '',
    'Bye',
    '```'
  ].join('\n')
  const [lang, body] = util.renderer(content)

  t.ok(lang == 'md')
  t.ok(body == 'Hello\n\nBye')
})