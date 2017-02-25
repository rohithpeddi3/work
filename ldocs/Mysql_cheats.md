- Starting with a vowel query

  > SELECT DISTINCT CITY FROM STATION WHERE CITY RLIKE '^[AEIOUaeiou].*$'; 
  
- Does not start with a vowel; add a NOT to above statement 

  > SELECT DISTINCT CITY FROM STATION WHERE CITY NOT RLIKE '^[AEIOUaeiou].*$';
  
- Selecting the first one in ascending order or descending order; LIMIT 1 is used to reference.

  > SELECT CITY, CHAR_LENGTH(CITY) FROM STATION ORDER BY CHAR_LENGTH(CITY) LIMIT 1;
  
  > SELECT CITY, CHAR_LENGTH(CITY) FROM STATION 
    WHERE ( CHAR_LENGTH(CITY)= (SELECT CHAR_LENGTH(CITY) FROM STATION ORDER BY CHAR_LENGTH(CITY) DESC LIMIT 1)) 
    ORDER BY CHAR_LENGTH(CITY) LIMIT 1;

- Every derived table has to have an alias; Names that donot start or end with a vowel.
  
  > SELECT CITY FROM 
        (SELECT DISTINCT CITY FROM 
                STATION WHERE CITY NOT RLIKE '^[AEIOUaeiou].*$') AS T
    WHERE CITY NOT RLIKE '^.*[AEIOUaeiou]$';
    
 - Use ORDER BY RIGHT(NAME,3), if you need to order it based on last three letters of column. 