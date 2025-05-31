# TODO

- [ ] Support @try @catch @finally
- [ ] Use \$ instead of $$?
- [ ] Make sure interpolation works inside quoted strings
  - do not interpolate outside quoted strings?
- [ ] Add optional "!" after functions that can throw
- [ ] Flatten functions, dot notation not allowed on functions:
  - @db.insert -> @insert or @db_insert

- [ ] Docs:
| Type             | Syntax       | Notes                       |
| ---------------- | ------------ | --------------------------- |
| Variable         | `$var`       | Or `$var.prop`              |
| Function         | `@function`  | Flat name, self-contained   |
| Optional Throw   | `@function?` | Ignores errors              |
| Emphasized Throw | `@function!` | No effect, for clarity only |

- [ ] Design: modern and more sleek, black?
- [ ] Blow up logo or new Logo?
