These are the signals used in Weblang state to communicate with the runner from extensions:

1. state.break - cancels further execution of a node's children
2. state.test - used for @if @then @else to setup which branch to run
3. state.result - used for @return and bang errors
4. node.last - the result from this node, which is usually the last root node, will write to state.result (last function returns automatically.)