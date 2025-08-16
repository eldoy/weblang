# TODO

### Rewrite

- [ ] Create a linker.js that adds the following fields to ast tree nodes:
  next: null,
  previous: null,
  siblings: [],
  index: 0,
]
- [ ] Tag - remove "-" from @ and = and add to id (a = async, s = sync)
  - could we "group" all of the consecutive asyncs?
- [ ] Create tree from shape

### CLI

- [ ] Need a CLI that runs weblang

### Syntax

- [ ] Support @try @catch @finally?
- [ ] Deconstruct syntax: =var1,var2: [1, 2]
- [ ] Use \$ instead of $$?
- [ ] Make sure interpolation works inside quoted strings
  - do not interpolate outside quoted strings?
- [ ] Add optional "!" after functions that can throw
- [ ] Allow dot notation on functions: @db.insert -> @insert or @db_insert
- [ ] Validate syntax before execute
- [ ] Inline function: =@func: { @func1: {}, @func2: {} }
- [ ] Parallel processing: [@func1, @func2, @func3]


### Docs

- [ ] Docs:
| Type             | Syntax       | Notes                       |
| ---------------- | ------------ | --------------------------- |
| Variable         | `$var`       | Or `$var.prop`              |
| Function         | `@function`  | Flat name, self-contained   |
| Optional Throw   | `@function?` | Ignores errors              |
| Emphasized Throw | `@function!` | No effect, for clarity only |

### Website

- [ ] Design: modern and more sleek, black?
- [ ] Blow up logo or new Logo?
