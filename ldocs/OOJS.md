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
    obj.fn(3,4) 
```

- The object that is looked up to call the function is the thing 'this' would be bound to.
- The object that is left of the dot where containing function is called.

```javascript 
    var fn = function(a,b){
        log(this,a,b);
    };
    
fn(3,4);           //this is bound to 'global' object
    
    r= {};
    r.method = fn;
    r.method(3,4); //this has the object 'r', also applicable to r['method'](g,b)

```
- In order bind 'this' to object 'r' we can use ```java fn.call(r,3,4) ```. 

```javascript 
    new r.method(3,4); // 'this' is bound to a brand new object.
```
- 'this' helps in creation of one function object and use it with any object being associated.

### PROTOTYPE CHAINS
--------------------
- They are a mechanism that makes objects resemble other objects, failed lookups of one object are delegated to the other object.

```javascript

    var gold={a:1};
    var blue={};    // blue = extend({},gold) copying all the methods to the blue object
    var rose = Object.create(gold); //failed lookups to rose are delegated to gold
    
```
- All the objects delegate failed lookups to 'object prototype'.
- .constructor points to a different object in the object prototype iff current doesn't havev one, which is used to make objects.

### OBJECT DECORATOR PATTERN
----------------------------
```javascript
    
    var JaVa = Software({},9);
    var AnGularJS = Software({},2.0);
    
    var Software = function(obj,version){ 
        obj.ver = version;
        return obj;
    };

```
- Function taking an object as input and augmenting required methods to it is qualified as a decorator.

```javascript

    var Software = function(obj,version){ 
        obj.ver = version;
        obj.up = upgrade;
        return obj;
    };
    
    var upgrade = function(){
        this.ver++;             //usage of this keyword
    };

```
- upgrade function can be put in software object but it leads to creation of many upgrade objects [HIGH PRICE].
- Decorator: Adding new functionality to an object.

### FUNCTIONAL CLASSES
----------------------
- Difference between a class and decorator is, the former creates one and the later accepts one before adding functionalities.

```javascript

    var Software = function(version){ 
        var obj={ver:version};
        var upgrade = function(){
            obj.ver++;             
        };
        return obj;
    };   
    
```
- Functions such as above which produce fleets of similar objects are called constructor functions.
- Functional shared pattern

```javascript

    var Software = function(version){ 
        var obj = {ver:version};
        obj.up = upgrade;
        return obj;
    };
    
    var upgrade = function(){
        this.ver++;            
    };

```
- If there are multiple methods then it is better to refactor all the methods in methods obj

```javascript

    var Software = function(version){ 
        var obj = {ver:version};
        extend(obj,Software.methods);            //It is not a native javascript function
        return obj;
    };
    
    Software.methods = {                         //Functions are special type of objects
        upgrade: function(){
            this.ver++;
        }
    };

```
- Class:Any construct that is capable of building a fleet of similar objects.

### PROTOTYPICAL CLASSES
------------------------

```javascript
    
    var Software = function(version){
        var obj = Object.create(Software.methods);  //Delegation of failed lookups than copying all the methods to object
        obj.ver=version;
        return obj;
    }; 
    
    Software.methods = {
        upgrade:function(){
            this.ver++;
        }
    };

```
- Whenever a function is created, it will have an object attached to it that can be used as a container for methods iff that function is used to build istances of a class.
- The default object that comes with every function is stored at the key *.prototype* [Naming choice of language].

```javascript
    
    var Software = function(version){
        var obj = Object.create(Software.prototype);  
        obj.ver=version;
        return obj;
    }; 
    
    Software.prototype.upgrgade = function(){
        this.ver++;
    };

```
- Using *.prototype* there will not be any change in the in memory model of the runtime. 
- It doesn't delegate it's failed lookups to *Software.prototype* unless we specify it to do so.
- It is just a freely provided object for storing things with no additional characteristics.

```javascript
    var JaVa = Software(9);
```
- Here **JaVa**'s prototype is *Software.prototype*, but **Software**'s prototype is *function.prototype*[Same for all functions]
- **Software** has a special relationship with *Software.prototype* [When Software function runs then delegation happens].
- *.prototype* object has a *.constructor* property pointing to the function it came attached to.
- **Software.prototype.constructor === Software**

### PSEUDOCLASSICAL PATTERNS
----------------------------
- Instantiating a new object, runs the function in constructor mode. [**new Software()**]
```javascript
    var Software = function(version){
        this = Object.create(Software.prototype); //Interpreter adds these lines to your code
        return this;                              //When run in constructor mode
    };
```
- Pseudoclassical version is just adding a layer of syntactical convenience
- Primary difference would be number of performance optimizations javascript engine implemented that apply during this usage.

### SUPER CLASS AND SUB CLASS
-----------------------------

