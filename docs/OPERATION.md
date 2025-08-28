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

Confirmed. Based on your language spec the minimal set is:

**Types** (broad categories of operations):

* `"set"` → mutate `state.vars`
* `"builtin"` → special form starting with `@` (e.g. log)
* `"expr"` (optional) → pure evaluation, no mutation (if you want to model expressions as standalone nodes)

**Ops** (sub-kind for `"set"`):

* `"assign"` → overwrite with value
* `"merge"` → deep merge object into existing
* `"delete"` → remove variable/key/index

**Value kinds** (for `value` nodes):

* `"literal"` → raw primitive/structure
* `"var"` → lookup in `state.vars`
* `"call"` → function application (`@func` or pipes)
* `"object"` → object with entries `{ key, value }[]`
* `"array"` → array with `value[]`

This covers every example you gave: variable set/get, merge, delete, object/array literal, function call, pipes, variable keys.


Here’s the flat **syntax coverage list**, one example per test, grouped by section:

Got it — here’s the list rewritten with a **dash** for the description instead of parentheses:

---

### literals

`=hello: world` - literal string
`=number: 1` - literal number
`=hello: true` - literal boolean
`=hello: null` - literal null
`=hello: { a: 1, b: 2 }` - literal object
`=arr: [1, 2]` - literal array

### assign with paths

`=hello.name: world` - assign nested dot path
`=hello[0]: 3` - assign array index

### vars

`=bye: $hello` - var assign
`=bye: $hello.name.deep` - var assign with dot path
`=bye: $hello[0].name` - var assign with index and dot path
`=x: $arr[1]` - var assign with array index
`=bye: \$hello` - escaped var is literal

### functions

`@log: $hello` - func call top-level
`=hello@func: { a: 1 }` - func call on assign
`=hello@func: world |> upcase` - func call with pipe
`=result@func: input |> transform 1 $x $y=2` - func call with pipe and mixed args
`=result@func: foo |> transform $k=$v` - func call with pipe arg var key and value

### pipes

`=hello: world |> upcase` - pipe on literal
`=hello: $hello |> truncate 5` - pipe on var
`=user: { name: john |> upcase }` - pipe inside object with literal
`=user: { name: $user |> upcase }` - pipe inside object with var
`=list: [hi |> upcase]` - pipe inside array with literal
`=list: [$n |> truncate 5]` - pipe inside array with var
`=hello: world |> truncate $n` - pipe with var arg
`=hello: world |> replace $name=6` - pipe with assignment arg literal value
`=hello: "world" |> replace a=$name` - pipe with assignment arg var value
`=hello: "world" |> replace $k=$v` - pipe with assignment arg var key and value
`=hello: world |> format 1 $x $y=2` - pipe with mixed args
`=hello: "world" |> replace 1,2,3` - pipe with array literal args
`=hello: "world" |> replace $n,2,3` - pipe with array args containing var
`=hello: "world" |> replace a=1,b=2` - pipe with array args containing assignment elements

### destructuring

`=a,b,c: $list` - destructure array
`=a,b: $obj` - destructure object

### dynamic keys

`=hello: { $dyn: world }` - dynamic object key from var
`=obj: { $hello.bye[2]: $world[5] }` - dynamic object key and value with complex var path
`=hello: world |> replace $hello.bye[2]=$world[5]` - pipe with assignment arg using complex var paths
