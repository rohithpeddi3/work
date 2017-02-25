DEPENDENCY INJECTION:
---------------------

- Consider an object drawing a shape. 

    ```java
      public class Drawing {
        private Shape shape;
        
        public void setShape(Shape shape){
          this.shape = shape;  
        }
        
        public void drawShape(){
          this.shape.draw();
        }     
      }
    
    ```
- The above class does draw a shape without actually knowing what shape is it drawing. 
- The dependency of it on shape object to draw is being taken away and shape creation is being handled by a different class.
