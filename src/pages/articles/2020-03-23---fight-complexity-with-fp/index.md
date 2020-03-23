---
title: Fight Complexity with Functional Programming
date: "2020-03-23T00:00:00.000Z"
layout: post
draft: false
path: "/posts/fight-complexity-with-fp/"
cover: "./cover.jpeg"
category: "Design"
tags:
  - "Java"
  - "Vavr"
description: "Skadooosh!"
---

## Abstract

With the advent of **SaaS** and **Microservices**, software systems majorly communicate through the network, and **REST** is the predominant HTTP protocol used. To reduce network latency, these services resort to Bulk-APIs. One of the significant challenges of Bulk-APIs is **Request Validation. **With increasing request bulk size, service routes, and the number of validations, the validation orchestration can quickly get complex when done in traditional imperative style.

This proposal offers a **creative solution** using Functional Programming (FP) - an extensible **Validation Framework** for REST services, which was successfully implemented by our Payments Platform Engineering in one of the world's largest SaaS companies, *Salesforce*.

## Audience

This talk targets developers with basic knowledge of software design. The concepts are language agnostic. For broader outreach, I shall use **Java** for demonstration. The audience experience a mind-shift from a traditional imperative style to functional style and how it simplifies modeling and designing complex real-world problems. This talk adds new paradigm toolset and vocabulary to any programmer's arsenal.

