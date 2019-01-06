---
title: Kung fu Lambda ƛ
date: "2016-10-26T00:00:00.000Z"
layout: post
draft: false
path: "/posts/functional-programming-with-java-8/"
category: "Functional Programming"
cover: "./cover.jpg"
tags: 
    - "Java 8"
description: "Fun in Functional Programming with Java 8 and how it is competing with younger functional languages."
---

### FP vs OOP Simply:
- Whenever I write some code to deal with data about an entity, then functional programming seems to work best.
- Whenever I write some code to simulate that entity, then object-oriented programming seems to work best.
For example, if we have to design a system that deals with **People**, we use OOP to design a **Person** class, which holds the state and behavior of a person. But let us say, we need to perform an operation to calculate age of every person based on their DOB, OOP tells us to keep that as a function inside **Person** class. But if you as FP, it looks at it like a mathematical data-driven operation. It suggests you to prepare a function independent of a person class, which can be called with DOB as input, and we get age as output. We can **Evaluate** ages of all people by passing them through this function.

### Only Java 8?
Functional Programming is just a different way of thinking about structuring your code. Java 8, just provides new toys to make it more handy. That said, functional programming can be implemented even in Java 6, using anonymous inner classes in-place of lambdas.

### Why Functional Programming?
- FP is handy over OOP when the core essence of objects are functions. In such scenario, design can be changed from OOP to FP, by passing the core function as an argument to constructor and use it for evaluation. This smells **Strategy Pattern**. Before Java 8, we had to use anonymous inner classes to achieve the same.
- Functions can be treated as values, and they can be assigned to variables. These are called **First Class Functions** and this type of programming is called **Higher Order Programming**. Function<>, Consumer<> etc can be used as variable types to which either lambdas or anonymous inner classes be assigned as values.

```java:title=FirstClassFunction.java
private static Function<String, String> lastWord = (String phrase) ->
     Arrays.asList(phrase.split(" ")).stream()
                    .reduce((other, last) -> last)
                    .orElse("");
```

- Functional Interfaces, with only one abstract function, can be represented with Lambdas, () -> {}
- **Data-in Data-out (DIDO) Functions**, are those that return the same value for a given set of inputs. This is called **Referential Transparency**. Also know as **Pure Functions** or functions with **No Side Effects**. These kind of functions form the core of a Functional program.
- FP also encourages **Immutability** for the same reason, to avoid any side effects.

### Thinking in FP
- In the code below, the function receives lambda as an argument. Since this is a type of Functional Interface, the lambda holds the implementation of single abstract method, in this case `apply()` ('apply' is the notation used for single abstract method in functional interface when its purpose can be anything).

```java:title=FunctionalInterface.java
@FunctionalInterface
public static interface FunctionOf3 {
  public double apply(double a, double b, double c);
}

static FunctionOverTime combinationOf3(FunctionOverTime a, FunctionOverTime b, FunctionOverTime c, FunctionOf3 combination) {
  return (time) -> combination.apply(a.valueAt(time), b.valueAt(time), c.valueAt(time));
}
```
- Think of lambdas as Maths formulas. So you can essentially pass the values along with their formula to the function, and function uses the formula passed to evaluate like above. This way we can abstract the formula and the values passed.
- Like Encapsulation in OOP, FP's mantra is **Isolation**, that is running functions without any knowledge of the outside world.
- In FP thinking, **Evaluation over Execution** is preferred. Evaluation is mostly constructed with DIDO (Data-in Data-out) functions, which take data in, process and return an output, without causing side effects. This should form the Core of the application. This is wrapped up with Execution elements like UI, DB, File IO etc. Functional part should only focus on evaluation and computing output from input.
- Make functions generic whenever possible.
- Java 8 recognizes and treats static functions, that don't need instance instantiation, as constants. This way it doesn't have to create instance every time the method is called.
- When looping through a list and implementing multiple operations on it, the code inside the loop clubs logic for all those operations. Instead it would be clean if we can separate those operations into different functions, which leads to **Separation of Concerns**.
- In non-java8 environments, when using anonymous classes in-place of lambdas, try putting them outside as static constants of Function type or equivalent, and pass into Stream operations.
- To perform multiple operations on same list of elements, link them like **Pipeline**.

