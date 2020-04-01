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
keyTakeAways:
  - A **Metric-driven approach** towards reducing Cognitive Complexity using Functional Programming (FP) principles.
  - Modeling and designing of complex real-world problems using Functional Programming constructs.
  - Intermediate FP Concepts such as Monads, Function Lifting and their application in the context of a real-world problem.
  - A mind-shift from a traditional imperative style to functional style.
---

## Abstract

A Metric-driven approach to reduce Cognitive Complexity in a code base, using Functional Programming, demoed by solving a complex real-world ubiquitous design challenge - REST API Bulk Request Validation, with an extensible Framework that separates what-to-do (Validations) from how-to-do (Validation Orchestration). It was successfully done by our team in the world's largest SaaS org, *Salesforce*.

## Audience

Technical Level: Interesting to all, approachable for basic and up. Any Functional Programming (FP) enthusiasts love it.

This talk targets developers with basic knowledge of software design. The concepts are language agnostic. For broader outreach, I shall use **Java** for demonstration. The audience doesn't need any prior knowledge of FP. They are gradually ramped-up towards Intermediate FP concepts such as Monads, Function Lifting in the context of the problem.

The audience experiences a mind-shift from a traditional imperative style to functional style. This talk adds new paradigm tool-set and vocabulary to any programmer's arsenal and how to use it to simplify the modeling and designing of complex real-world problems.

