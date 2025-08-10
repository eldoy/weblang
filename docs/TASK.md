Tasks are groups of functions, which can be called upon like normal functions:

=@task:
  @func1: {}
  @func2: {}

@task: {}

The parameters when calling the task can be passed as defaults to the task functions:

@task: {
  hello: world
}

You can run tasks inside of tasks:

=@task2:
  @task1: {}

And of course run in parallel:

=@task:
  - @task2: {}
  - @task3: {}
