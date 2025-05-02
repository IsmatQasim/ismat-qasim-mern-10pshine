import { render, screen } from '@testing-library/react';
import Layout from '../components/Layout';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom'

describe('Layout Component', () => {
  it('renders children inside layout', () => {
    render(
      <Layout>
        <p>Test content</p>
      </Layout>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });
});
