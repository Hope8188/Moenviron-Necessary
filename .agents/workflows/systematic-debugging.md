---
description: Systematic Debugging and Root Cause Analysis
---

When invoked to fix a bug, follow these strict analytical steps to ensure we find the true root cause instead of just guessing:

1. **Information Gathering**: Gather all relevant logs, error messages, and context about the bug. Use tools to read the actual terminal output and search the exact error string in the codebase.
2. **Reproduce & Trace**: Mentally (or actually) trace the execution path. Find exactly where the code diverges from expected behavior. Do not jump to conclusions.
3. **Formulate Hypothesis**: State clearly what you believe the root cause is. It must be specific (e.g., "The variable X is null because API Y failed and we didn't check the response code").
4. **Propose the Fix**: Outline the intended fix before writing extensive code. Ensure the fix addresses the root cause, not just the symptom.
5. **Implement & Verify**: Apply the change and verify that the bug is removed and no new issues are introduced.
