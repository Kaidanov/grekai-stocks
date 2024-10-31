import { NextResponse } from 'next/server';

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const SYMBOLS = ['NVDA', 'MSFT', 'TSLA'];

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  investment: number;
  potentialReturn: number;
  historicalData: HistoricalDataPoint[];
}

interface HistoricalDataPoint {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function GET() {
  try {
    const stocksData: StockData[] = [];

    for (const symbol of SYMBOLS) {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error(`API call failed for ${symbol}`);
      }

      const data = await response.json();
      const timeSeries = data['Time Series (Daily)'];
      
      if (!timeSeries) {
        console.error(`No data received for ${symbol}`);
        continue;
      }

      const dates = Object.keys(timeSeries).sort().reverse();
      const historicalData = dates.slice(0, 30).map(date => ({
        date,
        open: parseFloat(timeSeries[date]['1. open']),
        high: parseFloat(timeSeries[date]['2. high']),
        low: parseFloat(timeSeries[date]['3. low']),
        close: parseFloat(timeSeries[date]['4. close']),
        volume: parseInt(timeSeries[date]['5. volume'])
      }));

      const latestData = historicalData[0];
      const previousClose = historicalData[1]?.close || latestData.close;
      const change = ((latestData.close - previousClose) / previousClose) * 100;

      stocksData.push({
        symbol,
        name: getCompanyName(symbol),
        price: latestData.close,
        change: parseFloat(change.toFixed(2)),
        investment: 0,
        potentialReturn: 0,
        historicalData
      });

      // Alpha Vantage has rate limits, add delay between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return NextResponse.json(stocksData);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
  }
}

function getCompanyName(symbol: string): string {
  const companies: Record<string, string> = {
    'NVDA': 'NVIDIA Corporation',
    'MSFT': 'Microsoft Corporation',
    'TSLA': 'Tesla, Inc.'
  };
  return companies[symbol] || symbol;
} 