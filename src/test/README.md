# Test Suite for GitHub Copilot Metrics Dashboard

This folder contains comprehensive unit tests for the Admin functionality using Vitest and React Testing Library.

## 📋 Test Structure

```
src/test/
├── setup.ts                # Test setup and global mocks
├── Admin.test.tsx          # Admin component tests
├── apiConfig.test.ts       # API configuration module tests
└── githubApi.test.ts       # GitHub API service tests
```

## 🚀 Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test
```

### Run tests once (CI mode)
```bash
npm run test:run
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests with coverage report
```bash
npm run test:coverage
```

## 🧪 Test Coverage

### Admin Component (`Admin.test.tsx`)
Tests cover:
- ✅ Component rendering
- ✅ Configuration loading from localStorage
- ✅ Form input handling
- ✅ Enterprise metrics download
- ✅ Enterprise seats download
- ✅ 28-day report download
- ✅ User 28-day report download
- ✅ Organization metrics download
- ✅ Organization seats download
- ✅ Clear data functionality
- ✅ File upload handling
- ✅ Validation error display
- ✅ Loading states
- ✅ Demo mode indicator

**Total Tests:** 30+

### API Configuration (`apiConfig.test.ts`)
Tests cover:
- ✅ Loading configuration from localStorage
- ✅ Saving configuration (excluding token)
- ✅ Configuration validation
- ✅ Token format validation (ghp_ and gho_ prefixes)
- ✅ Date format validation
- ✅ Date range validation
- ✅ Error handling for corrupted data

**Total Tests:** 20+

### GitHub API Service (`githubApi.test.ts`)
Tests cover:
- ✅ Fetching enterprise metrics
- ✅ Fetching organization metrics
- ✅ Download and save functionality
- ✅ Clear localStorage
- ✅ Get data statistics
- ✅ Get last saved timestamp
- ✅ 28-day report download
- ✅ User 28-day report download
- ✅ HTTP error handling (401, 403, 404)
- ✅ Network error handling

**Total Tests:** 25+

## 🎯 What's Being Tested

### 1. **Component Behavior**
- Proper rendering of UI elements
- User interactions (button clicks, form inputs)
- State management and updates
- Conditional rendering based on data

### 2. **API Integration**
- Correct API endpoints are called
- Proper headers and authentication
- Error handling for various HTTP status codes
- Data transformation and storage

### 3. **Data Management**
- localStorage read/write operations
- Data validation
- File upload processing
- Data statistics calculation

### 4. **Configuration**
- Loading and saving configuration
- Validation rules
- Token security (not saving to localStorage)

## 🔧 Test Setup

### Global Mocks
The `setup.ts` file provides:
- **localStorage mock** - In-memory storage for tests
- **window.matchMedia mock** - For responsive design tests
- **window.confirm mock** - Auto-confirms dialogs
- **Cleanup** - Automatic cleanup after each test

### Service Mocks
Tests mock external dependencies:
- `githubApiService` - Mocked to avoid real API calls
- `apiConfig` functions - Mocked for predictable behavior
- `fetch` - Mocked for HTTP request testing

## 📊 Coverage Goals

Target coverage: **80%+** for all modules

Current coverage areas:
- ✅ Admin component logic
- ✅ API configuration
- ✅ GitHub API service
- ⚠️ UI components (to be added)
- ⚠️ Data transformation utilities (to be added)

## 🛠️ Writing New Tests

### Example Test Structure

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import MyComponent from '../pages/MyComponent'

describe('MyComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('should render correctly', () => {
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    )
    
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interaction', async () => {
    render(
      <BrowserRouter>
        <MyComponent />
      </BrowserRouter>
    )
    
    const button = screen.getByRole('button', { name: /click me/i })
    fireEvent.click(button)
    
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument()
    })
  })
})
```

## 📚 Testing Best Practices

1. **Arrange-Act-Assert Pattern**
   - Arrange: Set up test data and mocks
   - Act: Execute the code being tested
   - Assert: Verify the results

2. **Test Isolation**
   - Each test should be independent
   - Use `beforeEach` to reset state
   - Clear mocks between tests

3. **Meaningful Test Names**
   - Use descriptive names: "should do X when Y"
   - Group related tests with `describe`

4. **Mock External Dependencies**
   - Don't make real API calls
   - Mock localStorage, fetch, etc.
   - Focus on testing your code, not external services

5. **Test User Behavior**
   - Test what users see and do
   - Avoid testing implementation details
   - Use accessible queries (getByRole, getByLabelText)

## 🐛 Debugging Tests

### View test results in UI
```bash
npm run test:ui
```

### Enable console logs
Tests automatically show console.log output. Use it for debugging:

```typescript
it('should debug issue', () => {
  console.log('Debug info:', someValue)
  expect(someValue).toBe(expected)
})
```

### Use VSCode Debugging
1. Set breakpoint in test file
2. Click "Debug Test" in VSCode test explorer
3. Step through code execution

## 📖 Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## 🚧 Future Enhancements

- [ ] Add component tests for charts (LineChart, BarChart, PieChart)
- [ ] Add tests for custom hooks
- [ ] Add E2E tests with Playwright
- [ ] Increase coverage to 90%+
- [ ] Add visual regression tests
- [ ] Add performance benchmarks
