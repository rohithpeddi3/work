
IoC container
-------------

- org.springframework.beans and org.springframework.context packages provide the basis for the Spring Framework's IoC container
    - BeanFactory provides the configuration framework and basic functionality
    - ApplicationContext adds more enterprise-centric functionality to it.
    
- In Spring, beans form the backbone of your application and are managed by the Spring IoC(Inversion of control)container. 
- A bean is simply an object that is instantiated, assembled and otherwise managed by a Spring IoC container.
- These beans, and the dependencies between them, are reflected in the configuration metadata used by a container.

Container
---------
- The BeanFactory interface is the central IoC container interface in Spring. 
- Its responsibilities include instantiating or sourcing application objects, configuring such objects, and assembling the dependencies between these objects.
- There are a number of implementations of the BeanFactory interface that come supplied straight out-of-the-box with Spring. 
- The most commonly used BeanFactory implementation is the XmlBeanFactory class. 
- This implementation allows you to express the objects that compose your application, and interdependencies between such objects, in terms of XML. 
- The XmlBeanFactory takes this XML configuration metadata and uses it to create a fully configured system or application.

- **Configuration metadata + Spring container +  Your business objects = *Fully configured system* **

- Configuration metadata informs the Spring container how to “instantiate, configure, and assemble [objects in your application]”
- Spring configuration consists of at least one bean definition that the container must manage.
- When using XML-based configuration metadata, these beans are configured as ```<bean/> ```elements inside a top-level ```<beans/>``` element.
