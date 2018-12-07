---
layout: post
draft: false
title: "Functional Terminology"
date: 2018-12-07
excerpt_separator: <!--more-->
tags:
    - "Functional Programming" 
---

## Pure Functions 
- These return a value based on what is passed in to the function.
- For instance, if we pass x into a function as input we will get F of x out as output. 
- Another property of a pure function is that it will always return the same result for the same passed in value. 
- If we pass input x into the function again, we should get back the exact same value, F of x. You should be able to do this an infinite amount of times and always get back the same output for a specific input. In addition, pure functions do not modify values outside of its scope. They are independent from any state in the system.
- They never mutate data and they do not produce side effects. Generally, they can also easily be reused.

## First-Class Functions
- First of all, a programming language must support first-class functions to support the functional programming paradigm.
- First-class functions can be stored as a variable, they can be passed as an argument, and also they can be returned as the result of a function call.
- In addition, a first-class function can also be bound to a variable name, as well as stored in a data structure. Basically, you can generally do anything with a first-class function that you would be able to do with a variable or object. 

## Higher-order Functions
- These are functions that can operate on other functions. They can take in a function as input, or even return one as output.
- First-class functions are useless without higher-order functions to pass them into or return them from.

## Anonymous Functions
- The roots of anonymous functions lie heavily in lambda calculus.
- An anonymous function allows us to define ad hoc logic as we need, without needing to declare a formal named function. 
- They are nameless and they can also serve as an argument to another function. 
- Also, they can be assigned to a variable. They are basically a nameless first-class function.
- Anonymous functions can be passed into or returned from a higher-order function. 

## Clousures
- Closures are lexically scoped name binding in languages with first-class functions. Closures give us function portability. Closures are what allow us to pass around and store functions. 
- A closure is defined as a **persistent local variable scope** which holds on to local variables after the code execution has moved out of that block.
- Captured variables can be accessed through the closure's copies of variable values or references when the function is invoked outside of their scope. A closure, which is the scope of a function, is kept alive by a reference to that function. Variables which were in scope when that function was defined will still be in scope when we call it later in a different context.
- A closure can also be thought of as a record storing a function together with a environment. One final way of defining a closure is as a mapping associating each variable of the function with the value or reference to which the name was bound when the closure was created. Next up, let's go over functional composition.

## Some-more
- **Monad**, Think of monads as a context object that wraps a value and allows us to apply a set of transformations on that value and get it back out with all the transformations applied. 
- Stream and Optional are Monads, when they are used as `Stream.of()` and `Optional.of()` as constructors and `map()` and `flatMap()` as binding functions.

```java
Optional.of(5).flatMap(addOne).flatMap(addTwo).equals(Optional.of(5).flatMap(addThree));
```
- `collect()` method is called **fold** in FP terms, which summarizes bunch of values into one.
