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

ext.return = async function ({ state, val }) {
  state.return = lodash.cloneDeep(val)
}

module.exports = ext
