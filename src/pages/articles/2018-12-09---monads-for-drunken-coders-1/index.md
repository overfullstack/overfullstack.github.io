---
title: "Monads for Drunken Coders, Pint-1\U0001F37A"
date: '2018-12-09T00:00:00.000Z'
layout: post
draft: false
path: /posts/monads-for-drunken-coders-pint-1/
cover: ./cover.jpg
category: Functional Programming
tags:
  - Java 8
  - Monads
description: 'A chilled introduction to the Dreaded Monad, using Java 8'
---

# Story of an Egg validator

![Intro](media/introduction.gif)

## Sol 1: One egg - One validation

Life is so simple. Pass that one egg through that one validator. Results in good or bad.

## Sol 23: Many eggs - One validation

Not difficult at all, simply pass them through validator, one after the other and collect the results for each one, in order. With simple if-else condition, this code looks like a Cute Sprout! 🌱

## Sol 97: Many eggs - Many validations

Why do I sense climate's getting a bit hotter. Ok, still no problem, I know Java 8\. Let me write a pipe of filter functions. Each of them just pass the good ones ahead and discard bad ones.

```java:title=firstfunctionalcode.java
eggs.stream()
    .filter(EggValidator::validator1)
    .filter(EggValidator::validator2)
    .filter(EggValidator::validator3)
    ....
    ...
    ..
```

Yay! I'm a Functional programmer! Let me have a 🍺

- But what if at the end of validation pipeline, I need both good and bad eggs? Hmm, placing the 🍺 mug back on table.
- How can I make all of them pass through every validator and accumulate the results?
- Probably, ditch that FP, let me just use the all-friendly for-each loop to iterate through all the eggs, call validator on each egg, store bad eggs separately in a bucket as and when I find one.
- Bad! I couldn't use those Streams and Lambdas. Anyways, they are just fancy syntactic-sugar. May be next time! Let me go ahead with this if-else ladder for now. Let me take a sip! 🍺
- Wait, what if I also need to know the reason why an egg is bad?
- Let me use a global badEggFailureBucketMap and put eggIndex to validation failure.
- But! how can I tightly map validation-failure-TO-failed-validation-method? Hmm... it's ok to not tightly map them, I just know which failure is-to what.

Suddenly, the cute sprout turned into a tree🎋, with multiple if-else-break-continue branches of execution.

## Sol 179: Many Types of eggs - Many validations

- Seriously, how many validators should I write? One per every egg type? Repeat this entire algo for each and every type, just changing the parameter types!?
- Also, there can be some **exceptional** eggs, that blow-off while going through the validator, how am I supposed to deal with all those exceptions?
- How am I gonna jenga new validations in the middle of this chaos!?
- By the way, notice, I kept mutating egg list while iterating, removing bad ones. It's totally confusing to reason-out, how is the state changing.
- Now, don't ask me to add inter-dependent validations. If they throw exceptions as well, the if-else-try-catch nest crosses all margins and overflows out of my screen.
- Again, don't ask me to unit-test this shit!

## Sol 237: Many Types of eggs - Many more validations - _in parallel_

I think, I'm too drunk. My head is spinning! 🤯

> This design pattern has a name and it's called the "Evolution-of-a-Problem-Over-Time".

The code ended-up like an Alien plant 👽

