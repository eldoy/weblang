var lodash = require('lodash')

var ext = {}

ext.if = {
  name: 'if',
  handler: async function ({ state, data, ok }) {
    state.test = await ok(data, state)
  },
}

ext.then = {
  name: 'then',
  handler: async function ({ state }) {
    if (state.test === true) {
      delete state.test
    } else {
      state.break = true
    }
  },
}

ext.else = {
  name: 'else',
  handler: async function ({ state }) {
    if (state.test === false) {
      delete state.test
    } else {
      state.break = true
    }
  },
}

ext.delete = {
  name: 'delete',
  handler: async function ({ state, node }) {
    if (node.value) {
      delete state.vars[node.value]
    }
  },
}

ext.return = {
  name: 'return',
  handler: async function ({ state, data }) {
    state.return = data
  },
}

module.exports = ext
