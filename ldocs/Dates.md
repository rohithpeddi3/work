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



