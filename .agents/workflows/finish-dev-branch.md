---
description: Finish Development Branch & Cleanup
---

When explicitly invoked to finalize a branch or feature, run through this automated checklist:

1. **Code Audit**: Do a quick scan of the recently modified files to ensure there are no leftover `console.log()` statements, `TODO`s, or debug artifacts. 
2. **Type Checking**: Run any configured TypeScript or linting checks to ensure code quality is maintained.
3. **Test Status**: Ensure all tests are passing.
4. **Git Status**: 
   - Check `git status`
   - Stage appropriate files
   - Propose a clean, descriptive `git commit` message based on the recent diffs.
5. **Push**: Optionally, push to the remote branch and prepare a summary for a Pull Request.
