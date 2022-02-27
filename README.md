# Weblang

The Weblang low code programming language lets you write safe, portable and efficient code with minimal logic. Created to let users run code on your server, but can be extended to run anything anywhere.

### Features
- Extendable dynamic runtime
- Written in Javascript, can run anywhere
- Easy to learn, very minimal logic
- Safe and secure
  - File and network access prohibited by default
  - Allows running of user defined code on your server
- JSON compatible
  - Write code using YAML syntax
  - Easily transform to and from JSON

Ready to try it out?

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

### How it works

Generally, variables start with the `$` character, and functions start with `@`.

Variables have dynamic types, just as with YAML. All variables are global, there is no scope, not even inside _if_ and _else_ blocks.

Functions are added through _extensions_. Even the core functionality can be overridden, Weblang is meant to be extended.


### Set

Set variables, _starting with $_, available in `state.vars`:

```yml
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

# Set bool variable
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

# Set variable, nested, dot notation
$hello.name: world

# Delete variable
$hello: null

# Delete value from object
$hello:
  name: null

# Delete value from object, dot notation
$hello.name: null

# Delete array index, dot notation
$hello[0]: null

# Set variable from object, dot notation
$hello:
  name:
    deep: 1
$bye: $hello.name.deep

# Set variable from array, dot notation
$hello:
  - 1
  - 2
$bye: $hello[0]

# Set variable from object array, dot notation
$hello:
  - name: nils
$bye: $hello[0].name

# Non existing variables are empty strings
$bye: $hello

# Set literal '$', prevents var lookup
$bye: $$hello
```

### If then else

Minimal logic is achieved through _@if, @then and @else_.

The validations inside the if-section are from [the d8a validations.](https://github.com/eldoy/d8a)

```yml
required: true # Can not be undefined
eq: 5          # Equal to
ne: 5          # Not equal to
gt: 5          # Greater than
lt: 5          # Less than
gte: 5         # Greater than or equal to
lte: 5         # Less than or equal to
in:            # Must be in list
  - 1
  - 2
  - 3
nin:           # Must not be in list
  - 1
  - 2
  - 3
length: 5      # Length of string must be
min: 5         # Minimum length of string
max: 5         # Maximum length of string
match: /regex/ # Must match regex
is: boolean    # Must be true or false
is: string     # Must be a string
is: number     # Must be a number, integer or decimal (float)
is: integer    # Must be an integer
is: decimal    # Must be a decimal number
is: date       # Must be a date
is: id         # Must be an id
is: object     # Must be an object
is: array      # Must an array
is: email      # Must be an email address
is: url        # Must be a URL
is: undefined  # Must be undefined
is: null       # Must be null

# Multiple types
is: [string, number]

# Use 'isnt' as the opposite of 'is'
isnt: null

# Works for all of the ones in 'is'
isnt: string
isnt: number
isnt: [email, id]
```

This is how you use them:
```yml
# If with then
@if:
  $hello:
    name:
      eq: nils
@then:
  $hello.name: hans

# Multiple checks
@if:
  $hello:
    name:
      eq: nils
  $req:
    pathname:
      eq: /hello
@then:
  $hello.name: hans

# Checks works with dot notation as well
@if:
  $hello.name.eq: nils
@then:
  $hello.name: hans

# If then else
@if:
  $hello:
    name:
      eq: hans
@then:
  $hello.name: guri
@else:
  $hello.name: kari
```

### Return

The _@return_ command sets a variable in `state.return`. Using _@return_ causes execution to be halted.

```yml
# Return a string
@return: hello

# Return a string variable
$hello: world
@return: $hello

# Return an object variable
$hello:
  name: world
@return: $hello

# Return an array variable
$hello:
  - 1
  - 2
@return: $hello

# Return a variable, dot notation
$hello:
  name:
    baner: 1
@return: $hello.name
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
```yml
# Modify pathname
$req.pathname: /bye

# Return the modified pathname
@return: $req.pathname
```

Then run with:
```js
await run(code)

// Pass params to extensions
const params = { name: 'hello' }
await run(code, params)
```

### Pipes

Variables can be run through _pipes_, which are functions that transform a value.

If the pipe does not exist, it is ignored.

Currently 3 built in pipes exist:
* __upcase__ - transform a string value to upper case
* __downcase__ - transform a string value to lower case
* __capitalize__ - capitalize the first letter of a string

```yml
# Use pipes with string
$hello: hello | upcase

# Use pipes with variables
$hello: hello
$bye: $hello | upcase

# Use pipes with return
@return: hello | capitalize

# Multiple pipes
@return: hello | upcase | downcase | capitalize
```

You can add your own pipes or replace the existing ones using the _pipes_ option:
```js
// Add a pipe named 'hello'
const run = await weblang({
  pipes: {
    hello: function(str) {
      if (typeof str != 'string') return str
      return 'hello ' + str
    }
  }
})
```
and the use it like this:

```yml
@return: world | hello
```

### Extensions

Weblang can (and should) be extended with your own commands. Define an extension function like this:

```js
// Function called db
const db = function({
  state,  // the runner's state with vars and return
  code,   // the actual code sent to weblang, untouched
  blob,   // the internal object used by weblang, with ids
  raw,    // the object you send to this function
  val,    // the object, variables and pipes applied
  key,    // the name of the function, here 'db'
  setter, // store the result in this variable
  id,     // the duplicate key id, if any
  run,    // the run function that runs your code
  set,    // use this to set variables, prefix with '$'
  get,    // use this to get variables and run pipes
  ok,     // the validation function used for if tests
  opt,    // the options passed to weblang
  params, // parameters passed to your extensions
  expand, // the expander function used internally
  pipes,  // the pipe functions
  util,   // util functions
  load,   // the loader, converts yml string to object
  core    // the core extension functions
}) {

  // Example use of set
  set('$internal', 'hello')

  // Whatever you return will be in your setter
  return { id: '1' }
}
```

Add the function to the runner like this:

```js
const run = await weblang({
  ext: { db }
})
```

Write the _code_ like this:
```yml
@db: user/create
```

and run with the extension like this:
```js
const state = await run(code)
```

To set the result of the function, use the _extension variable setter syntax_:

```yml
@db$result: user/create
```

and the `result` variable will be available in `state.vars.result`.

### Duplicate keys

YAML doesn't normally support duplicate keys, but Weblang does! It is automatically handled for you:

```yml
@if:
  $req.pathname.eq: /users
@then:
  $hello: lasse

# No problem with a second if here
@if:
  $req.pathname.eq: /projects
@then:
  $hello: nils
```

If you use duplicate keys in a variable, the last one overwrites the first one:
```yml
$hello:
  name: kari
  name: ola

# $hello.name is 'ola'
```

Internally the keys are added to anything starting with a `$` and `@`, using a unique identifier starting with the `#` character.

### License

MIT Licensed. Enjoy!
