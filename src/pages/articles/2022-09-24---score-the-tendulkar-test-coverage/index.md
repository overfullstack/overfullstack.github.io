---
title: Score the Tendulkar Test Coverage 🏏
date: '2022-09-24T00:00:00.000Z'
layout: post
draft: false
path: /posts/score-the-tendulkar-test-coverage
cover: ./cover.png
category: Test Driven Design
tags:
  - Unit Test
  - Design Pattern
  - Clean Architecture
  - Ports and Adapters
  - PowerMock
  - Java
  - Kotlin
description: Java for Problem-Solving in Campus Interviews
---

# Nervous Nineties

India's most renowned cricketer **Sachin Tendulkar** holds a peculiar record that **NO** batsman wants to break. He missed many centuries by getting dismissed at the score of 90 (18 times in ODIs and 10 times in Test cricket). He holds the record for the highest number of dismissals in the 90s (a total of 28 times) across all forms of international cricket. As a Tendulkar fan, I knew almost each of these scores by heart, as I felt equally nervous. When I see code coverage numbers hitting more than 90, it reminds me of Sachin's [Nervous Nineties](https://en.wikipedia.org/wiki/Nervous_nineties)

# Abstract
- Unit testing has always been one of the most controversial topics among devs with many strong opinions, myths, and magic!
- Let’s talk about why we write unit tests and common mistakes that make unit testing difficult and tempt teams to reach out for Invasive tools like **PowerMock** to quench their coverage obsession.
- Side-effects in domain logic or developing amidst Legacy code should not be an excuse to skip unit tests. Let’s check out how **Ports & Adapters** architecture can help unit-test your Greenfield code in isolation, independent of side-effects or Brownfield setup.
- The Salesforce platform is powered by one of the largest monoliths, scaffolded back in 1999. Let’s discuss some of the practices we follow to stay honest with our coverage obsession till today.

# Audience
This applies to software developers at all levels interested in good Software Architecture. I use **Java** code snippets for demonstration. *PowerMock* may be specific to the JVM ecosystem,
but there may be analogous tools in other ecosystems. *Ports & Adapters* is a language-agnostic architectural pattern.

# Takeaways
- Not a Test-Pyramid talk!
- Learn how the need to use Invasive tools like PowerMock literally mocks the OO principles like Encapsulation, through hands-on demonstration.
- Anti-patterns that can be avoided in the design so that the behavior can be tested without any `when-then` statements
- Let's discuss **Ports & Adapters** architecture and understand how it eases Testing the Domain logic in isolation, even when interacting with Legacy code.
- Let’s learn about techniques like **Black-box unit testing**, which emphasizes on behavior-coverage rather than Statement-coverage

# Resources
- [Slide deck](https://speakerdeck.com/gopalakshintala/score-the-tendulkar-test-coverage)
- [Demo source code](https://github.com/overfullstack/sttc-demo/)

# Why Unit test?
- *"Test"* is a misnomer when used in the context of *Unit tests*. Unit testing is not to find bugs, although it is a nice second-order advantage, it primarily acts as a behavior documentation of CUT (Component Under Test) in the form of Code.
- Unlike the Word/Quip documents we create around code, Code-automation always stays up-to-date and guards your component to always behave as the developer who wrote intended it to. If you accidentally break the behavior, it warns you by failing. If it's intentional, update the documentation (Automation) to reflect the same.
- Unit tests are unique among the automation methods, as they are written by developers during development. They are the cheapest to set up, easiest to write, and quickest to execute. When done right they can co-pilot your development.
- Unit test is the first client to your Component. It's like your Dogfood customer. If it's finding it difficult to interact and assert your component behavior, any other client integrating will also face the same difficulty.

# What makes Unit testing difficult?
There are so many [test anti-patterns](www.digitaltapestry.net/testify/manual/AntiPatterns.html), you may refer to the [resources](#Resources-1) cited for an in-depth explanation.
We are going to focus on a few primary factors, that are prevalent across almost all code bases, and simply correcting them gives us maximum returns.

## Code Smells 🐽
- `void` methods are hard to test, as they don't give you back any result to assert. Asserting on statements like no.of times, a statement got executed is very brittle
- `static` methods that are not static and mutate state and do side-effects are not **Static**.

## Bad Design 💩
Your component is interacting with your external systems directly, without explicitly declaring them as dependencies.

## Legacy Code Interactions 🗿
If you interact with Legacy code, your code instantly turns legacy

> To guard a component behavior with Unit-tests, one should Strive to achieve behavior coverage, and not statement coverage. Unfortunately, the code-coverage metric currently available to measure this Behavior coverage is only through the no.of statements or LOC covered. That's in a way a Loophole! Like anything in our society, a loophole combined with an obsession to achieve high coverage numbers leads to some shady tools and practices that cut corners, which defeat the purpose of why coverage exists in the first place.

# I have the "Power" Mock
Are you saying one can't achieve high test coverage with these obstacles? The obstacle is the way and I have the **"Power"Mock**.
These are some of the dark powers it gives you:

- Suppress
  - `this` and `super` constructor
  - Static initialization blocks
- Stub
  - `private` methods
  - `static` methods
  - `final` methods
  - Constructors
- Mock `final` classes

What else do you need!? you should feel unstoppable!! When you have a hammer, everything feels like a nail. Check-out how you can achieve 100% test coverage even without testing any behavior: [Example](https://github.com/overfullstack/sttc-demo/blob/master/demo/src/test/java/ga/overfullstack/pokemon/before/BeanToEntityTest.java)
- Although this is an example, it's inspired by some tests that I encountered in reality
- Such tests are extremely hard to spot in code reviews and so sneaky even if you are seeing them in the IDE.

## Synthetic Coverage
- Any statement coverage without testing Behavior like the above is useless and doesn't give any confidence in guarding the behavior.
- The synthetic coverage can disguise your coverage dashboards, which is more dangerous than not having coverage.

## Altogether a new Framework to learn
- I am interested in knowing if anyone can write tests with PowerMock without googling or referring to other PowerMock tests.
- No doubt, the learning curve is high, even for experienced developers.
- Again, has anyone got a PowerMock test right the first time? I never did, I had to do a lot of setups upfront and a lot of trial and error, mocking the right pieces in a particular way to get it right.

## Brittle and Hard to maintain tests
- Most of the time, I end up with a feeling of, "I don't know how that test is passing, I don't wanna touch it any further", especially while fixing failures on PowerMock tests, the tests are so diluted with a lot of mocking, I don't have any clue what's being tested.
- Plus, as these tests are so tightly latched with the statements in your prod code, a simple refactoring can break all these tests.
- If your behavior hasn't changed but your tests are failing, then there is a problem with what you are testing
- Instead of aiding the refactoring, they end up being a foot-chain for your code.

## Compatibility
The last nail in the coffin is PowerMock's poor compatibility with other test tools:

- PowerMock is incompatible with Junit 5
  - Junit 5 was released 5 years ago, just to give you an idea of how overdue this is
  - [Active Issue](https://github.com/PowerMock/PowerMock/issues/929) not addressed since 2018
- PowerMock doesn't support Mockito 4
- PowerMock is a wrapper over Mockito, the most popular mocking library
  - The newer versions of Mockito bring in many fixes and enhancements, but the highest version PowerMock supports is still stuck at `3.12`.
- Not fully compatible even with Java 11
- [PowerMock | [Github](https://github.com/powermock/powermock) has had no major enhancements since 2018 or early 2019. There are numerous [unaddressed issues](https://github.com/powermock/powermock/issues), and the library doesn't seem to be in great shape.

## Why is PowerMock Invasive?
- But why is PowerMock so invasive? If it's bad, why is everyone using it?
- I was so curious and wanted to check out [PowerMock's documentation](https://powermock.github.io/)
- I don't know about what's under the hammer of this logo, but I think it's OO (Object Orientation). This is how this tool is sold:
  > When writing unit tests it is often useful to bypass encapsulation and therefore PowerMock includes several features that simplifies reflection specifically useful for testing. This allows easy access to internal state, but also simplifies partial and private mocking.
    - That's like a robber breaking into your house. But the irony is, we use this tool to break into our own house, even though we hold the keys.
    - PowerMock does weird things to already-compiled Java classes, to "hijack" the way Java normally loads compiled classes, all so it can create a "special" situation that's unlike production for the sake of a test.
- Followed by this:
  > Please note that PowerMock is mainly intended for people with expert knowledge in unit testing. Putting it in the hands of junior developers may cause more harm than good.
    - So, of course, if you are an expert you may use it right, but not everyone is. So, there are high chances of misusing.
    - That's like handing over a gun to a toddler and asking him to use it under expert supervision.
    - Why does it need expert supervision? When you manipulate byte-code, you are bending your code. It can reach a point where you obfuscate it too much that the code under test is no more yours (the one that runs in production).
    - The moment you start parting away from reality, and you enjoy that convenience, without the expert supervision nothing stops you from doing it until you reach a point where you are almost if not entirely detached from reality.
- Thus, I confirmed PowerMock is indeed a **Painkiller** and conceals the actual ailments in the prod code.

# But do I need Unit tests at all?
With all these obstacles and PowerMock dark powers, do unit tests even add any value to my automation? I better rely on my Integration Tests (ITests)

## Integration Tests (ITests) vs Unit Tests (UTests)
I must emphasize, please don't use ITests to replace your Utests. That's like taking a full bath each time you pee, instead of just hand-washing.

### Purpose
ITest is supposed to emulate how the customer uses your application in the real world, with real DB and network calls. So, you need to limit them to test E2E use cases and not for every perm & comb.

### Traceability
ITests are bad at giving pinpoint feedback. Unit tests do an excellent job of that. We have so many ITests with just a param difference. Mostly, they might be testing a validation for which they don't need the server to be running.

### Productivity
ITests, both writing, and running are costly and one of the major productivity killers.
- We compromise running them due to long hours, unpredictability, and check-in timelines.
- As we break tests, subsequent check-ins cannot leverage this automation anymore and have to check in blindfolded. This leads to a traffic-jam situation, where nobody knows what's going on
- UTests are quick to run, can provide immediate feedback, and can even help code reviews.

What if I told you instead of trying to overcome those obstacles using invasive tools like PowerMock, you can get rid of those altogether and write meaningful Unit tests and achieve organic Unit test coverage that matters?

# The Redemption

## Code Smells

### `void` methods
- Look out for these, these are generally the places where mutations & side-effects hide.
- It's either mutating parameters passed or talking to an external system, otherwise, why would it exist in the first place?
- Avoid them as much as possible and write methods that return results

### `static` methods
- We hear this misconception that `static` methods are bad for testing.
- But `static` methods are the best for testing if they stay **Pure**

### Pure vs Impure

#### Impure
Functions that perform side-effects like DB interactions, Network calls, Emitting events, logging, etc.

```java{2}:title=impureFn
static void add(int a, int b) {
  System.out.println(a + b); // Side-effect
}
```

This is not easy to test. It's a `void` method performing an impure operation of printing to the console

#### Pure
- `Pure` functions are those whose output purely depends on the input parameters.
- You may have come across a term called **Referential Transparency**; it refers to the same, which indicates, no matter how many times you call such functions with the same parameters, you get the same output.
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
- [Example](https://github.com/overfullstack/sttc-demo/blob/4c9bbfc1137f71d247f7528d66b69812e57f85be/demo/src/main/java/ga/overfullstack/pokemon/before/PokemonCollector.java)
- When you have a function like this, it is no more OOP, instead, it's P~~O~~OP (Procedure Oriented Programming).
- It's just a script written in Java and scripts are by definition not test-friendly.
- This leaves you with no choice but to resort to invasive tools like **PowerMock**, where you end up mocking statements with `when-then`
- Mocking statements instead of Dependencies is like strapping your prod code. You can't move those lines around without breaking or needing to update your tests, even though the behavior remains the same.
- You need to design components with Unit-Testing in mind (There you go, **TDD** in one line).
- One Golden thumb rule: **Always inject the **dependencies through the **constructor**.
- It makes it easy to Isolate your component and control the dependency behavior while testing.

## Legacy Code Dependencies
- But what if my code depends on Legacy classes? How legacy are some classes
- The term legacy is frequently used as _slang_ to describe a complex code, which is difficult to understand, rigid, fragile in nature, and almost impossible to enhance.
- We still interact with classes written during the early days of the product, dating back some 20 years ago.
- But as we develop from scratch today, in release 240, the year 2022, we still use these classes.

### Ports & Adapters 🔌
- But the problem remains, what is the right way to test legacy code?
- There's a saying:
  > If you interact with legacy code, your code turns legacy too
- As the new code depends on these Legacy components which are not written with *Testability* in mind, the new code suffers the same problem.
- But there is a catch to it:
  > If you interact with legacy code **Directly**, your code turns legacy too
- But how to *indirectly* interact? Introduce a **Level of Indirection**, which is popularly known as the **Ports & Adapters** architecture.
- This is a very simple concept to grasp:
  - Port - Interface
  - Adapter - Implementation of it
- By making your component depend on Ports, you can switch implementation from Prod to Fake adapters during a test.

# Black-box Unit testing 🕋

- It's a technique to Unit test a component without knowing its internals.
- Unit tests don't mean testing the internals. It's an E2E test for your Unit/Component.
- You must have noticed this statement in PowerMock tests: `Whitebox.setInternalState(...)`. This is essentially what we talked about "breaking into your own house", i.e., breaking your own component's encapsulation.

## Mock Dependencies NOT statements
- You also notice statements like `when(`...).then(...)`, `doNothing().when(...)` etc, which essentially indicate your test is tightly latched to your Prod code and making assertions tweaking the internal code statements and flow.
- With such a statement mocking, you can't move those lines around (Refactoring) without breaking or needing to update your tests, even though the behavior remains the same.
- Your test should know its component only through its dependencies, such that it can switch the dependencies being injected and asserts the change in its behavior.

# Demo
[sttc-demo](https://github.com/overfullstack/sttc-demo)

## Before:
[PokemonCollector](https://github.com/overfullstack/sttc-demo/blob/master/demo/src/main/java/ga/overfullstack/pokemon/before/PokemonCollector.java)

- This is badly designed and this component directly interacts with legacy components, leaving no choice for the tests but to use *PowerMock*
- To test such components, you may need to mock a lot of statements.
- But for every `when-then` statement written here, the developer has to scrutinize the prod code and do a lot of trial n error.

## After:
[PokemonCollector](https://github.com/overfullstack/sttc-demo/blob/master/demo/src/main/java/ga/overfullstack/pokemon/before/PokemonCollector.java)

You can execute a test without worrying about what statements to mock. Test as if you don't know how it's implemented. Instead, fake the dependencies and assert how the component behavior changes with it.

# Conclusion

It's easy to design right than to depend on invasive tools like PowerMock. Don't let the existing legacy code be an excuse for bad design.

> No one gives you change, you need to bring change

A Bus conductor told the above quote (now read the quote again) — #dadjoke

# My Talks on this
- 🇮🇳 **[Google Cloud Community Days](https://gdg.community.dev/events/details/google-gdg-cloud-hyderabad-presents-cloud-community-days-hyderabad-2022-1/)**, Hyderabad, 2022
- 🇩🇪 **[WeAreDevelopers World Congress](https://www.wearedevelopers.com/world-congress/speakers#:~:text=Gopal%20S%20Akshintala-,Lead,-member%20of%20Technical)**, Berlin, 2022
- 🇮🇳 **[Salesforce](https://www.youtube.com/watch?v=glgI5W2BU5o&list=PLrJbJ9wDl9EC0bG6y9fyDylcfmB_lT_Or&index=1)**, Hyderabad, 2022

`youtube: https://www.youtube.com/watch?v=glgI5W2BU5o&list=PLrJbJ9wDl9EC0bG6y9fyDylcfmB_lT_Or&index=1`

# Resources
- [Anti-Patterns](https://www.digitaltapestry.net/testify/manual/AntiPatterns.html)
- [Explanation of how proxy based Mock Frameworks work](https://blog.rseiler.at/2014/06/explanation-how-proxy-based-mock.html)
- [Write tests. Not too many. Mostly integration](https://kentcdodds.com/blog/write-tests)
- [Testing of Microservices - Spotify Engineering](https://engineering.atspotify.com/2018/01/testing-of-microservices/)
- [On the Diverse And Fantastical Shapes of Testing](https://martinfowler.com/articles/2021-test-shapes.html)
- [Testing in the Twenties](https://www.tbray.org/ongoing/When/202x/2021/05/15/Testing-in-2021)
