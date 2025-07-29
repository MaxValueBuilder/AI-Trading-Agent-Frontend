import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { TrendingUp, TrendingDown, Filter, DollarSign } from 'lucide-react';
import { getSignalHistory } from '@/lib/api';
import { CloseTradeModal } from '@/components/Dashboard/CloseTradeModal';

interface HistoricalSignal {
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
  userId?: string;
  telegramId?: string;
  // Optionally, add more fields as needed
  // For legacy support:
  pair?: string;
  direction?: 'Long' | 'Short';
  entry?: number | string;
  exit?: number | string;
  pnl?: number | string;
  pnlPercentage?: string;
  confidence?: string;
  date?: string;
  doc_id?: string;
}

export default function History() {
  const [signals, setSignals] = useState<HistoricalSignal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [closeModalOpen, setCloseModalOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<HistoricalSignal | null>(null);
  const itemsPerPage = 10;

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSignalHistory();
      // Ensure all signals conform to HistoricalSignal type
      setSignals(data as HistoricalSignal[]);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleCloseTrade = (signal: HistoricalSignal) => {
    setSelectedSignal(signal);
    setCloseModalOpen(true);
  };

  const handleTradeClosed = () => {
    fetchHistory(); // Refresh the history after closing a trade
  };

  const totalPages = Math.ceil(signals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSignals = signals.slice(startIndex, endIndex);

  // Helper to get confidence from gpt_signal or fallback
  const getConfidence = (signal: HistoricalSignal) => {
    return signal.gpt_signal?.confidence ?? signal.confidence ?? '-';
  };

  // Helper to get entry/exit from gpt_signal or fallback
  const getEntry = (signal: HistoricalSignal) => {
    if (signal.gpt_signal?.entry && Array.isArray(signal.gpt_signal.entry) && signal.gpt_signal.entry.length > 0) {
      return signal.gpt_signal.entry.join(', ');
    }
    return signal.entry ?? '-';
  };
  const getExit = (signal: HistoricalSignal) => {
    // No exit in gpt_signal, fallback to signal.exit
    return signal.exit ?? '-';
  };

  // Helper to get direction from top-level or fallback to signal.signal
  const getDirection = (signal: HistoricalSignal) => {
    return signal.direction ?? signal.signal;
  };

  // Helper to get pair/asset
  const getPair = (signal: HistoricalSignal) => {
    return signal.pair ?? signal.asset;
  };

  // Helper to get PnL
  const getPnL = (signal: HistoricalSignal) => {
    if (signal.pnl !== undefined && signal.pnl !== null) {
      const pnlValue = typeof signal.pnl === 'number' ? signal.pnl : parseFloat(signal.pnl.toString());
      return isNaN(pnlValue) ? '-' : `$${pnlValue.toFixed(2)}`;
    }
    return '-';
  };

  // Helper to get PnL Percentage
  const getPnLPercentage = (signal: HistoricalSignal) => {
    return signal.pnlPercentage ?? '';
  };

  // Helper to get result
  const getResult = (signal: HistoricalSignal) => {
    if (signal.status === 'completed' && signal.pnl !== undefined && signal.pnl !== null) {
      const pnlValue = typeof signal.pnl === 'number' ? signal.pnl : parseFloat(signal.pnl.toString());
      return !isNaN(pnlValue) && pnlValue > 0 ? 'profit' : 'loss';
    }
    return signal.result ?? '-';
  };

  // Helper to get date
  const getDate = (signal: HistoricalSignal) => {
    if (signal.date) return new Date(signal.date).toLocaleDateString();
    if (signal.timestamp) return new Date(signal.timestamp).toLocaleDateString();
    return '-';
  };

  // Calculate total PnL
  const totalPnL = signals.reduce((sum, signal) => {
    if (signal.pnl !== undefined && signal.pnl !== null) {
      const pnlValue = typeof signal.pnl === 'number' ? signal.pnl : parseFloat(signal.pnl.toString());
      return sum + (isNaN(pnlValue) ? 0 : pnlValue);
    }
    return sum;
  }, 0);

  // Calculate win rate
  const completedTrades = signals.filter(s => s.status === 'completed');
  const winRate = completedTrades.length > 0 
    ? (completedTrades.filter(s => getResult(s) === 'profit').length / completedTrades.length) * 100 
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trading History</h1>
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </div>
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
                {totalPnL >= 0 ? '+' : ''}${totalPnL.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total P&L</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{signals.length}</div>
              <div className="text-sm text-muted-foreground">Total Trades</div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* History Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Loading history...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Pair</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead>Entry</TableHead>
                  <TableHead>Exit</TableHead>
                  <TableHead>P&L</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentSignals.map((signal) => {
                  const direction = getDirection(signal);
                  const result = getResult(signal);
                  const confidence = getConfidence(signal);
                  const pnl = getPnL(signal);
                  return (
                    <TableRow key={signal.id || signal.doc_id}>
                      <TableCell className="font-mono text-sm">
                        {getDate(signal)}
                      </TableCell>
                      <TableCell className="font-medium">{getPair(signal)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          {direction === 'Long' ? (
                            <TrendingUp className="h-4 w-4 text-success" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-destructive" />
                          )}
                          <span className={direction === 'Long' ? 'text-success' : 'text-destructive'}>
                            {direction}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono">{getEntry(signal)}</TableCell>
                      <TableCell className="font-mono">{getExit(signal)}</TableCell>
                      <TableCell>
                        <div className="text-right">
                          <div className={`font-mono ${result === 'profit' ? 'text-success' : result === 'loss' ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {pnl}
                          </div>
                          <div className={`text-xs ${result === 'profit' ? 'text-success' : result === 'loss' ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {getPnLPercentage(signal)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            confidence === 'A+' || confidence === 'A' 
                              ? 'bg-success' 
                              : confidence === 'B' 
                              ? 'bg-warning' 
                              : 'bg-destructive'
                          }
                        >
                          {confidence}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            signal.status === 'completed' 
                              ? (result === 'profit' ? 'default' : 'destructive')
                              : signal.status === 'confirmed' 
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {signal.status === 'completed' 
                            ? (result === 'profit' ? 'Profit' : 'Loss')
                            : signal.status === 'confirmed' 
                            ? 'Confirmed'
                            : signal.status
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {signal.status === 'confirmed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCloseTrade(signal)}
                            className="flex items-center space-x-1"
                          >
                            <DollarSign className="h-3 w-3" />
                            <span>Close</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          {/* Pagination */}
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i + 1}>
                    <PaginationLink 
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Close Trade Modal */}
      {selectedSignal && (
        <CloseTradeModal
          isOpen={closeModalOpen}
          onClose={() => setCloseModalOpen(false)}
          signalId={selectedSignal.id || selectedSignal.doc_id || ''}
          asset={selectedSignal.asset}
          onTradeClosed={handleTradeClosed}
        />
      )}
    </div>
  );
}