---
title: Template-Oriented-Programming (TOP) with Ad-Hoc Polymorphism
date: "2020-03-06T00:00:00.000Z"
layout: post
draft: false
path: "/posts/top-with-ad-hoc-polymorphism/"
cover: "./cover.jpeg"
category: "Design"
tags:
  - "Kotlin"
  - "Arrow"
description: "Top-up the Polymorphism"
---

## Abstract

With the advent of **B2C products**, the same product can have use-cases (or Services) with varied traffic and scaling needs. The trend is to split them into Microservices built on different paradigms/tech-stacks (blocking or non-blocking [1]). In domains like Payments, many such heterogeneous services are parallel as well (having most of the domain business logic in common, e.g., Purchases and Refunds). Although the business logic is common, it cannot be reused among these parallel services, as the code is written specifically to that paradigm.

This paper attempts to overcome this challenge and make such common logic **reusable**, turning the `Monomorphic` code to `Polymorphic` reusable templates, using an innovative design technique called `Ad-hoc Polymorphism`.

## Things to know before reading

A good understanding of generics and exposure to blocking/non-blocking paradigms. This talk is language-agnostic, but I use **Kotlin** (a modern JVM language) for demonstration along with **[Arrow](http://arrow-kt.io/)** (An upcoming Functional Programming library for Kotlin). The readers learn how to convert shared code into reusable templates, to be consumed by services of different paradigms or services that eventually migrate to a different paradigm, and how this reduces the maintenance overhead of rewriting the same business logic.

## The Case for Heterogeneous services

Taking the example from the Payments domain, Purchases tend to have high traffic (especially during Black Fridays, Flash sales, etc.), and it's common to model them with an Asynchronous non-blocking paradigm like Reactive Stack [2]. Whereas Refunds tend to have relatively low traffic, and a simple blocking stack can easily cater its scaling needs.

## The problem of Reusability among Heterogeneous services

Despite being heterogenous, these services have many commonalities in their Domain logic - such as Authentication, Request-Validation, Idempotency, external integrations (like gateway interaction), logging. In the case of homogeneous services, this reusable code can be placed in a shared module and be added as a dependency in all services. But in heterogeneous case, blocking code can't be reused for non-blocking service or vice-versa, because:

- Their styles of programming are different (Functional in non-blocking vs. Imperative in blocking).
- Non-Blocking code is filled with callbacks while the blocking code is sequential.
- The DB APIs are different, as non-blocking services use non-blocking DBs.
- Each paradigm has specific `Effect (or Container)` it operates on, e.g., Non-blocking paradigms operate on reactive containers like `Mono<A>/Flux<A> or Observable<A>`, contrary to blocking paradigms which may (or need not) use simple containers like `Option/Either`.

Due to this problem, the code is rewritten or duplicated for common use-cases, which eventually leads to maintenance overhead. This problem also applies to services that have plans to migrate to async non-blocking as their business increases, in which case, the entire service is rewritten, although the domain business logic remains the same.

## Monomorphic to Polymorphic

Monomorphic code is written explicitly to the `Effect (or Container)`. If the Effect is abstracted out as a _Generic_, the domain logic turns reusable for service of any type, and it can be called **Polymorphic**. But to achieve that, we need to understand concepts like **Typeclasses** and **Higher-Kinds**.

But let's briefly touch upon types of Polymorphism:

### Subtype Polymorphism (Inheritance) [3]

This type is the most common OOP pattern, where we achieve polymorphism through inheritance. An interface is implemented by multiple classes (called subtypes).

### Parametric Polymorphism (Generics) [4]

This type uses generics (like `<T>`), to generate templates of reusable code. This works when the logic doesn't depend on any type-specific behavior. e.g., `Array<T>`.

### Ad-hoc Polymorphism (Type Classes) [5]

The term **Ad-hoc polymorphism** refers to polymorphic functions that can be applied to arguments of different types, but that behave differently depending on the type of the argument to which they are applied. To achieve this, we use **Typeclasses**. `Comparator<T>` in JDK is a simple typeclass. Typeclasses are just generic interfaces that are parametric on a Type `T`.

## Typeclass

It's a generic interface that is parametric on a Type `T`. `Comparator<T>` in JDK is a simple typeclass. `Comparator<T>` has one operation `fun compare(a: T?, b: T?): Int`. Now for a type `Apple` to be a member of this typeclass, prepare a concrete `Comparator<Apple>` implementing its `fun compare(a: Apple?, b: Apple?): Int`. That's it! Now the JDK's `Collections.sort()` can make use of this concrete implementation to compare apples.

A type class `C` defines some behavior in the form of operations that must be supported by a type `T` for it to be a member of type class `C`. A type can be a member of a type class simply by providing implementations of the operations the type must support. Once `T` is made a member of the type class `C`, functions that have constrained one or more of their parameters to be members of `C` can be called with arguments of type `T`.
The code that relies on type classes is open for extension. Just like how `Comparator<T>` can be extended to compare any type.

### Need for Higher-Kinded Types [6]

Effects are of the form `F<A>` (e.g. `Mono<A>`), where `F` is the _Effect (or Container)_ type and `A` is the value type. The problem is, most JVM languages only support parametricity on the value type `A` but not on the Container type `F`. So, we need **Higher-Kinded Types**, to represent `F<A>` as `Kind<F, A>`.

## Ad-hoc Polymorphism by example

Now that we have both the tools (typeclasses and Higher-Kinded Types), let’s make a polymorphic template for our reusable domain logic. The samples used in the rest of this post can be seen in action in a fully working POC - [GitHub](https://github.com/overfullstack/ad-hoc-poly). This has 3 modules:

- `kofu-mvc-validation` - Blocking Service built with `Spring-WebMVC` [8]
- `kofu-reactive-validation` - Reactive Service built with `Spring-WebFlux` [7]
- `validation-templates` - Common module for both the services, holding templates.
  We shall take-up the **_user validate-and-upsert_** as our example use-case, where a request to upsert a user is **_validated_**, followed by **_insert or update_** based on the user's existence in the DB.

`Spring-WebFlux` works with `Mono<A>/Flux<A>` while `Spring-WebMVC` doesn't. As discussed before, the difference in paradigms prevents the reusability of common code. Observe, the differences in `upsert` functions in both the services - [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/6b151be233e45e45632fd38518f9133a267e843d/kofu-mvc-validation/src/main/kotlin/com/sample/Handlers.kt#L24-L43) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/6b151be233e45e45632fd38518f9133a267e843d/kofu-reactive-validation/src/main/kotlin/com/sample/Handlers.kt#L26-L52).

The goal is to abstract this use-case domain logic into a generic reusable template. We shall achieve it by creating some typeclasses and making use of some typeclasses from the Arrow library. These heterogeneous services can inflate these templates by supplying concrete instances of those typeclasses. Let's get started!

### The Repo typeclass

Let's abstract the DB behavior in both these stacks to a generic typeclass interface, `Repo<F>`, where `F` represents the Effect-type on which the DB works in their respective stacks.

```kotlin:title=Repo.kt
interface Repo<F> : Async<F> {
    fun User.update(): Kind<F, Unit>
    fun User.insert(): Kind<F, Unit>
    fun User.doesUserLoginExist(): Kind<F, Boolean>
    fun User.isUserCityValid(): Kind<F, Boolean>
}
```

- These operations has return type of `Kind<F, A>`(=`F<Boolean>`), which is generic and agnostic of `Effect`.
- Our services implement this typeclass with their respective effect types. The service repository functions are mapped to `Repo` operations, using `IO` and `MonoK` from Arrow Library - [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/e1a7586ed82765830cef03f3c797095ccb0a716e/kofu-mvc-validation/src/main/kotlin/com/sample/Configurations.kt#L38-L41) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/e1a7586ed82765830cef03f3c797095ccb0a716e/kofu-reactive-validation/src/main/kotlin/com/sample/Configurations.kt#L29-L32).

## Templates using Typeclasses

- Now we can weave our business-logic into generic templates depending on the generic operations of the typeclass `Repo<F>`.
- Templates are generic functions and they depend on Typeclasses. This dependency can be achieved by passing typeclass as a function parameter or declaring the template functions as extensions to a typeclass. I used the latter in my POC - [Ref](https://github.com/overfullstack/ad-hoc-poly/blob/e1a7586ed82765830cef03f3c797095ccb0a716e/validation-fx/src/main/kotlin/com/validation/rules/UserRules.kt)
- Typeclass is the bridge between services and templates. Services supply a concrete implementation of the typeclass, and using those concrete instances, and they can consume all the templates for free! [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/6b151be233e45e45632fd38518f9133a267e843d/kofu-mvc-validation/src/main/kotlin/com/sample/HandlersX.kt#L22-L30) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/6b151be233e45e45632fd38518f9133a267e843d/kofu-reactive-validation/src/main/kotlin/com/sample/HandlersX.kt#L20-L27)
- Moreover, the typeclass is entirely extensible to support more operations, in turn, to extend our template base.

## Outcomes and Conclusions

We achieved reusable domain logic using Ad-hoc Polymorphism, abstracting out the effect using typeclasses and Higher-Kinded Types, migrating our Monomorphic code to Polymorphic. This is very powerful to model B2C-services and to-be-scalable services. This **zeros-down the cost and effort** to rewrite and maintain common business logic across all parallel services and future service migrations, speeding-up the feature development.

## References

1. <https://community.oracle.com/docs/DOC-918126>
2. <https://www.reactivemanifesto.org/>
3. <https://en.wikipedia.org/wiki/Subtyping>
4. <https://en.wikipedia.org/wiki/Parametric_polymorphism>
5. <https://en.wikipedia.org/wiki/Ad_hoc_polymorphism>
6. <https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf>
7. <https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html>
8. <https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#spring-web>
9. <https://danielwestheide.com/blog/the-neophytes-guide-to-scala-part-12-type-classes/>
