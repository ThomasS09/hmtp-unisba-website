import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../ErrorBoundary';

// Mock components
const ThrashingComponent = () => {
  throw new Error('Component error');
};

const SafeComponent = () => <div data-testid="safe">Safe Content</div>;

describe('ErrorBoundary', () => {
  it('renders children without error', () => {
    const { container } = render(
      <ErrorBoundary fallback={<div>Error Fallback</div>}>
        <SafeComponent />
      </ErrorBoundary>
    );
    expect(container.querySelector('[data-testid="safe"]')).toBeInTheDocument();
  });

  it('shows fallback when component throws error', () => {
    const { container } = render(
      <ErrorBoundary fallback={<div data-testid="fallback">Error Occurred</div>}>
        <ThrashingComponent />
      </ErrorBoundary>
    );
    expect(container.querySelector('[data-testid="fallback"]')).toBeInTheDocument();
  });
});