```java{8,9,10,18,23,26}:title=cyclomaticeggvalidator.java
void cyclomaticCode() {
  var eggList = Egg.getEggCarton();
  Map<Integer, ValidationFailure> badEggFailureBucketMap = new HashMap<>();
  var eggIndex = 0;
  for (var iterator = eggList.iterator(); iterator.hasNext(); eggIndex++) {
    var eggTobeValidated = iterator.next();
    if (!Operations.simpleOperation1(eggTobeValidated)) {
      iterator.remove(); // Mutation
      // How can you cleanly map validation-failure to which validation-method failed?
      badEggFailureBucketMap.put(eggIndex, VALIDATION_FAILURE_1);
      continue;
    }
    try {
      if (!Operations.throwableOperation2(eggTobeValidated)) {
        iterator.remove();
        badEggFailureBucketMap.put(eggIndex, VALIDATION_FAILURE_2);
      }
    } catch (Exception e) { // Repetition of same logic for exception handling
      iterator.remove();
      badEggFailureBucketMap.put(eggIndex, ValidationFailure.withErrorMessage(e.getMessage()));
      continue;
    }
    try { // Inter-dependent validations
      if (Operations.throwableOperation31(eggTobeValidated)) {
        var yellowTobeValidated = eggTobeValidated.getYolk();
        if (yellowTobeValidated != null) { // Nested-if for null checking nested objects
          try {
            if (!Operations.throwableAndNestedOperation32(yellowTobeValidated)) {
              iterator.remove();
              badEggFailureBucketMap.put(eggIndex, VALIDATION_FAILURE_32);
            }
          } catch (Exception e) {
            iterator.remove();
            badEggFailureBucketMap.put(eggIndex, ValidationFailure.withErrorMessage(e.getMessage()));
          }
        }
      } else {
        iterator.remove();
        badEggFailureBucketMap.put(eggIndex, VALIDATION_FAILURE_2);
      }
    } catch (Exception e) {
      iterator.remove();
      badEggFailureBucketMap.put(eggIndex, ValidationFailure.withErrorMessage(e.getMessage()));
    }
  }
  for (var entry : badEggFailureBucketMap.entrySet()) {
    System.out.println(entry);
  }
}
```

## Imperative vs Functional Chatter

- If a right Paradigm isn't chosen, you literally have to stab and cut-open the Open-Closed principle every time you get a new requirement.
- Every Software design problem can be seen like a block of objects doing functions or functions doing (I mean, processing) objects. There you go! I just metaphored OOPs vs FP.
- Eggs aren't doing anything here, they are being done. This clearly is a Functional programming problem. Eggs should NOT be juggled around validation functions, but validations should be _applied_ on eggs.
- In OOPs, we build classes with state and have functions exposed to operate on that state. But, how can you build a class which lets you provide functions dynamically at run time, to operate on its state. This is fundamental premises on which Functional style is built.
- Of-course, Functional thinking doesn't solve all the problems, neither is Object oriented thinking. However, in this problem FP is not fighting with OOPs, but with **Imperative Programming**.
- Our friend here is clearly suffering from trying to do too much of administration, dealing with the eggs.
- Like any other problem, this too has multiple sub-problems.

## Problem`.split()`

- One master function which loops and calls all validation functions and passes around the results to other functions. That's like doing all the **Administrative-Orchestration-Imperatively** (That's how you use 3 adjectives 😎). Such functions are so difficult to Unit test, which indicates, they are difficult to reason-out as well.
- Validations should be **Streamlined**, in a way that they can be plugged in and out of anywhere in between (like the bars in Jenga).
- The Streamline should let different types of data (The Good, the Bad and the Ugly), to co-exist as they flow. One bucket per type won't scale, need an alternative to hold **Heterogeneous-Data**.
- It's 2k18, please don't use **`if` to null check while Streaming**. Especially when you have nested objects, you end-up in an if-else hell. The code-flow should not be like a Trigonometric curve, but should be like a Linear equation.
- Mutation is sin, especially when you are mutating a global state. **Immutability** should be enforced, while the data is streamed across multiple functions, or predicting who-changed-what can kill a lot of your time while debugging.
- **Exceptions are Evil**, they are camouflaged gotos. Never throw them with your own hands and interrupt your stream and code flow.
- The `ValidationFailure` and validation method are loosely coupled, this makes it way harder to reason-out.
- It is so difficult to unit-test a function like this.
- Finally, we need to find a way to compose our algorithm without worrying about the parameter type, basically abstract away the parameter type on which this algo is being run.

