"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  dayHigh: number;
  dayLow: number;
}

interface ChartData {
  time: string;
  nifty50: number;
  sensex: number;
  bankNifty: number;
}

export function IndianStockMarket() {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [individualStockData, setIndividualStockData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [dataSource, setDataSource] = useState<string>('fallback');
  const [apiStatus, setApiStatus] = useState<string>('limited');

  // Generate realistic mock data for Indian stocks
  const generateStockData = (): StockData[] => {
    return [
      {
        symbol: "RELIANCE",
        name: "Reliance Industries",
        price: 2456.78 + (Math.random() - 0.5) * 50,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 2,
        volume: "12.5M",
        marketCap: "16.5L Cr",
        dayHigh: 2480,
        dayLow: 2420
      },
      {
        symbol: "TCS",
        name: "Tata Consultancy Services",
        price: 3567.89 + (Math.random() - 0.5) * 80,
        change: (Math.random() - 0.5) * 30,
        changePercent: (Math.random() - 0.5) * 2.5,
        volume: "8.3M",
        marketCap: "13.2L Cr",
        dayHigh: 3600,
        dayLow: 3520
      },
      {
        symbol: "HDFCBANK",
        name: "HDFC Bank",
        price: 1678.45 + (Math.random() - 0.5) * 40,
        change: (Math.random() - 0.5) * 25,
        changePercent: (Math.random() - 0.5) * 1.8,
        volume: "15.7M",
        marketCap: "11.8L Cr",
        dayHigh: 1700,
        dayLow: 1650
      },
      {
        symbol: "INFY",
        name: "Infosys",
        price: 1456.32 + (Math.random() - 0.5) * 35,
        change: (Math.random() - 0.5) * 18,
        changePercent: (Math.random() - 0.5) * 1.5,
        volume: "9.2M",
        marketCap: "6.1L Cr",
        dayHigh: 1480,
        dayLow: 1430
      },
      {
        symbol: "ICICIBANK",
        name: "ICICI Bank",
        price: 987.65 + (Math.random() - 0.5) * 25,
        change: (Math.random() - 0.5) * 15,
        changePercent: (Math.random() - 0.5) * 1.6,
        volume: "18.4M",
        marketCap: "6.8L Cr",
        dayHigh: 1000,
        dayLow: 970
      },
      {
        symbol: "HINDUNILVR",
        name: "Hindustan Unilever",
        price: 2567.89 + (Math.random() - 0.5) * 45,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 1.2,
        volume: "5.6M",
        marketCap: "5.9L Cr",
        dayHigh: 2600,
        dayLow: 2530
      }
    ];
  };

  // Generate chart data for indices
  const generateChartData = (): ChartData[] => {
    const data: ChartData[] = [];
    const now = new Date();
    const baseNifty = 19800;
    const baseSensex = 66500;
    const baseBankNifty = 44500;

    for (let i = 30; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60000); // 5-minute intervals
      const randomFactor = Math.sin(i * 0.3) * 0.01 + (Math.random() - 0.5) * 0.005;
      
      data.push({
        time: time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        nifty50: baseNifty * (1 + randomFactor),
        sensex: baseSensex * (1 + randomFactor * 0.8),
        bankNifty: baseBankNifty * (1 + randomFactor * 1.2)
      });
    }
    
    return data;
  };

  useEffect(() => {
    fetchStockData();
    fetchChartData();

    // Update data every 30 seconds for real-time updates
    const interval = setInterval(() => {
      fetchStockData();
      fetchChartData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStockData = async () => {
    try {
      const response = await fetch('/api/stocks');
      const data = await response.json();
      
      if (data.success && data.data) {
        setStockData(data.data);
        setLastUpdated(new Date());
        setDataSource(data.source || 'unknown');
        setApiStatus(data.apiStatus || 'unknown');
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      // Fallback to demo data if API fails
      setStockData(generateStockData());
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChartData = async () => {
    try {
      const response = await fetch('/api/stocks?type=historical');
      const data = await response.json();
      
      if (data.success && data.data) {
        setChartData(data.data);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Fallback to demo data if API fails
      setChartData(generateChartData());
    }
  };

  // Generate individual stock historical data
  const generateIndividualStockData = (stock: StockData): any[] => {
    const data = [];
    const now = new Date();
    const basePrice = stock.price;

    for (let i = 30; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60000); // 5-minute intervals
      const randomFactor = Math.sin(i * 0.3) * 0.02 + (Math.random() - 0.5) * 0.01;
      const price = basePrice * (1 + randomFactor);
      
      data.push({
        time: time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        price: price,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    
    return data;
  };

  // Handle stock click
  const handleStockClick = (stock: StockData) => {
    setSelectedStock(stock);
    setIndividualStockData(generateIndividualStockData(stock));
  };

  // Reset to market view
  const handleBackToMarket = () => {
    setSelectedStock(null);
    setIndividualStockData([]);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const formatMarketCap = (cap: string) => {
    return cap.replace('L Cr', 'Lakh Cr');
  };

  const getChangeColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Indian Stock Market</CardTitle>
          <CardDescription>Loading market data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Market Indices Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {selectedStock ? `${selectedStock.symbol} - ${selectedStock.name}` : 'Indian Market Indices'}
              </CardTitle>
              <CardDescription>
                {selectedStock 
                  ? `Real-time price performance for ${selectedStock.symbol}`
                  : 'Real-time NIFTY 50, SENSEX, and BANK NIFTY performance'
                }
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {selectedStock && (
                <Button variant="outline" size="sm" onClick={handleBackToMarket}>
                  ← Back to Market
                </Button>
              )}
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  dataSource === 'alpha_vantage' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-yellow-50 text-yellow-700'
                }`}
              >
                {dataSource === 'alpha_vantage' ? 'Real Data' : 'Demo Data'}
              </Badge>
              {apiStatus === 'limited' && (
                <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                  API Limited
                </Badge>
              )}
              <span className="text-xs text-gray-500">
                {lastUpdated.toLocaleTimeString('en-IN')}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            {selectedStock ? (
              <AreaChart data={individualStockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 50', 'dataMax + 50']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: string) => {
                    const formattedValue = typeof value === 'number' 
                      ? `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
                      : value;
                    return [formattedValue, name === 'price' ? 'Price' : 'Volume'];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="Price"
                />
              </AreaChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  domain={['dataMin - 100', 'dataMax + 100']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: string) => {
                    const formattedValue = typeof value === 'number' 
                      ? value.toLocaleString('en-IN', { maximumFractionDigits: 2 })
                      : value;
                    return [formattedValue, name];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="nifty50"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="NIFTY 50"
                />
                <Area
                  type="monotone"
                  dataKey="sensex"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="SENSEX"
                />
                <Area
                  type="monotone"
                  dataKey="bankNifty"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  name="BANK NIFTY"
                />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Indian Stocks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Top Indian Stocks
          </CardTitle>
          <CardDescription>
            Real-time prices and movements for major Indian companies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stockData.map((stock) => (
              <div
                key={stock.symbol}
                className={`flex items-center justify-between p-4 border rounded-lg transition-colors cursor-pointer ${
                  selectedStock?.symbol === stock.symbol 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleStockClick(stock)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {selectedStock?.symbol === stock.symbol && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}
                    <h4 className="font-semibold">{stock.symbol}</h4>
                    <span className="text-sm text-gray-500">{stock.name}</span>
                    {selectedStock?.symbol === stock.symbol && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        Selected
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500">
                      Vol: {stock.volume} | MCap: {formatMarketCap(stock.marketCap)}
                    </span>
                    <span className="text-xs text-gray-400">
                      H: {formatNumber(stock.dayHigh)} L: {formatNumber(stock.dayLow)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">
                    {formatNumber(stock.price)}
                  </div>
                  <div className={`flex items-center gap-1 ${getChangeColor(stock.change)}`}>
                    {getChangeIcon(stock.change)}
                    <span className="text-sm font-medium">
                      {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Market Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {chartData[chartData.length - 1]?.nifty50.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '19,800'}
              </div>
              <div className="text-sm text-gray-600">NIFTY 50</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {chartData[chartData.length - 1]?.sensex.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '66,500'}
              </div>
              <div className="text-sm text-gray-600">SENSEX</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {chartData[chartData.length - 1]?.bankNifty.toLocaleString('en-IN', { maximumFractionDigits: 2 }) || '44,500'}
              </div>
              <div className="text-sm text-gray-600">BANK NIFTY</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stockData.reduce((sum, stock) => sum + stock.changePercent, 0).toFixed(2)}%
              </div>
              <div className="text-sm text-gray-600">Avg Change</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-blue-600 font-semibold">i</span>
            </div>
            <div className="text-xs text-gray-600">
              <p className="font-medium text-gray-700 mb-1">Market Data Disclaimer</p>
              <p>
                Stock market data is simulated for demonstration purposes using realistic values. 
                In production, this would integrate with real-time APIs like NSE, BSE, Alpha Vantage, or Yahoo Finance. 
                Data refreshes every 30 seconds to simulate live updates.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
