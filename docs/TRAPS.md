These are the traps used in Weblang state to communicate with the runner from extensions:

1. state.break - cancels further execution of a node's children
2. state.test - used for @if @then @else to setup which branch to run
3. state.return - used for @return and bang errors. if it exists we return the value immediately.
4. node.last - the result from this node, which is usually the last root node, will write to state.result (last function returns automatically.)
5. state.current - the node we're currently executing
6. state.iterator - the array or object we're currently iterating upon
7. state.index - the index of the current iteration
8. state.item - the name of the current iteration item

* state current is set for each execution node
* iterator, index, item is set from within the extension
