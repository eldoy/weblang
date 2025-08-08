var lodash = require('lodash')

var ext = {}

ext.if = async function ({ state, ok, val }) {
  state.test = await ok(val)
}

ext.then = async function ({ state, val, run }) {
  if (state.test) {
    await run(val)
    delete state.test
  }
}

ext.else = async function ({ state, val, run }) {
  if (state.test === false) {
    await run(val)
    delete state.test
  }
}

ext.delete = async function ({ state, current }) {
  var keyToDelete = current.replace('$', 'vars.')

  // Check if the path includes an array index, like 'vars.param.list[0]'
  var arrayMatch = keyToDelete.match(/^(.*)\[(\d+)\]$/)

  if (arrayMatch) {
    var arrayPath = arrayMatch[1] // e.g., 'vars.param.list'
    var index = parseInt(arrayMatch[2], 10)

    // Get the array from the state object
    var arr = lodash.get(state, arrayPath)

    // If it's a valid array and the index exists, remove the item at that index
    if (Array.isArray(arr) && index >= 0 && index < arr.length) {
      arr.splice(index, 1)
    }
  } else {
    // If it's not an array path, just unset the property normally
    lodash.unset(state, keyToDelete)
  }
}

ext.return = async function ({ state, val }) {
  state.return = lodash.cloneDeep(val)
}

module.exports = ext
