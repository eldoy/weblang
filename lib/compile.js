var yaml = require('js-yaml')
var tag = require('./tag.js')

function compile(source) {
  if (!source) return {}

  var lines = source.trim().split('\n')

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
  source = lines.join('\n')

  // Uncomment to debug:
  // console.log({ source })

  var result = yaml.load(source)

  // Uncomment to debug:
  // console.log({ result })
  return result
}

module.exports = compile
