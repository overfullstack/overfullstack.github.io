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
keyTakeAways:
  - Create magic by combining Spring Boot + Kotlin + Arrow library.
  - Convert common use-cases among heterogeneous services into reusable code templates using **Ad-hoc Polymorphism**.
  - Monomorphic vs. Polymorphic code.
  - Agile **B2C product development** teams, both in enterprises and startups, can accelerate their feature development cycle.
---

## Abstract

B2C microservices are built on heterogeneous tech-stacks (blocking/reactive) as per their traffic and can have common use-cases E.g. Validation, Idempotency. But code can't be shared/reused due to paradigm contrast. So it's rewritten everywhere. With a POC, we demo how to hasten feature development, by templatizing code for large common well-tested features for reuse across heterogeneous services.

## Audience

Technical Level: Interesting to all, approachable for intermediate and up. Any Functional Programming enthusiasts love it.

This talk targets intermediate to expert senior developers with a good understanding of `generics` and some exposure/interest towards blocking and non-blocking/reactive paradigms. This talk is language-agnostic, but I use **Kotlin** (a modern JVM language) in combination with **[Arrow](http://arrow-kt.io/)** (A unique open-source library for Kotlin).

Kotlin's syntax is very close to Java, and all software design patterns discussed in this talk can be implemented in almost any language. Thanks to the concise syntax of Kotlin[$_{[2]}$](https://www.intuit.com/blog/uncategorized/kotlin-development-plan/) and robust tool-set provided by Arrow, implementing `Ad-hoc Polymorphism` turns ergonomic.

I used `Spring-MVC`[$_{[3]}$](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#spring-web) and `Spring-WebFlux`[$_{[4]}$](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html) (popular backend frameworks) to demonstrate heterogeneity, in my POC.

No prior knowledge about these frameworks or kotlin is required, all the nuances required for this problem are contextually explained in the talk.

The audience learn about an innovative design technique to create reusable templates called **Ad-hoc Polymorphism**[$_{[5]}$](https://en.wikipedia.org/wiki/Ad_hoc_polymorphism), and how is it profitable and reduces the maintenance overhead of rewriting the same business logic across heterogeneous services and service migrations.

## Introduction

This paper is for Agile B2C product development teams, both in enterprises and startups, looking for ways to accelerate their feature development cycle.

### The Case for Heterogeneous services

The trend in the B2C world is to chop the use-cases with varied traffic-needs into Microservices managed by independent Scrum teams. These teams develop using Heterogeneous frameworks and tech-stacks, suitable for the traffic needs of their services.
Reactive/non-blocking stack[6] should only be used for high traffic services, as it adds a lot of complexity to the application[7] . Taking the example from the Payments domain, Purchases tend to have high traffic (especially during Black Fridays, Flash sales, etc.), and it's common to model them with an Asynchronous non-blocking paradigm like Spring-WebFlux. Whereas Refunds tend to have relatively low traffic, and a simple blocking stack like Spring-MVC can easily cater to its scaling needs. Such use-cases can be found in many B2C products, E.g. Reservations vs. Cancellations.

### The problem of Reusability among Heterogeneous services

Despite being heterogenous, these services have many commonalities in their Domain logic, ranging from small features such as Authentication, Logging to large features such as Request-Validation, Idempotency, External-Integrations. In the case of homogeneous services, the common code can be placed in a shared module and be added as a dependency in all services. But in heterogeneous case, blocking code can't be shared/reused for non-blocking service or vice-versa, because:

- It's extremely dangerous to mix both paradigms, as it can lead to untraceable performance issues.
- Their styles of programming are different (Functional in non-blocking vs. Imperative in blocking).
- Non-Blocking code is filled with callbacks while the blocking code is sequential.
- The DB APIs are different, as non-blocking services use non-blocking DBs.
- Each paradigm has specific `Effect` it operates on, E.g. Non-blocking paradigms may operate on reactive Effect types like `Mono<A>/Flux<A> or Observable<A>`, contrary to blocking paradigms which may (or need not) use simple Effect types like `Option/Either`.

This leads to scrum teams duplicating the same logic in all the services. Also, a service may be migrated, E.g. from `Spring-MVC` to `Spring-WebFlux` to scale better for increasing traffic, it needs to be entirely rewritten.

Let’s see (with a working POC) how to make such common logic reusable/sharable, turning the Monomorphic code into Polymorphic templates, which enables scrum teams to share well-tested small and large features across their services.

## Monomorphic to Polymorphic[$_{[8]}$](https://arrow-kt.io/docs/fx/polymorphism/)

If the Effect is abstracted out as a _Generic_, the domain logic turns reusable for service of any type, and it can be called **Polymorphic**. But to achieve that, we need to understand the concepts - **Higher-Kinded Types** and **Typeclasses**.

### Need for Higher-Kinded Types[$_{[9]}$](https://arrow-kt.io/docs/patterns/glossary/#higher-kinds)

Effects are of the form `F<A>` (e.g. `Mono<A>`), where `F` is the _Effect_ type and `A` is the value type. The problem is, most JVM languages only support parametricity on the value type `A` but not on the Container/Effect type `F`. So, we need **Higher-Kinded Types**, to represent `F<A>` as `Kind<F, A>`.

### Need for Typeclasses[$_{[10]}$](https://arrow-kt.io/docs/patterns/glossary/#typeclasses)

It's a generic interface that is parametric on a Type `T`. E.g. `Comparator<T>` in JDK is a simple typeclass. `Comparator<T>` has one operation `fun compare(a: T?, b: T?): Int`. Now for a type `String` to be a member of this typeclass, prepare a concrete `Comparator<String>` implementing its `fun compare(a: String?, b: String?): Int`. That's it! Now the `Collections.sort()` can make use of this concrete implementation to compare Strings.

To put our above example into a formal definition - A type class defines some behavior in the form of operations that must be supported by a type. A type can be a member of a typeclass by merely providing implementations of the operations the type must support.

This principle can be used to define abstract interfaces like `Comparator<T>` and reusable templates like `Collections.sort()`, whose behavior is polymorphic to the type `T` being sorted. This is **Ad-hoc Polymorphism**.

The term **Ad-hoc polymorphism** refers to polymorphic functions that can be applied to arguments of different types, but that behave differently depending on the type of the argument to which they are applied.

The code that relies on type classes is open for extension, just like how `Comparator<T>` can be extended to compare any type.

## Template-Oriented-Programming with a POC

Now that we have both the tools (Higher-Kinded Types and Typeclasses), let’s make a polymorphic template for our reusable domain logic. The samples used in the rest of this paper can be seen in action in a fully working POC - [GitHub](https://github.com/overfullstack/ad-hoc-poly). It has 3 modules:

- `kofu-mvc-validation` - Blocking Service built with `Spring-WebMVC`[$_{[3]}$](https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#spring-web)
- `kofu-reactive-validation` - Reactive Service built with `Spring-WebFlux`[$_{[4]}$](https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html)
- `validation-templates` - Shared module for both the services, holding templates.

We shall take-up the **_user validate-and-upsert_** as our example use-case, where a request to upsert a user is **_validated_**, followed by **_insert or update_** based on the user's existence in the DB.

`Spring-WebFlux` works with `Mono<A>/Flux<A>` while `Spring-WebMVC` doesn't. As a proof for reusability problem discussed above, refer the `upsert` function in both the services - [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/72f6e6c0ba/kofu-mvc-validation/src/main/kotlin/com/sample/Handlers.kt#L24-L43) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/72f6e6c0ba/kofu-reactive-validation/src/main/kotlin/com/sample/Handlers.kt#L26-L52).

The goal is to abstract this use-case domain logic into a generic reusable template. We shall achieve it by creating some typeclasses and making use of some typeclasses from the Arrow library. These heterogeneous services can inflate and consume these templates by supplying concrete instances of those typeclass interfaces. I coined this technique as **Template-Oriented-Programming!**.

### The `Repo<F>` typeclass

Let's abstract the DB behavior in both these stacks to a generic typeclass interface, `Repo<F>`, where `F` represents the Effect-type on which the DB works in their respective stacks/paradigms.

```kotlin:title=Repo.kt
interface Repo<F> : Async<F> {
    fun User.update(): Kind<F, Unit>
    fun User.insert(): Kind<F, Unit>
    fun User.doesUserLoginExist(): Kind<F, Boolean>
    fun User.isUserCityValid(): Kind<F, Boolean>
}
```

- These operations have a return type of the form `Kind<F, A>`(=`F<A>`), which is generic and agnostic of the `Effect`.
- Our services implement this typeclass with their respective Effect types. In these concrete implementations, the service repository functions are mapped to `Repo` operations, using `IO` and `MonoK` from Arrow Library - [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/72f6e6c0ba/kofu-mvc-validation/src/main/kotlin/com/sample/Configurations.kt#L38-L41) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/72f6e6c0ba/kofu-reactive-validation/src/main/kotlin/com/sample/Configurations.kt#L29-L32).

### Templates using Typeclasses

- Now we can weave our business-logic into generic templates depending on the generic operations of the typeclass `Repo<F>`.
- **Templates** are generic functions and they depend on Typeclasses. This dependency can be achieved by passing typeclass as a function argument or declaring the template functions as extensions to a typeclass. I used the latter in my POC - [Ref](https://github.com/overfullstack/ad-hoc-poly/blob/72f6e6c0ba/validation-fx/src/main/kotlin/com/validation/rules/UserRules.kt)
- Typeclass is the bridge between services and templates. Services supply a concrete implementation of the typeclass, essentially filling in the blanks for the templates - [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/72f6e6c0ba/kofu-mvc-validation/src/main/kotlin/com/sample/Configurations.kt#L36-L43) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/72f6e6c0ba/kofu-reactive-validation/src/main/kotlin/com/sample/Configurations.kt#L27-L34).
- These templates work as shared logic, and the services can use those concrete instances to consume all these templates. - [WebMVC Ref](https://github.com/overfullstack/ad-hoc-poly/blob/72f6e6c0ba/kofu-mvc-validation/src/main/kotlin/com/sample/HandlersX.kt#L22-L30) and [WebFlux Ref](https://github.com/overfullstack/ad-hoc-poly/blob/72f6e6c0ba/kofu-reactive-validation/src/main/kotlin/com/sample/HandlersX.kt#L20-L27).

That means, any new service or service migration can borrow all those well-tested small and large features for _free_ with minor efforts! Moreover, the typeclass is entirely extensible to support more operations, in turn, to extend and expand our template base.

## Outcomes and Conclusions

We achieved reusable domain logic using Ad-hoc Polymorphism, abstracting out the Effect using Typeclasses and Higher-Kinded Types, turing our Monomorphic code to Polymorphic. This is very powerful to model and migrate B2C-services. This **zeros-down the cost and effort** to rewrite and maintain common business logic across all services and service migrations. This can save a release cycle amount of work, bringing in real agility among scrum teams and startups to ship features faster.

## My Talk on this

This talk was successfully presented and warmly received at [@Kotlin User Group, Hyderabad](https://twitter.com/kotlinhyderabad)
<https://www.meetup.com/en-AU/kotlinhyderabad/events/269763753/>

`youtube: _QBlKtUY6ac`

## References

1. <https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/>
2. <https://www.intuit.com/blog/uncategorized/kotlin-development-plan/>
3. <https://docs.spring.io/spring/docs/current/spring-framework-reference/web.html#spring-web>
4. <https://docs.spring.io/spring/docs/current/spring-framework-reference/web-reactive.html>
5. <https://en.wikipedia.org/wiki/Ad_hoc_polymorphism>
6. <https://www.reactivemanifesto.org/>
7. <https://blog.pragmatists.com/unobvious-traps-of-spring-webflux-16924a0d76d5>
8. <https://arrow-kt.io/docs/fx/polymorphism/>
9. <https://arrow-kt.io/docs/patterns/glossary/#higher-kinds>
10. <https://arrow-kt.io/docs/patterns/glossary/#typeclasses>

- <https://danielwestheide.com/blog/the-neophytes-guide-to-scala-part-12-type-classes/>
- <https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf>
- <https://people.csail.mit.edu/dnj/teaching/6898/papers/wadler88.pdf>
