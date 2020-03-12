---
title: Template-Oriented-Programming (TOP) with Ad-Hoc Polymorphism
date: "2020-03-06T00:00:00.000Z"
layout: post
draft: false
path: "/posts/top-with-ad-hoc-polymorphism/"
image: "https://i.imgur.com/ff0QYbi.jpg"
cover: "./cover.jpeg"
category: "Design"
tags: 
    - "Kotlin"
    - "Arrow"
description: "Top-up the Polymorphism"
---
## Abstract

With the advent of B2C products, the same product can have use-cases (or Services) with varied traffic and scaling needs. The trend is to split them into Microservices built on different paradigms/tech-stacks (blocking or non-blocking [1]). In domains like Payments, many such heterogeneous services are parallel as well (having most of the domain business logic in common e.g., Purchases and Refunds). Although the business logic is common, it cannot be reused among these parallel services, as the code is written specifically to that paradigm.

This article attempts to overcome this challenge and make such common logic **reusable**, turning the `Monomorphic` common code to `Polymorphic` templates, using an innovative design technique called `Ad-hoc Polymorphism`.

## Things to know before reading

A good understanding of generics and exposure to blocking/non-blocking paradigms. This is language-agnostic, but then I will use **Kotlin** (a modern JVM language) for demonstration along with **Arrow** (An upcoming Functional Programming library for Kotlin).

## The Case for Heterogeneous services

Taking the example from Payments domain, **Purchases** tend to have high traffic (especially during Black Fridays, Flash sales, etc), and it's common to model them with an Asynchronous non-blocking paradigm like **Reactive Stack** [2]. Whereas, **Refunds** tend to have relatively low traffic and its scaling needs can easily be catered with a simple blocking stack.

## Problem of Re-usability among Heterogeneous services

Despite being heterogeneous, these services have a lot of commonality in their Domain logic - like Authentication, Request-Validation, Idempotency, external integrations (like gateway interaction), logging, etc. In the case of homogeneous services, this reusable code can be placed in a different module and be added as a dependency in all services. But in heterogeneous case, blocking code can't be reused for non-blocking service or vice-versa, because:

- Their styles of programming are different (Functional in non-blocking vs Imperative in blocking).
- Non-Blocking code is filled with callbacks while the blocking code is sequential.
- The DB APIs are different, as non-blocking services use non-blocking DBs.
- Each paradigm has specific `Effect (or Container)` it operates on, e.g - Non-blocking paradigms operate on reactive containers like `Mono<A>/Flux<A> or Observable<A>`, contrary to blocking paradigms which may (or need not) use simple containers like `Option/Either`.

Due to this problem, the code is rewritten or duplicated for common use-cases, which eventually leads to maintenance overhead. This also applies to services that have future plans to migrate to async non-blocking as their business increases, in which case, the entire service needs to be rewritten although the domain business logic remains the same.

## Monomorphic to Polymorphic

Monomorphic code is written specifically to the `Effect (or Container)`. If the Effect is abstracted out as a *Generic*, the domain logic turns reusable for any type of service, and it can be called **Polymorphic**. But to achieve that, we need to understand concepts like **TypeClasses** and **Higher-Kinds**.

But let's briefly touch upon types of Polymorphism:

### Subtype Polymorphism (Inheritance) [3]

This is the most common OOP pattern, where we achieve polymorphism through inheritance. An interface is implemented by multiple classes (called subtypes).

### Parametric Polymorphism (Generics) [4]

Simply put, this style uses generics (like `<T>`), to generate templates of reusable code. This works when the logic doesn't depend on any type-specific behavior. e.g., `Array<T>`.

### Ad-hoc Polymorphism (Type Classes) [5]

The term **Ad-hoc polymorphism** refers to polymorphic functions that can be applied to arguments of different types, but that behave differently depending on the type of the argument to which they are applied. To achieve this, we use **TypeClasses**. `Comparator<T>` in JDK is a simple typeClass. TypeClasses are just generic interfaces that are parametric on a Type `T`. 

