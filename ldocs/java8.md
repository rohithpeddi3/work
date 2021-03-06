# JAVA 8

- PROBLEM: Lack of efficient operations over large collections of data.
- SOLUTION: A language change, birth of lambda expressions.

```java
  public class Sample {
    public static void main(String args[]) {
      Thread th = new Thread(new Runnable() {
        public void run() {
          System.out.println("This is from another thread");
        }
      });
      
      th.start();
      System.out.println("This is from main");
    }
  }
```
- INTENTION - run that simple one line (But we constructed an object by wrapping that line in it to execute)
- This code is fairly hard to read because it obscures the programmers intent. 

```java
  public class Sample {
    public static void main(String args[]) {    
    //function has 4 things
    // 1. name
        // 2. parameter list
        // 3. body
    // 4. return type
      [cute little anonymous method]
      Thread th = new Thread(() -> System.out.println("This is from another thread"));     
      th.start();
      System.out.println("This is from main");
    }
  }
```

-	Object oriented programming is mostly about abstracting over data, while functional programming is mostly about abstracting over behaviour.

### Why lambdas?

- Lambda expressions provide a compact way of passing around behaviour

- Provide libraries a path to multicore
  - Parallel friendly libraries need internal iteration
  - Internal iteration needs a concise code-as-data mechanism 

- Empower library developers
  - Enable a higher degree of cooperation between libraries and client code

- Java is the lone holdout among mainstream OO languages at this point to not have closures, So they did it!
  - Closure means to have an environment of its own and have atleast a single bound variable in that environment.
  - In Java, closure is a block of code that can be referenced with access to the variables in the enclosed scope. 

- Inner classes give us some of these benefits, but are too clunky.

### DIFFERENT TYPES:

- Lambdas always capture values not variables.

```java
  Runnable noArguments = () -> System.out.println("Hello Lambda!");
  
  ActionListener oneArgument = event -> System.out.println("button clicked!");
  
  Runnable multiStatement = () -> {
	System.out.println("Hello");
	System.out.pritnln("Lambda!");	
  }

  BinaryOperator<Long> add = (x,y) -> x + y;
  //This line of code doesn't add up, instead creates a function that adds together two numbers.

  BinaryOperator<Long> addExplicit = (Long x, Long y) -> x + y;

  final String name = "I am not variable, but a value";

	button.addActionListener(new ActionListener() {
		public void actionPerformed(ActionEvent event) {
			System.out.println(name);
		}
	});  
```
- The target type of the lambda expression is the type of the context in which the lambda expression appears.

	> Its not quite new, Array initializers in java have always been inferred from their contexts, 
    another example is null, its type is known only after is assigned to something.

- Earlier in anonymous inner classes, you cannot access the variables inside an inner class unless they are final.
- But java 8 has introduced a facility to access effectively final variables.

### FIT INTO JAVA PHILOSOPHY: 
-----------------------------

What does having lambda mean to java? 
  - Java always cares about backward compatibility.
  - Lambdas backed by single abstract method interfaces [Functional interfaces]. Makes them compatible with old code.

#### UNDER THE HOOD: 

What does the compiler do when it sees a lamda expression?

  - [ ] It constructs an anonymous inner class of how it would be implemented if it were java7.           
  
      JAVA7 : If it any anonymous inner classes are present, jvm generates two .class files
      By the same logic if lambdas were implemented many times, equivalent number of objects has to be created.
      Although this is what other programming languages like groovy, scala which use jvm do. But not java (Bigger scale of usage)
      
[Anonymous inner classes]-> [Annonymous classes] -> [Big jar files] -> [Memory footprint] -> [Garbage collection] -> [Runtime footprint]

  - [x] Invoke dynamic implemented for dynamically typed languages running on jvm      
      
      It means you can attach and detach to the function to be invoked dynamically, 
      finally function pointers are available at the program level. Lambdas are implemented using INVOKE DYNAMIC.
      So, lambdas doesn't have the overhead of creating objects.
          
             They can become: 
              1. A static method
              2. Instance method
              3. Routing of invoke dynamic to an existing method in other class.
              
