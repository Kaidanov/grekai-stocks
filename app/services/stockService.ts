const ALPHA_VANTAGE_API_KEY = 'MMPJVL692J2B7IO1';

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  details: StockDetails[];
}

interface StockDetails {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export async function getStockData(): Promise<StockData[]> {
  const symbols = ['AAPL', 'GOOGL', 'MSFT', 'AMZN'];
  const stocksData: StockData[] = [];

  try {
    for (const symbol of symbols) {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      const data = await response.json();
      
      if (data['Time Series (Daily)']) {
        const timeSeriesData = data['Time Series (Daily)'];
        const dates = Object.keys(timeSeriesData).slice(0, 5); // Get last 5 days
        
        const details: StockDetails[] = dates.map(date => ({
          date,
          open: parseFloat(timeSeriesData[date]['1. open']),
          high: parseFloat(timeSeriesData[date]['2. high']),
          low: parseFloat(timeSeriesData[date]['3. low']),
          close: parseFloat(timeSeriesData[date]['4. close']),
          volume: parseFloat(timeSeriesData[date]['5. volume'])
        }));

        stocksData.push({
          symbol,
          name: getCompanyName(symbol),
          price: details[0].close,
          change: ((details[0].close - details[1].close) / details[1].close) * 100,
          details
        });
      }
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
  }

  return stocksData;
}

function getCompanyName(symbol: string): string {
  const companies: { [key: string]: string } = {
    'AAPL': 'Apple Inc.',
    'GOOGL': 'Alphabet Inc.',
    'MSFT': 'Microsoft Corporation',
    'AMZN': 'Amazon.com Inc.'
  };
  return companies[symbol] || symbol;
} 