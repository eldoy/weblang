var parse = require('./parse.js')
var tag = require('./tag.js')
var build = require('./build.js')

function compile(code) {
  if (!code) return {}
  if (typeof code !== 'string') return {}

  code = code.replace(/\t/g, '  ')

  var lines = code.split('\n')

  // Uncomment to debug:
  // console.log({ lines })

  var block = 1
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim()
    if (line === '') {
      if (i === 0 || lines[i - 1].trim() !== '') block++
    } else {
      lines[i] = tag(line, i + 1, block)
    }
  }
  code = lines.join('\n')

  // Uncomment to debug:
  // console.log({ code })

  var irt = parse(code)

  // Uncomment to debug:
  // console.log({ irt })

  var ast = build(irt)

  // Uncomment to debug:
  // console.log({ ast })

  return ast
}

module.exports = compile
