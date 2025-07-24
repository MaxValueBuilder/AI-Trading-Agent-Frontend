import React from 'react';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PriceTickerProps {
  symbol: string;
  showDetails?: boolean;
}

export function PriceTicker({ symbol, showDetails = false }: PriceTickerProps) {
  const { prices, isConnected, error } = useBinanceWebSocket([symbol]);
  const coin = prices.find(p => p.symbol === symbol);

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    );
  }

  if (error || !coin) {
    return (
      <Card className="w-full border-destructive">
        <CardContent className="pt-6">
          <div className="text-center text-destructive text-sm">
            Failed to load {symbol} price
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {coin.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">${coin.price}</div>
            <div className="flex items-center space-x-2 mt-1">
              {coin.isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
              <Badge 
                variant={coin.isPositive ? "default" : "destructive"}
                className={coin.isPositive ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {coin.changePercent}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">{coin.symbol}</div>
            {showDetails && (
              <div className="text-xs text-muted-foreground mt-1">
                <div>Vol: {coin.volume}</div>
                <div>H: ${coin.high24h}</div>
                <div>L: ${coin.low24h}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Mini version for compact display
export function MiniPriceTicker({ symbol }: PriceTickerProps) {
  const { prices, isConnected } = useBinanceWebSocket([symbol]);
  const coin = prices.find(p => p.symbol === symbol);

  if (!isConnected || !coin) {
    return (
      <div className="flex items-center space-x-2 p-2 border rounded">
        <Skeleton className="h-4 w-8" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-12" />
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 p-2 border rounded hover:bg-muted/50 transition-colors">
      <span className="font-semibold text-sm">{coin.symbol}</span>
      <span className="font-mono text-sm">${coin.price}</span>
      <Badge 
        variant={coin.isPositive ? "default" : "destructive"}
        className={`text-xs ${coin.isPositive ? "bg-green-500 hover:bg-green-600" : ""}`}
      >
        {coin.changePercent}
      </Badge>
    </div>
  );
} 