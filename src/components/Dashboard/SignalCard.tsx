import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Eye, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Signal {
  id: string;
  direction: 'Long' | 'Short';
  entry: string;
  stopLoss: string;
  takeProfit: string;
  status: 'waiting' | 'confirmed' | 'completed';
  confidence: 'A+' | 'A' | 'B' | 'C';
  timestamp: string;
  screenshot?: string;
  result?: 'profit' | 'loss';
}

interface SignalCardProps {
  signal: Signal;
  onViewScreenshot?: (screenshot: string) => void;
}

export function SignalCard({ signal, onViewScreenshot }: SignalCardProps) {
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
    switch (signal.confidence) {
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            {signal.direction === 'Long' ? (
              <TrendingUp className="h-5 w-5 text-success" />
            ) : (
              <TrendingDown className="h-5 w-5 text-destructive" />
            )}
            <span className={signal.direction === 'Long' ? 'text-success' : 'text-destructive'}>
              {signal.direction}
            </span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={getConfidenceColor()}>
              {signal.confidence}
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
            <div className="font-mono font-medium">{signal.entry}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Stop Loss</div>
            <div className="font-mono font-medium text-destructive">{signal.stopLoss}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Take Profit</div>
            <div className="font-mono font-medium text-success">{signal.takeProfit}</div>
          </div>
        </div>

        {signal.screenshot && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Chart Analysis Available</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewScreenshot?.(signal.screenshot!)}
              className="flex items-center space-x-1"
            >
              <Eye className="h-4 w-4" />
              <span>View Chart</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}