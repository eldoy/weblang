var lodash = require('lodash')

var ext = {}

ext.if = {
  name: 'if',
  handler: async function ({ node, state, data, ok, get }) {
    state.test = await ok(data, state)
  },
}

ext.then = {
  name: 'then',
  handler: async function ({ state }) {
    if (state.test !== true) {
      state.break = true
      return
    }
  },
}

ext.else = {
  name: 'else',
  handler: async function ({ state }) {
    if (state.test !== false) {
      state.break = true
      return
    }
  },
}

ext.delete = {
  name: 'delete',
  handler: async function ({ state }) {
    console.log('implement')
  },
}

ext.return = {
  name: 'return',
  handler: async function ({ state, data }) {
    state.return = data
  },
}

module.exports = ext
