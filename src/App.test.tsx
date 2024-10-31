import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders navigation links', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  expect(screen.getByText(/home/i)).toBeInTheDocument();
  expect(screen.getByText(/about/i)).toBeInTheDocument();
  expect(screen.getByText(/contact/i)).toBeInTheDocument();
});
