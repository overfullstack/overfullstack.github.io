---
title: Template-Oriented-Programming (TOP) to Ship Faster
date: "2020-03-06T00:00:00.000Z"
layout: post
draft: false
path: "/posts/top-with-ad-hoc-polymorphism/"
cover: "./cover.jpeg"
category: "Design"
tags:
  - "Kotlin"
  - "Arrow"
description: "Top-up with Ad-hoc Polymorphism"
---

## Abstract

This paper is for Agile **B2C product development** teams, both in enterprises and startups, looking for ways to accelerate their feature development cycle.

The trend in B2C world is to chop the use-cases with varied traffic-needs into **Microservices** managed by independent Scrum teams. These teams develop using Heterogeneous frameworks and tech-stacks, suitable for the traffic needs of their services. E.g., from Payments Domain - Purchases (high traffic Reactive service) and Refunds (low traffic blocking service) [1].

Despite being heterogenous, these services have many commonalities in their Domain logic - such as Authentication, Request-Validation, Idempotency, external integrations, logging. But the code for common logic, cannot be reused due to the _heterogeneity_. This leads to scrum teams duplicating the same logic in all the services, or a service needs to be rewritten entirely, when migrated to a different paradigm.

I shall demonstrate (with a working POC) how to make such common logic **reusable**, turning the `Monomorphic` code to `Polymorphic` reusable templates.

## Things to know before reading

Technical Level: Interesting to all, approachable for basic and up. Any Functional Programming enthusiast will love it.

