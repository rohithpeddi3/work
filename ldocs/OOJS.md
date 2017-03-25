## OBJECT ORIENTED JAVASCRIPT
-----------------------------
### SCOPES
- Commonly referred by term lexical scope, which describes regions in the source code where you can refer to the variable by name without getting access errors.
- ```javascript 
    
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
- ```javascript 

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
