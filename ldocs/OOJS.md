## OBJECT ORIENTED JAVASCRIPT
-----------------------------
### SCOPES
- Commonly referred by term lexical scope, which describes regions in the source code where you can refer to the variable by name without getting access errors.

```javascript 
    
    var global_variable = returnGlobal(); //variable in the global scope
    var new_lexicalScope = function() {
    
      var new_scope_variable = returnLocal(); 
      log(new_scope_variable); //variables that can be accessed in this scope are global_variable,new_lexicalScope,new_scope_variable
      
      unknown = returnLocal(); //Javascript adds these variables without var declaration to the global scope [DONOT DO IT].
      
    };     
    log(global_variable);
    log(unknown);     
```

- Blocks on ```javascript if(){ }, while(){ }, for(){ } ``` donot create new scopes. 
- Javascript allows only curly braces on the functions to create new scopes.

#### Different usage of the word scope
- When a program runs, it builds up storage systems for the variables and values, these in memory scope structures are called execution contexts.
- Execution contexts differ from lexical scopes, they are built as the program runs and not as its typed.
- So for each lexical scope there may be many in memory scopes or there may be none.

```javascript 

  var sector = returnIT(); // Interpreter builds up a new key value mapping {sector = "IT";}
  var company = function(){
    var platform = returnPlatform();//{sector="IT",company={f}, {platform="Java"}} 
    var team = function(){  
      var size = returnSize();
      log(sector+platform+size);
    };                              //{sector="IT",company={f}, {platform="Java",team={f}}}
    team();                         //{sector="IT",company={f}, {platform="Java",team={f}, {} }} creates a new current context.
    team();
  };                                //{sector="IT",company={f}} function runs and builds its context only after calling it.
  company();                        //{sector="IT",company={f}, {} } creates a new current context for the interpreter 
  company();
  

```
- In memory scopes vs In memory objects, Execution context looks lot like an object with key value pairs.
- They are a deceptive similarity as both of them are kept so different by the interpreter.
- Many of the rules of the objects will also happen to be true for the execution contexts. Ex: it is not possible to store an array full of contexts unlike objects.
- For printing the log(), interpreter moves from current context to closest containing context

### CLOSURES
------------

```javascript 
  var teams = [];  
  var sector = returnIT(); 
  var company = function(){
    var platform = returnPlatform();
    teams.push(function(){  
      var size = returnSize();
      log(sector+platform+size);
    }); 
  };                                
  company();  //can be done by setting a timeout, storing in a global variable, returning the variable;
  teams[0](); // {teams=[{f}],sector="IT",company={f},{platform="Java", {size="10"} }}
  teams[0](); // {teams=[{f}],sector="IT",company={f},{platform="Java", {size="10"}, {size="15"} }}
  company();  // {teams=[{f},{f}],sector="IT",company={f}, {platform="Java", {size="10"},{size="15"}}, {platform="Python"} }

```
- Execution context creation long after lexical scope has returned.

### KEYWORD 'this'
-----------------
- 'this' is an identifier that gets a value bind to it, same like a variable,but it gets bound to correct object automatically
```javascript

    var fn = function(a,b){
        log(this);              
    };
    
    var ob2 = {method: fn};
    
    var obj = {
        fn: function(a,b){
            log(this);
        }
    };
    
```
- 'this' is not bound to 
    - When interpreter hits the function object, it creates ```java {f} ``` in memory.
    - A new instance of the created function object.
    - Newly created inmemory obj(As the function can be included in two objects, so 'this' has to choose between two objects).
    - obj.fn(3,4). {a=3,b=4} in memory object created due to mapping. javascript doesn't give you any memory ref access.
    
```javascript 
    obj.fn(3,4) //the object that is looked up to call the function is the thing that 'this' would be bound to.
```
- 
