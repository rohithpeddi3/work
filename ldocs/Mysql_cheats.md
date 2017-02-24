- Starting with a vowel query

 ```java
  SELECT DISTINCT CITY FROM STATION WHERE CITY RLIKE '^[AEIOUaeiou].*$'; 
  ```
  
- Does not start with a vowel; add a NOT to above statement 
  
  ```java
  SELECT DISTINCT CITY FROM STATION WHERE CITY NOT RLIKE '^[AEIOUaeiou].*$';
  ```
  
- Selecting the first one in ascending order or descending order; LIMIT 1 is used to reference.

    ```java
    SELECT CITY, CHAR_LENGTH(CITY) FROM STATION ORDER BY CHAR_LENGTH(CITY) LIMIT 1;
  
    SELECT CITY, CHAR_LENGTH(CITY) FROM STATION 
    WHERE ( CHAR_LENGTH(CITY)= (SELECT CHAR_LENGTH(CITY) FROM STATION ORDER BY CHAR_LENGTH(CITY) DESC LIMIT 1)) 
    ORDER BY CHAR_LENGTH(CITY) LIMIT 1;
    ```

- Every derived table has to have an alias; Names that donot start or end with a vowel.
  
  ```java
        SELECT CITY FROM 
            (SELECT DISTINCT CITY FROM 
                STATION WHERE CITY NOT RLIKE '^[AEIOUaeiou].*$') AS T
                WHERE CITY NOT RLIKE '^.*[AEIOUaeiou]$';
  ```
    
- Use ORDER BY RIGHT(NAME,3), if you need to order it based on last three letters of column. 

- For If else statements case can be used in MySQL and purpose can be solved.
  To check whether columns in a row correspond to a triangle or not.

      ```java
          SELECT 
                CASE
                    WHEN (A=B AND B=C) THEN 'Equilateral'
                    WHEN (A+B>C AND B+C>A AND C+A>B) 
                        THEN 
                            CASE
                                WHEN (A=B OR B=C OR C=A) THEN 'Isosceles'
                                ELSE 'Scalene'
                            END
                    ELSE 'Not A Triangle'
                END
          FROM TRIANGLES;      
      ```

  
  
