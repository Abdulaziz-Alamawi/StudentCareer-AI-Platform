# Contributing to StudentCareer AI Platform

Thank you for your interest in contributing! This guide explains how to set up
your environment and submit high-quality contributions.

## Code of Conduct
Be respectful and constructive. Harassment of any kind is not tolerated.

## Getting Started
1. Fork the repository and clone your fork.
2. Create a feature branch: `git checkout -b feat/your-feature`.
3. Follow the [Installation Guide](./README.md#-installation-guide).

## Branch & Commit Conventions
We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     a new feature
fix:      a bug fix
docs:     documentation only
refactor: code change that neither fixes a bug nor adds a feature
test:     adding or fixing tests
chore:    tooling / build / deps
```

Example: `feat(analyzer): add formatting-quality sub-score`

## Code Style
- **Python:** format with `black`, lint with `ruff`, type-check with `mypy`.
- **TypeScript:** format with `prettier`, lint with `eslint`.
- Keep functions small and the service layer free of framework details.

## Testing
- Add/update tests for any new behavior.
- Run `pytest -v` in `backend/` before opening a PR.
- All tests and the CI pipeline must pass.

## Pull Requests
1. Keep PRs focused and reasonably small.
2. Describe **what** changed and **why**.
3. Link related issues.
4. Ensure CI is green and request a review.

## Reporting Bugs
Open an issue with: expected behavior, actual behavior, steps to reproduce,
environment, and logs/screenshots where helpful.
