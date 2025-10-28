# Contributing to Football Analysis System

Thank you for your interest in contributing to the Football Analysis System! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- Git
- Basic knowledge of React and Python

### Development Setup
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/newsystem.git`
3. Install dependencies:
   ```bash
   # Frontend
   cd football-app
   npm install
   
   # Backend
   cd ../football_api
   pip install -r requirements.txt
   ```

## How to Contribute

### 1. Reporting Issues
- Use the GitHub issue tracker
- Provide detailed description of the problem
- Include steps to reproduce
- Add screenshots if applicable

### 2. Suggesting Features
- Create a new issue with the "enhancement" label
- Describe the feature and its benefits
- Provide mockups or examples if possible

### 3. Code Contributions

#### Frontend (React)
- Follow React best practices
- Use TypeScript for type safety
- Maintain consistent code style
- Add proper error handling
- Write meaningful commit messages

#### Backend (Python/FastAPI)
- Follow PEP 8 style guidelines
- Add proper type hints
- Include docstrings for functions
- Write unit tests for new features
- Use async/await patterns

### 4. Pull Request Process
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test your changes thoroughly
4. Commit with descriptive messages
5. Push to your fork
6. Create a pull request

## Code Style Guidelines

### Frontend
- Use functional components with hooks
- Prefer composition over inheritance
- Use meaningful variable and function names
- Add comments for complex logic
- Follow the existing file structure

### Backend
- Use async/await for asynchronous operations
- Add proper error handling
- Use Pydantic models for data validation
- Follow RESTful API conventions
- Add comprehensive docstrings

## Testing

### Frontend Testing
```bash
cd football-app
npm test
```

### Backend Testing
```bash
cd football_api
pytest
```

## Documentation

- Update README.md for new features
- Add JSDoc comments for functions
- Update API documentation
- Include examples in code comments

## Commit Message Format

Use conventional commits:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

Examples:
```
feat: add player substitution tracking
fix: resolve lineup position dropdown issue
docs: update deployment guide
```

## Review Process

1. All pull requests require review
2. Address feedback promptly
3. Ensure all tests pass
4. Update documentation as needed
5. Maintain backward compatibility

## Community Guidelines

- Be respectful and inclusive
- Help others learn and grow
- Provide constructive feedback
- Follow the code of conduct
- Celebrate others' contributions

## Getting Help

- Check existing issues and discussions
- Join our community discussions
- Ask questions in GitHub discussions
- Contact maintainers for urgent issues

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to the Football Analysis System! 🎉⚽
