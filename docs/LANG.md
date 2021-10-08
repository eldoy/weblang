Can be translated using YML:

```yml

$tags:
	db.tags.find:
    	query:
        	published: true
	// or
    db:
      	model: tag
	    type: find
    	query:
        	published: true
	// or
    db:
    	tags:
        	find:
            	query:
                	published: true
validate:
	query:
    	name:
        	gt: 1
	values:
    	tag:
        	in:
            	$tags // Replaceable variables
            	if: $.user.id

allow:
	fields:
    	- title
    in: params.values // default

deny:
	fields:
    	- title
    in: params.values // default

remove:
	fields:
    	- title
    in: result // default

keep:
	fields:
    	- title
	    - description
	in: result // default

set:
	fields:
    	user_id: $.user.id
	in: $.params.values
    if: $.user.id

db:
	model: user
	type: create
	values:
    	name: $.params.values.name

mail:
	name: signup
    to: $.result.email
    if: $.result
```

If we can make it run the YML file, the DSL can translate to the YML. That way we can do a graphical no-code version instead. The DSL is simple, but not easier than no-code. The no-code version hides the complexity of the YML.

Can also skip YML and just do to and from DSL.