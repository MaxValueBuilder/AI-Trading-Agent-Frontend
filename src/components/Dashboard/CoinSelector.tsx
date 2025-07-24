import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRealTimePrices } from '@/hooks/useRealTimePrices';
import { useBinanceWebSocket } from '@/hooks/useBinanceWebSocket';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, AlertCircle, Wifi, WifiOff, Settings } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Default coins to display
const DEFAULT_COINS = ['BTC', 'ETH', 'SOL'];

interface CoinSelectorProps {
  selectedCoin: string;
  onSelect: (coin: string) => void;
  coins?: string[]; // Optional: allow custom coin list
}

export function CoinSelector({ selectedCoin, onSelect, coins = DEFAULT_COINS }: CoinSelectorProps) {
  const [useWebSocket, setUseWebSocket] = useState(false);
  
  // REST API approach
  const { 
    data: restData, 
    isLoading: restLoading, 
    error: restError, 
    refetch: restRefetch 
  } = useRealTimePrices(coins);

  // WebSocket approach
  const { 
    prices: wsData, 
    isConnected: wsConnected, 
    error: wsError, 
    reconnect: wsReconnect 
  } = useBinanceWebSocket(coins);

  // Use WebSocket data if enabled and connected, otherwise use REST data
  const coinData = useWebSocket && wsConnected ? wsData : restData;
  const isLoading = useWebSocket ? !wsConnected : restLoading;
  const error = useWebSocket ? wsError : restError;
  const refetch = useWebSocket ? wsReconnect : restRefetch;

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Trading Pair</h2>
          <div className="flex items-center space-x-2">
            <Label htmlFor="websocket-mode" className="text-sm">WebSocket</Label>
            <Switch
              id="websocket-mode"
              checked={useWebSocket}
              onCheckedChange={setUseWebSocket}
            />
          </div>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load real-time price data. Please check your connection and try again.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2" 
              onClick={() => refetch()}
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
            {useWebSocket ? (
              <div className="flex items-center space-x-1 text-sm">
                {wsConnected ? (
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
            ) : (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                {isLoading && <RefreshCw className="h-3 w-3 animate-spin" />}
                <span>Polling</span>
              </div>
            )}
          </div>

          {/* WebSocket Toggle */}
          <div className="flex items-center space-x-2">
            <Label htmlFor="websocket-mode" className="text-sm">WebSocket</Label>
            <Switch
              id="websocket-mode"
              checked={useWebSocket}
              onCheckedChange={setUseWebSocket}
            />
          </div>

          {/* Manual Refresh Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
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
      
      {coinData && (
        <div className="text-xs text-muted-foreground text-center">
          {useWebSocket 
            ? 'Real-time updates via WebSocket • Powered by Binance API'
            : 'Data updates every 5 seconds • Powered by Binance API'
          }
        </div>
      )}
    </div>
  );
}