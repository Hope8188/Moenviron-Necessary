---
description: Test-Driven Development (TDD) Enforcer
---

When invoked to implement a feature or module using TDD, follow this strict cycle:

1. **Understand Requirements**: Ensure clarity on exactly what the component needs to do.
2. **Write the Tests FIRST**: Create unit and/or integration tests defining the expected behavior. Do not write any implementation code yet.
3. **Run the Tests (Red)**: Execute the tests. They MUST fail (since the implementation does not exist).
4. **Write the Minimum Code (Green)**: Write only enough implementation code to make the tests pass. Do not add extra features.
5. **Run the Tests Again**: Verify that all tests now pass successfully.
6. **Refactor (Refactor)**: Clean up the implementation code, ensure good architecture, and run tests a final time to guarantee nothing broke.
