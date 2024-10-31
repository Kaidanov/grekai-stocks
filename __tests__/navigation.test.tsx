import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../app/layout';

describe('Navigation', () => {
  it('renders navigation links', () => {
    render(<RootLayout children={<div />} />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });
}); 