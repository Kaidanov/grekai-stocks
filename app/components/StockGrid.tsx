'use client';

import React, { useState, useEffect } from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  DetailRow,
  Inject
} from '@syncfusion/ej2-react-grids';
import { 
  ChartComponent, 
  SeriesCollectionDirective, 
  SeriesDirective,
  Inject as ChartInject, 
  DateTime, 
  LineSeries, 
  Legend, 
  Tooltip,
  Crosshair,
  DataLabel
} from '@syncfusion/ej2-react-charts';
import DataSwitch from './DataSwitch';
import styles from './StockGrid.module.css';

const mockData = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 230.10,
    change: -3.57,
    investment: 0.00,
    potentialReturn: 0.00,
    historicalData: [
      { date: new Date('2024-01-01'), price: 225.00 },
      { date: new Date('2024-01-02'), price: 228.50 },
      { date: new Date('2024-01-03'), price: 230.10 },
    ]
  },
];

const realData = [
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 881.45,
    change: 1.23,
    investment: 0.00,
    potentialReturn: 0.00,
    historicalData: [
      { date: '2024-03-01', open: 885.20, high: 890.15, low: 880.30, close: 881.45, volume: 25123456 },
      { date: '2024-02-29', open: 880.50, high: 888.75, low: 878.20, close: 885.20, volume: 23456789 },
      { date: '2024-02-28', open: 875.30, high: 882.45, low: 873.15, close: 880.50, volume: 21234567 },
      // Add more historical data points
    ]
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 425.22,
    change: 0.85,
    investment: 0.00,
    potentialReturn: 0.00,
    historicalData: [
      { date: '2024-03-01', open: 424.50, high: 427.80, low: 423.15, close: 425.22, volume: 18765432 },
      { date: '2024-02-29', open: 422.30, high: 425.45, low: 421.20, close: 424.50, volume: 17654321 },
      { date: '2024-02-28', open: 420.15, high: 423.80, low: 419.30, close: 422.30, volume: 16543210 },
      // Add more historical data points
    ]
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 175.35,
    change: -2.15,
    investment: 0.00,
    potentialReturn: 0.00,
    historicalData: [
      { date: '2024-03-01', open: 178.50, high: 179.25, low: 174.80, close: 175.35, volume: 45678901 },
      { date: '2024-02-29', open: 180.20, high: 181.45, low: 177.90, close: 178.50, volume: 43210987 },
      { date: '2024-02-28', open: 182.35, high: 183.60, low: 179.75, close: 180.20, volume: 41098765 },
      // Add more historical data points
    ]
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 168.82,
    change: 0.45,
    investment: 0.00,
    potentialReturn: 0.00,
    historicalData: [
      { date: new Date('2024-01-01'), price: 167.50 },
      { date: new Date('2024-01-02'), price: 168.25 },
      { date: new Date('2024-01-03'), price: 168.82 },
    ]
  }
];

const StockGrid: React.FC = () => {
  const [isRealData, setIsRealData] = useState(true);
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isRealData) {
      fetchRealData();
    }
  }, []);

  useEffect(() => {
    const handleDataSourceChange = (e: CustomEvent) => {
      if (e.detail.isRealData) {
        fetchRealData();
      } else {
        setData(mockData);
      }
      setIsRealData(e.detail.isRealData);
    };

    window.addEventListener('dataSourceChange', handleDataSourceChange as EventListener);
    return () => {
      window.removeEventListener('dataSourceChange', handleDataSourceChange as EventListener);
    };
  }, []);

  const fetchRealData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/stocks');
      
      if (!response.ok) {
        throw new Error('Failed to fetch stock data');
      }

      const stocksData = await response.json();
      
      if (stocksData.error) {
        throw new Error(stocksData.error);
      }

      setData(stocksData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Error fetching real data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDataSource = async () => {
    if (isRealData) {
      setData(mockData);
    } else {
      await fetchRealData();
    }
    setIsRealData(!isRealData);
  };

  const tooltipRender = (args: any) => {
    if (args.series.dataSource) {
      const data = args.series.dataSource[args.pointIndex];
      const date = new Date(data.date).toLocaleDateString();
      const formattedVolume = new Intl.NumberFormat().format(data.volume);
      
      args.text = `
        <div class="tooltip-container">
          <div class="tooltip-title">${args.series.name}</div>
          <div class="tooltip-date">Date: ${date}</div>
          <div class="tooltip-data">
            <div>Open: $${data.open.toFixed(2)}</div>
            <div>High: $${data.high.toFixed(2)}</div>
            <div>Low: $${data.low.toFixed(2)}</div>
            <div>Close: $${data.close.toFixed(2)}</div>
            <div>Volume: ${formattedVolume}</div>
          </div>
        </div>
      `;
    }
  };

  const detailTemplate = (props: any) => {
    return (
      <div className={styles.detailContainer}>
        <div className={styles.historicalData}>
          <h4>Historical Data - {props.symbol}</h4>
          <ChartComponent
            id={`chart-${props.symbol}`}
            primaryXAxis={{
              valueType: 'DateTime',
              labelFormat: 'MMM dd',
              majorGridLines: { width: 0 },
              crosshairTooltip: { enable: true }
            }}
            primaryYAxis={{
              title: 'Price ($)',
              labelFormat: '${value}',
              majorGridLines: { width: 1 },
              crosshairTooltip: { enable: true }
            }}
            tooltip={{ 
              enable: true,
              shared: true
            }}
            crosshair={{
              enable: true,
              lineType: 'Vertical',
              line: { width: 1, color: '#666666' }
            }}
            width="100%"
            height="300px"
            tooltipRender={tooltipRender}
            chartArea={{ border: { width: 0 } }}
          >
            <ChartInject services={[DateTime, LineSeries, Legend, Tooltip, Crosshair, DataLabel]} />
            <SeriesCollectionDirective>
              <SeriesDirective
                dataSource={props.historicalData}
                xName='date'
                yName='close'
                name={props.symbol}
                type='Line'
                width={2}
                marker={{
                  visible: true,
                  width: 7,
                  height: 7,
                  shape: 'Circle',
                  fill: '#ffffff',
                  border: { width: 2 }
                }}
              />
            </SeriesCollectionDirective>
          </ChartComponent>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.gridContainer}>
      <DataSwitch isRealData={isRealData} onToggle={toggleDataSource} />
      
      {isLoading && (
        <div className={styles.loading}>
          Loading real-time market data...
        </div>
      )}
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      
      {!isLoading && !error && (
        <GridComponent 
          dataSource={data}
          detailTemplate={detailTemplate}
          childGrid={{
            columns: [
              { field: 'date', headerText: 'Date', type: 'date', format: 'MMM dd, yyyy' },
              { field: 'open', headerText: 'Open' },
              { field: 'high', headerText: 'High' },
              { field: 'low', headerText: 'Low' },
              { field: 'close', headerText: 'Close' },
              { field: 'volume', headerText: 'Volume' }
            ]
          }}
        >
          <ColumnsDirective>
            <ColumnDirective field='symbol' headerText='Symbol' width='100' />
            <ColumnDirective field='name' headerText='Name' width='150' />
            <ColumnDirective field='price' headerText='Price' width='100' format='C2' />
            <ColumnDirective field='change' headerText='Change %' width='100' format='N2' />
            <ColumnDirective field='investment' headerText='Investment ($)' width='130' format='C2' />
            <ColumnDirective field='potentialReturn' headerText='Potential Return ($)' width='150' format='C2' />
          </ColumnsDirective>
          <Inject services={[DetailRow]} />
        </GridComponent>
      )}
    </div>
  );
};

export default StockGrid;