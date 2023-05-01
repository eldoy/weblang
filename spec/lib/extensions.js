const extensions = {}

extensions.db = function({ set }) {
  set('=internal', 'hello')
  return { id: '1' }
}

module.exports = extensions