Extensions are functions you can call from weblang. They are implemented using Javascript.

Extensions look like this:

{
  name: 'db',
  environments: ['web', 'script'],
  handler: function(root, node) {
    root.state.vars.hello = 'world'
  },
  throws: 'always' // never, optional,
  assigns: 'always', // never, optional
  options: {
    name: {
      is: 'string',
      required: true
    }
  }
}

The meta data on the function can be used to validate code before compiling, and give information to the editor for autocomplete and documentation.
