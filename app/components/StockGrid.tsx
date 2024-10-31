'use client';

import React from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Inject,
  DetailRow,
  Sort,
  Filter,
  Page,
  Edit
} from '@syncfusion/ej2-react-grids';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const ALPHA_VANTAGE_API_KEY = 'MMPJVL692J2B7IO1';

// Mock data
const mockData = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 150.25,
    change: 2.5,
    investmentAmount: 0,
    potentialReturn: 0,
    details: [
      {
        timestamp: '2024-01-01 10:00:00',
        open: 149.00,
        high: 151.00,
        low: 148.50,
        close: 150.25,
        volume: 1000000
      },
      {
        timestamp: '2024-01-01 11:00:00',
        open: 150.25,
        high: 152.00,
        low: 149.75,
        close: 151.50,
        volume: 900000
      }
    ]
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 320.45,
    change: -1.2,
    investmentAmount: 0,
    potentialReturn: 0,
    details: [
      {
        timestamp: '2024-01-01 10:00:00',
        open: 321.00,
        high: 322.50,
        low: 319.75,
        close: 320.45,
        volume: 800000
      },
      {
        timestamp: '2024-01-01 11:00:00',
        open: 320.45,
        high: 321.75,
        low: 319.00,
        close: 320.00,
        volume: 750000
      }
    ]
  }
];

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  investmentAmount?: number;
  potentialReturn?: number;
  details: StockDetail[];
}

interface StockDetail {
  timestamp: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const StockGrid: React.FC = () => {
  const [stockData, setStockData] = React.useState<StockData[]>(mockData);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [useMockData, setUseMockData] = React.useState(true);

  const fetchHistoricalData = async (symbol: string) => {
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      const timeSeries = data['Time Series (60min)'];
      
      return Object.entries(timeSeries).map(([timestamp, values]: [string, any]) => ({
        timestamp,
        open: parseFloat(values['1. open']),
        high: parseFloat(values['2. high']),
        low: parseFloat(values['3. low']),
        close: parseFloat(values['4. close']),
        volume: parseFloat(values['5. volume'])
      }));
    } catch (error) {
      console.error(`Error fetching historical data for ${symbol}:`, error);
      return [];
    }
  };

