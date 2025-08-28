After the intermediary represenation tree has been created, we convert it into this shape. This contains a representation, including state, of your program.

This will be used to execute your interpreted function, but can also be stored for replay, or used to transpile into another (target) language.

```js
{
  {
    id: '1-1-1',
    block: 1,
    line: 1,
    column: 1,
    key: 'hello',
    value: {},
    operation: {},
    parent: null,
    siblings: [],
    index: 0,
    next: null,
    previous: null,
    mode: 'sync',
    children: []
  },
}
```

Entries with keys that start with "=" and "@" are removed from values. The `operation` is extracted from the irt key.

`operation` describes the operation performed on this execution node. The pattern we need to support is:

```sh
=a,b@func!
```

which can be converted to this structure:

```js
{
  assigns: ['a'],
  ext: 'func',
  bang: true
}
```