> But rather than solving them one-by-one, it's important to find a paradigm, which can solve these problems as a group.

## Octopus Functions

- It's been told since my Grandfather, that functions need to be small and do only one thing and do it well, nothing new. We don't achieve much by splitting the above alien plan into separate functions.
- Coz, there should be an **Octopus function** administrating all these function calls, which in itself is a monster.
- State being pin-balled among imperative control statements, function calls and try-catches, is a horror show, when trying to reason-out the code flow or debug it. ![octopus](media/octopus.gif)
- In our problem, it is even trying to handle the coupling between Validation method and Validation failure, through a `badEggFailureBucketMap`. That surely is not its responsibility. The Validation method should be responsible to communicate its corresponding validation failure to the orchestrator.

## Imperative Responsibility

- Let's take a break from our Monster-Validation-Octopus and look at this simple function, which is just trying to append all last-names from a List of Names with `&`, with a lot of do-this-do-that imperative administration. It might be clear to the computer, but not very intuitive to another developer (or the same dev after sometime).

```java{3,4,5,6,7,10,11}:title=imperativelastname.java
public static String concatLastNames(List<String> team) {
  var output = new StringBuilder();
  var isFirst = true;
  for (var teamMemberName : team) { // Concern-1: Looping through the list
    if (teamMemberName != null) { // Catch-1: Deal with nulls
      teamMemberName = teamMemberName.trim(); // Catch-2: Deal with only white space names
      if (!teamMemberName.isEmpty()) { // Catch-3: Deal with empty names
        if (!isFirst) { // Catch-4: Should not prepend delimiter for first entry.
          output.append(DELIMITER);
        }
        var lastName = extractLastName(teamMemberName); // Concern-2: Extracting last name
        output.append(lastName); // Concern-3: Aggregating the results with the delimiter.
        isFirst = false;
      }
    }
  }
  return output.toString();
}

private static String extractLastName(String fullName) {
  return fullName.substring(fullName.lastIndexOf(" ") + 1);
}
```

