var parser = require('himalaya')

var html = {}

async function simpleTag({ get, set, run, val, ext, state, current }) {
  state.vars.currentLevel ||= 0
  state.vars.previousLevel ||= 0

  var tagsPath = 'tags'

  if (state.vars.currentLevel > 0) {
    var path = 'tags[0]'

    for (var i = 0; i < state.vars.currentLevel; i++) {
      path += i === 0 ? '.children' : '[0].children'
    }

    tagsPath = path
  }

  var tags = get('$' + tagsPath) || []

  var element = {
    type: 'element',
    tagName: ext,
    attributes: [],
    children: []
  }

  var content = ''
  var hasChild = false
  if (['string', 'number', 'boolean'].includes(typeof current)) {
    content = get(current)
  } else {
    for (var key in current) {
      if (key == 'text') {
        content = get(current[key])
      } else if (key.startsWith('@')) {
        hasChild = true
      } else {
        element.attributes.push({ key, value: current[key] })
      }
    }
  }

  if (content) {
    element.children.push({ type: 'text', content })
  }

  tags.push(element)
  set(tagsPath, tags)

  if (hasChild) {
    state.vars.previousLevel = state.vars.currentLevel
    state.vars.currentLevel++
    await run(val)
  }
}

html.div = simpleTag
html.p = simpleTag

module.exports = html
