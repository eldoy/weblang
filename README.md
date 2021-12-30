# Weblang

The Weblang language lets you write safe, portable and efficient code with minimal logic. Written to let users run code on your server.

### Install
```
npm i weblang
```

### Usage

```js
const weblang = require('weblang')
const code = '$hello: world'
const state = await weblang()(code)
```

### Set

Set variables, available in `state.vars`:

```yaml
# Set string variable
$hello: world

# Set object variable
$hello:
  a: 1
  b: 2

# Set array variable
$hello:
  - 1
  - 2

#  Set bool variable
$hello: true

# Set variable from other variable
$hello: world
$bye: $hello

# Set object value from other variable
$hello: world
$bye:
  name: $hello

# Set array index from other variable
$hello: world
$bye:
  - $hello

# Set variable in object, dot notation
$hello:
  name:
    deep: 1
$bye: $hello.name.deep

# Set variable in array, dot notation
$hello:
  - 1
  - 2
$bye: $hello[0]

# Set variable in object array, dot notation
$hello:
  - name: nils
$bye: $hello[0].name

# Non existing variables are empty strings
$bye: $hello
```

### If then else

Minimal logic is achieved through _if, then and else_.

The validations inside the if-section are from [the Waveorb validations.](https://waveorb.com/doc/actions#validations)

```yaml
# If with then
$hello:
  name: nils
if:
  $hello:
    name:
      eq: nils
then:
  $hello.name: hans

# Multiple checks
$hello:
  name: nils
$req:
  pathname: /hello
if:
  $hello:
    name:
      eq: nils
  $req:
    pathname:
      eq: /hello
then:
  $hello.name: hans

# The checks work dot notation as well
$hello:
  name: nils
if:
  $hello.name.eq: nils
then:
  $hello.name: hans

# if else
$hello:
  name: nils
if:
  $hello:
    name:
      eq: hans
then:
  $hello.name: guri
else:
  $hello.name: kari
```

### Return

The _return_ command sets a variable in `state.return`:

```yaml
# Return a string
return: hello

# Return a string variable
$hello: world
return: $hello

# Return an object variable
$hello:
  name: world
return: $hello

# Return an array variable
$hello:
  - 1
  - 2
return: $hello

# Return a variable, dot notation
$hello:
  name:
    baner: 1
return: $hello.name
```

### Vars

You can prefill the state with your own variables:

```js
const req = { pathname: '/hello' }
const run = await weblang({
  vars: { req }
})
```

Use some _code_ like this:
```yaml
# Modify pathname
$req.pathname: /bye

# Return the modified pathname
return: $req.pathname
```

Then run with:
```js
await run(code)
```

### Pipes

Variables can be run through _pipes_, which are functions that transform a value.

If the pipe does not exist, it is ignored.

Currently 3 built in pipes exist:
* __upcase__ - transform a string value to upper case
* __downcase__ - transform a string value to lower case
* __capitalize__ - capitalize the first letter of a string

```yaml
# Use pipes with string
$hello: hello | upcase

# Use pipes with variables
$hello: hello
$bye: $hello | upcase

# Use pipes with return
return: hello | capitalize

# Multiple pipes
return: hello | upcase | downcase | capitalize
```

### Extensions

Weblang can (and should) be extended with your own commands. Define an extension function like this:

```js
// Function called db
const db = function({ state, key, val, set, get }) {

  // state - the runner's state with vars and return
  // key - the name of the function, here 'db'
  // val - the object you send to this function
  // set - use this to set variables, prefix with '$'
  // get - use this to get variables and run pipes

  set('$internal', 'hello')
  return { id: '1' }
}
```

and then add the function to the runner like this:

```js
const run = await weblang({
  ext: { db }
})
```

Run the extension like this:
```yaml
db: user/create
```

To set the result of the function, use the _extension variable syntax_:

```yaml
db$result: user/create
```

and the `result` variable will be available in `state.vars.result`.

MIT Licensed. Enjoy!
