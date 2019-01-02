---
title: Pocket Design Patterns 📋
date: "2018-04-14T00:00:00.000Z"
layout: post
draft: false
path: "/posts/pocket-design-patterns/"
category: "Design Patterns"
tags: 
    - "Design"
description: "All the popular Design Patterns abridged for quick revision, along with some tidbits."
---

## Creational Patterns
### Factory method Vs Abstract Factory
- Abstract factory has a level more depth of abstraction.
- Factory method abstracts creation of a family of objects.
- Abstract factory does the same, but inside, the product depends on an abstract factory which can be assigned any of the family of factories. 
- This abstract factory is 'composed' (HAS-A) inside factory.
- Abstract Factory is one level higher in abstraction than Factory Method. Factory Method abstracts the way objects are created, while Abstract Factory abstracts the way factories are created which in turn abstracts the way objects are created.

### Builder Pattern
- When the parameters involved in construction of an object are dynamic and inconsistent in terms of optional/required, passing null for optionals or having multiple constructors can get dirty.
- Instead, a 'builder' class, which HAS-A the object to build, can be made responsible of creation.
- This can be achieved by fluent methods inside builder class, which act like setter methods on the object to be created.

## Behavioral Patterns
### Strategy Pattern
- "Encapsulate what varies", use HAS-A over IS-A.
- Behavior encapsulated into an object which is used HAS-A. This can be dynamically changed to change behavior of the object.
- This is called Runtime Sub-classing or Runtime Polymorphism.
- This is alternative to sub-classing

### Observer pattern
- Observer objects are registered in a HAS-A fashion.
- All observers implement same interface that contain the notify or callback method.
- This encourages loose coupling.

### Command Pattern
- Encapsulates request or command as an object.
- To decouple client from receiver Invocation, the request/command object is given to invoker, instead of directly invoking it on the receiver.
- It helps in Queueing, logging requests etc.
- Command object HAS-A receiver which calls methods on receiver. Client just has to call invoker.execute();

### Template Method Pattern
- It defines the skeleton of algorithm, deferring some steps to sub-classes to define or redefine, without changing algorithm structure.
- It can also contain methods called 'Hooks', to provide default implementation of a method common to all classes.
- In template, client can depend on higher abstract class. It has control over algorithm and calls to subclasses only when there is a need to implement a method.
- This is a great design tool for creating *Frameworks*.

### Iterator Pattern
- Provides a way to iterate through a aggregate collection of objects.
- The Iterator object consists of methods that takes care of looping through the collection.
- Underlying representation of collection (be it array or arrayList or HashMap) is hidden from client.

### Composite Pattern
- It deals with 2 responsibilities: *Iterating* and *Uniformity*.
- Allows objects to compose objects into tree structure to represent *Part-Whole* hierarchies.
- It lets client treat both individual objects and composite objects the same way.
- SRP (Single Responsibility Principle) is violated for Transparency.

### State Pattern 
- The behavior of an object depends on its state.
- State is controlled and switched using a HAS-A object.
- It smells like *Strategy Pattern* but they differ in intent.
- Strategy pattern is an alternate for Sub-Classing while State pattern is an alternative to having if-else conditions everywhere and encapsulating behavior to state object.


## Structural Patterns
### Decorator Pattern
- "Open-Closed" Principle. Open for extension and closed for change.
- This is used to achieve "Dynamic Inheritance".
- A component is given to Decorator object as HAS-A and Decorator class adds extra functionality or responsibility to it.
- Both component and Decorator implement the same interface. So one decorator can be component to another decorator, thus behavior can be added in layers or wrappers.

### Adapter Pattern
- Converts one interface to another (Target), adaptable to client.
- It is done by implementing 'Target' interface and HAS-A Adoptee object. Now client calls methods on Adapter and it delegates appropriately to Adoptee.
- Decorator, Adapter and Facade patterns are close but differ in their intent.

### Bridge Pattern
- This is similar to Adapter pattern, except that it bridges between two hierachies of abstractions.
- It has two layers abstractions, one that holds the interface methods for client and the other abstraction is what actual implementations extend.
- Abstraction for client HAS-A implementor abstraction for delegation.
- This provides flexibility for both these hierarchies to independently change.
- This has downside of increasing complexity.

### Facade Pattern
- It's an unified interface, that a client can use with ease to control many other sub-systems.
- A facade HAS-A all other components of sub-systems references and makes use of them appropriately.
- If there are too many sub-systems for one Facade to handle, we can multiple layers of Facade.

### Proxy Pattern
- It provides a surrogate or placeholder for another object to control access to it.
- The local stub has the same API as original object. Once client invokes any method on stub, it requests the state of original object and provides it to the client.

### Decorator vs Adapter vs Facade
- Decorator: Adds responsibility without the change of interface.
- Adapter: Converts on interface to another.
- Facade: Simplify an interface.


## Bonus
### Principle of Least knowledge (or) Law of Delimiter
- One should make calls only to its immediate objects. Otherwise, it builds unnecessary dependencies between objects and makes the system fragile and complex to understand.

```java
station.getThermometer().getTemp() // Wrong approach
station.getTemp() // Right approach
```
- But we can call methods on objects we pass or create in any local methods.
- However, this results in more 'wrapper' classes being written.
- The same is followed in Facade pattern, client only interacts with its immediate Facade object.

### Hollywood Principle
- Always higher level components should call lower-level ones.

### MVC Pattern
- View and Controller together implement *Strategy Pattern*.
- View depends on controller for user actions, so view behavior depends on Controller. Now, this controller can be easily replaced with another to change behavior.
