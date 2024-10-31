import { NextResponse } from 'next/server';

export async function GET() {
  // Your actual API logic here
  const stocks = [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 150.25,
      change: 2.5,
      details: [
        {
          date: '2024-01-01',
          open: 149.00,
          high: 151.00,
          low: 148.50,
          close: 150.25,
          volume: 1000000
        }
      ]
    }
  ];

  return NextResponse.json(stocks);
} 