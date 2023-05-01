const formatter = require('tomarkup')()

const renderers = {}

renderers.md = function() {
  return 'markdown'
}

renderers.tomarkup = function({ val, body }) {
  const { html } = formatter(body, val)
  return html
}

module.exports = renderers
