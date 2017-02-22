### DateFormat 
- DateFormat is an abstract class for date/time formatting subclasses which formats and parses dates or time in a 
language independant manner
- The date is represented as a Date object or as the milliseconds since January 1, 1970, 00:00:00 GMT. 

Formatting a date for the current locale:

```java
   myString = DateFormat.getDateInstance().format(myDate);
```
- Subclasses SimpleDateFormat, allows for formatting (date\-text) and parsing (text\-date) and normalization.
- Date formats are not synchronized. It is recommended to create separate format instances for each thread. 
- If multiple threads access a format concurrently, it must be synchronized externally.

### SimpleDateFormat
- SimpleDateFormat allows you to start by choosing any user-defined patterns for date-time formatting. 
- Preferred to create a date-time formatter with either getTimeInstance, getDateInstance, or getDateTimeInstance in DateFormat.
- Pattern letters are usually repeated, as their number determines the exact presentation: 
    - yy gives SimpleDateFormat must interpret the abbreviated year relative to some century. 
     It does this by adjusting dates to be within 80 years before and 20 years after the time the SimpleDateFormat instance is created.
    - Pattern :"yyyy.MM.dd G 'at' HH:mm:ss z", Result: 2001.07.04 AD at 12:08:56 PDT
- It is possible to customize the date symbols used in the formatted output, for a specific locale

```java
    Locale locale = new Locale("en", "UK");
    DateFormatSymbols dateFormatSymbols = new DateFormatSymbols(locale);
    dateFormatSymbols.setWeekdays(new String[]{
            "Unused",
            "Sad Sunday",
            "Manic Monday",
            "Thriving Tuesday",
            "Wet Wednesday",
            "Total Thursday",
            "Fat Friday",
            "Super Saturday",
    });

    String pattern = "EEEEE MMMMM yyyy";
    SimpleDateFormat simpleDateFormat =
            new SimpleDateFormat(pattern, dateFormatSymbols);

    String date = simpleDateFormat.format(new Date());
    System.out.println(date);
    
```
- One way to reuse date formats without trading thread-safety is to put them in a ThreadLocal, some libraries do that. 
- That's if you need to use the same format multiple times within one thread. 
- But in case you are using a servlet container (that has a thread pool), remember to clean the thread-local after you finish.
- If you do not clean up when you're done, any references it holds to classes loaded as part of a deployed webapp will remain in the permanent heap and will never get garbage collected. 
- Redeploying/undeploying the webapp will not clean up each Thread's reference to your webapp's class(es) since the Thread is not something owned by your webapp. 
- Each successive deployment will create a new instance of the class which will never be garbage collected.
- Each thread holds an exclusive copy of ThreadLocal variable which becomes eligible to Garbage collection after thread finished or died, 
  normally or due to any Exception, Given those ThreadLocal variable doesn't have any other live references.
- ThreadLocal variables in Java are generally private static fields in Classes and maintain its state inside Thread.

> DateTimeFormatter in Java 8 is immutable and thread-safe alternative to SimpleDateFormat.

### ThreadLocal storage
- A single instance of ThreadLocal can store different values for each thread independently. 
- Therefore, the value stored in a ThreadLocal instance is specific (local) to the current running thread and any other code logic running on the same thread will see the same value, but not the values set on the same instance by other threads.
- In a single threaded environment,with a static field used, then a getter of ID can obtain current transaction.
- In multithreaded environment each thread generates its own ID and overrides the static field.

Example:
```java
public class TransactionManager {
   private static final ThreadLocal<String> context = new ThreadLocal<String>();
   public static void startTransaction() {
      //logic to start a transaction
      //...
      context.set(generatedId); 
   }
   public static String getTransactionId() { 
      return context.get();
   }
   public static void endTransaction() {
      //logic to end a transaction
      //…
      context.remove();
   }
}

```

### Internals of ThreadLocal
- ThreadLocal is implemented by having a map(ThreadLocalMap) as a field (with a WeakReference entry) within each thread instance.

   > Weak Refereces are those which are not strong enough to enforce object to be in memory. They allow you to leverage the garbage collectors reachability to you. While Softreferences which are used in cache can are also weakly referenced but depends on the availability of memory.
   
- The keys of those maps are the corresponding ThreadLocals themselves. 
- Therefore, when a set/get is called on a ThreadLocal, it looks at the current thread, finds the map, and looks up the value with “this” ThreadLocal instance.
 
   > Client JRE always keeps its footprint small by removing soft references rather than expanding heap, while in Server JRE
   to improve performace heap is maximised rather than removing soft references

- The value object put into the ThreadLocal would not purge itself if there are no more strong references to it. 
- Instead, the weak reference is done on the thread instance, which means Java garbage collection would clean up the ThreadLocal map if the thread itself is not strongly referenced elsewhere.

- Naive Implementation of ThreadLocal<T>
      - ConcurrentHashMap<Thread,T> using Thread.currentThread() as its key. 
      - Disadvantages
         - Thread contention - slowdown in performance
         - Permanently keeps a pointer to both thread and the object, even after thread has finished and could be GC'ed

- The GC friendly implementation
      - ```java   Collections.synchronizedMap(new WeakHashMap<Thread,T>())    ```
      - No one else is holding onto key after finishing thread and can be GC'ed
      - Disadvantages
         - Thread contention still prevails
         - If in some environment threads are hold onto after they'd finished, they would never be GC'ed

- The clever implementation
      - We've been thinking about ThreadLocal as a mapping of threads to values, but maybe that's not actually the right way to think about it. 
      - Instead of thinking of it as a mapping from Threads to values in each ThreadLocal object, what if we thought about it as a mapping of ThreadLocal objects to values in each Thread? 
      - If each thread stores the mapping, and ThreadLocal merely provides a nice interface into that mapping, we can avoid all of the issues of the previous implementations.
      
      ```java new WeakHashMap<ThreadLocal,T> ```
      - Only one thread will ever be accessing this map

### DateTimeFormatter
- It uses concurrentHashMap internally to access a particular element and thus has performance issues.
   >It is preferred to use Threadlocal class over DateTimeFormatter considering the performance.
   

