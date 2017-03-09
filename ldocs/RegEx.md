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
       
