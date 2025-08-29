var parse = require('./parse.js')
var tag = require('./tag.js')
var build = require('./build.js')
var linker = require('./linker.js')

function compile(code) {
  if (!code) return []
  if (typeof code !== 'string') return []

  code = code.replace(/\t/g, '  ')

  var lines = code.split('\n')

  var block = 1
  for (var i = 0; i < lines.length; i++) {
    var row = lines[i]
    if (row === '') {
      if (i === 0 || lines[i - 1].trim() !== '') block++
    } else {
      lines[i] = tag(row, block, i + 1)
    }
  }
  code = lines.join('\n')

  var irt = parse(code)
  var ast = build(irt)
  var linked = linker(ast)

  return linked
}

module.exports = compile
