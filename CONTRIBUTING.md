# Contributing to astro-aws

Thank you for your interest in contributing to astro-aws! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Code Style](#code-style)
- [Submitting Changes](#submitting-changes)
- [Release Process](#release-process)

## Getting Started

### Prerequisites

- **Node.js**: Version 20.x or 22.x
- **Bun**: Version 1.2.23 (specified in `package.json`)
- **Git**: For version control
- **AWS Account**: For testing infrastructure deployments (optional, but recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone ssh://git@github.com/YOUR_USERNAME/astro-aws.git
   cd astro-aws
   ```
3. Add the upstream repository:
   ```bash
   git remote add upstream ssh://git@github.com/lukeshay/astro-aws.git
   ```

## Development Setup

### Install Dependencies

This project uses Bun as the package manager. Install dependencies:

```bash
bun install
```

### Build the Project

Build all packages:

```bash
bun run build
```

Build a specific package:

```bash
bun run build:one @astro-aws/adapter
```

### Run Development Server

Start development servers:

```bash
bun run dev
```

Start a specific workspace:

```bash
bun run dev:one @astro-aws/examples-base
```

## Project Structure

This is a monorepo managed with Bun workspaces and Turbo:

```
astro-aws/
├── apps/              # Applications
│   ├── docs/         # Documentation site
│   └── infra/        # AWS CDK infrastructure
├── examples/         # Example Astro applications
│   └── base/         # Base example
├── packages/         # Published packages
│   ├── adapter/      # Astro adapter for AWS Lambda
│   └── constructs/   # AWS CDK constructs
└── scripts/          # Build and utility scripts
```

### Key Packages

- **@astro-aws/adapter**: The Astro adapter that handles deployment to AWS Lambda
- **@astro-aws/constructs**: AWS CDK constructs for deploying Astro applications
- **@astro-aws/scripts**: Internal build scripts

## Making Changes

### Creating a Branch

Create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
```

Or for bug fixes:

```bash
git checkout -b fix/your-bug-fix-name
```

### Making Code Changes

1. Make your changes in the appropriate package or workspace
2. Ensure your code follows the project's code style (see [Code Style](#code-style))
3. Add tests if you're adding new functionality
4. Update documentation if needed

### Testing Your Changes

Run tests:

```bash
bun run test
```

Run tests for a specific package:

```bash
bun run test:one @astro-aws/adapter
```

### Formatting Code

Format code using Prettier:

```bash
bun run format
```

## Testing

### Running Tests

Run all tests:

```bash
bun run test
```

Run tests for a specific package:

```bash
bun run test:one @astro-aws/adapter
```

### Testing Infrastructure

To test infrastructure changes, you'll need AWS credentials configured:

```bash
# Set AWS environment variables
export AWS_ACCOUNT=your-account-id
export AWS_REGION=us-east-1
export AWS_PROFILE=your-profile

# Synthesize CDK stack
bun run synth

# Deploy (use with caution)
bun run deploy:one @astro-aws/infra
```

## Code Style

### TypeScript

- Use TypeScript for all code
- Follow the existing code style
- Use meaningful variable and function names
- Add type annotations where helpful

### Formatting

- Code is formatted using Prettier
- Run `bun run format` before committing
- Prettier config: `@lshay/prettier-config`

### Code Organization

- Keep functions and classes focused and single-purpose
- Add comments for complex logic
- Follow existing patterns in the codebase

## Submitting Changes

### Commit Messages

Write clear, descriptive commit messages:

```
feat: add support for streaming SSR responses
fix: resolve CloudFront cache invalidation issue
docs: update getting started guide
```

### Pull Request Process

1. **Update your branch**: Make sure your branch is up to date with `main`:

   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Run checks**: Ensure all tests pass and code is formatted:

   ```bash
   bun run build
   bun run test
   bun run format
   ```

3. **Create Pull Request**:
   - Push your branch to your fork
   - Create a pull request on GitHub
   - Fill out the PR template with:
     - Description of changes
     - Related issues (if any)
     - Testing performed
     - Screenshots (if applicable)

4. **Respond to feedback**: Be responsive to code review comments and make requested changes

### Pull Request Guidelines

- Keep PRs focused and reasonably sized
- Include tests for new features
- Update documentation as needed
- Ensure CI checks pass

## Release Process

This project uses [Changesets](https://github.com/changesets/changesets) for version management.

### Adding a Changeset

When making changes that should be released:

1. Create a changeset:

   ```bash
   bun run changeset
   ```

2. Select the packages affected
3. Choose the type of change (major, minor, patch)
4. Describe your changes

### Release Workflow

The release process is handled by maintainers:

1. **Prepare release**: `bun run release:prepare`
   - Builds all packages
   - Synthesizes CDK stacks
   - Versions packages based on changesets
   - Formats code

2. **Cut release**: `bun run release:cut`
   - Deploys infrastructure
   - Publishes packages
   - Pushes tags

## Additional Resources

- [Documentation](https://www.astro-aws.org/)
- [GitHub Issues](https://github.com/lukeshay/astro-aws/issues)
- [Astro Documentation](https://docs.astro.build/)
- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)

## Questions?

If you have questions or need help, please:

- Open an issue on GitHub
- Check existing issues and discussions
- Review the documentation

Thank you for contributing to astro-aws! 🚀
