var tag = require('./tag.js')

var ext = {}

ext.if = {
  name: 'if',
  handler: async function ({ state, data, ok }) {
    state.test = await ok(data, state)
  }
}

ext.then = {
  name: 'then',
  handler: async function ({ state }) {
    if (state.test === true) {
      delete state.test
    } else {
      state.break = true
    }
  }
}

ext.else = {
  name: 'else',
  handler: async function ({ state }) {
    if (state.test === false) {
      delete state.test
    } else {
      state.break = true
    }
  }
}

ext.delete = {
  name: 'delete',
  handler: async function ({ state, node }) {
    if (typeof node.value === 'string' && node.value[0] === '$') {
      delete state.vars[node.value.slice(1)]
    }
  }
}

ext.return = {
  name: 'return',
  handler: async function ({ state, data }) {
    state.return = data
  }
}

ext.each = {
  name: 'each',
  handler: async function ({ state, node }) {
    var v = node.value
    if (typeof v === 'string') {
      v = { in: v }
    }
    state.in = (v.in || '').slice(1)
    state.as = v.as || 'item'
    state.n = v.n || 'i'
  }
}

ext.do = {
  name: 'do',
  handler: async function ({ state, get }) {
    var it = (state.iterator = get(state, state.in))
    if (!it || !it.length) {
      delete state.iterator
      delete state.in
      delete state.as
      delete state.n
      state.break = true
      state.test = false
    }
  }
}

module.exports = ext