## TypeClass

A type class `C` defines some behavior in the form of operations that must be supported by a type `T` for it to be a member of type class `C`. A type can be a member of a type class simply by providing implementations of the operations the type must support. Once `T` is made a member of the type class `C`, functions that have constrained one or more of their parameters to be members of `C` can be called with arguments of type `T`.
`Comparator<T>` has one operation `fun compare(a: T?, b: T?): Int`. Now for a type `Apple` to be a member of this TypeClass, prepare a concrete `Comparator<Apple>` implementing its `fun compare(a: Apple?, b: Apple?): Int`. That's it! Now the JDK's `Collections.sort()` can make use of this concrete implementation to compare apples.
The code that relies on type classes is open for extension. Just like how `Comparator<T>` can be extended to compare any type.

### Need for Higher-Kinded Types [6]

Effects are of the form `F<A>` (e.g. `Mono<A>`), where `F` is the container type and `A` is the value type. The problem is, most JVM languages only support parametricity on the value type `A` but not on the Container type `F`. So to represent it, we need **Higher-Kinded Types**, which are represented by `Kind<F, A>` which is synonymous to `F<A>`

## Ad-hoc Polymorphism by example

Now that we have both the tools (TypeClasses and Higher-Kinded Types), let’s make a polymorphic template for our reusable domain logic. A POC working sample can be found in this [GitHub repo](https://github.com/overfullstack/ad-hoc-poly). I shall be using references from this code to explain the subsequent examples, where we have two identical services, one built with `Spring-WebFlux` (non-blocking reactive stack) [7] and another built with `Spring-WebMVC` (blocking servlet stack) [8]. We shall take-up the *user validate-and-upsert* as our example use-case (where a request to upsert a user is validated and either inserted or updated based on the user's existence in the DB). We shall attempt to abstract this into a common module so that both the services can consume it.

- `Spring-WebFlux` works with `Mono<A>/Flux<A>` while `Spring-WebMVC` doesn't. Also, we shall see how the difference in paradigms prevents reusability.
- The first step, is to abstract the DB behavior in both these stacks to a generic TypeClass interface, `RepoTC<F>`, where `F` represents the Effect-type on which the DB works in their respective stacks. This is how the simplest version of it looks like:

```kotlin:title=RepoTC.kt
interface RepoTC<F> : Async<F> {
    fun User.get(): Kind<F, User?>
}
```

This code may look alien at first, but if we get into the details it all makes sense.

- The operation `get()` has a return type `Kind<F, User?>`, which is synonymous to `F<User?>`. This indicates our operations are agnostic of `Effect`.
- Our `RepoTC<F>` extends from `Async<F>` which is TypeClass from *Arrow* library.
- Our Services are supposed to supply concrete instances of this `RepoTC<F>` and provide implementation for its operation `get()`.
- We can help our services to map their *Effect-full* operations to generic operations, for which we can write two utility functions, which are extension functions on `Async<F>` as below:

```kotlin:title=RepoUtils
fun <R> forMono(thunk: () -> Mono<R>): Kind<F, R?> = effect { thunk().k().suspended() }
fun <R> forIO(thunk: () -> R): Kind<F, R> = effect { thunk() }
```

- The `Async<F>` typeClass has an important method called `effect{..}`, which wraps a function with an *Effect* return type (like `Mono<F>`) and returns a generic effect type `Kind<F, A>`.
- Utilizing these utilities, Just like `Comparator<T>` example we discussed, we can create two concrete instances of our `Repo<TC>` - `blockingRepo`, `nonBlockingReactiveRepo`.

```kotlin:title=ConcreteInstances
val blockingRepo = object : RepoTC<ForIO>, Async<ForIO> by IO.async() {
    override fun User.get(): Kind<ForIO, User?> = forIO { userRepo.findOne(loginId) }
}

val nonBlockingReactiveRepo = object : RepoTC<ForMonoK>, Async<ForMonoK> by MonoK.async() {
    override fun User.get(): Kind<ForMonoK, User?> = forMono { userReactiveRepo.findOne(loginId) }
}
```

- For blocking operations, `IO.async()` instance is supplied as implementation for `Async<F>` and for non-blocking operations, `MonoK.async()` is supplied. These concrete instances effect the `effect{..}` method's behavior and supplies it with superpowers to handle a specified effect (`Mono` or `IO`).
- The return types of `userRepo.findOne(loginId)` is `User?` and `userReactiveRepo.findOne(loginId)` is `Mono<User?>`, both these are mapped to generic function `User.get()` whose return type is a higher-kind `Kind<F, User?>` where `F` is represented by `ForMonK` and `ForIO` in their respective concrete entities.

## How the pieces fit'?'

- This typeClass `RepoTC<F>` is the bridge between the service and common module (In the GitHub repo, this common module is named as `validation-fx`).
- `RepoTC<F>` has all the common business logic template (refer `validateUserForUpsert` function [here](https://github.com/overfullstack/ad-hoc-poly/blob/master/validation-fx/src/main/kotlin/com/validation/RepoTC.kt#L32)). Arrow's `fx` blocks are used to write this code, which shall be briefly explained in the talk.
- These templates depend on the TypeClass's abstract functions (like `get()`) to weave their business logic. As shown in [this code](https://github.com/overfullstack/ad-hoc-poly/blob/master/validation-fx/src/main/kotlin/com/validation/RepoTC.kt#L13), the `RepoTC<F>` can be extended with more operations to be used inside our templates.
- On the service side, we supply concrete implementation of TypeClasses as a dependency (Refer [this](https://github.com/overfullstack/ad-hoc-poly/blob/master/kofu-mvc-validation/src/main/kotlin/com/sample/Configurations.kt#L29) and [this](https://github.com/overfullstack/ad-hoc-poly/blob/master/kofu-reactive-validation/src/main/kotlin/com/sample/Configurations.kt#L20)).
- Now both services can consume the common business logic through these concrete entities (Refer [this](https://github.com/overfullstack/ad-hoc-poly/blob/master/kofu-mvc-validation/src/main/kotlin/com/sample/Handlers.kt#L84) and [this](https://github.com/overfullstack/ad-hoc-poly/blob/master/kofu-reactive-validation/src/main/kotlin/com/sample/Handlers.kt#L97)).

## Outcomes and Conclusions

We achieved reusable domain logic using Ad-hoc Polymorphism, abstracting out the effect using TypeClasses and Higher-Kinded Types, migrating our Monomorphic code to Polymorphic. This is very powerful to model B2C-services and to-be-scalable services. This **zeros-down the cost and effort** to rewrite and maintain common business logic across all parallel services and future service migrations, speeding-up the feature development.

## References

1. [https://community.oracle.com/docs/DOC-918126](https://community.oracle.com/docs/DOC-918126)
2. [https://www.reactivemanifesto.org/](https://www.reactivemanifesto.org/)
3. [https://en.wikipedia.org/wiki/Subtyping](https://en.wikipedia.org/wiki/Subtyping)
4. [https://en.wikipedia.org/wiki/Parametric_polymorphism](https://en.wikipedia.org/wiki/Parametric_polymorphism)
5. [https://en.wikipedia.org/wiki/Ad_hoc_polymorphism](https://en.wikipedia.org/wiki/Ad_hoc_polymorphism)
6. [https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf](https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf)
7. [https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html)
8. [https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#spring-web](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#spring-web)
9. [https://danielwestheide.com/blog/the-neophytes-guide-to-scala-part-12-type-classes/](https://danielwestheide.com/blog/the-neophytes-guide-to-scala-part-12-type-classes/)
