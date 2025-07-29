// API utility for backend integration
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

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

// Data structure for coin price data (used by WebSocket hook)
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

// Trading stats interface
export interface TradingStats {
  active_signals: number;
  today_pnl: number;
  win_rate: number;
  risk_level: string;
}

// Close trade request interface
export interface CloseTradeRequest {
  pnl: number;
  notes?: string;
}

// Update signal status request interface
export interface UpdateSignalStatusRequest {
  status: string;
  notes?: string;
}

// Get coin name mapping (used by WebSocket hook)
export function getCoinName(symbol: string): string {
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

export async function getCurrentSignals() {
  console.log('Getting current signals');
  return apiFetch('/signals/current');
}

export async function getSignalHistory() {
  console.log('Getting signal history');
  return apiFetch('/signals/history');
}

export async function getTradingStats(): Promise<TradingStats> {
  console.log('Getting trading stats');
  return apiFetch('/signals/stats');
}

export async function closeTrade(signalId: string, pnl: number, notes?: string) {
  console.log('Closing trade', signalId, 'with P&L:', pnl);
  return apiFetch(`/signals/${signalId}/close`, {
    method: 'PUT',
    body: JSON.stringify({ pnl, notes }),
  });
}

export async function updateSignalStatus(signalId: string, status: string, notes?: string) {
  console.log('Updating signal status', signalId, 'to:', status);
  return apiFetch(`/signals/${signalId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, notes }),
  });
}

export async function triggerSignal(coin: string) {
  // Get user's telegramId from Firebase
  const auth = getAuth();
  const user = auth.currentUser;
  let telegramId = null;
  
  if (user) {
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        telegramId = userData.telegramId;
      }
    } catch (error) {
      console.error('Failed to get user telegramId:', error);
    }
  }
  
  console.log('Triggering signal for', coin, 'with telegramId:', telegramId);
  
  return apiFetch('/signals/trigger', {
    method: 'POST',
    body: JSON.stringify({ coin, telegramId }),
  });
}

export async function askAIChat(message: string, context?: any) {
  return apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
} 