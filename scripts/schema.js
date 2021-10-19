var { read } = require('extras')
var TOML = require('@ltd/j-toml')
var config = read('./schema.toml')
var data = TOML.parse(config, '\n', false)
// var data = read('./schema.yml')

console.dir(JSON.stringify(data, null, 2))