- Check here for complete implementation [details.](https://github.com/rohithpeddi3/work/blob/master/ldocs/Lambdas.md)

- Functional interfaces provide target types for lambda expressions and method references. 
- Each functional interface has a single abstract method, called the functional method for that functional interface, to which		 the lambda expression's parameter and return types are matched or adapted. 
- Functional interfaces can provide a target type in multiple contexts, such as assignment context, method invocation, 

```java
     // Assignment context
     Predicate<String> p = String::isEmpty;

     // Method invocation context
     stream.filter(e -> e.getSize() > 10)...

     // Cast context
     stream.map((ToIntFunction) e -> e.getSize())...
 ```

#### BENEFIT FROM LAMBDAS: 

```java 
  public class Sample {
    public static void main(String[] args) {
      List<Integer> numbers = Arrays.asList(2,3,4,6,7,8,9);
      
      //External Iterators (Having complete control of the things)
      //Familiar for loop 
      for(int i=0; i<numbers.size(); i++) {
        System.out.pritnln(numbers.get(i));
      }
      
      //External iterator also
      for(Integer i:numbers) {
        System.out.pritnln(i);
      }
      
      //internal iterator
      numbers.forEach(new Consumer<Integer>() {
        public void accept(Integer value) {
          System.out.println(value);
        }
      });     
      //Rather than passing the collection to for, we are invoking forEach on the collection.
      //When a function is called on object, we benefit from polymorphism [What to do, vary implementation based on type of object]
     
      numbers.forEach(value -> System.out.println(value));       
      //paranthesis is optional for only one parameter.
      
      //Its a simple pass through of value. [Waste of key strokes]
      numbers.forEach(System.out::println);
      //We are passing a function and not invoking function, method reference syntax.
      
    }
  }
```
- Java8 has type inference for lamda expressions.
- While lamdas are cute, keep it that way.
- DONOT HAVE LOGIC IN THE LAMBDA, PUT IT IN A FUNCTION AND CALL THE FUNCTION FROM THE LAMBDA.

### METHOD REFERENCE: Only useful in the most trivial case, receiving a parameter and pass through.

- Parameter as an argument
- Parameter as an argument to static method
- Parameter as a target
- Two parameters as arguments
- Two parameters one as target and the other as argument    
- LIMITATIONS:
    - If you want to do anything with the received argument, its not right
    - If compiler finds a conflict between static and instance methods to apply method reference.

```java
  numbers.forEach(System.out::println);
  //System.out is an object and we are calling the method println, it is an instance method on the object.
  //Passing the parameter 'e' as an argument to an instance method 'println' with 'System.out' as the target.
  
  numbers.stream()
          //.map(e -> String.valueOf(e))
         .map(String::valueOf)              //Reference to a static method
         .forEach(System.out::println)      //Reference to an instance method   
  //Passing parameter as an argument to a static method      
         
  numbers.stream()
         .map(e -> String.valueOf(e))
         .map(String::toString)             //Reference to an instance method
         .forEach(System.out::println);
  //Passed parameter 'e' has become a target and we are using 'toString' method on it. 
  //Based on the context we often get to know as we work along.      
   
   System.out.println(
    numbers.stream()
        .reduce(0, (total,e) -> Integer.sum(total,e)) );
   //Method references are only useful if order is the same.     
   
   System.out.println(
    numbers.stream()
        .reduce(0, Integer::sum));
        
   System.out.println(
    numbers.stream()
        .map(String::valueOf)
        .reduce("", String::concat));        
   //First parameter is the target and the other is an argument
  
```

### FUNCTION COMPOSITION

```java
    
    //IMPERATIVE:
    int result = 0;
    for(int e:numbers) {
      if(e%2 == 0) result += e*2
    }
    
    //DECLARATIVE
    //Stream can be thought of as an interator
    numbers.stream()
           .filter(e -> e%2 == 0)
           .map(e -> e*2)
           .reduce(0, Integer::sum);
    
    numbers.stream()
           .filter(e -> e%2 == 0)
           .mapToInt(e -> e*2)
           .sum();        
```

- This is called functional composition, it can also be called as a pipeline.

- Class that measures the actual time taken for a runnable block to run and prints it to console.

```java
   public class Timeit {
    public static code (Runnable block) {
      long start = System.nanoTime();
      try{
        block.run();
      } finally {
        long end = System.nanoTime();
        System.out.println("Time taken(s): "+ (end - start)/1.0e9);
      }
    }
   }
```

```java
   public class Sample {
    public static void main(String[] args) {
      List<Integers> numbers = Arrays.asList(1,2,3,4,5,6,7,8,9,10);
      
      Timeit.code(() -> 
        System.out.println(
          numbers.stream()
                 .filter(e -> e%2 == 0)
                 .mapToInt(Sample::compute)
                 .sum()));                          //5.027041076
                 
       Timeit.code(() -> 
        System.out.println(
          numbers.parallelStream()
                 .filter(e -> e%2 == 0)
                 .mapToInt(Sample::compute)
                 .sum()));                          //1.0150950506
      
    }
    
    public static int compute(int number) {
      //assume this is time intensive
      try{ thread.sleep(1000);} catch(Exception) {}
      return number*2;
    }
    
   }
```

- Be extemely careful with parallel stream.
- Just because you can parallelise, you don't have to parallelize. [Compromising on all threads to get your result faster]
- When the data size is big ennough
- When the task computation is big enough to get a benefit in performance.

#### HIGHER ORDER FUNCTIONS:

A higher order function is a function that either takes another function as argument or returns a function as its result.

- Comparing not only took another function inorder to extract an index value, but also returns a new comparator.
- Comparator was invented when a function was needed, but all java had at that time was objects.
- Being an object was always accidental.

Provide what transformation has to be made rather than how transformation occurs.

**Functions with no side effects don't change the state of anything else in the program or outside world.**

```java
	private void registerHandler() {
		button.addActionListener(event -> this.lastEvent = event);
	}
```

- Here we save away the event parameters into a field, a more subtle way of generating side effects [assigning to variables].
- Capturing values encourages people to write code that is free from side effects by making it harder to do so.

**Whenever you pass lambda expression into the higher order functions on the stream interface, 
you should seek to avoid side effects**.

### STREAMS

- They are an abstraction. 
- It is not a physical object with data, it is a bunch of functions.
- It is a non mutating pipeline. [Avoid shared mutability]
- It follows BUILDER PATTERN, there are a sequence of calls that set up properties or configuration, followed by a single call to a build method.


Java 7: LOOPING EXTERNAL ITERATOR

			|		|
 	      hasNext() |-------------->|
			|		|
 		hasNext	|<--------------|
			|		|
			|-------------->|
			|		|
			|<--------------|
			|		|
 		next()	|-------------->|
			|		|
 		element	|<--------------|
			|		|

		Application    	   Collections
		   code		      code

Java 8: INTERNAL ITERATION

				|		|
		Build operation	|-------------->|
				|		|
	 			|		|
				|		|
				|		|
				|		|
				|		|
				|		|
	 		    	|		|
				|		|
	 	result		|<--------------|
				|		|

			Application     Collections
			    code	  code

FUNCTIONS: 
  - filter:       
      ```java
        numbers.stream()
               .filter(e -> e%2 == 0)
        // 0 <= number of elements in the output <= number of elements in the input
        // input: Stream<T> takes Predicate<T>
      ```
  - map : transforms values 
          number of output = number of input.
          no guarantee on the type of output with respect to the type of the input.
          parameter: Stream<T> map takes Function<T,R> to return Sream<R>.
  
  - reduce: on Stream<T> takes two parameters
            First parameter is of type T
            Second parameter is of type BiFunction<R,T,R> to produce a result R.
            Specialized reduce functions : sum , collect.
  
  - flatMap: As it can be guessed by its name, is the combination of a map and a flat operation. 
  	     That means that you first apply a function to your elements, and then flatten it. 
	     Stream.map only applies a function to the stream without flattening the stream.
	     To understand what flattening a stream consists in, consider a structure like 
	     	[ [1,2,3],[4,5,6],[7,8,9] ] which has "two levels". 
	     Flattening this means transforming it in a "one level" structure : [ 1,2,3,4,5,6,7,8,9 ].

  
      
      ```java
        System.out.println(
          numbers.stream()
                 .filter(e -> e%2 == 0)
                 .map(e -> e*2.0)
                 .reduce(0.0, (carry,e) -> carry+e));
      ```
  
  - collect : It is also a reduce operation.
  
    ```java
      public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1,2,3,4,5,6,7,8,3,2,4,5,3,5,6);
        
        //double the even values and put that into a list
        //wrong way to do this.
        List<Integer> doubleOfEven = new ArrayList<>();
        numbers.stream()
               .filter(e -> e%2 == 0)
               .map(e -> e*2)
               .forEach(e -> doubleOfEven.add(e))
        //mutability is ok, sharing is nice, shared mutability is devils work.
        //CONCURRENCY PROBLEMS MAY RISE AS THAT VARIABLE IS SHARED.
        
        //right way to do this
        Set<Integer> doubleOfEven2 = 
            numbers.stream()
                   .filter(e -> e%2 == 0)
                   .map(e -> e*2)
                   .collect(toSet());                
      }
    ```
  
    ```java
      public class Sample{
        public static List<Person> create() {
          return new Arrays.asList(
            new Person("Joey", Gender.MALE, 23),
            new Person("Chandler", Gender.MALE, 24),
            new Person("Monica", Gender.FEMALE, 22),
            new Person("Rachel", Gender.FEMALE, 22),
            new Person("Ross", Gender.MALE, 24),
            new Person("Phoebe", Gender.FEMALE, 23)
          );
        }
        
        public static void main(String[] args) {
          List<Person> people = createPeople();
          //create a map with name and age as key and the person as value          
          people.stream()
                .collect(toMap(
                  person -> person.getName()+"-"+person.getAge(),
                  person -> person
                ));
                
          //given a list of people, create a map where their name is the key and value is 
          //all the people with that name
          
           people.stream()
                 .collect(groupingBy(Person::getName));
                 
          //given a list of people, create a map where their name is the key and value is 
          //all the ages with that name.
          
           people.stream()
                 .collect(groupingBy(Person::getName, mapping(Person::getAge, toList())));        
          
        }
        
      }
    ```
          
    ```
    both filter and map stay within their swim lanes.
    but reduce cuts across swimlanes.
            
            filter        map               reduce
                                             0.0
    -------------------------------------     \    
    x1        |                                 \
    -------------------------------------         \
    x2       ->           x2'           ->          +
    -------------------------------------             \     
    x3        |                                         \
    -------------------------------------                 \
    x4       ->           x4'           ->                  +
    -------------------------------------
    
    ```
    
- EFFICIENCY OF STREAMS: 

```java
  
  public class Sample {
    public static void main(String[] args){
      List<Integer> numbers = Arrays.asList(1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20);      
      
      //given an ordered list find the double of the first even number greater than 3      
      //IMPERATIVE
      int result = 0;
      for(Integer e :numbers)
        if(e > 3 && e%2 == 0 ) {
          result = e*2;
          break;
        }        
      }
      System.out.println(result);             // 8
      
      
      //FUNCTIONAL
      System.out.println(
        numbers.stream()
               .filter(e -> e>3)
               .filter(e -> e%2 == 0)
               .map(e -> e*2)
               .findFirst();
      );                                      //Optional[8]   
      
      System.out.println(
        numbers.stream()
               .filter(Sample::isGT3)   |
               .filter(Sample::isEven)  |
               .map(Sample::doubleIt)   |------> Intermediate functions, builds the pipeline of function but no work done.
               .findFirst();            //This triggers the function
      );    
      
    }
  }

```
- HOW MUCH WORK? 
  - Imperative : 8 units of work
  - Functional : Lazy evaluation, it postpones until the termial function is hit.
                 It also performs 8 units of work

- Lazy evaluations are possible only if functions don't have side effects.

- CHARACTERISTICS OF STREAM
  - Sized
  - Ordered
  - Distinct
  - Sorted
  
```java
    
    numbers.stream()
           .filter(e -> e%2 ==0 )
           .sorted()
           .distinct()
           .forEach(System.out::println)
    //sized,ordered,distinct,sorted
    
    //property of a stream can be changed originally or in the middle by tinkering with the process.
    
    //INFINITE STREAM
    Stream.iterate(100, e -> e+1)
    
    //starts with 100, create a series
    //It is an infinite stream but it is lazy, until it is triggered 
    
```
- To get to know whethere something is lazy or eager look at the return type.
      
#### DEFAULT METHODS:

- Nightmare of all third party collections libraries being broken as they don't implement stream method is averted by 				introduction of a new language construct called default methods.
- If any of my children do not have a stream method, they can use this one.

- They follow slightly different inheritance rules.
- Always class wins, allowing classes to win simplifies a lot of inheritance scenarios, they are designed to allow binary 			compatible API evolution.

THREE GOLDEN RULES FOR DEFAULT METHODS/MULTIPLE INHERITANCE:

- Any class wins over any interface.
  - So if there is a method with a body or an abstract declaration, in the superclass chain, we ignore the interface completely

- Subtype wins over supertype.
  - If two interfaces are competiting to providedefault methods and one interface extends the other, subclass wins.

- No rule 3
  - If both the above don't give an answer then the sub class must either implement the method or declare it abstract.
  
#### PARALLELISM VS CONCURRENCY

- Concurrency arises when two tasks are making progress at overlapping time periods.
- Parallelism arises when two tasks are happening at literally the same time such as on a multi core CPU.

- Data parallelism works really well when same operations are performed on a lot of data.
- Problem needs to be decomposed into subsections of data and then the answers from each subsection can be composed.

- Amdahl's law is a simple rule that predicts the theretical maximum speed up on a machine.

CAVEATS:

- To work correctly in parallel, initial element has to be the identity value of the combining function in reducing operation
- For reduce, combining function has to be associative.
- Avoid usage of locks, streams framework deals with any necessary usage of synchronization.
- Parallel streams internally uses fork/join to break down the problem set.

TO PARALLEL CONVERSION:

The good - Arrays, Arraylist, Intstream range
The okay - Hashset, Treeset
The bad  - LinkedList 

FACTORS INFLUENCING PARALLEL PERFORMANCE:

- DATA SIZE
- SOURCE DATA STRUCTURE
- VALUES ARE PACKED?
- NUMBER OF AVAILABLE CORES
- PROCESSING TIME ON ELEMENT

- For a better testable code, any method that would have been written as a lambda expressioncan also be written as a 
	normal method and then directly referenced elsewhere in code using method references.

```java
	Set<String> nationalities = 
		album.getMusicians()
			 .filter(artist -> artist.getName().startsWith("The"))
			 .map(Artist::getNationality)
			 .peek(nation -> System.out.pritnln("Found Nationality: "+ nation))
			 .collection(Collectors.<String>toSet()); 
```
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