### Streams
- List elements are passed one after the other and one at a time, through all the stream operations.
- None of the stream operations gets triggered, until a Terminal operation (Like reduce), is called. This is **Lazy Processing**. It's like the terminal operation is a trigger and puller of data from the stream, processed through all operations. It pulls one-by-one till the list is all covered.
- Lazy processing is efficient and moreover it does things with Separation of Concerns.
- Also, all intermediate operations are **Lazy Streams**, which means one unit of stream gets executed through all the steps in the pipe-line, before the next one is taken up. If a Truncate operation like `findFirst()` is encountered, rest of the units are ignored.

```java:title=LazyStream.java
List<Integer> list = Arrays.asList(1, 10, 3, 7, 5);
int a = list.stream()
            .peek(num -> System.out.println("will filter " + num))
            .filter(x -> x > 5)
            .findFirst()
            .get();
System.out.println(a);

/* 
This outputs:
will filter 1
will filter 10
10
*/

```
- Functions like `mapToDouble()` can deal with primitives without wrapping, which is more efficient. Explore more of such...
- Short-Circuiting terminal operations like `anyMatch()` process the stream only as much as required to return the desired result.
- Once the terminal operation is executed, the stream is dead, and throws an exception when reused (Unlike Iterator which would just return empty). To Reuse as Stream, declare it as type `Supplier<Stream>` and use its `get()` method to get new instance of stream.

```java:title=Supplier.java
Supplier<DoubleStream> totalStream = () -> saleStream().mapToDouble(Sale::total);
boolean bigSaleDay = totalStream.get().anyMatch(total -> total > 100.00);
```
- Intermediate operations when called on a stream returns a stream.
- Use `flatMap()` to flatten a collection of stream before operating on it and outputs a concatenation of all those streams.
- In the code below, assume `saleStream()` produces a stream of sales and every sale has a list of items. `map` returns a Stream of Streams, while `flatMap` flattens all those streams and concatinates them into a single stream.

```java:title=MapAndFlatMap.java
Stream<Stream<Item>> itemStream1 = saleStream().map(sale -> sale.items.stream());
Stream<Item> itemStream2 = saleStream().flatMap(sale -> sale.items.stream());
```
- `collect()` to collect the out-coming stream to a desired data structure like List. It also has interesting functions like `groupBy` and `groupByConcurrent`, `summarizingDoubles` etc. This is called **fold** in FP terms, which summarizes bunch of values into one.
- `Stream.generate(supplier)` can generate an infinite stream of objects, but it needs to be used along with a Short-Circuiting operator like `limit()`. The below code generates sale objects supplied by the `Supplier`, limited by the quantity passed.

```java:title=InfiniteStream.java
public static Supplier<Sale> supplier = () -> new Sale(...);
return Stream.generate(supplier).limit(quantity);
```
- **ParallelStreams** are a great way to span work onto multiple threads, when order of processing is not of a concern.
- `Optional` is preferred over traditional null checking with `isPresent()` which is more intuative. Since passing optionals around methods avoids presence of NULLs, there won't be any restlessness about NPE. Note, you still need to check `isPresent()`, so it's not a total replacement to avoid checking, it just makes it error free. According to the documentation, Optional should be used as a return type. And that’s all. It's a neat solution for handling data that might be not present.
- Also, It can be flawlessly used in the stream chains, without worrying about Null. It can also be used to return alternate results with `orElse` when the result set is empty.
-  Stream, Optional and Functions are **Contexts**. Contexts are like containers with a framework around (Execution around Pattern) and accepts a variable which it uses and executes logic around it.
-  `sorted()` is a State-full operation, because unlike processing one-by-one, it needs to process all.

### Conclusion
- Computer time is lot less cheaper than programmer time. So code that looks clear is more effective than code that runs fast.
- FP may not be familiar among developers, who are used to code in a traditional OOPs way. But more readable may not always be more familiar. FP leads to more **Declarative Programming**.

### Tit-Bits
- **External Iteration**, is when you are in control of the iteration, like iterating using `for/while` loop
- **Internal Iteration**, is when the Iterable is in control of the iteration. We just pass it the function saying what to do with those elements.
- Functions like `mapToDouble()` can deal with primitives without wrapping, which is more efficient. (Explore more of such...)
- `Supplier` can act as function object that can hold a function that can return a result.
