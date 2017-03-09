Regular Expressions:
--------------------
- Regular expressions are patterns used to match character combinations in strings.
  In JavaScript, regular expressions are also objects.

#### Creating a regular expression

There are two ways of creating a RegEx:

- ``` javascript var re = /ab+c/; ``` - compiled when script is loaded, preferred when regEx remains constant, boosts performance.
- ``` javascript var re = new RegEx('ab+c'); ``` - runtime compilation, preferred when not certain about the pattern.

#### Writing a regular expression pattern

- Using simple patterns Eg: ```javascript /abc/,/baba/ ```.
- Using special characters
      
character | meaning
----------|---------
\ | if it precedes a non special character then it forms word boundary character, else removes the speciality of special one
^ | matches beginning of input. ```javascript /^A/ does not match the 'A' in "an A", but does match the 'A' in "An E" ```.
$ | matches end of input. ```javascript /^t/ does not match /eater/ while matches /eat/ ```.
* | matches preceeding expression 0 or more times. 
+ | matches preceeding expression 1 or more times.
? | matches preceeding expression 0 or 1 time.
. | matches any single character exccept new line character.
(x) | matches x and remembers the match. capturing paranthesis.
(?:x) | matches x but doesn't remember it. Non capturing paranthesis.
x(?=y) | matches only if x is followed by y, called lookahead. 
x(?!y) | matches only if x is not followed by y, called negated lookahead.
(x\|y) | matches if x or y.
{n} | matches n occurences of a character.
{n,m} | matches atleast n and atmost m characters.
\[xyz\] | matches anyone of the characters in the brackets.
\[^x-z\] | matches any character not included in the brackets.
[\b] | matches backspace character.
\d | matches a digit character. 
\D | matches a non-digit character.
\0 | matches a NULL(U+0000) character.
\xhh | matches the character with code hh (two hexadecimal digits).
\uhhhh | matches the character with code hhhh (four hexadecimal digits).
\f | matches a form feed (U+000C). a page break inserted
\n | matches a line feed (U+000A). a new line
\r | matches carriage return
\t | matches a tab.
\w | matches any alpha numeric character.
\s | single white space character.

#### Working with regular expressions

Method | Description
-------|------------
exec | A RegExp method that executes a search for a match in a string and returns an array of information or null on a mismatch.
test | A RegExp method that tests for a match in a string and returns true or false.
match | A String method that executes a search for a match in a string and returns an array of information or null on a mismatch.
search | A String method that executes a search for a match in a string and returns the index of the match or -1.
replace | A string method that executes a search and replaces that with a new substring if matched.
split | A string method to break a string into array of substrings.

Two possible ways:
- ```javascript var reArray = /d(b+)d/g.exec('cdbbdbsbz') ```
- ```javascript var re = new RegExp('/d(b+)d/','g'); 
      var reArray = re.exec('cdbbdbsbz'); ```

- Paranthesized substring matches
```javascript
  var re = /(\w+)\s(\w+)/;
  var str = 'John Smith';
  var newstr = str.replace(re, '$2, $1');
  console.log(newstr);
  
  //prints Smith,John  
```
- Advanced searching with flags
```javascript /ab+c/g ```

Flag | Description
-----|------------
g | global search
i | case insensitive search
m | multi line search

       
