import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Eye, Clock, CheckCircle, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Signal {
  id: string;
  asset: string;
  gpt_signal?: {
    confidence?: string; // e.g. "A", "A+", "B", "C"
    entry?: number[]; // array of entry prices
    stop_loss?: number[]; // array of stop loss prices
    take_profits?: number[]; // array of take profit prices
    reason?: string;
  };
  signal: 'Long' | 'Short';
  status: 'waiting' | 'confirmed' | 'completed';
  timestamp: string;
  screenshots?: {
    [key: string]: string;
  };
  result?: 'profit' | 'loss';
  metrics?: Record<string, any>;
  user_id?: string;
  telegramId?: string;
}

interface SignalCardProps {
  signal: Signal;
  onViewScreenshot?: (screenshotUrl: string, screenshotType: string) => void;
}

export function SignalCard({ signal, onViewScreenshot }: SignalCardProps) {
  // Prefer gpt_signal.confidence if present, else use top-level confidence
  const confidence =
    signal.gpt_signal?.confidence ??   
    '';


  const getStatusIcon = () => {
    switch (signal.status) {
      case 'waiting':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'completed':
        return signal.result === 'profit' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = () => {
    switch (signal.status) {
      case 'waiting':
        return 'bg-warning';
      case 'confirmed':
        return 'bg-primary';
      case 'completed':
        return signal.result === 'profit' ? 'bg-success' : 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getConfidenceColor = () => {
    switch (confidence) {
      case 'A+':
      case 'A':
        return 'bg-success';
      case 'B':
        return 'bg-warning';
      case 'C':
        return 'bg-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getScreenshotDisplayName = (key: string) => {
    const displayNames: { [key: string]: string } = {
      'tradingview_15m': 'TradingView 15m',
      'tradingview_1h': 'TradingView 1h',
      'tradingview_4h': 'TradingView 4h',
      'tradingview_1D': 'TradingView 1D',
      'coinglass_liquidation_map': 'Liquidation Map',
      'coinglass_liquidation_heatmap': 'Liquidation Heatmap',
      'coinglass_hyperliquid_map': 'Hyperliquid Map',
      'coinglass_oi_expiry': 'OI Expiry',
      'coinglass_options_oi': 'Options OI',
      'coinglass_options_vs_futures': 'Options vs Futures'
    };
    return displayNames[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  // Helper to format array of numbers as comma-separated string
  const formatNumberArray = (arr?: number[]) => {
    console.log("----------------> arr", arr);
    if (!arr || arr.length === 0) return '-';
    return arr.join(', ');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {signal.signal === 'Long' ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
            <span className={signal.signal === 'Long' ? 'text-success' : 'text-destructive'}>
              {signal.signal}
            </span>
            <span className="ml-2 text-xs text-muted-foreground font-mono">{signal.asset}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={getConfidenceColor()}>
              {confidence || '-'}
            </Badge>
            <Badge className={getStatusColor()}>
              <div className="flex items-center space-x-1">
                {getStatusIcon()}
                <span className="capitalize">{signal.status}</span>
              </div>
            </Badge>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(signal.timestamp).toLocaleString()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Entry</div>
            <div className="font-mono font-medium">{formatNumberArray(signal.gpt_signal?.entry)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Stop Loss</div>
            <div className="font-mono font-medium text-destructive">{formatNumberArray(signal.gpt_signal?.stop_loss)}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Take Profit</div>
            <div className="font-mono font-medium text-success">{formatNumberArray(signal.gpt_signal?.take_profits)}</div>
          </div>
        </div>    

        {signal.screenshots && Object.keys(signal.screenshots).length > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {Object.keys(signal.screenshots).length} Chart Analysis Available
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Charts</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {Object.entries(signal.screenshots).map(([key, url]) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => onViewScreenshot?.(url, key)}
                    className="cursor-pointer"
                  >
                    {getScreenshotDisplayName(key)}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  );
}