As I cannot use the production code, I use code samples from my POC [Github repo](https://github.com/overfullstack/railway-oriented-validation) for the demonstration.

## Introduction

Our Payment Platform service has parallel routes such as Authorization, Capture, Refund, Void. All of these are REST-APIs. They have JSON request payloads that accept sub-requests in bulk (list of JSON nodes). A simplified version of payload for one of the routes - Authorization:

```json
[
    {
        "amount": 99,
        "accountId": "{{validAccountId}}",
        ...,
        "paymentMethod": {
            ...
        },
        ...
    },
    {
        "amount": 77,
        "accountId": "{{validAccountId}}",
        ...,
        "paymentMethod": {
            ...
        },
        ...
    }
]
```

Since all services deal with Payments, they have a lot of common fields like `amount`, as well as common child nodes like `paymentMethod` in their structure.

Based on the type of field, they have different kinds of validations. E.g., `amount` - needs *simple data validation* for non-negative integers, `accountId` - needs a _stateful validation_ which involves a DB read, _Nested Validations_ for the `paymentMethod` as it is an independent child node inside a parent.

### The Requirements

The service validation module has the following requirements:

- Share common and Nested Validations.
- Configure sequence of Validations - Cheaper first and Costlier later.
- Fail-Fast for each sub-request.
- Partial failures - An aggregated error response for failed sub-requests can only be sent after valid requests are processed through multiple layers of the application. We have to hold on to the invalid sub-requests till the end and skip them from processing.

## Imperative treatment

We have close to **100 validations** of various kinds and increasing. When the above requirements are dealt with traditional [Imperative Style](https://en.wikipedia.org/wiki/Imperative_programming), it can quickly get messy, as shown [here](https://github.com/overfullstack/railway-oriented-validation/blob/master/src/test/java/imperative/ImperativeEggValidation.java). This code is mutation filled, non-extensible, non-sharable, non-unit-testable, and difficult to reason about. But to state that objectively, we can run some complexity metrics on this code, using [MetricsReloaded](https://plugins.jetbrains.com/plugin/93-metricsreloaded) Intellij IDE Plugin:

- Cyclomatic Complexity - v(G) - This measures the number of linearly independent paths in a function.
- Design Complexity - iv(G) - This measures how well a function is orchestrating calls to other functions.
- Essential Cyclomatic Complexity - ev(G) - This measures the structuredness of a function (how easy it is to break a function).

In short, these help us identify the degree of complexity in this code, which is **high** in this approach. (Results to be run and explained during the talk).

## Need for Better Design

### The 3D design problem

This problem is a 3-dimensional design problem stretching among - Sub-requests, service routes (sharing common fields & nodes), and Validations. In the above imperative approach, we entangled all 3, which lead to chaos. We need a design, which treats all of these separately, let them extend independently and abstract out validation sequencing and orchestration. We need to separate *What-to-do* from *How-to-do.*

### Dichotomous Data

We have two types of data floating around throughout our validation program - Valid sub-requests and Invalid sub-requests with Validation Failures. For each sub-request, based on its state, the imperative code flow is continuously branched out with `if-else` and `try-catch` statements, which lead to much of the cyclomatic complexity. We need a way to represent this valid/invalid **_Effect_** so that our program flows linearly agnostic of the sub-request state.

## The Bulk Validation Framework

We need an extensible framework to cater above design needs.

### Functions as Values

I used Java 8 Functional interfaces to represent the validation functions as values - [Ref](https://github.com/overfullstack/railway-oriented-validation/blob/master/src/test/java/railwayoriented/RailwayEggValidation2.java). This way Validation functions turn more cohesive than the imperative style, can be extended independently from each other and **shared** among various service routes.

### Representing Effect with Either Monad [1]

In the talk, I shall introduce Monad with a crash course, but for the brevity of this paper - It is a data type container that represents the data it contains in 2 states `left` and `right`. We can leverage this *Effect* to represent our Dichotomous Data, where `left: Validation Failure` and `right: Valid sub-request`. Either Monad has operations [API ref] like `map` and `flatMap`, which perform operations on the contained value, only if Monad is in `right` state. This property helps developers write *linear programs*, without worrying about the state of Monad. [Ref](https://github.com/overfullstack/railway-oriented-validation/blob/master/src/test/java/railwayoriented/RailwayEggValidation2.java#L48-L53)

### Validations exchange Monad Currency

This _Effect_ can be used as a currency to be exchanged as input-output for our independent validation functions. A validation function takes Either monad as input. If the input is in the `right` state, validation is performed using its API functions `map` or `flatMap`, and if the validation fails, the monad is set to the `left` state. Otherwise, return the `right` state received.

### Validation Orchestration

Since functions are values, all you need is an Ordered List (like `java.util.list`) to maintain the sequence of validations. We can compose all the validation functions, in the order of preference. This order is easily **configurable** - [Ref](https://github.com/overfullstack/railway-oriented-validation/blob/b5184eecdc8bb428c839a5d11536ce76a0554ad1/src/test/java/common/Config.java#L32-L43)

Now we have 2 lists to intertwine - List of sub-requests to be validated against List of Validations. This orchestration can be easily achieved in many ways due to the virtue of loose coupling between What-to-do(validations) and How-to-do(Orchestration). We can switch orchestration strategies without effecting validations code, as seen in [here](https://github.com/overfullstack/railway-oriented-validation/blob/master/src/test/java/common/ValidationStrategies.java). If in future, we can even switch the fail-fast strategy to error-accumulation.

The partial failure sub-requests are captured as Either Monads in `left` state, which are passed to subsequent layers, where they are ignored, thanks to the Either Monad property we discussed above.

### Testability

Individual validation functions are easily testable through unit-tests. The orchestration is completely done using well-tested library functions (by library owners) like `foldLeft`, `findFirst`, etc. So nothing stops the framework from having a **100% code coverage**.

### Complexity

Thanks to the monad abstracting away all the branching complexity, our linear code has minimum complexity, which makes it easy to extend, debug and reason about. We can rerun the complexity metrics to proove it.

## Conclusion

Functional Programming is not Complex, but it fights complexity. The solution runs with the same time complexity, but minimum accidental complexity. The framework is generic and agnostic of programming language and can be consumed by any Service with a similar requirement, with minor modifications.

## My Talk on this

`youtube: https://www.youtube.com/embed/l9jJ7m7_VpM`

## References

1. <https://en.wikipedia.org/wiki/Monad_(functional_programming)#An_example:_Maybe>
2. <https://www.vavr.io/vavr-docs/>
3. <https://fsharpforfunandprofit.com/rop/>
4. <http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html#just-what-is-a-functor,-really>
5. <https://codurance.com/2018/08/09/the-functional-style-part-1/>