  const fetchRealData = async (symbol: string) => {
    try {
      const [quoteData, details] = await Promise.all([
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`),
        fetchHistoricalData(symbol)
      ]);
      
      if (!quoteData.ok) throw new Error(`HTTP error! status: ${quoteData.status}`);
      
      const data = await quoteData.json();
      return {
        symbol: data['Global Quote']['01. symbol'],
        name: symbol,
        price: parseFloat(data['Global Quote']['05. price']),
        change: parseFloat(data['Global Quote']['09. change']),
        details
      };
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return null;
    }
  };

  const loadData = async (useRealData: boolean) => {
    setIsLoading(true);
    setError(null);

    if (useRealData) {
      try {
        const symbols = ['AAPL', 'MSFT', 'GOOGL'];
        const stockPromises = symbols.map(symbol => fetchRealData(symbol));
        const results = await Promise.all(stockPromises);
        const validResults = results.filter(result => result !== null);
        setStockData(validResults);
      } catch (error) {
        console.error('Error fetching real stock data:', error);
        setError('Failed to fetch real stock data');
        setStockData(mockData);
      }
    } else {
      setStockData(mockData);
    }
    
    setIsLoading(false);
  };

  // Initial load
  React.useEffect(() => {
    loadData(!useMockData);
  }, [useMockData]);

  // Add this effect to calculate potential returns when investment amount changes
  React.useEffect(() => {
    const updatedStocks = stockData.map(stock => ({
      ...stock,
      potentialReturn: stock.investmentAmount 
        ? (stock.investmentAmount * (1 + stock.change / 100)) - stock.investmentAmount
        : 0
    }));
    setStockData(updatedStocks);
  }, [stockData.map(stock => stock.investmentAmount).join(',')]); // Dependency on investment amounts

  const detailTemplate = (props: any) => {
    const data = props.details || [];
    return (
      <div style={{ padding: '20px', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp"
              tickFormatter={(timestamp) => new Date(timestamp).toLocaleDateString()}
            />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip
              labelFormatter={(label) => new Date(label).toLocaleString()}
              formatter={(value) => [`$${value}`, 'Price']}
            />
            <Area 
              type="monotone" 
              dataKey="close" 
              stroke="#8884d8" 
              fill="#8884d8" 
              fillOpacity={0.3} 
            />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ marginTop: '20px' }}>
          <h3>Historical Data</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Open</th>
                <th>High</th>
                <th>Low</th>
                <th>Close</th>
                <th>Volume</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item: StockDetail, index: number) => (
                <tr key={index}>
                  <td>{new Date(item.timestamp).toLocaleString()}</td>
                  <td>${item.open.toFixed(2)}</td>
                  <td>${item.high.toFixed(2)}</td>
                  <td>${item.low.toFixed(2)}</td>
                  <td>${item.close.toFixed(2)}</td>
                  <td>{item.volume.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const childGrid = {
    queryString: 'details',
    detailTemplate: detailTemplate,
    columns: [
      { field: 'timestamp', headerText: 'Time', width: 180 },
      { field: 'open', headerText: 'Open', width: 100, format: 'N2' },
      { field: 'high', headerText: 'High', width: 100, format: 'N2' },
      { field: 'low', headerText: 'Low', width: 100, format: 'N2' },
      { field: 'close', headerText: 'Close', width: 100, format: 'N2' },
      { field: 'volume', headerText: 'Volume', width: 100 }
    ]
  };

  const handleActionComplete = (args: any) => {
    if (args.requestType === 'save') {
      const updatedStocks = stockData.map(stock => {
        if (stock.symbol === args.data.symbol) {
          const potentialReturn = args.data.investmentAmount 
            ? (args.data.investmentAmount * (1 + stock.change / 100)) - args.data.investmentAmount
            : 0;
          return {
            ...stock,
            investmentAmount: args.data.investmentAmount,
            potentialReturn
          };
        }
        return stock;
      });
      setStockData(updatedStocks);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="stock-grid-container">
      <div className="controls" style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => setUseMockData(!useMockData)}
          style={{ 
            padding: '0.5rem 1rem',
            marginRight: '1rem'
          }}
        >
          {useMockData ? 'Switch to Real Data' : 'Switch to Mock Data'}
        </button>
        <span>Using: {useMockData ? 'Mock Data' : 'Real Data'}</span>
      </div>

      <h2>Stock Market Data</h2>
      <GridComponent 
        dataSource={stockData}
        childGrid={childGrid}
        allowPaging={true}
        allowSorting={true}
        allowFiltering={true}
        hierarchyPrintMode="Expanded"
        editSettings={{ 
          allowEditing: true,
          mode: 'Normal'
        }}
        actionComplete={handleActionComplete}
        detailTemplate={detailTemplate}
      >
        <ColumnsDirective>
          <ColumnDirective field='symbol' headerText='Symbol' width='100' />
          <ColumnDirective field='name' headerText='Name' width='150' />
          <ColumnDirective field='price' headerText='Price' width='100' format='N2' />
          <ColumnDirective field='change' headerText='Change %' width='100' format='N2' />
          <ColumnDirective 
            field='investmentAmount' 
            headerText='Investment ($)' 
            width='120' 
            format='N2'
            editType='numericedit'
            edit={{
              params: {
                decimals: 2,
                min: 0
              }
            }}
          />
          <ColumnDirective 
            field='potentialReturn' 
            headerText='Potential Return ($)' 
            width='150' 
            format='N2'
            template={(props: any) => {
              const value = props.potentialReturn || 0;
              return (
                <div style={{ 
                  color: value >= 0 ? 'green' : 'red',
                  fontWeight: 'bold'
                }}>
                  {value >= 0 ? '+' : ''}{value.toFixed(2)}
                </div>
              );
            }}
          />
        </ColumnsDirective>
        <Inject services={[DetailRow, Sort, Filter, Page, Edit]} />
      </GridComponent>
    </div>
  );
};

export default StockGrid;