- Imagine how complicated it becomes, if we require more conditions and exception handling.
- In the age of Java 8, I can say this developer is trying too hard, using low-level stuff like dry if-else and for-each.
- He is taking too much of control over iterating and filtering stuff, and as Uncle Ben says, **With great Power comes great Responsibility**. ![uncle-ben](media/uncle-ben.gif)
- You sure don't have to take this responsibility. Pass that to the Collections library itself, they know how to iterate and filter and much more. Just pass them the **Criteria**.
- If you get too serious into functional programming, you shall think twice every-time before writing any for-loop or if-else condition. (But don't take it too serious 😉, for-loops are good for small iterations).

## Behead the Octopus, Lego the Focussed Functions

- State should always march **Unidirectional**, like an unstoppable army of zombies. ![zombies](media/zombies.gif)
- I ain't copying this from the [Flux](https://facebook.github.io/flux/) guys at Facebook. This is seen ever since there are pipes in Unix, since 1978.
- Simply, make the shit of a function be the food for another.
- To do that, above Imperative Program can be transformed into **Declarative Style** like this:

```java{6,7,8}:title=functionallastname.java
private static final UnaryOperator<String> GET_LAST_NAME =
  fullName -> fullName.substring(fullName.lastIndexOf(" ") + 1);

void lastNameCollectorWithStream() {
  final var expected = TEAM.stream()
    .filter(Objects::nonNull) // Catch-11: Deal with nulls.
    .map(String::trim) // Catch-12: Deal with only white space strings.
    .filter(not(String::isEmpty)) // Catch-13: Deal with empty strings.
    .map(GET_LAST_NAME)
    .collect(Collectors.joining(DELIMITER));
}
```

- This might not be familiar to many Java devs, but sure is more readable, even for someone unfamiliar with code, if feels like reading an English sentence. **Familiarity is different from Readability**.
- **Separation of Concerns** made it clear and concise, like an SQL Query.
- This way functions can be fitted into each other to create a smooth pipeline, aiding unidirectional flow of data.
- This is flexible to restructure, and it's easy to hire and fire these criterion functions, without thinking too much. ![lego](media/lego.gif)

## Flow Heterogeneous data Fluently

- Now that we saw Functional Lego, can we do the same with our validations functions? Can we nicely pipe them and flow our eggs stream through it and expect to see both good eggs and bad eggs at the end of our pipeline?
- Streamlining of functions is easier said than done when dealing with Heterogeneous data.
- Unidirectional flow demands uniform data structure for the entire stream-per-step. A pipeline can have different types of streams, but how can a stream/collection have different data types? ![color-eggs](media/color-eggs.gif)
- Flowing through a function, Data inside a stream/collection of one type can metamorphose into various life forms of all shapes and sizes as it comes out, may be due to invalidations or exceptions or some eggs hatch into chickens or dinosaurs or your database just gets struck by a lightning.
- The dichotomy of Data metamorphism with Stream Uniformity can be seen in our current problem.
- We have two categories of data, Good eggs and Bad eggs. But who needs bad eggs, what you really interested are, the Validation failures for bad eggs.
- So two categories here, demand two totally disparate data types (Good-eggs), (Validation-failures due to ( invalidations) and (exceptions)) to co-exist, inside a stream, as they flow through the pipeline. Check-out these cases in this pseudo code:

```java{11,14,17,20}:title=pseudovalidator.java
Stream<Egg> validatedEggStream = eggs.stream().map(egg -> validate(egg));

private <what-should-I-return?> validate(Egg egg) {
  boolean isValid = false;
  if (!egg.isRotten()) {
    if (egg.getYellow() != null) {
      try {
        makeHalfBoiledOmelette(egg); // My Fav Omlet
        isValid = true;
      } catch (EggException e) {
        return <How-to-return-exception?>; // case 1 exception
      }
    } else if (egg.getEggWhite() != null) {
      eggWhiteDefect = examineEggWhite(egg); // case 2 inter-dependent validation fails
      isValid = (eggWhiteDefect == null);
    } else {
      return <not-an-egg>; // case 3
    }
  }
  return isValid ? egg : <How-to-return-defect?>; //case 4
}
```

- This poor function is not sure how to communicate back to its caller with multiple possibilities. Unfortunately, Strongly-typed languages are strict about return type.
- Had it been a Dynamically-typed-language like Javascript, this is not a problem at all. This is one of the reasons why Dynamically typed languages got popular for. Of-course, that makes them very difficult to debug. It's difficult to build even a proper IDE around them.
- A dirty solution in a Strongly-typed-language like Java can be, have some Enum `ValidationFailureType` as the return type which has all failure types listed, and in all these cases just return that specific failure accordingly.
- In valid case, you need to return something like `ValidationFailureType.NONE`. But, that means you can't pipe this function, with other validation functions (without the octopus orchestrator), as the valid egg is now lost in the oblivion of if-else labyrinth.
- If you return a `null` in valid case, you know what happens if caller doesn't know about that. A blast of NPE!
- **Data Containerization** solves this.
- Ship your heterogeneous data inside these containers. Not those plain-old-java-wrappers, but **Containers**.

Let's take a fork here and visit the Monad-Land to understand Containerization.

### Functors

- Ya, data container is too simple to be intimidating, and so they named them **Functors**.
- They are just simple objects that implement `map`.
- Functor contains a value `x` of some type, and let you operate on that value by passing a first-class function `f` through `map`, that returns you a new functor containing result value `f(x)`. (This is Functional English 😋).
- If that's not clear, this code snippet should clarify it:

```java{7}:title=functor.java
public class Functor<T> {
  private final T value;
  public Functor(T value) {
    this.value = value;
  }
  public <U> Functor<U> map(Function<T, U> mapperFunction) {
    return new Functor<>(mapperFunction.apply(value)); // Functor wrapping f(x)
  }
}
```

## The Siblings - `map()`, `flatMap()`

![minions](media/minions.gif)

- Both `map()` and `flatMap()` are Higher-Order functions, which take first-class functions as parameters.
- `map` applies the mapper-function on wrapped value and returns a new Functor instance, wrapping the result value. Say, if the return value of the mapper-function is a `Functor<T>`, then the return value of `map` ends up being `Functor<Functor<T>>`
- `flatMap` applies the mapper-function and simply returns its result without wrapping in another Functor.
- So, the difference is, the return value of the mapper-function should be a `Functor<T>` and `flatMap` returns it as is.
- But why am I speaking about `flatMap()` ?

### The Dawn of the Monad

- Finally! the Dawn of Monad (Introducing the title lead with a BGM) ![dawn-of-justice](media/dawn-of-justice.gif)

> The curse of the monad is that once you get the epiphany, once you understand - "oh that's what it is" - you lose the ability to explain it to anybody. - Douglas Crockford

- Douglas is right in a way, but here is what my understanding (although not an epiphany), in its most simplistic form:

> Monads are Functors, which also implement `flatmap` and abide by some Monad laws.

- Monad laws are simple math-rules, like the associativity, Left identity and Right identity. More on these later.
- Of-course, there is no such constraint that Monads should ONLY implement `flatMap`.
- This is how the simplest Monad looks. (Observe the difference in mapper functions passed to `map` and `flatMap`)

```java{9,10,11}:title=monad.java
public class Monad<T> {
  private final T value;
  public Monad(T value) {
    this.value = value;
  }
  public <U> Monad<U> map(Function<T, U> mapperFunction) {
    return new Monad<>(mapping.apply(value));
  }
  public <U> Monad<U> flatMap(Function<T, Monad<U>> mapperFunction) {
    return mapperFunction.apply(value);
  }
}
```

- Monad's anatomy needs 3 basic organs:

  - A Parameterized type: `Monad<T>`
  - A Unit function: `new Monad()`
  - A Bind function: `flatMap()`

Enough of Theory! how can this help the problem at hand?

## Problems`.split().stream()`<br>
`.map(this::solve)`

- You would have got a hint by now. Monads are the data containers you need. The problem is solved by one container-type (which can be the unit for uniformity through-out the pipeline) and a variable-value-type contained inside (which can be morphed from type to type).
- Now every function can speak the same language, by passing around these Monad boxes and operate on them with functions, without worrying much about what it contains. Uniform boxes with Heterogenous data.
- Like, validation functions can ship either a goodEgg or a validation failure to the orchestration function by wrapping them in a Monad box, and it doesn't even care what's in the box.
- Now, Orchestrator only has one job to do, just pump the data inside the pipeline ahead to the next validation function. ![wow](media/wow.gif)
- Now, both the Parameter type and Algorithm are cleanly separate, and algo can be reused on multiple parameter types, which solves our last problem.

## Post credits scene: Making of a Monad

Now you see it? Now you don't? ![now-you-see-me](media/now-you-see-me.gif)

- This blog post is already too long and so I left the part on how these problems are solved with Monads for the sequel.
- Chances are you already worked with lot of Monads, if you started adapting Java 8 or above.
- Java guys took 3 years between Java 7 and 8 and packed Java 8 with bunch of functional toys, and alongside came some Monads like Optional, Stream etc.,.

Wanna see how the entire pipeline works seamlessly with the Monad, even with some exceptional eggs blown in-between? The sequel brings-in some new names like Immutability, Parallelism, Memoization and X-Men evolution (Just kidding!)

Let's cook a Monad.

Well, I couldn't find time to prepare a pint-2, but this talk I gave covers everything about what is discussed till now and further:

`youtube: https://www.youtube.com/embed/l9jJ7m7_VpM`
