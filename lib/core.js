const _ = require('lodash')

const core = {}

core.if = async function({ state, ok, val }) {
  state.test = await ok(val)
}

core.then = async function({ state, val, run }) {
  if (state.test) {
    await run(val)
    delete state.test
  }
}

core.else = async function({ state, val, run }) {
  if (state.test === false) {
    await run(val)
    delete state.test
  }
}

core.return = async function({ state, val }) {
  state.return = _.cloneDeep(val)
}

module.exports = core
