---
title: Score the Tendulkar Test Coverage
date: '2022-09-24T00:00:00.000Z'
layout: post
draft: false
path: /posts/score-the-tendulkar-test-coverage
cover: ./cover.png
category: Design
tags:
  - Java
  - Unit Test
  - Design Pattern
  - Clean Architecture
description: Java for Problem-Solving in Campus Interviews
---

# 🏏 Score the Tendulkar Test **Coverage**

India's most renowned cricketer Sachin Tendulkar has a peculiar record that no batsman wants to break. He got dismissed in 90s 18 times in ODIs and 10 times in Test cricket and
holds the record for the highest number of dismissals in the 90s (a total of 28 times) across all forms of international cricket.  they call it!
When I see code coverage numbers hitting more than 90, it reminds me of Sachin's [Nervous Nineties](https://en.wikipedia.org/wiki/Nervous_nineties)

# Abstract
- Unit testing has always been one of the most controversial topics among devs with many strong opinions, myths, and magic!
- Let’s talk about why we write unit tests and common mistakes that make unit testing difficult and tempt teams to reach out for Invasive tools like **PowerMock** to quench their coverage obsession.
- Developing in the middle of Legacy code should not be an excuse to skip unit tests. Let’s check out how **Ports & Adapters** architecture can cover your Greenfield code written over a Brownfield setup.
- Salesforce platform is powered by one of the largest monoliths, scaffolded back in 1999. Let’s discuss some of the practices we follow to stay honest with our coverage obsession till today.

# Audience

This applies to software developers at all levels interested in good Software Architecture. I use **Java** code snippets for demonstration. *PowerMock* may be specific to the JVM ecosystem,
but there may be analogous tools in other ecosystems. *Ports & Adapters* is a language-agnostic architectural pattern.

# Takeaways

- Not a Test-Pyramid talk!
- Learn how the need to use Invasive tools like PowerMock literally mocks the OO principles like Encapsulation, through hands-on demonstration.
- Anti-patterns that can be avoided in the design so that the behavior can be tested without any `when-then` statements
- Let's discuss **Ports & Adapters** architecture and understand how it eases Testing the Domain logic in isolation, even when interacting with Legacy code.
- Let’s learn about techniques like **Black-box unit testing**, which emphasises on behavior-coverage rather than Statement-coverage

# Resources

