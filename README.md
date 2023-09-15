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
let weblang = require('weblang')
let code = '=hello: world'
let state = await weblang.init().run(code)
```

### How it works

Generally, setting a variable starts with `=`, variable lookup starts with `$`, and functions start with `@`.

Variables have dynamic types, just as with YAML. All variables are global, there is no scope, not even inside _if_ and _else_ blocks.

Functions are added through _extensions_. Even the core functionality can be overridden, Weblang is meant to be extended.

### Set and Get variables

Variables are stored in `state.vars`:

* Setting a variable starts with `=`
* Getting a variable starts with `$`

```yml
# Set string variable
=hello: world

# Set number variable
=number: 1

# Set bool variable
=hello: true

# Set object variable
=hello:
  a: 1
  b: 2

# Set object one liner syntax
=hello: { a: 1, b: 2 }

# Set array variable
=hello:
  - 1
  - 2

# Set array one liner syntax
=hello: [1, 2]

# Set array index
=hello[0]: 3

# Set variable from other variable
=hello: world
=bye: $hello

# Set object value from other variable
=hello: world
=bye:
  name: $hello

# Set array index from other variable
=hello: world
=bye:
  - $hello

# Set variable, nested, dot notation
=hello.name: world

# Delete variable, making $hello undefined
=hello: null

# Delete value from object
=hello:
  name: null

# Delete value from object, dot notation
=hello.name: null

# Delete array index, dot notation
=hello[0]: null

# Set variable from object, dot notation
=hello:
  name:
    deep: 1
=bye: $hello.name.deep

# Set variable from array, dot notation
=hello:
  - 1
  - 2
=bye: $hello[0]

# Set variable from object array, dot notation
=hello:
  - name: nils
=bye: $hello[0].name

# Non existing variables are empty strings
=bye: $hello

# Set literal '$', prevents var lookup
=bye: $$hello

# Setting the same object variable merges the values
=hello: { a: 1 }
=hello: { b: 2 }

@log: $hello
# { a: 1, b: 2 }
```

### If then else

Minimal logic is achieved through _@if, @then and @else_:

```yml
# If with then
@if:
  $hello:
    name:
      eq: nils
@then:
  =hello.name: hans

# Multiple checks
@if:
  $hello:
    name:
      eq: nils
  $req:
    pathname:
      eq: /hello
@then:
  =hello.name: hans

# Checks works with dot notation as well
@if:
  $hello.name.eq: nils
@then:
  =hello.name: hans

# If then else
@if:
  $hello:
    name:
      eq: hans
@then:
  =hello.name: guro
@else:
  =hello.name: kari
```

The validations inside the if-section are from [the d8a validations:](https://github.com/eldoy/d8a)

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

### Return

The _@return_ command sets a variable in `state.return`. Using _@return_ causes execution to be halted.

```yml
# Return a string
@return: hello

# Return a string variable
=hello: world
@return: $hello

# Return an object variable
=hello:
  name: world
@return: $hello

# Return an array variable
=hello:
  - 1
  - 2
@return: $hello

# Return a variable, dot notation
=hello:
  name:
    baner: 1
@return: $hello.name
```

### Vars

You can prefill the state with your own variables:

```js
let req = { pathname: '/hello' }
let state = await weblang
  .init({ vars: { req }})
  .run(code)
```

### Extensions

Weblang can (and should) be extended with your own commands.

Define an extension function like this:

```js
// Extension function called db
function db({
  state,    // the runner's state with vars and return
  code,     // the actual code sent to weblang, untouched
  tree,     // the syntax tree like object, with ids
  branch,   // the current object being processed
  node,     // the key of the current branch
  current,  // the value of the current branch
  key,      // the setter key, usually starts with '='
  id,       // the internal id of the node
  run,      // the run function that runs your code
  opt,      // the options passed to weblang
  expand,   // the expander function used internally
  load,     // the loader, converts yml string to object
  get,      // use this to get variables and run pipes
  set,      // use this to set variables
  ok        // the validation function used for if tests
}) {

  // Example use of set
  set('=internal', 'hello')

  // Whatever you return will be in your setter
  return { id: '1' }
}
```

Write some code like this:
```js
var code = '@db: user/create'
```

then run the code like this, while also adding the extension:
```js
let state = await weblang.init({ ext: { db } }).run(code)
```

To set the result of the function, use the _extension variable setter syntax_:

```yml
=result@db: user/create
```

and the `result` variable will be available in `state.vars.result`.


### Pipes

Variables can be run through _pipes_, which are functions that transform a value.

If the pipe does not exist, it is ignored.

```yml
# Use pipes with string
=hello: hello | upcase

# Use pipes with variables
=hello: hello
=bye: $hello | upcase

# Use pipes with return
@return: hello | capitalize

# Multiple pipes
@return: hello | upcase | downcase | capitalize

# Pipe parameters
@return: list | join delimiter=+ max=5
```

You can add your own pipes, or replace the built in ones, using the _pipes_ option:
```js
// Add a pipe named 'hello'
let state = await weblang
  .init({
    pipes: {
      hello: function({ val }) {
        if (typeof val != 'string') return val
        return 'hello ' + val
      }
    }
  })
  .run(code)
```
and then use it like this:

```yml
@return: world | hello
```

The pipes receive all the same variables as with extensions.

### License

MIT Licensed. Enjoy!
