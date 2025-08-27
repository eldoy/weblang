Execute is responsible for executing the AST root nodes.

The children of a node is also executed from here. The nodes can halt the execution by setting the state.halt = true

state.halt must be set to false immediately after this.
