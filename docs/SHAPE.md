After the intermediary represenation tree has been created, we convert it into this shape. This contains a representation, including state, of your program.

This will be used to execute your interpreted function, but can also be stored for replay, or used to transpile into another (target) language.

```js
{
  map: {},
  state: {
    vars: {},
    result: null,
    err: null,
  },
  root: {
    children: [
      {
        id: '1-1-1',
        block: 1,
        line: 1,
        occurrence: 1,
        key: 'hello',
        value: {},
        level: 1,
        parent: null,
        siblings: [],
        index: 0,
        next: null,
        previous: null,
        attributes: [],
        children: [],
        mode: 'sync',
        group: []
      },
    ],
  },
}
```
