import { useState, useEffect, useRef, useCallback } from 'react';
import { CoinPriceData } from '@/lib/api';

interface WebSocketTicker {
  e: string; // Event type
  E: number; // Event time
  s: string; // Symbol
  p: string; // Price change
  P: string; // Price change percent
  w: string; // Weighted average price
  x: string; // Previous close price
  c: string; // Current close price
  Q: string; // Close trade's quantity
  b: string; // Best bid price
  B: string; // Best bid quantity
  a: string; // Best ask price
  A: string; // Best ask quantity
  o: string; // Open price
  h: string; // High price
  l: string; // Low price
  v: string; // Total traded base asset volume
  q: string; // Total traded quote asset volume
  O: number; // Statistics open time
  C: number; // Statistics close time
  F: number; // First trade ID
  L: number; // Last trade ID
  n: number; // Total number of trades
}

export function useBinanceWebSocket(symbols: string[]) {
  const [prices, setPrices] = useState<CoinPriceData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      // Create WebSocket connection for 24hr ticker stream
      const streamNames = symbols.map(symbol => `${symbol.toLowerCase()}usdt@ticker`).join('/');
      const wsUrl = `wss://stream.binance.com:9443/ws/${streamNames}`;
      
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Binance WebSocket connected');
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketTicker = JSON.parse(event.data);
          
          setPrices(prevPrices => {
            const newPrices = [...prevPrices];
            const existingIndex = newPrices.findIndex(
              price => price.symbol === data.s.replace('USDT', '')
            );

            const changePercent = parseFloat(data.P);
            const isPositive = changePercent >= 0;

            const priceData: CoinPriceData = {
              symbol: data.s.replace('USDT', ''),
              name: getCoinName(data.s.replace('USDT', '')),
              price: parseFloat(data.c).toFixed(2),
              change: parseFloat(data.p).toFixed(2),
              changePercent: `${isPositive ? '+' : ''}${changePercent.toFixed(2)}%`,
              isPositive,
              volume: parseFloat(data.v).toLocaleString(),
              high24h: parseFloat(data.h).toFixed(2),
              low24h: parseFloat(data.l).toFixed(2),
            };

            if (existingIndex >= 0) {
              newPrices[existingIndex] = priceData;
            } else {
              newPrices.push(priceData);
            }

            return newPrices;
          });
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('WebSocket connection error');
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt to reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 5000);
      };

    } catch (err) {
      console.error('Error creating WebSocket connection:', err);
      setError('Failed to create WebSocket connection');
    }
  }, [symbols]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    prices,
    isConnected,
    error,
    reconnect: connect,
    disconnect,
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