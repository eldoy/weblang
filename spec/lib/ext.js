const ext = {}

ext.db = function({ set }) {
  set('=internal', 'hello')
  return { id: '1' }
}

module.exports = ext