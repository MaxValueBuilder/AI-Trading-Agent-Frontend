import React, { useEffect, useCallback, useRef, useState } from 'react';
import { CoinSelector } from '@/components/Dashboard/CoinSelector';
import { SignalCard } from '@/components/Dashboard/SignalCard';
import { AIChat } from '@/components/Dashboard/AIChat';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, AlertTriangle, X } from 'lucide-react';
import { getCurrentSignals, triggerSignal, getTradingStats, TradingStats } from '@/lib/api';
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
  const [isAnalyzing, setIsAnalyzing] = useState(() => {
    // Initialize from localStorage, but we'll verify this with actual data
    const stored = localStorage.getItem('isAnalyzing');
    return stored === 'true';
  });
  const [pollingErrorCount, setPollingErrorCount] = useState(0);
  const [showPollingErrorAlert, setShowPollingErrorAlert] = useState(false);
  const [stats, setStats] = useState<TradingStats>({
    active_signals: 0,
    today_pnl: 0,
    win_rate: 0,
    risk_level: 'Medium'
  });

  const fetchSignals = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getCurrentSignals();
      setSignals(data);
      
      // Always check if there are any analyzing signals and update state accordingly
      const hasAnalyzingSignal = data.some((signal: any) => signal.status === 'analyzing');
      setIsAnalyzing(hasAnalyzingSignal);
      localStorage.setItem('isAnalyzing', hasAnalyzingSignal.toString());
      
      // Reset error count on successful fetch
      if (showLoading) {
        setPollingErrorCount(0);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to fetch signals');
      
      // Increment error count for polling errors
      if (!showLoading) {
        const newErrorCount = pollingErrorCount + 1;
        setPollingErrorCount(newErrorCount);
        
        // If we've had 20 polling errors, remove analyzing signals and show alert
        if (newErrorCount >= 20) {
          setSignals(prev => prev.filter(signal => signal.status !== 'analyzing'));
          setIsAnalyzing(false);
          localStorage.setItem('isAnalyzing', 'false');
          setShowPollingErrorAlert(true);
          setPollingErrorCount(0);
        }
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }, [pollingErrorCount]);

  const fetchStats = useCallback(async () => {
    try {
      const statsData = await getTradingStats();
      setStats(statsData);
    } catch (e: any) {
      console.error('Failed to fetch stats:', e);
      // Don't show error for stats, just log it
    }
  }, []);

  // Update localStorage when isAnalyzing changes
  useEffect(() => {
    localStorage.setItem('isAnalyzing', isAnalyzing.toString());
    
    // Listen for storage changes (in case user has multiple tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAnalyzing') {
        const newValue = e.newValue === 'true';
        if (newValue !== isAnalyzing) {
          setIsAnalyzing(newValue);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAnalyzing]);

  // Cleanup localStorage when there are no analyzing signals
  useEffect(() => {
    if (!isAnalyzing) {
      localStorage.removeItem('isAnalyzing');
    }
  }, [isAnalyzing]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchSignals(), fetchStats()]);
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
    fetchStats();
  }, [fetchSignals, fetchStats]);

  // Auto-refresh when there's an analyzing signal
  useEffect(() => {
    const hasAnalyzingSignal = signals.some(signal => signal.status === 'analyzing');
    
    if (hasAnalyzingSignal) {
      const interval = setInterval(() => {
        fetchSignals(false); // Don't show loading state during polling
        fetchStats(); // Also refresh stats during polling
      }, 5000); // Poll every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [signals, fetchSignals, fetchStats]);

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
    setIsAnalyzing(true);
    localStorage.setItem('isAnalyzing', 'true');
    setPollingErrorCount(0); // Reset error count for new analysis
    
    // Create an immediate analyzing signal
    const analyzingSignal = {
      id: `analyzing-${Date.now()}`,
      asset: pendingCoin,
      signal: 'Long' as const, // Placeholder, will be updated when real signal comes
      status: 'analyzing' as const,
      timestamp: new Date().toISOString(),
      gpt_signal: {
        confidence: '-',
        entry: [],
        stop_loss: [],
        take_profits: [],
        reason: 'AI is analyzing market data...'
      }
    };
    
    setSignals(prev => [analyzingSignal, ...prev]);
    
    try {
      await triggerSignal(pendingCoin);
      await Promise.all([fetchSignals(), fetchStats()]);
    } catch (e: any) {
      setError(e.message || 'Failed to trigger signal');
      // Remove the analyzing signal on error
      setSignals(prev => prev.filter(s => s.id !== analyzingSignal.id));
      // Reset analyzing state on error
      setIsAnalyzing(false);
      localStorage.setItem('isAnalyzing', 'false');
    } finally {
      setTriggeringCoin(null);
      setPendingCoin(null);
      // Note: We don't set isAnalyzing to false here anymore
      // It will be updated by the polling mechanism when the signal status changes
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

  const statsData = [
    { 
      label: 'Active Signals', 
      value: stats.active_signals.toString(), 
      icon: Clock, 
      color: 'text-warning' 
    },
    { 
      label: 'Today\'s Profit', 
      value: `${stats.today_pnl >= 0 ? '+' : ''}$${stats.today_pnl.toFixed(0)}`, 
      icon: TrendingUp, 
      color: stats.today_pnl >= 0 ? 'text-success' : 'text-destructive' 
    },
    { 
      label: 'Win Rate', 
      value: `${stats.win_rate.toFixed(1)}%`, 
      icon: TrendingUp, 
      color: stats.win_rate >= 50 ? 'text-success' : 'text-destructive' 
    },
    { 
      label: 'Risk Level', 
      value: stats.risk_level, 
      icon: AlertTriangle, 
      color: 'text-warning' 
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Optionally, if Navbar is used here: */}
      {/* <Navbar onRefresh={handleRefresh} refreshing={refreshing} /> */}
      {/* Polling Error Alert */}
      {showPollingErrorAlert && (
        <Alert className="border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Connection Error:</strong> Unable to update signal status after multiple attempts. The analyzing signal has been removed. Please try generating a new signal.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={() => setShowPollingErrorAlert(false)}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Alert Banner */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Market Alert:</strong> High volatility detected in BTC. Our AI is monitoring closely for optimal entry points.
        </AlertDescription>
      </Alert>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat) => (
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
      <CoinSelector selectedCoin={selectedCoin} onSelect={handleCoinSelect} disabled={isAnalyzing} />

      {/* Current Signals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Current Trade Signals</h2>
          <div className="flex items-center space-x-2">
            {pollingErrorCount > 0 && isAnalyzing && (
              <Badge variant="outline" className="bg-warning/10 text-warning-foreground">
                Polling Error: {pollingErrorCount}/20
              </Badge>
            )}
            <Badge variant="outline" className="bg-primary/10">
              {signals.length} Active
            </Badge>
          </div>
        </div>
        
        {loading && <p>Loading signals...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {signals.map((signal) => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onViewScreenshot={handleViewScreenshot}
              />
            ))}
          </div>
        )}
        {!loading && !error && signals.length === 0 && !isAnalyzing && (
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