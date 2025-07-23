import React, { useEffect, useCallback, useRef, useState } from 'react';
import { CoinSelector } from '@/components/Dashboard/CoinSelector';
import { SignalCard } from '@/components/Dashboard/SignalCard';
import { AIChat } from '@/components/Dashboard/AIChat';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, X } from 'lucide-react';
import { getCurrentSignals, triggerSignal } from '@/lib/api';
import { Navbar } from '@/components/Layout/Navbar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DashboardProps {
  registerRefresh?: (fn: () => Promise<void>) => void;
}

interface ScreenshotData {
  url: string;
  type: string;
}

export default function Dashboard({ registerRefresh }: DashboardProps) {
  const [signals, setSignals] = useState<any[]>([]);
  const [selectedScreenshot, setSelectedScreenshot] = useState<ScreenshotData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [triggeringCoin, setTriggeringCoin] = useState<string | null>(null);
  const [selectedCoin, setSelectedCoin] = useState('BTC');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingCoin, setPendingCoin] = useState<string | null>(null);

  const fetchSignals = useCallback(async () => {
    console.log("----------------> ");0
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentSignals();
      setSignals(data);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch signals');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchSignals();
    setRefreshing(false);
  };

  useEffect(() => {
    if (registerRefresh) {
      registerRefresh(handleRefresh);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerRefresh, handleRefresh]);

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  const handleViewScreenshot = (screenshotUrl: string, screenshotType: string) => {
    setSelectedScreenshot({ url: screenshotUrl, type: screenshotType });
  };

  const handleCoinSelect = (coin: string) => {
    setPendingCoin(coin);
    setShowConfirmDialog(true);
  };

  const handleConfirmCoinSelection = async () => {
    if (!pendingCoin) return;
    
    setSelectedCoin(pendingCoin);
    setTriggeringCoin(pendingCoin);
    setShowConfirmDialog(false);
    
    try {
      await triggerSignal(pendingCoin);
      await fetchSignals();
    } catch (e: any) {
      setError(e.message || 'Failed to trigger signal');
    } finally {
      setTriggeringCoin(null);
      setPendingCoin(null);
    }
  };

  const handleCancelCoinSelection = () => {
    setShowConfirmDialog(false);
    setPendingCoin(null);
  };

  const getScreenshotDisplayName = (type: string) => {
    const displayNames: { [key: string]: string } = {
      'tradingview_15m': 'TradingView 15m Chart',
      'tradingview_1h': 'TradingView 1h Chart',
      'tradingview_4h': 'TradingView 4h Chart',
      'tradingview_1D': 'TradingView 1D Chart',
      'coinglass_liquidation_map': 'Liquidation Map',
      'coinglass_liquidation_heatmap': 'Liquidation Heatmap',
      'coinglass_hyperliquid_map': 'Hyperliquid Map',
      'coinglass_oi_expiry': 'Open Interest Expiry',
      'coinglass_options_oi': 'Options Open Interest',
      'coinglass_options_vs_futures': 'Options vs Futures'
    };
    return displayNames[type] || type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const stats = [
    { label: 'Active Signals', value: '2', icon: Clock, color: 'text-warning' },
    { label: 'Today\'s Profit', value: '+$1,247', icon: TrendingUp, color: 'text-success' },
    { label: 'Win Rate', value: '78.4%', icon: TrendingUp, color: 'text-success' },
    { label: 'Risk Level', value: 'Medium', icon: AlertTriangle, color: 'text-warning' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Optionally, if Navbar is used here: */}
      {/* <Navbar onRefresh={handleRefresh} refreshing={refreshing} /> */}
      {/* Alert Banner */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Market Alert:</strong> High volatility detected in BTC. Our AI is monitoring closely for optimal entry points.
        </AlertDescription>
      </Alert>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coin Selector */}
      <CoinSelector selectedCoin={selectedCoin} onSelect={handleCoinSelect} />

      {/* Current Signals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Current Trade Signals</h2>
          <Badge variant="outline" className="bg-primary/10">
            {signals.length} Active
          </Badge>
        </div>
        
        {loading && <p>Loading signals...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {signals.map((signal) => (
              console.log("----------------> signal", signal.id),
              <SignalCard
                key={signal.id}
                signal={signal}
                onViewScreenshot={handleViewScreenshot}
              />
            ))}
          </div>
        )}
        {!loading && !error && signals.length === 0 && (
          <p>No active signals at the moment. Select a coin to generate a new signal.</p>
        )}
      </div>

      {/* AI Chat */}
      <AIChat />

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <Card className="max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle>{getScreenshotDisplayName(selectedScreenshot.type)}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedScreenshot(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative w-full h-[70vh] bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedScreenshot.url}
                  alt={getScreenshotDisplayName(selectedScreenshot.type)}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `
                      <div class="flex items-center justify-center h-full">
                        <div class="text-center">
                          <div class="text-lg font-medium">Failed to load image</div>
                          <div class="text-sm text-muted-foreground mt-2">
                            The chart analysis image could not be loaded
                          </div>
                        </div>
                      </div>
                    `;
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Coin Selection Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Signal Generation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to generate a new AI trading signal for {pendingCoin}? 
              This will trigger our AI analysis and may take a few moments to complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelCoinSelection}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCoinSelection}>
              Generate Signal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}