### What is it? 
	
#### Considered options : 

As most languages have, use a **function type**

- How would we represent functions in VM type signatures?		[	javap -s <Class-Name>	]
  - A short hand representation of types in java.
  
- How would we represent invocation in byte code?
- How would we create instances of function typed variables?
- How would we deal with variance?

VARIANCE:

  - In Java, Integer[] is a subclass of Number[], and they are both subclasses of Object[]. This is called covariance. 
  - Given A <: B (meaning A is a subclass of B), if T[A] <: T[B] then T is covariant in its type. 
  - Given the same relationship A <: B, if T[B] <: T[A] then T is contravariant in its type. 
  - if T[A] and T[B] have no relationship despite the fact that A <: B, then we say T is invariant in its type.


Why not just add function types?

- JVM has no native(unerased) representation of function type in VM type signatures

  - Closest tool we have is generics
  - Boxed and erased function types would be no fun
  - Gaps between language and VM representation are always pain points

- Teaching the VM about 'real' function types would be a huge effort

  - New type signatures for functions
  - New bytecodes for invocation
  - New verification rules

**Functional interfaces:**

- Historically modelled functions using single method interfaces

  - Runnable, Comparator

- Rather than complicate the type system, let's just formalize that

  - Give them a name: "functional interfaces"
  - Always convert lambda expressions to an instance of a functional interface

```java

    interface Predicate<T> { boolean test(T x);}
    //Compiler identifies Predicate as a functional interface structurally

    people.removeIf(p -> p.getAge() >= 18);  
    //Compiler infers the lambda is a Predicate<Person>
    
```

How does the **lambda instance** get created? 
What is its **runtime representation**?

- Need to convert a function into an instance of a functional interface
- Need to handle captured variables

```
   Predicate<Person> pred = (Person p) -> p.age < minAge;
```

- The obvious choice is ..... **inner classes**

Why not "just" use inner classes?

- We could say that lambda is just an inner class instance
  
  ```java
  	class Foo$1 implements Predicate<Person> {

      private final int $minAge;

      Foo$1(int v0) { this.$minAge = v0;}

      public boolean test(Person p) {
        return p.Age < $minAge;
      }

    }
  ```
- Then lambda capture becomes constructor invocation

  ```java
   list.removeIf(p -> p.age < minAge) ==> list.removeIf(new Foo$1(minAge));
  ```
  
- Translating to inner classes means we inherit most of their problems

- Performance issues

  - One class per lambda expression
  - Type profile pollution
  - Always allocates a new instance

- Complicated and error-prone "comb" lookup for names.

### NEW BYTECODE TOOL: MethodHandle
-----------------------------------

Java 7 adds VM level method handles

- Can store references to methods on the constant pool, load with LDC
- Can obtain a method handle for any method (or field access)
- VM will happily inline through MH calls
- API-based combinators for manipulating method handles

  - Add, remove, reorder arguments
  - Adapt (box, unbox, cast) arguments and return types
  - Compose methods

- Compiler writers swiss-army knife

LAMBDA's are language level method constant, Method handles are VM level method constants

Why not "just" use **MethodHandle**?

- Desugar lambdas expressions to methods
- Represent lambdas using MethodHandle in bytecode signatures

#### COMPILER TRANSLATION:
-------------------------

```java
  private static boolean lambda$1 (int minAge, Person p) { return p.age < minAge; }

  MethodHandle mh = LDC[lambda$1];
  mh = MethodHandles.insertArguments(mh, 0, minAge);
  list.removeIf(mh);
```
- If we did this, the signature of List.removeIf would be:

```java
  void removeIf(MethodHandle predicate)
```
- This is erasure on steroids!

  - Can't overload two methods that take differently "shaped" lambdas
  - Still would need to encode the erased type information somewhere

- Also: is MH invocation performance yet competitive with bytecode invocation?
- Again: conflates binary representation with implementation.


#### REQUIREMENTS:
------------------

- Binary interface tied to a specific implementation

  - Inner classes have too much baggage
  - MethodHandle is too low-level, is erased
  - Can't force users to recompile ever

- What actaully needed .......... another level of indirection

  - Let the static compiler emit a declarative recipe, rather than imperative code for creating a lambda
  - Let the runtime execute the recipe however it deems best and make it darned fast!

A JOB FOR **INVOKE DYNAMIC!!**

BYTECODE INVOCATION METHODS:

- Prior to Java 7, JVM had four bytecodes for method invocation

  - invokestatic: for static methods
  - invokevirtual: for class methods
  - invokeinterface: for interface methods
  - invokespecial: for constructors, private methods, and super calls

- Each specifies a class name, method name, and method signature 
- invoke static,virtual,interface are fixed and java like, other languages need custom method linkage

Basic idea: let some **language logic** determine **call target**
- Then get out of the way
- Language and VM become partners in flexible and efficient method dispatch.

  JRuby caller 		==> 		JRuby logic 		==> 		Method

           (invoke dynamic)                  (invoke virtual)


**INVOKEDYNAMIC** started out as a tool for dynamic languages

  - A typical application would be invocating a method like 
    ```
     def add(a,b) {a+b}
    ```
  - Here the types of a and b are not known at compile time.
  - And can change from call to call ..... but probably don't 
  - Good chance that if called with two ints, next call will be with two ints

  - We win by not having to **re-link** the **call site** for every invocation.

The *first time* JVM executes an **invokedynamic**

- Consults the bootstrap method for the call site (the "language logic")
- Bootstrap returns a linked call site
- Call site can embed conditions under which it needs relinking (if any)
  - Such as the arguments type changing
  - Otherwise, JVM doesn't have to consult bootstrap again
