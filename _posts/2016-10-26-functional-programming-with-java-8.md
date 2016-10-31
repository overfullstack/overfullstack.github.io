---
layout: post
title:  "Kung fu Lambda - Fun in Functional Programming"
date:   2016-10-26
excerpt_separator: <!--more-->
toc: true
comments: true
tags: [Functional Programming, Skills, Java 8]
---
<!-- TODO: Refine the blog posts, so they actually look like blog posts and not your scribbled notes -->

### Only Java 8?
Functional Programming is just a different way of thinking about structuring your code. Java 8, just provides new toys to make it more handy. That said, functional programming can be implemented even in Java 6, using anonymous inner classes in-place of lambdas.
<!--more-->

### Why Functional Programming?
- FP is handy over OOP when the core essence of objects are functions. In such scenario, design can be changed from OOP to FP, by passing the core function as an argument to constructor and use it for evaluation. This smells **Strategy Pattern**. Before Java 8, we had to use anonymous inner classes to achieve the same.
- Functions can be treated as values, and they can be assigned to variables. These are called **First Class Functions** and this type of programming is called **Higher Order Programming**. Function<>, Consumer<> etc can be used as variable types to which either lambdas or anonymous inner classes be assigned as values.
- Functional Interfaces, with only one abstract function, can be represented with Lambdas, () -> {}
- **Data-in Data-out (DIDO) Functions**, are those that return the same value for a given set of inputs. This is called **Referential Transparency**. Also know as **Pure Functions** or functions with **No Side Effects**. These kind of functions form the core of a Functional program.

### Thinking in FP
- In the code below, the function receives lambda as an argument. Since this is a type of Functional Interface, the lambda holds the implementation of single abstract method, in this case `apply()` ('apply' is the notation used for single abstract method in functional interface when its purpose can be anything).

```java
@FunctionalInterface
public static interface FunctionOf3 {
  public double apply(double a, double b, double c);
}
static FunctionOverTime combinationOf3(FunctionOverTime a, FunctionOverTime b, 
        FunctionOverTime c, FunctionOf3 combination) {
  return (time) -> combination.apply(a.valueAt(time), b.valueAt(time), c.valueAt(time));
}
```
-  Think of lambdas as Maths formulas. So you can essentially pass the values along with their formula to the function, and function uses the formula passed to evaluate like above. This way we can abstract the formula and the values passed.
-  In FP thinking, **Evaluation over Execution** is preferred. Evaluation is mostly constructed with DIDO functions, which don't cause side effects. This should form the Core of the application. This is wrapped up with Execution elements like UI, DB, File IO etc. Functional part should only focus on evaluation and computing output from input.
-  Make functions generic whenever possible.
-  Like Encapsulation in OOP, FP mantra is **Isolation**, that is running functions without any knowledge of the outside world.
-  Java 8 recognizes and treats static functions, that don't need instance instantiation, as constants. This way it doesn't have to create instance every time the method is called.
-  When looping through a list and implementing multiple operations on it, the code inside the loop clubs logic for all those operations. Instead it would be clean if we can separate those operations into different functions, which leads to **Separation of Concerns**.
-  In non-java8 environments, when using anonymous classes in-place of lambdas, try putting them outside as static constants of Function type or equivalent, and pass into Stream operations.
-  To perform multiple operations on same list of elements, link them like **Pipeline**.
-  Computer time is lot less cheaper than programmer time. So code that looks clear is more effective than code that runs fast.
-  FP may not be familiar among developers, who are used to code in a traditional OOPs way. But more readable may not always be more familiar. FP leads to more **Declarative Programming**.

### Streams
-  List elements are passed one after the other and one at a time, through all the stream operations.
-  Non of the stream operations gets triggered, until a Terminal operation (Like reduce), is called. This is **Lazy Processing**. It's like the terminal operation is a trigger and puller of data from the stream, processed through all operations. It pulls one-by-one till the list is all covered.
-  Lazy processing is efficient and moreover it does things with Separation of Concerns.
-  Short-Circuiting terminal operations like `anyMatch()` process the stream only as much as required to return the desired result.
-  Once the terminal operation is executed, the stream is dead, and throws an exception when reused (Unlike Iterator which would just return empty). To Reuse as Stream, declare it as type `Supplier<Stream>` and use its `get()` method to get new instance of stream.

```java
Supplier<DoubleStream> totalStream = () -> saleStream().mapToDouble(Sale::total);
boolean bigSaleDay = totalStream.get().anyMatch(total -> total > 100.00);
```
-  Intermediate operations when called on a stream returns a stream.
-  Use `flatMap()` to flatten a collection of stream before operating on it and outputs a concatination of all those streams.
-  In the code below, assume `saleStream()` produces a stream of sales and every sale has a list of items. `map` returns a Stream of Streams, while `flatMap` flattens all those streams and concatinates them into a single stream.

```java
Stream<Stream<Item>> itemStream1 = saleStream().map(sale -> sale.items.stream());
Stream<Item> itemStream2 = saleStream().flatMap(sale -> sale.items.stream());
```
-  `collect()` to collect the out-coming stream to a desired data structure like List. It also has interesting functions like `groupBy` and `groupByConcurrent`, `summarizingDoubles` etc. This is called **fold** in FP terms, which summarizes bunch of values into one.
-  `Stream.generate(supplier)` can generate an infinite stream of objects, but it needs to be used along with a Short-Circuiting operator like `limit()`. The below code generates sale objects supplied by the `Supplier`, limited by the quantity passed.
```java
public static Supplier<Sale> supplier = () -> new Sale(...);
return Stream.generate(supplier).limit(quantity);
```
-  **ParallelStreams** are a great way to span work onto multiple threads, when order of processing is not of a concern.
-  `Optional` is preferred over traditional null checking. It can be flawlessly used in the stream chains, without worrying about Null. It can also be used to return alternate results with `orElse` when the result set is empty.
-  Stream, Optional and Functions are **Contexts**. Contexts are like containers with a framework around (Execution around Pattern) and accepts a variable which it uses and executes logic around it.
-  `sorted()` is a State-full operation, because unlike processing one-by-one, it needs to process all.

### Tit-bits
-  **Monad**, is so popular in FP world. Think of monads as a context object that wraps a value and allows us to apply a set of transformations on that value. Stream and Optional are Monads, when they are used as `Stream.of()` and `Optional.of()` as constructors and `map()` and `flatMap()` as binding functions.

```java
Optional.of(5).flatMap(addOne).flatMap(addTwo).equals(Optional.of(5).flatMap(addThree));
```
-  **External Iteration**, is when you are in control of the iteration, like iterating using `for/while` loop
-  **Internal Iteration**, is when the Iterable is in control of the iteration. We just pass it the function saying what to do with those elements.
-  Functions like `mapToDouble()` can deal with primitives without wrapping, which is more efficient. (Explore more of such...)
-  `Supplier` can act as function object that can hold a function that can return a result.
