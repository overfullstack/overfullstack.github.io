# Unit Testing Cheat Sheet for Codebase

## Testing Libraries and Frameworks
- Jest (assumed, as PowerMock is mentioned which is often used with Jest)
- PowerMock (for invasive mocking, discouraged in the article)

## Mocking and Stubbing
1. Avoid using PowerMock for invasive mocking
2. Prefer dependency injection through constructors for easier mocking
3. Use Ports & Adapters pattern to isolate dependencies
4. Mock dependencies, not statements
5. Avoid `when-then` statements in tests

Example of bad mocking (to avoid):
```java
Whitebox.setInternalState(...);
when(...).then(...);
doNothing().when(...);
```

## Fake Implementations
- Use fake adapters for testing instead of real implementations
- Implement interfaces (ports) with test-specific adapters

## Testing Strategies
1. Black-box Unit Testing
   - Test component behavior without knowing internals
   - Focus on inputs and outputs, not implementation details

2. Behavior-driven Testing
   - Emphasize behavior coverage over statement coverage

3. Ports & Adapters Architecture
   - Use interfaces (ports) to define dependencies
   - Implement adapters for production and test environments

Example:
```java
public interface PokemonRepository {
    List<Pokemon> findAll();
}

public class FakePokemonRepository implements PokemonRepository {
    @Override
    public List<Pokemon> findAll() {
        // Return test data
    }
}
```

## Best Practices
1. Avoid void methods in tested components
2. Avoid static methods that mutate state or have side effects
3. Always inject dependencies through the constructor
4. Design components with testability in mind
5. Use Ports & Adapters to interact with legacy code indirectly
6. Focus on behavior documentation in tests
7. Treat unit tests as the first client of your component

## Anti-patterns to Avoid
1. Using PowerMock or similar invasive tools
2. Tightly coupling tests to implementation details
3. Breaking encapsulation in tests
4. Mocking internal state or private methods
5. Focusing on statement coverage instead of behavior coverage

## Testing Legacy Code
1. Introduce a level of indirection using Ports & Adapters
2. Create interfaces for legacy dependencies
3. Implement fake adapters for testing
4. Inject fake adapters during tests

## Code Structure for Testability
1. Separate domain logic from side effects
2. Use dependency injection
3. Create interfaces for external dependencies
4. Implement adapters for different environments (prod, test)

Example of a testable component structure:
```java
public class PokemonCollector {
    private final PokemonRepository repository;
    private final PokemonValidator validator;

    public PokemonCollector(PokemonRepository repository, PokemonValidator validator) {
        this.repository = repository;
        this.validator = validator;
    }

    public List<Pokemon> collectValidPokemon() {
        return repository.findAll().stream()
            .filter(validator::isValid)
            .collect(Collectors.toList());
    }
}
```