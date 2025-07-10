import React, { useState } from 'react';
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
import { TrendingUp, TrendingDown, Filter } from 'lucide-react';

interface HistoricalSignal {
  id: string;
  date: string;
  pair: string;
  direction: 'Long' | 'Short';
  entry: string;
  exit: string;
  pnl: string;
  pnlPercentage: string;
  result: 'profit' | 'loss';
  confidence: 'A+' | 'A' | 'B' | 'C';
}

const mockHistoricalSignals: HistoricalSignal[] = [
  {
    id: '1',
    date: '2024-01-14',
    pair: 'BTC/USDT',
    direction: 'Long',
    entry: '$66,800',
    exit: '$68,200',
    pnl: '+$420',
    pnlPercentage: '+2.1%',
    result: 'profit',
    confidence: 'A+'
  },
  {
    id: '2',
    date: '2024-01-13',
    pair: 'ETH/USDT',
    direction: 'Short',
    entry: '$3,920',
    exit: '$3,850',
    pnl: '+$210',
    pnlPercentage: '+1.8%',
    result: 'profit',
    confidence: 'A'
  },
  {
    id: '3',
    date: '2024-01-12',
    pair: 'SOL/USDT',
    direction: 'Long',
    entry: '$195.40',
    exit: '$192.80',
    pnl: '-$78',
    pnlPercentage: '-1.3%',
    result: 'loss',
    confidence: 'B'
  },
  {
    id: '4',
    date: '2024-01-11',
    pair: 'BTC/USDT',
    direction: 'Short',
    entry: '$67,500',
    exit: '$65,900',
    pnl: '+$480',
    pnlPercentage: '+2.4%',
    result: 'profit',
    confidence: 'A+'
  },
  {
    id: '5',
    date: '2024-01-10',
    pair: 'ETH/USDT',
    direction: 'Long',
    entry: '$3,780',
    exit: '$3,920',
    pnl: '+$350',
    pnlPercentage: '+3.7%',
    result: 'profit',
    confidence: 'A'
  }
];

export default function History() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(mockHistoricalSignals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSignals = mockHistoricalSignals.slice(startIndex, endIndex);

  const totalPnL = mockHistoricalSignals.reduce((sum, signal) => {
    const pnl = parseFloat(signal.pnl.replace(/[+$]/g, ''));
    return sum + pnl;
  }, 0);

  const winRate = (mockHistoricalSignals.filter(s => s.result === 'profit').length / mockHistoricalSignals.length) * 100;

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
              <div className="text-2xl font-bold text-success">+${totalPnL.toFixed(0)}</div>
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
              <div className="text-2xl font-bold">{mockHistoricalSignals.length}</div>
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
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentSignals.map((signal) => (
                <TableRow key={signal.id}>
                  <TableCell className="font-mono text-sm">
                    {new Date(signal.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-medium">{signal.pair}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {signal.direction === 'Long' ? (
                        <TrendingUp className="h-4 w-4 text-success" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span className={signal.direction === 'Long' ? 'text-success' : 'text-destructive'}>
                        {signal.direction}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{signal.entry}</TableCell>
                  <TableCell className="font-mono">{signal.exit}</TableCell>
                  <TableCell>
                    <div className="text-right">
                      <div className={`font-mono ${signal.result === 'profit' ? 'text-success' : 'text-destructive'}`}>
                        {signal.pnl}
                      </div>
                      <div className={`text-xs ${signal.result === 'profit' ? 'text-success' : 'text-destructive'}`}>
                        {signal.pnlPercentage}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        signal.confidence === 'A+' || signal.confidence === 'A' 
                          ? 'bg-success' 
                          : signal.confidence === 'B' 
                          ? 'bg-warning' 
                          : 'bg-destructive'
                      }
                    >
                      {signal.confidence}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={signal.result === 'profit' ? 'default' : 'destructive'}>
                      {signal.result === 'profit' ? 'Profit' : 'Loss'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
    </div>
  );
}