- After linkage, JVM can treat the call site as fully linked
  - Can inline through indy callsites like any other.

An invoke dynamic call site has three groups of operands.

- A bootstrap method (the "language logic")
  - Called by the VM for linking the callsite on first invocation, not called again after that.

- A static argument list, embedded in the constant pool
  - Available to the bootstrap method

- A dynamic argument list, like any other method invocation
  - Not passed to the bootstrap, but their static types and arity are
  - Passed to whatever target the callsite is linked to 

So, if invokedynamic is for dynamic languages, why is java compiler using it?

- All the types involved are static
- What is dynamic here is the code generation strategy

  - Generate inner classes?
  - Use method handles?
  - Use dynamic proxies?
  - Use VM-private API's for constructing objects

- Invokedynamic lets us turn this choice into pure implementation detail

  - Seperate from the binary representation

Its not just for **dynamic languages** anymore

- Invoke dynamic is used to embed a recipe for constructing a lambda, including

  - The desugared implementation method (static)
  - The functional interface we are converting to (static)
  - Additional metadata, such as serialization information (static)
  - Values captured from the lexical scope (dynamic)

- The capture site is called the "lambda factory"

  - Invoked with invoke dynamic, returns an instance of the desired functional interface
  - Subsequent captures by pass the (slow) linkage path.

#### DESUGARING LAMBDAS TO METHODS:
----------------------------------

- First, we desugar lambda to a method, as before

  - Signature matches functional interface method plus captured arguments prepended
  - Simplest lambdas desugar to static methods [But some need access to receiver, and so are instance methods]
  
  ```java
      Predicate<Person> pred = p -> p.age < minAge

      private static boolean lambda$1 (int minAge, Person p) {
        return p.age < minAge;
      }
  ```

#### FACTORIES AND METAFACTORIES:
--------------------------------

Generate an invoke dynamic call site, which when called, returns the lambda

- This is the lambda factory
- Bootstrap for the lambda factory selects the translation strategy
  - Bootstrap is called the lambda metafactory
  - Part of java runtime
- Captured args are passed to lambda factory

    ```java
    list.removeIf(p -> p.age < minAge)

    Predicate $p = indy[bootstrap=LambdaMetaFactory, staticargs=[Predicate, lambda$1], dynargs=[minAge]]
    list.removeIf($p);
    ```

#### TRANSLATION STRATEGIES:
---------------------------

- The metafactory could spin inner classes dynamically
  - Generate the same class the compiler would, just at runtime
  - Link factory call site to constructor of generated class. Conveniently, dynamic args will line up
  - Our initial strategy until we can prove that there's a better one
- Alternatively we could spin, one wrapper class per interface
  - Constructor would take a method handle
  - Methods would invoke that method handle
- Could also use dynamic proxies or MethodHandleProxy
- Or VM-private APIs to build object from scratch.

#### INDY THE ULTIMATE PROCRASTINATION AID:
------------------------------------------

- By deferring the code generation choice to runtime, it becomes a pure implementation detail

  - Can be changed dynamically
  - We can settle on a binary protocol now(metafacory API) while delaying the choice of code generation strategy
    - Moving work from static compiler to runtime
  - Can change code generation strategy across VM versions, or even days of the week.

- For stateless (non-capturing) lambdas, we can create one single instance of the lambda object and always return that

  - Sometimes we do this by hand in source code - e.g., pulling a comparator into a static final variable

- Indy functions as a lazily initialized cache

  - Deferes initialization cost to first use
  - No heap overhead if lambda is never used
  - No extra field or static initializer
  - All stateless lambdas get lazy initialization and cachinf for free.

- Just because we defer code generation strategy to runtime, we don't have to pay the price on every call

  - Metafactory only invoked once per call site
  - For non-capturing case, subsequent captures are FREE
    - VM optimizes to constant load
  - For capturing case, subsequent capture cost on order of a constructor call/method handle manipulation
    - MF links to constructor for generated class.

#### PERFORMANCE COSTS
----------------------

- Any translation scheme imposes costs at several levels

  - LINKAGE COST - One time cost of setting up lambda capture
  - CAPTURE COST - cost of creating a lambda instance
  - INVOCATION COST - cost of invoking a lambda method

- For inner class instances, these correspond to:

  - LINKAGE - Loding the class
  - CAPTURE - Invoking the constructor
  - INVOCATION - invoke interface

NOT JUST FOR THE JAVA LANGUAGE

- The lambda conversion metafactories will be part of java.lang.invoke
- Java API's will be full of functional interfaces [Collection.forEach]
- Other languages will want to call this API
  - May be using their own closures
  - Will want a similar conversion
- Since metafactories are likely to receive future VM optimization attention, using platform runtime is easir than spinning own inner classes
- VM could intrinsify lambda capture sites

  - Capture semantics are straight forward properties of method handles
  - Capture operation is pure, therefore freely reorderable
  - Can use code motion to delay/eliminate captures

- Lambda capture is essentially a "boxing" operation

  - Boxing a method handle into a lambda object
  - Invocation is the corresponding unbox
  - Can use box elimination techniques to eliminate capture overhead
    
    INTRINSIFICATION OF CAPTURE + INLINE + ESCAPE ANALYSIS

#### SERIALIZATION:
------------------

  ```java
	  interface Foo extends Serializable {
		public boolean eval();
	  }

	  Foo f = () -> false;
  ```

- We can't just serialize the lambda object

  - Implementing class won't exist at deserialization time
  - Deserializing VM may use a different translation strategy
  - Need a dynamic serialization strategy tool

    - Without exposing security holes...
