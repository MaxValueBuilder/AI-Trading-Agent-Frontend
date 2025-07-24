// API utility for backend integration
import { getAuth } from 'firebase/auth';

// Environment-aware BASE_URL configuration
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Log the BASE_URL for debugging (remove in production)
console.log('Environment:', import.meta.env.MODE);
console.log('BASE_URL:', BASE_URL);
console.log('VITE_BACKEND_URL from env:', import.meta.env.VITE_BACKEND_URL);

async function getIdToken() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await user.getIdToken();
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getIdToken();
  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  console.log('Fetching from', `${BASE_URL}${path}`, 'with headers', headers);
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Binance API functions for real-time price data
export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface CoinPriceData {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  isPositive: boolean;
  volume: string;
  high24h: string;
  low24h: string;
}

// Get all 24hr ticker statistics from Binance
export async function getBinanceTickers(): Promise<BinanceTicker[]> {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Binance tickers:', error);
    throw error;
  }
}

// Get specific ticker data for a symbol
export async function getBinanceTicker(symbol: string): Promise<BinanceTicker> {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Binance ticker for ${symbol}:`, error);
    throw error;
  }
}

// Transform Binance ticker data to our CoinPriceData format
export function transformTickerToCoinData(ticker: BinanceTicker): CoinPriceData {
  const changePercent = parseFloat(ticker.priceChangePercent);
  const isPositive = changePercent >= 0;
  
  return {
    symbol: ticker.symbol.replace('USDT', ''), // Remove USDT suffix for display
    name: getCoinName(ticker.symbol.replace('USDT', '')),
    price: parseFloat(ticker.lastPrice).toFixed(2),
    change: parseFloat(ticker.priceChange).toFixed(2),
    changePercent: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
    isPositive,
    volume: parseFloat(ticker.volume).toLocaleString(),
    high24h: parseFloat(ticker.highPrice).toFixed(2),
    low24h: parseFloat(ticker.lowPrice).toFixed(2),
  };
}

// Get coin name mapping
function getCoinName(symbol: string): string {
  const coinNames: { [key: string]: string } = {
    'BTC': 'Bitcoin',
    'ETH': 'Ethereum',
    'SOL': 'Solana',
    'ADA': 'Cardano',
    'DOT': 'Polkadot',
    'LINK': 'Chainlink',
    'UNI': 'Uniswap',
    'MATIC': 'Polygon',
    'AVAX': 'Avalanche',
    'ATOM': 'Cosmos',
    'LTC': 'Litecoin',
    'BCH': 'Bitcoin Cash',
    'XRP': 'Ripple',
    'DOGE': 'Dogecoin',
    'SHIB': 'Shiba Inu',
    'TRX': 'TRON',
    'NEAR': 'NEAR Protocol',
    'FTM': 'Fantom',
    'ALGO': 'Algorand',
    'VET': 'VeChain',
  };
  
  return coinNames[symbol] || symbol;
}

// Get real-time price data for specific coins
export async function getRealTimePrices(symbols: string[]): Promise<CoinPriceData[]> {
  try {
    const tickers = await getBinanceTickers();
    const filteredTickers = tickers.filter(ticker => 
      symbols.some(symbol => ticker.symbol === `${symbol}USDT`)
    );
    
    return filteredTickers.map(transformTickerToCoinData);
  } catch (error) {
    console.error('Error fetching real-time prices:', error);
    throw error;
  }
}

export async function getCurrentSignals() {
  console.log('Getting current signals');
  return apiFetch('/signals/current');
}

export async function getSignalHistory() {
  console.log('Getting signal history');
  return apiFetch('/signals/history');
}

export async function triggerSignal(coin: string) {
  return apiFetch('/signals/trigger', {
    method: 'POST',
    body: JSON.stringify({ coin }),
  });
}

export async function askAIChat(message: string, context?: any) {
  return apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
} 