# JAVA 8

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

- FIT INTO JAVA PHILOSOPHY: What does having lambda mean to java? 
      - Java always cares about backward compatibility.
      - Lambdas backed by single abstract method interfaces. Makes them compatible with old code.

- UNDER THE HOOD: What does the compiler do when it sees a lamda expression?
      - [x] It constructs an anonymous inner class of how it would be implemented if it were java7. 
          
          JAVA7 : If it any anonymous inner classes are present, jvm generates two .class files
          By the same logic if lambdas were implemented many times, equivalent number of objects has to be created.
          Although this is what other programming languages like groovy, scala which use jvm do. But not java (Bigger scale of usage)
          [Anonymous inner classes] -> [Annonymous classes] -> [Big jar files] -> [Memory footprint] -> [Garbage collection] -> [Runtime footprint]
      
      - [ ] Invoke dynamic implemented for dynamically typed languages running on jvm
      
          It means you can attach and detach to the function to be invoked dynamically, finally function pointers are available at the 
          program level. Lambdas are implemented using INVOKE DYNAMIC.
          So, lambdas doesn't have the overhead of creating objects.
          
             They can become: 
              1. A static method
              2. Instance method
              3. Routing of invoke dynamic to an existing method in other class.

- BENEFIT FROM LAMBDAS: 

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
- Java8 has type inference but only for lamda expressions.
- While lamdas are cute, keep it that way.
- DONOT HAVE LOGIC IN THE LAMBDA, PUT IT IN A FUNCTION AND CALL THE FUNCTION FROM THE LAMBDA.

- METHOD REFERENCE: Only useful in the most trivial case, receiving a parameter and pass through.
    - If you want to do anything with the received argument, its not right.

```java
  numbers.forEach(System.out::println);
  //System.out is an object and we are calling the method println, it is an instance method on the object.
  
  numbers.stream()
          //.map(e -> String.valueOf(e))
         .map(String::valueOf)              //Reference to a static method
         .forEach(System.out::println)      //Reference to an instance method
         
         
  numbers.stream()
         //.map(e -> e.toString())
         .map()
         .forEach(System.out::println);
  
```

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