- [Slide deck](https://speakerdeck.com/gopalakshintala/score-the-tendulkar-test-coverage)
- [Demo source code](https://github.com/overfullstack/sttc-demo/)

# Why Unit test

- Unit testing is not to find bugs, it's behavior documentation in the form of Code
- Strive to achieve behavior coverage, not statement coverage

# What makes Unit testing difficult?

- There are so many [test anti-patterns](www.digitaltapestry.net/testify/manual/AntiPatterns.html), but obviously we cannot cover all these in this talk; you may refer to these resources for cited for in-depth explanation.
- We are going to focus on a few primary factors, that are prevalent across almost all code bases and simply correcting them gives us maximum returns.

## Code Smells

- `void` methods make it really difficult to test, as you don't give you back any result to assert. Asserting on statements like no.of times, a statement got executed is very brittle
- `static` methods that are not static and mutate state and do side-effects are not really __Static__

## Bad Design

- Your component is interacting with your external systems directly, without explicitly declaring them as dependencies.

## Legacy Code Interactions

- If you interact with Legacy code, your code instantly turns legacy

# I have the "Power"Mock
Are you saying one can't achieve high test coverage with these obstacles? The obstacle is the way and I have the **"Power"Mock**. Some of the powerful things that it lets you do are:

- Suppress
  - `this` and `super` constructor
  - Static initialization blocks
- Stub
  - `private` methods
  - `static` methods
  - `final` methods
  - Constructors
- Mock `final` classes
- What else you need, you should feel unstoppable

When you have a hammer, everything feels like a nail. Check-out how you can achieve 100% test coverage even without testing any behavior

- [Example](https://github.com/overfullstack/sttc-demo/blob/master/src/test/java/ga/overfullstack/PowerMock/after/BeanToEntityTest.java)
- Although this is an example, it's inspired from some tests that I encountered in reality
- Such tests are extremely hard to spot in code reviews and so sneaky even if you are seeing them in the IDE

## Synthetic Coverage
- What you essentially are doing is bending the Prod code to make the test pass and achieve 100% statement coverage.
- *Statement* coverage as a metric is **NOT** accurate to measure the behavior of the component covered.
- The synthetic coverage can disguise your coverage dashboards, which is more dangerous than not having coverage

## All-together a new Framework to learn
- I am interested in knowing if anyone can write tests with PowerMock without googling or referring to other PowerMock tests.
- No doubt, the learning curve is high, even for experienced developers.
- Again, has anyone got a PowerMock test right the first time? I never did, I had to do a lot of setups upfront and a lot of trial and error, mock the right pieces in a particular way to get it right.

## Brittle and Hard to maintain tests
- And most of the time, I end up with a feeling of, "I don't know how that test is passing, I don't wanna touch it any further".
- This feeling especially comes while fixing TFs on PowerMock tests. The tests are so diluted with a lot of mocking, I don't have any clue what's being tested.
- Plus, as these tests are so tightly latched with the statements in your prod code, a simple refactoring can break all these tests.
- If your behavior hasn't changed but your tests are failing, then there is a problem with what you are testing
- Instead of aiding the refactoring, they end up being a foot-chain for your code.

## Why is PowerMock Invasive?
- But why is PowerMock so invasive? If it's bad, why is everyone using it?
- I was so curious and wanted to check out their documentation:
- I don't know about what's under the hammer of this logo, but I think it's OO (Object Orientation). From their own description:
  > When writing unit tests it is often useful to bypass encapsulation and therefore PowerMock includes several features that simplifies reflection specifically useful for testing. This allows easy access to internal state, but also simplifies partial and private mocking.
    - That's like a robber breaking into your house. But the irony is, we use the same tool to break into our own house, even though we hold the keys.
    - PowerMock does weird things to already-compiled Java classes, in order to "hijack" the way Java normally loads compiled classes, all so it can create a "special" situation that's unlike production for the sake of a test.
- Followed by this:
  > Please note that PowerMock is mainly intended for people with expert knowledge in unit testing. Putting it in the hands of junior developers may cause more harm than good.
    - So, of-course if you are an expert you may use it right, but not everyone is and there are high chances of mis-using.
    - That's like handing over the gun to a toddler and asking him to use it under expert supervision.
    - Why does it need expert supervision? When you manipulate byte-code, you are bending your code. It can reach a point where you obfuscate it too much that the code under test is no more yours (the one that runs in production).
    - The moment you start parting away from reality, and you enjoy that convenience, without the expert supervision nothing stops you from doing it more until you reach a point where you are almost if not entirely detached from reality.
- Thus, I confirmed PowerMock is indeed a **Painkiller**, and conceals the actual ailments in the prod code.

## Compatibility
- Last nail in the coffin, PowerMock is incompatible with Junit 5
  - Junit 5 was released 5 years ago, just to give you an idea how  overdue this is
  - [Active Issue](https://github.com/PowerMock/PowerMock/issues/929) not addressed since 2018
- PowerMock doesn't support Mockito 4
  - PowerMock is wrapper over Mockito, the most popular mocking library
  - Mockito `4.20` is the latest version with a lot of improvements over Mockito 3
  - But the highest version PowerMock supports is `3.12`.
- Not fully compatible even with Java 11
- PowerMock has no major enhancements since 2018 or early 2019. There are numerous unaddressed issues, and the library doesn't seem to be in a great shape.

# But do I need Unit tests at all?
With all these obstacles and PowerMock dark powers, do unit tests even add any value to my automation? I better rely on my FTests

## Integration Tests (ITests) vs Unit Tests (UTests)
- I must emphasize, please don't use ITests to replace your Unit tests. That's like taking a full bath each time you pee, instead of just hand-washing.

### Purpose
ITest is supposed to emulate how the customer uses your application in the real-world, with real DB and network calls. So, you need to limit them to test E2E use-cases and not for every perm & comb.

### Traceability
ITests are bad at giving pinpoint feedback. Unit tests do an excellent job at that. We have so many ITests with just a param difference. Mostly, they might be testing a validation for which they don't need the server to be running.
### Productivity
ITests, both writing and running are costly and one of the major productivity killers
- We compromise running them due to long hours, unpredictability and check-in timelines.
- As we break tests, subsequent check-ins cannot leverage this automation anymore and have to check in blindfolded. This leads to a traffic-jam situation, where nobody knows what's going on
- UTests can even help code reviews

What if I told you instead of trying to overcome those obstacles using invasive tools like PowerMock, you can get rid of those altogether and write meaningful Unit tests and achieve organic Unit test coverage that matters?

# The Redemption

## Code Smells

### `void` methods
- Look out for these, these are generally the places where mutations & side-effects hide.
- It's either mutating parameters passed or talking to an external system, otherwise why would it exist in the first place.
- Avoid them as much as possible and write methods that return results

### `static` methods
- We hear this misconception that `static` methods are bad for testing.
- But `static` methods are the best for testing if they stay **Pure**

### Pure vs Impure

#### Impure
Functions that perform side-effects like DB interactions, Network calls, Emitting events, logging etc

```java{2}:title=impureFn
static void add(int a, int b) {
  System.out.println(a + b); // Side-effect
}
```

This is not easy to test. It's a `void` method performing an impure operation of printing to the console

#### Pure
- `Pure` functions are those whose output purely depend on the input parameters.
- You may have come across a term called **Referential Transparency**; it refers to the same, which indicates, no matter how many times you call such functions with same parameters, you get same output.
- To achieve this, you should not mutate the parameters or perform side-effects

```java:title=pureFn
static int add(int a, int b) {
  return a + b;
}
```

This is a no-brainer to test. But it's not always possible, sometimes they are too intermingled. In that case, pass the side-effect as a parameter for the function. This makes it easy to fake during testing.

```java{2,3}:title=higherOrderFn
static void add(int a, int b,
  Consumer<Integer> consumer) {
  consumer.accept(a + b);
}

// Function call in Prod
add(1, 2, System.out::println);

// Function call in Test
add(1, 2, result -> assertEquals(3, result));
```

## Bad Design
- [Example](https://github.com/overfullstack/sttc-demo/tree/f9793eea7bd4b185db521ff14c77ac3a1827e508/src/main/java/ga/overfullstack/pokemon)
- When you have a function like this, it is no more OOP, instead, it's P~~O~~OP (Procedure Oriented Programming).
- It's just a script written in Java and scripts are by definition not test-friendly.
- This leaves you no choice but to resort to invasive tools like **PowerMock** where you end up mocking statements with `when-then`
- Mocking statements instead of Dependencies is like strapping your prod code. You can't move those lines around without breaking or need to update your tests, even though the behavior remains the same.
- You need to design components with Unit-Testing in mind. There you go, **TDD** in one line
- But why? Your test is your first client. It's like your Dogfood customer. If it's finding it difficult to assert your component behavior, any other client integrating will also.
- One Golden thumb rule: **Always inject the dependencies through constructor**.
- It makes it really easy to Isolate your component and control the dependency behavior while testing.

## Legacy Code Dependencies
- But what if my code depends on Legacy classes? How legacy are some classes
- The term legacy is frequently used as a *slang* to describe a complex code, which is difficult to understand, rigid, fragile in nature, and almost impossible to enhance.
- We still interact with classes written during the early days of the product, dating all the way back some 20 years ago.
- But as we develop from scratch today, in release 240, year 2022, we still use these classes.

### Ports & Adapters
- But the problem still remains, what is the right way to test legacy code
- There's a saying:
  > If you interact with legacy code, your code turns legacy too
- As the new code depends on these Legacy components which are not written with *Testability* in mind, it suffers the same problem.
- But there is a catch to it,
  > If you interact with legacy code **Directly**, your code turns legacy too
- But how to *indirectly* interact? Introduce a **Level of Indirection**, which is popularly known as the **Ports & Adapters** architecture.
- This is a very simple concept to grasp:
  - Port - Interface
  - Adapter - Implementation of it
- By making your component depend on Ports, you can switch implementation from Prod to Fake adapters during a test.

# Black-box unit testing
- You must have noticed this statement in PowerMock tests: `Whitebox.setInternalState(...)`
- This is essentially what we talked about breaking into one's house.

## Mock Dependencies not statements
- You also notice statement like: `when(...).then(...)`, `doNothing().when(...)` etc, which essentially indicate you are testing a code statement flow and not the behavior.
- Mocking statements is like strapping your prod code, you can't move those lines around without breaking or need to update your tests, even though the behavior remains the same.
- Your tests shouldn't know about the internals of your component.
- Unit tests should be E2E for a component.

# Demo

[sttc-demo | Github](https://github.com/overfullstack/sttc-demo)

## Before:
[PokemonCollector](https://github.com/overfullstack/sttc-demo/blob/master/src/main/java/ga/overfullstack/pokemon/before/PokemonCollector.java)

- This is badly designed and this component directly interacts with legacy components, leaving no choice for the tests but to use **PowerMock**
- In-order to test such component, you may need to mock a lot of statements, with some random data. You don't necessarily care about the value of these data.
- But for every `when-then` statement written here, the developer has to scrutinize the prod code and do a lot of trial n error.

## After:

[PokemonCollector](https://github.com/overfullstack/sttc-demo/blob/master/src/main/java/ga/overfullstack/pokemon/after/PokemonCollector.java)

- You can execute a test without worrying about what statements to mock. Test as if you don't know how it's implemented. Instead, fake the dependencies and assert how the component behavior changes with it.

> No one gives you change, you need to bring change

A Bus conductor told the above quote (now read the quote again) — #dadjoke

# My Talks on this

- 🇮🇳 **[Google Cloud Community Days](https://gdg.community.dev/events/details/google-gdg-cloud-hyderabad-presents-cloud-community-days-hyderabad-2022-1/)**, Hyderabad, 2022
- 🇩🇪 **[WeAreDevelopers World Congress](https://www.wearedevelopers.com/world-congress/speakers#:~:text=Gopal%20S%20Akshintala-,Lead,-member%20of%20Technical)**, Berlin, 2022
- 🇮🇳 **[Salesforce](https://www.youtube.com/watch?v=glgI5W2BU5o&list=PLrJbJ9wDl9EC0bG6y9fyDylcfmB_lT_Or&index=1)**, Hyderabad, 2022

`youtube: https://www.youtube.com/watch?v=glgI5W2BU5o&list=PLrJbJ9wDl9EC0bG6y9fyDylcfmB_lT_Or&index=1`

# Resources

- [Anti-Patterns](https://www.digitaltapestry.net/testify/manual/AntiPatterns.html)
- [Explanation how proxy based Mock Frameworks work](https://blog.rseiler.at/2014/06/explanation-how-proxy-based-mock.html)
- [Write tests. Not too many. Mostly integration](https://kentcdodds.com/blog/write-tests)
- [Testing of Microservices - Spotify Engineering](https://engineering.atspotify.com/2018/01/testing-of-microservices/)
- [On the Diverse And Fantastical Shapes of Testing](https://martinfowler.com/articles/2021-test-shapes.html)
- [Testing in the Twenties](https://www.tbray.org/ongoing/When/202x/2021/05/15/Testing-in-2021)