As I cannot use the production code, I use code samples from my POC [Github repo](https://github.com/overfullstack/railway-oriented-validation) for the demonstration.

## Introduction

With the advent of **SaaS** and **Microservices**, software systems majorly communicate through the network, and **REST** is the predominant HTTP protocol used. To reduce network latency, these services resort to _Bulk-APIs_. One of the significant challenges of Bulk-APIs is **Request Validation**. With increasing request bulk size, service routes, and the number of validations, the validation orchestration can quickly get complex when done in traditional imperative style.

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

Since all services deal with Payments, they have a lot of common fields like `amount`, as well as common child nodes like `paymentMethod` in their structure. Based on the type of field, they have different kinds of validations. E.g.:

- Common fields like `amount` - needs *simple data validation* for non-negative integers.
- Fields like `accountId` - needs a *stateful validation* which involves a DB read.
- _Nested Validations_ for the common child nodes like `paymentMethod` as it is an independent child node inside a parent.

### The Requirements

The service validation module has the following requirements:

- Share common and Nested Validations.
- Configure Validation sequence- Cheaper first and Costlier later.
- Fail-Fast for each sub-request.
- Partial failures - An aggregated error response for failed sub-requests can only be sent after valid requests are processed through multiple layers of the application. We have to hold on to the invalid sub-requests till the end and skip them from processing.

## Imperative treatment

We have close to **100 validations** of various kinds and increasing. When the above requirements are dealt with traditional [Imperative Style](https://en.wikipedia.org/wiki/Imperative_programming), it can quickly get messy, as shown [here](https://github.com/overfullstack/railway-oriented-validation/blob/master/src/test/java/imperative/ImperativeEggValidation.java). This code is mutation filled, non-extensible, non-sharable, non-unit-testable, and difficult to reason about.

But to state that objectively, we can run **Cyclomatic Complexity**[$_{[1]}$](https://www.ibm.com/developerworks/java/library/j-cq03316/) and **Cognitive Complexity** [$_{[2]}$](https://www.sonarsource.com/docs/CognitiveComplexity.pdf) metrics on this code, using a popular Code Quality tool called **SonarQube™**[$_{[3]}$](https://docs.sonarqube.org/latest/user-guide/metric-definitions/).

Our current imperative approach records **high** values for both these metrics. (Results to be run and explained during the talk).

## Need for Better Design

### The 3D design problem

This problem is a 3-dimensional design problem stretching among - Sub-requests, service routes (sharing common fields & nodes), and Validation count. In the above imperative approach, we entangled all 3, which lead to chaos. We need a design, which treats all of these separately, let them extend independently, and abstracts out validation sequencing and orchestration. We need to separate *What-to-do* from *How-to-do.*

### Dichotomous Data

We have two types of data floating around throughout our validation program - Valid sub-requests and Invalid sub-requests with Validation Failures. For each sub-request, based on its state, the imperative code flow is continuously branched out with `if-else` and `try-catch` statements, which lead to much of the cognitive complexity. We need a way to represent this valid/invalid **_Effect_** so that our program flows linearly agnostic of the sub-request's validation state.

## The Bulk Validation Framework

We need an extensible framework to cater above design needs.

### Functions as Values

I used Java 8 Functional interfaces to represent the validation functions as values - [Ref](https://github.com/overfullstack/railway-oriented-validation/blob/master/src/main/java/declarative/RailwayValidation2.java). This way Validation functions turn more cohesive than the imperative style, can be extended independently from each other and **shared** among various service routes.

### Representing Effect with Either Monad[$_{[4]}$](https://www.vavr.io/vavr-docs/#_either)

In the talk, I shall introduce Monad with a crash course and contextually explain the application of various monads, such as `Option`, `Either`, `Try`, `Stream`.

Let's start with `Either` Monad - It is a data type container that represents the data it contains in 2 states `left` and `right`. We can leverage this *Effect* to represent our Dichotomous Data, where `left: Validation Failure` and `right: Valid sub-request`. Either Monad has operations [API ref] like `map` and `flatMap`, which perform operations on the contained value, only if Monad is in `right` state. This property helps developers write _linear programs_ without worrying about the state of Monad - [Ref](https://github.com/overfullstack/railway-oriented-validation/blob/5a8565e02c09c18f9a776041ead745c0ea9414d5/src/main/java/declarative/RailwayValidation2.java#L38-L43).

### Validations exchange Monad Currency

This *Effect* can be used as a currency to be exchanged as input-output for our independent validation functions. A validation function takes Either monad as input. If the input is in the `right` state, validation is performed using its API functions `map` or `flatMap`, and if the validation fails, the monad is set to the `left` state. Otherwise, return the `right` state received.

### Validation Orchestration

Since functions are values, all you need is an Ordered List (like `java.util.list`) to maintain the sequence of validations. We can compose all the validation functions, in the order of preference. This order is easily **configurable** - [Ref](https://github.com/overfullstack/railway-oriented-validation/blob/5a8565e02c09c18f9a776041ead745c0ea9414d5/src/main/java/common/Config.java#L25-L36).

Now we have 2 lists to intertwine - List of sub-requests to be validated against List of Validations. This orchestration can be easily achieved in many ways due to the virtue of loose coupling between What-to-do(validations) and How-to-do(Orchestration). We can switch orchestration strategies (like fail-fast strategy to error-accumulation) without effecting validations code - [Ref](https://github.com/overfullstack/railway-oriented-validation/blob/master/src/main/java/declarative/ValidationStrategies.java).

The partial failure sub-requests are captured as Either Monads in `left` state, which are passed to subsequent layers, where they are ignored, thanks to the Either Monad property we discussed above.

### Testability

Individual validation functions are easily testable through unit-tests. The orchestration is completely done using well-tested library functions (by library owners) like `foldLeft`, `findFirst`, etc. So nothing stops the framework from having a **100% code coverage**.

### Complexity

Thanks to the monad abstracting away all the branching complexity, our linear code has minimum complexity, which makes it easy to extend, debug and reason about. We can rerun the previous complexity metrics to prove it.
![complexity-compare](media/complexity-compare.png)
As pointed, we can compare [Imperative approach](https://github.com/overfullstack/railway-oriented-validation/blob/master/src/main/java/imperative/ImperativeValidation.java) with the [Declarative one](https://github.com/overfullstack/railway-oriented-validation/blob/master/src/main/java/declarative/RailwayValidation2.java). Despite the declarative implementation having more validations than imperative implementation, the _Cognitive Complexity_ remains minimum.

## Conclusion

Functional Programming is not Complex, but it fights complexity. The solution runs with the same time complexity (no perf impact), but minimum cognitive complexity. The framework is generic and agnostic of programming language and can be consumed by any Service with similar requirements, with minor modifications.

## My Talk on this

This talk was successfully presented and warmly received at:

- [Google Developer Group Devfest 2019](https://devfest.gdghyderabad.in/speakers.html)
- [Java User Group Hyderabad (@JUGHyd)](https://www.meetup.com/en-AU/jughyderabad/events/264688807/)
- [Salesforce, Hyderabad, India](http://y2u.be/l9jJ7m7_VpM)

This talk is also selected for a prestigious international conference **[JBCN Conf - 2020](https://www.jbcnconf.com/2020/)** to be held in Barcelona this July.

- The [Slide deck](http://bit.ly/fcwfp-slides)
- The code examples for this talk can be found here:
  - [Imperative vs. Declarative](http://bit.ly/imp-vs-dec)
  - [Railway Oriented Validation](http://bit.ly/ro-validation)
- The recording _(This is only the first presentation of this talk, and there have been many enhancements in later editions)_.

`youtube: https://www.youtube.com/embed/l9jJ7m7_VpM`

## References

1. <https://www.ibm.com/developerworks/java/library/j-cq03316/>
2. <https://www.sonarsource.com/docs/CognitiveComplexity.pdf>
3. <https://docs.sonarqube.org/latest/user-guide/metric-definitions/>
4. <https://www.vavr.io/vavr-docs/#_either>

- <http://docs.mipro-proceedings.com/4cows/01_4cows_5333.pdf>
- <https://fsharpforfunandprofit.com/rop/>
- <http://adit.io/posts/2013-04-17-functors,_applicatives,_and_monads_in_pictures.html#just-what-is-a-functor,-really>
- <https://codurance.com/2018/08/09/the-functional-style-part-1/>
