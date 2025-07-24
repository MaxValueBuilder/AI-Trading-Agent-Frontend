import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Default coins to display
const DEFAULT_COINS = ['BTC', 'ETH', 'SOL'];

interface CoinSelectorProps {
  selectedCoin: string;
  onSelect: (coin: string) => void;
  coins?: string[]; // Optional: allow custom coin list
}

export function CoinSelector({ selectedCoin, onSelect, coins = DEFAULT_COINS }: CoinSelectorProps) {
  const { 
    prices: coinData, 
    isConnected, 
    error, 
    reconnect 
  } = useBinanceWebSocket(coins);

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Select Trading Pair</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to connect to real-time price feed. Please check your connection and try again.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2" 
              onClick={() => reconnect()}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Select Trading Pair</h2>
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-sm">
              {isConnected ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-red-500" />
                  <span className="text-red-600">Connecting...</span>
                </>
              )}
            </div>
          </div>

          {/* Manual Refresh Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => reconnect()}
            disabled={!isConnected}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {!isConnected ? (
          // Loading skeletons
          coins.map((symbol) => (
            <div key={symbol} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-5 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ))
        ) : (
          // Real coin data
          coinData?.map((coin) => (
            <Button
              key={coin.symbol}
              variant={selectedCoin === coin.symbol ? "default" : "outline"}
              className="p-4 h-auto flex flex-col items-start space-y-2 hover:shadow-md transition-shadow"
              onClick={() => onSelect(coin.symbol)}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-lg">{coin.symbol}</span>
                <Badge 
                  variant={coin.isPositive ? "default" : "destructive"}
                  className={coin.isPositive ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {coin.changePercent}
                </Badge>
              </div>
              <div className="text-left w-full">
                <div className="text-sm text-muted-foreground">{coin.name}</div>
                <div className="font-mono text-lg">${coin.price}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Vol: {coin.volume}
                </div>
              </div>
            </Button>
          ))
        )}
      </div>
      
      {isConnected && coinData && (
        <div className="text-xs text-muted-foreground text-center">
          Real-time updates via WebSocket • Powered by Binance API
        </div>
      )}
    </div>
  );
}