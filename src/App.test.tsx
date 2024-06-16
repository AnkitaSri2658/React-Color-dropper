import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders color text', () => {
  render(<App />);
  const linkElement = screen.getByText(/color/i);
  expect(linkElement).toBeInTheDocument();
});
