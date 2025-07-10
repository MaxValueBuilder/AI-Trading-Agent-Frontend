import React, { useState } from 'react';
import { CoinSelector } from '@/components/Dashboard/CoinSelector';
import { SignalCard } from '@/components/Dashboard/SignalCard';
import { AIChat } from '@/components/Dashboard/AIChat';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from 'lucide-react';

const mockSignals = [
  {
    id: '1',
    direction: 'Long' as const,
    entry: '$67,200',
    stopLoss: '$65,800',
    takeProfit: '$69,500',
    status: 'confirmed' as const,
    confidence: 'A+' as const,
    timestamp: '2024-01-15T10:30:00Z',
    screenshot: 'btc-analysis-1.jpg'
  },
  {
    id: '2',
    direction: 'Short' as const,
    entry: '$3,890',
    stopLoss: '$3,950',
    takeProfit: '$3,750',
    status: 'waiting' as const,
    confidence: 'B' as const,
    timestamp: '2024-01-15T11:15:00Z',
    screenshot: 'eth-analysis-1.jpg'
  },
  {
    id: '3',
    direction: 'Long' as const,
    entry: '$198.50',
    stopLoss: '$195.20',
    takeProfit: '$205.00',
    status: 'completed' as const,
    confidence: 'A' as const,
    timestamp: '2024-01-15T09:45:00Z',
    result: 'profit' as const
  }
];

export default function Dashboard() {
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const handleViewScreenshot = (screenshot: string) => {
    setSelectedScreenshot(screenshot);
  };

  const stats = [
    { label: 'Active Signals', value: '2', icon: Clock, color: 'text-warning' },
    { label: 'Today\'s Profit', value: '+$1,247', icon: TrendingUp, color: 'text-success' },
    { label: 'Win Rate', value: '78.4%', icon: TrendingUp, color: 'text-success' },
    { label: 'Risk Level', value: 'Medium', icon: AlertTriangle, color: 'text-warning' }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
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
      <CoinSelector />

      {/* Current Signals */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Current Trade Signals</h2>
          <Badge variant="outline" className="bg-primary/10">
            {mockSignals.length} Active
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              onViewScreenshot={handleViewScreenshot}
            />
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <AIChat />

      {/* Screenshot Modal (simplified for now) */}
      {selectedScreenshot && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedScreenshot(null)}
        >
          <Card className="max-w-4xl w-full">
            <CardHeader>
              <CardTitle>Chart Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-lg font-medium">Chart Analysis: {selectedScreenshot}</div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Technical analysis and key levels identified by AI
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}