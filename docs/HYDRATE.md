### Hydrate

At the moment expand only works with strings.

The issue is that we need to expand object values, and not just strings, it's needed for HTML.

class: $hello

We'd like to be able to store and pass Weblang functions as JSON in the database, so this could to be hydrated before run to make it fast or else it'll be a serious bottleneck.

(We could actually store a pre-hydrated version in the database and revive with new Function)

The value `$hello` becomes `get(state, 'hello')`

NOTE: then `values` becomes unusable

var data = expand(state, values)

This is probably a lot faster than having to parse values.

Alternative:

Could we lazy-map these values instead? The first time we see them we parse, then store the node path and replacements in a `replacements` map?

Optimization:

We could also indicate in operation if we should expand or not. If there's no $ in any of the keys or values, then we skip expand.