This talk targets basic to intermediate senior developers with a good understanding of `generics` and some exposure/interest towards blocking and non-blocking/reactive paradigms. This talk is language-agnostic, but I use **Kotlin** (a modern JVM language) in combination with **[Arrow](http://arrow-kt.io/)** (A unique open-source library for Kotlin). Kotlin's syntax is very close Java, and all software design patterns discussed in this talk can be implemented in almost any language. Thanks to the concise syntax of Kotlin [10] and powerful tool-set provided by Arrow, implementing `Ad-hoc Polymorphism` turns more ergonomic. I have used `Spring-MVC`[7] and `Spring-WebFlux`[8] (popular backend frameworks) for demonstration of the POC, but no prior knowledge is required about these frameworks.

The readers learn about an innovative design technique to create reusable templates called **Ad-hoc Polymorphism**, and how is it profitable and reduces the maintenance overhead of rewriting the same business logic across heterogeneous services and service migrations.

## Introduction

### The Case for Heterogeneous services

Taking the example from the Payments domain, Purchases tend to have high traffic (especially during Black Fridays, Flash sales, etc.), and it's common to model them with an Asynchronous non-blocking paradigm like a Reactive Stack [2]. Whereas Refunds tend to have relatively low traffic, and a simple blocking stack can easily cater its scaling needs. Such use-cases can be found in many B2C products e.g., Reservations vs. Cancellations.

### The problem of Reusability among Heterogeneous services

In the case of homogeneous services, the common code can be placed in a shared module and be added as a dependency in all services. But in heterogeneous case, blocking code can't be reused for non-blocking service or vice-versa, because:

- It's extremely dangerous to mix both paradigms, as it can lead to untraceable performance issues.
- Their styles of programming are different (Functional in non-blocking vs. Imperative in blocking).
- Non-Blocking code is filled with callbacks while the blocking code is sequential.
- The DB APIs are different, as non-blocking services use non-blocking DBs.
- Each paradigm has specific `Effect` it operates on, e.g., Non-blocking paradigms operate on reactive containers like `Mono<A>/Flux<A> or Observable<A>`, contrary to blocking paradigms which may (or need not) use simple Effect types like `Option/Either`.

## Monomorphic to Polymorphic

If the Effect is abstracted out as a _Generic_, the domain logic turns reusable for service of any type, and it can be called **Polymorphic**. But to achieve that, we need to understand the concepts - **Higher-Kinds** and **Typeclasses**.

### Need for Higher-Kinded Types [6]

Effects are of the form `F<A>` (e.g. `Mono<A>`), where `F` is the _Effect_ type and `A` is the value type. The problem is, most JVM languages only support parametricity on the value type `A` but not on the Container type `F`. So, we need **Higher-Kinded Types**, to represent `F<A>` as `Kind<F, A>`.

### Need for Typeclasses [12]

It's a generic interface that is parametric on a Type `T`. E.g., `Comparator<T>` in JDK is a simple typeclass. `Comparator<T>` has one operation `fun compare(a: T?, b: T?): Int`. Now for a type `String` to be a member of this typeclass, prepare a concrete `Comparator<String>` implementing its `fun compare(a: String?, b: String?): Int`. That's it! Now the `Collections.sort()` can make use of this concrete implementation to compare Strings.

To put our above example into a formal definition - A type class defines some behavior in the form of operations that must be supported by a type. A type can be a member of a type class simply by providing implementations of the operations the type must support.

This principle can be used to define abstract interfaces like `Comparator<T>` and reusable templates like `Collections.sort()`, whose behavior is polymorphic to the type `T` being sorted. This is **Ad-hoc Polymorphism**.

The term **Ad-hoc polymorphism** refers to polymorphic functions that can be applied to arguments of different types, but that behave differently depending on the type of the argument to which they are applied.

The code that relies on type classes is open for extension. Just like how `Comparator<T>` can be extended to compare any type.

## Template-Oriented-Programming with a POC

Now that we have both the tools (Higher-Kinded Types and Typeclasses), let’s make a polymorphic template for our reusable domain logic. The samples used in the rest of this paper can be seen in action in a fully working POC - [GitHub](https://github.com/overfullstack/ad-hoc-poly). It has 3 modules:

- `kofu-mvc-validation` - Blocking Service built with `Spring-WebMVC` [7]
- `kofu-reactive-validation` - Reactive Service built with `Spring-WebFlux` [8]
- `validation-templates` - Shared module for both the services, holding templates.
  We shall take-up the **_user validate-and-upsert_** as our example use-case, where a request to upsert a user is **_validated_**, followed by **_insert or update_** based on the user's existence in the DB.

`Spring-WebFlux` works with `Mono<A>/Flux<A>` while `Spring-WebMVC` doesn't. As a proof for reusability problem discussed above, refer the `upsert` function in both the services - [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/b59bd89a7302035e3d72dfb75071a2d05c055443/kofu-mvc-validation/src/main/kotlin/com/sample/Handlers.kt#L24-L43) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/b59bd89a7302035e3d72dfb75071a2d05c055443/kofu-reactive-validation/src/main/kotlin/com/sample/Handlers.kt#L26-L52).

The goal is to abstract this use-case domain logic into a generic reusable template. We shall achieve it by creating some typeclasses and making use of some typeclasses from the Arrow library. These heterogeneous services can inflate these templates by supplying concrete instances of those typeclass interfaces. Let's get started!

### The `Repo<F>` typeclass

Let's abstract the DB behavior in both these stacks to a generic typeclass interface, `Repo<F>`, where `F` represents the Effect-type on which the DB works in their respective stacks.

```kotlin:title=Repo.kt
interface Repo<F> : Async<F> {
    fun User.update(): Kind<F, Unit>
    fun User.insert(): Kind<F, Unit>
    fun User.doesUserLoginExist(): Kind<F, Boolean>
    fun User.isUserCityValid(): Kind<F, Boolean>
}
```

- These operations have a return type of the form `Kind<F, A>`(=`F<A>`), which is generic and agnostic of `Effect`.
- Our services implement this typeclass with their respective effect types. The service repository functions are mapped to `Repo` operations, using `IO` and `MonoK` from Arrow Library - [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/e1a7586ed82765830cef03f3c797095ccb0a716e/kofu-mvc-validation/src/main/kotlin/com/sample/Configurations.kt#L38-L41) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/e1a7586ed82765830cef03f3c797095ccb0a716e/kofu-reactive-validation/src/main/kotlin/com/sample/Configurations.kt#L29-L32).

### Templates using Typeclasses

- Now we can weave our business-logic into generic templates depending on the generic operations of the typeclass `Repo<F>`.
- Templates are generic functions and they depend on Typeclasses. This dependency can be achieved by passing typeclass as a function argument or declaring the template functions as extensions [11] to a typeclass. I used the latter in my POC - [Ref](https://github.com/overfullstack/ad-hoc-poly/blob/e1a7586ed82765830cef03f3c797095ccb0a716e/validation-fx/src/main/kotlin/com/validation/rules/UserRules.kt)
- Typeclass is the bridge between services and templates. Services supply a concrete implementation of the typeclass, essentially filling in the blanks for the templates - [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/b59bd89a7302035e3d72dfb75071a2d05c055443/kofu-mvc-validation/src/main/kotlin/com/sample/Configurations.kt#L36-L43) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/b59bd89a7302035e3d72dfb75071a2d05c055443/kofu-reactive-validation/src/main/kotlin/com/sample/Configurations.kt#L27-L34).
- Then the services can use those concrete instances to consume all the templates for free! - [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/b59bd89a7302035e3d72dfb75071a2d05c055443/kofu-mvc-validation/src/main/kotlin/com/sample/HandlersX.kt#L22-L30) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/b59bd89a7302035e3d72dfb75071a2d05c055443/kofu-reactive-validation/src/main/kotlin/com/sample/HandlersX.kt#L20-L27).
- Moreover, the typeclass is entirely extensible to support more operations, in turn, to extend our template base.

## Outcomes and Conclusions

We achieved reusable domain logic using Ad-hoc Polymorphism, abstracting out the Effect using typeclasses and Higher-Kinded Types, migrating our Monomorphic code to Polymorphic. This is very powerful to model and migrate B2C-services. This **zeros-down the cost and effort** to rewrite and maintain common business logic across all services and future service migrations. This can save a release cycle amount of work, bringing in real agility among scrum teams and startups to ship things faster.

## References

1. <https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/>
2. <https://www.reactivemanifesto.org/>
3. <https://en.wikipedia.org/wiki/Subtyping>
4. <https://en.wikipedia.org/wiki/Parametric_polymorphism>
5. <https://en.wikipedia.org/wiki/Ad_hoc_polymorphism>
6. <https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf>
7. <https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#spring-web>
8. <https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html>
9. <https://danielwestheide.com/blog/the-neophytes-guide-to-scala-part-12-type-classes/>
10. <https://www.intuit.com/blog/uncategorized/kotlin-development-plan/>
11. <https://kotlinlang.org/docs/reference/extensions.html>
12. <https://arrow-kt.io/docs/patterns/glossary/#typeclasses>
