var parser = require('himalaya')

var html = {}

html.div = async function ({ get, set, run, val, state, current }) {
  if (state.vars.level == undefined) {
    state.vars.level = 0
  }

  function buildPath(withDollar) {
    var path = withDollar ? '$tags[0]' : 'tags[0]'

    if (state.vars.level === 0) return withDollar ? '$tags' : 'tags'

    for (var i = 0; i < state.vars.level; i++) {
      path += i === 0 ? '.children' : '[0].children'
    }

    return path
  }

  var tags = get(buildPath(true)) || []

  var element = {
    type: 'element',
    tagName: 'div',
    attributes: [],
    children: []
  }

  var content = ''
  var hasDivChild = false
  if (typeof current == 'string') {
    content = current
  } else {
    for (var key in current) {
      if (key == 'text') {
        content = current[key]
      } else if (key.startsWith('@div')) {
        hasDivChild = true
      } else {
        element.attributes.push({ key, value: current[key] })
      }
    }
  }

  if (content) {
    element.children.push({ type: 'text', content })
  }

  tags.push(element)
  set(buildPath(false), tags)

  if (hasDivChild) {
    state.vars.level++
    await run(val)
  }
}

module.exports = html
