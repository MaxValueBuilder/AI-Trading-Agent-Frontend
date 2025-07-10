import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Coin {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isPositive: boolean;
}

const coins: Coin[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: '$67,425.12', change: '+2.45%', isPositive: true },
  { symbol: 'ETH', name: 'Ethereum', price: '$3,892.58', change: '+1.87%', isPositive: true },
  { symbol: 'SOL', name: 'Solana', price: '$198.42', change: '-0.92%', isPositive: false },
];

export function CoinSelector() {
  const [selectedCoin, setSelectedCoin] = useState('BTC');

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Select Trading Pair</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {coins.map((coin) => (
          <Button
            key={coin.symbol}
            variant={selectedCoin === coin.symbol ? "default" : "outline"}
            className="p-4 h-auto flex flex-col items-start space-y-2"
            onClick={() => setSelectedCoin(coin.symbol)}
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-bold text-lg">{coin.symbol}</span>
              <Badge 
                variant={coin.isPositive ? "default" : "destructive"}
                className={coin.isPositive ? "bg-success" : ""}
              >
                {coin.change}
              </Badge>
            </div>
            <div className="text-left w-full">
              <div className="text-sm text-muted-foreground">{coin.name}</div>
              <div className="font-mono text-lg">{coin.price}</div>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}