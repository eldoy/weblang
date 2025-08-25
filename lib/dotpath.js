var lodash = require('lodash')

function dotpath(path) {
  return lodash.toPath(path)
}

module.exports = dotpath
