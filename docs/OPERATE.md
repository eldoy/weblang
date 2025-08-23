To avoid string parsing at runtime we need to add operations to the ast:

```js
{
  id: "s-1-1-2",
  operations: [
    {
      type: "set",
      path: ["hello"],
      op: "assign",
      value: { kind: "literal", data: "world" }
    }
  ],
  pipes: [
    {
      name: "truncate",
      args: [
        { kind: "var", path: ["n"] }   // $n
      ]
    }
  ]
}
```

Simplified form can inline destructuring directly as parallel `set` ops without temp:

```js
{
  id: "s-1-2-1",
  operations: [
    {
      type: "set",
      path: ["a"],
      op: "assign",
      value: { kind: "literal", data: 1 }
    },
    {
      type: "set",
      path: ["b"],
      op: "assign",
      value: { kind: "literal", data: 2 }
    },
    {
      type: "set",
      path: ["c"],
      op: "assign",
      value: { kind: "literal", data: 3 }
    }
  ]
}
```

If the right-hand side is a variable or expression instead of a literal array, just reference by index:

```js
// =a,b,c: $list
{
  id: "s-1-2-2",
  operations: [
    { type: "set", path: ["a"], op: "assign", value: { kind: "var", path: ["list", 0] } },
    { type: "set", path: ["b"], op: "assign", value: { kind: "var", path: ["list", 1] } },
    { type: "set", path: ["c"], op: "assign", value: { kind: "var", path: ["list", 2] } }
  ]
}
```

This avoids introducing temps and stays consistent with your existing `set` node shape.

For object destructuring, expand into `set` ops keyed by property:

```js
// =a,b: $list
{
  id: "s-1-2-3",
  operations: [
    {
      type: "set",
      path: ["a"],
      op: "assign",
      value: { kind: "var", path: ["list", "a"] }
    },
    {
      type: "set",
      path: ["b"],
      op: "assign",
      value: { kind: "var", path: ["list", "b"] }
    }
  ]
}
```

Same shape as array destructuring, just use string keys instead of numeric indices.


The different strings can map to these operations:

```js
[
  // =hello: world
  {
    type: "set",
    path: ["hello"],
    op: "assign",
    value: {
      kind: "literal", data: "world"
    }
  },

  // =number: 1
  {
    type: "set",
    path: ["number"],
    op: "assign",
    value: {
      kind: "literal",
      data: 1
    }
  },

  // =hello: true
  {
    type: "set",
    path: ["hello"],
    op: "assign",
    value: {
      kind: "literal",
      data: true
    }
  },

  // =hello: { a: 1, b: 2 }
  {
    type: "set",
    path: ["hello"],
    op: "merge",
    value: {
      kind: "literal",
      data: { a: 1, b: 2 }
    }
  },

  // =hello[0]: 3
  {
    type: "set",
    path: ["hello", 0],
    op: "assign",
    value: {
      kind: "literal",
      data: 3
    }
  },

  // =bye: $hello
  {
    type: "set",
    path: ["bye"],
    op: "assign",
    value: {
      kind: "var",
      path: ["hello"]
    }
  },

  // =bye: $hello.name.deep
  {
    type: "set",
    path: ["bye"],
    op: "assign",
    value: {
      kind: "var",
      path: ["hello", "name", "deep"]
    }
  },

  // =bye: $hello[0].name
  {
    type: "set",
    path: ["bye"],
    op: "assign",
    value: {
      kind: "var",
      path: ["hello", 0, "name"]
    }
  },

  // =bye: $$hello
  {
    type: "set",
    path: ["bye"],
    op: "assign",
    value: {
      kind: "literal", data: "$hello"
    }
  },

  // @log: $hello
  {
    type: "builtin",
    name: "log",
    args: [{
      kind: "var", path: ["hello"]
    }]
  }
]
```
