import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminApiService } from "@/services/adminApi";
import {
  Search, 
  RefreshCw, 
  Edit, 
  Trash2, 
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Brain,
  AlertCircle,
  Eye
} from "lucide-react";
import { toast } from "sonner";

interface SignalData {
  id: number;
  pair: string;
  direction: string;
  status: string;
  strategy: string;
  entry: number[];
  stop_loss: number;
  take_profits: number[];
  created_at: string;
  ai_analysis?: any;
  enriched_data?: any;
  latest_version?: any;
}

export default function AdminSignals() {
  const [signals, setSignals] = useState<SignalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [directionFilter, setDirectionFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedSignal, setSelectedSignal] = useState<SignalData | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRetryDialog, setShowRetryDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const pageSize = 20;

  useEffect(() => {
    loadSignals();
  }, [page, statusFilter, directionFilter]);

  const loadSignals = async () => {
    try {
      setLoading(true);
      const filters: any = { page, page_size: pageSize };
      if (statusFilter !== "all") filters.status = statusFilter;
      if (directionFilter !== "all") filters.direction = directionFilter;
      if (search) filters.pair = search;

      const result = await adminApiService.getSignalsAdmin(page, pageSize, filters);
      setSignals(result.signals);
      setTotal(result.total);
    } catch (error) {
      console.error("Error loading signals:", error);
      toast.error("Failed to load signals");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    loadSignals();
  };

  const handleRetry = (signal: SignalData) => {
    setSelectedSignal(signal);
    setShowRetryDialog(true);
  };

  const confirmRetry = async () => {
    if (!selectedSignal) return;

    try {
      await adminApiService.retrySignalEnrichment(selectedSignal.id, true);
      toast.success(`Signal ${selectedSignal.id} queued for re-enrichment`);
      setShowRetryDialog(false);
      loadSignals();
    } catch (error) {
      console.error("Error retrying signal:", error);
      toast.error("Failed to retry signal enrichment");
    }
  };

  const handleDelete = (signal: SignalData) => {
    setSelectedSignal(signal);
    setDeleteReason("");
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!selectedSignal || !deleteReason.trim()) {
      toast.error("Please provide a reason for deletion");
      return;
    }

    try {
      await adminApiService.deleteSignal(selectedSignal.id, deleteReason);
      toast.success(`Signal ${selectedSignal.id} deleted`);
      setShowDeleteDialog(false);
      loadSignals();
    } catch (error) {
      console.error("Error deleting signal:", error);
      toast.error("Failed to delete signal");
    }
  };

  const handleViewDetails = (signal: SignalData) => {
    setSelectedSignal(signal);
    setShowDetailsDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      RAW: { variant: "secondary", label: "Raw" },
      PROCESSING: { variant: "default", label: "Processing" },
      ENRICHED: { variant: "default", label: "Enriched", className: "bg-green-500" },
      FAILED: { variant: "destructive", label: "Failed" },
    };
    const config = variants[status] || variants.RAW;
    return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
  };

  const getDirectionIcon = (direction: string) => {
    return direction === "LONG" ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <>
      <Card className="bg-crypto-card border-crypto-border">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Signal Management</span>
            <Button onClick={loadSignals} size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by pair..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button onClick={handleSearch} size="icon">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="RAW">Raw</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="ENRICHED">Enriched</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={directionFilter} onValueChange={setDirectionFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Directions</SelectItem>
                <SelectItem value="LONG">Long</SelectItem>
                <SelectItem value="SHORT">Short</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Signals Table */}
          {loading ? (
            <div className="text-center py-8 text-crypto-text-secondary">
              Loading signals...
            </div>
          ) : signals.length === 0 ? (
            <div className="text-center py-8 text-crypto-text-secondary">
              No signals found
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pair</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Strategy</TableHead>
                    <TableHead>AI Analysis</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signals.map((signal) => (
                    <TableRow key={signal.id}>
                      <TableCell className="font-mono">{signal.id}</TableCell>
                      <TableCell className="font-medium">{signal.pair}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDirectionIcon(signal.direction)}
                          {signal.direction}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(signal.status)}</TableCell>
                      <TableCell className="text-sm">{signal.strategy}</TableCell>
                      <TableCell>
                        {signal.ai_analysis ? (
                          <Badge variant="outline" className="bg-purple-500/10">
                            <Brain className="w-3 h-3 mr-1" />
                            {signal.ai_analysis.quality_score}
                          </Badge>
                        ) : (
                          <Badge variant="secondary">N/A</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-crypto-text-secondary">
                        {new Date(signal.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(signal)}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetry(signal)}
                            title="Retry Enrichment"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(signal)}
                            title="Delete Signal"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-crypto-text-secondary">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, total)} of {total} signals
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                    disabled={page * pageSize >= total}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Retry Dialog */}
      <Dialog open={showRetryDialog} onOpenChange={setShowRetryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Retry Signal Enrichment</DialogTitle>
            <DialogDescription>
              This will reset the signal status and re-run enrichment and AI analysis for signal #{selectedSignal?.id} ({selectedSignal?.pair}).
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 p-4 border rounded-lg bg-yellow-500/10 border-yellow-500/20">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <div className="text-sm">
              This will delete existing AI analysis and enriched data for this signal.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRetryDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmRetry}>
              Confirm Retry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Signal</DialogTitle>
            <DialogDescription>
              Delete signal #{selectedSignal?.id} ({selectedSignal?.pair})?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 p-4 border rounded-lg bg-red-500/10 border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <div className="text-sm">
                This action cannot be undone. The signal and all its data will be permanently deleted.
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason (Required)</Label>
              <Textarea
                placeholder="Explain why you're deleting this signal..."
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete} 
              disabled={!deleteReason.trim()}
            >
              Delete Signal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Signal Details - #{selectedSignal?.id}</DialogTitle>
            <DialogDescription>
              Complete information for {selectedSignal?.pair} signal
            </DialogDescription>
          </DialogHeader>
          
          {selectedSignal && (
            <div className="space-y-6 py-4">
              {/* Basic Signal Info */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Signal Information</h3>
                <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-crypto-card">
                  <div>
                    <Label className="text-crypto-text-secondary">Pair</Label>
                    <p className="font-medium">{selectedSignal.pair}</p>
                  </div>
                  <div>
                    <Label className="text-crypto-text-secondary">Direction</Label>
                    <p className="font-medium">{selectedSignal.direction}</p>
                  </div>
                  <div>
                    <Label className="text-crypto-text-secondary">Strategy</Label>
                    <p className="text-sm">{selectedSignal.strategy}</p>
                  </div>
                  <div>
                    <Label className="text-crypto-text-secondary">Status</Label>
                    <div className="mt-1">{getStatusBadge(selectedSignal.status)}</div>
                  </div>
                  <div>
                    <Label className="text-crypto-text-secondary">Entry</Label>
                    <p className="text-sm">{selectedSignal.entry?.join(", ")}</p>
                  </div>
                  <div>
                    <Label className="text-crypto-text-secondary">Stop Loss</Label>
                    <p className="text-sm">{selectedSignal.stop_loss}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-crypto-text-secondary">Take Profits</Label>
                    <p className="text-sm">{selectedSignal.take_profits?.join(", ")}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-crypto-text-secondary">Created At</Label>
                    <p className="text-sm">{new Date(selectedSignal.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              {selectedSignal.ai_analysis && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Brain className="w-5 h-5" />
                    AI Analysis
                  </h3>
                  <div className="space-y-4 p-4 border rounded-lg bg-purple-500/5 border-purple-500/20">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-crypto-text-secondary">Quality Score</Label>
                        <p className="text-lg font-bold text-purple-400">
                          {selectedSignal.ai_analysis.quality_score}
                        </p>
                      </div>
                      <div>
                        <Label className="text-crypto-text-secondary">Guardrails</Label>
                        <Badge variant={selectedSignal.ai_analysis.guardrails_passed ? "default" : "destructive"}>
                          {selectedSignal.ai_analysis.guardrails_passed ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Notes/Analysis Summary */}
                    {selectedSignal.ai_analysis.notes && selectedSignal.ai_analysis.notes.length > 0 && (
                      <div>
                        <Label className="text-crypto-text-secondary">Analysis Notes</Label>
                        <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                          {selectedSignal.ai_analysis.notes.map((note: string, idx: number) => (
                            <li key={idx}>{note}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Score Breakdown */}
                    {selectedSignal.ai_analysis.score_breakdown && (
                      <div>
                        <Label className="text-crypto-text-secondary">Score Breakdown</Label>
                        <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                          <div>Trend Alignment: <span className="font-medium">{selectedSignal.ai_analysis.score_breakdown.trend_alignment}</span></div>
                          <div>Liquidity Edge: <span className="font-medium">{selectedSignal.ai_analysis.score_breakdown.liquidity_edge}</span></div>
                          <div>Positioning: <span className="font-medium">{selectedSignal.ai_analysis.score_breakdown.positioning}</span></div>
                          <div>Orderbook Support: <span className="font-medium">{selectedSignal.ai_analysis.score_breakdown.orderbook_support}</span></div>
                          <div>Event Risk: <span className="font-medium">{selectedSignal.ai_analysis.score_breakdown.event_risk}</span></div>
                          <div>Final Score: <span className="font-medium text-purple-400">{selectedSignal.ai_analysis.score_breakdown.final_score}</span></div>
                        </div>
                      </div>
                    )}

                    {/* Guardrails Reasons */}
                    {selectedSignal.ai_analysis.guardrails_reasons && selectedSignal.ai_analysis.guardrails_reasons.length > 0 && (
                      <div>
                        <Label className="text-crypto-text-secondary text-red-400">Guardrails Issues</Label>
                        <ul className="list-disc list-inside text-sm mt-1 space-y-1 text-red-300">
                          {selectedSignal.ai_analysis.guardrails_reasons.map((reason: string, idx: number) => (
                            <li key={idx}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-xs text-crypto-text-secondary">
                      Processing time: {selectedSignal.ai_analysis.processing_time_ms}ms
                    </div>
                  </div>
                </div>
              )}

              {/* Enriched Data */}
              {selectedSignal.enriched_data && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Enriched Market Data</h3>
                  <div className="space-y-4 p-4 border rounded-lg bg-crypto-card">
                    <div className="flex items-center justify-between">
                      <Label className="text-crypto-text-secondary">Data Status</Label>
                      <Badge variant={selectedSignal.enriched_data.stale ? "destructive" : "default"}>
                        {selectedSignal.enriched_data.stale ? "Stale" : "Fresh"}
                      </Badge>
                    </div>
                    
                    {/* Derivatives Data */}
                    {selectedSignal.enriched_data.derivatives && (
                      <div className="space-y-2">
                        <Label className="font-medium">Derivatives Data</Label>
                        <div className="grid grid-cols-2 gap-3 text-sm pl-4">
                          {selectedSignal.enriched_data.derivatives.open_interest && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">Open Interest: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.derivatives.open_interest)}</span>
                            </div>
                          )}
                          {selectedSignal.enriched_data.derivatives.funding_rate && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">Funding Rate: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.derivatives.funding_rate)}</span>
                            </div>
                          )}
                          {selectedSignal.enriched_data.derivatives.long_short_ratio !== undefined && (
                            <div>
                              <span className="text-crypto-text-secondary">Long/Short Ratio: </span>
                              <span className="font-medium">{selectedSignal.enriched_data.derivatives.long_short_ratio}</span>
                            </div>
                          )}
                          {selectedSignal.enriched_data.derivatives.liquidations && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">Liquidations: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.derivatives.liquidations)}</span>
                            </div>
                          )}
                          {selectedSignal.enriched_data.derivatives.heatmap && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">Heatmap: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.derivatives.heatmap)}</span>
                            </div>
                          )}
                          {selectedSignal.enriched_data.derivatives.taker_flow && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">Taker Flow: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.derivatives.taker_flow)}</span>
                            </div>
                          )}
                          {selectedSignal.enriched_data.derivatives.exchange_flows && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">Exchange Flows: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.derivatives.exchange_flows)}</span>
                            </div>
                          )}
                          {selectedSignal.enriched_data.derivatives.exchange_balances && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">Exchange Balances: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.derivatives.exchange_balances)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* CoinAPI Data */}
                    {selectedSignal.enriched_data.coinapi && (
                      <div className="space-y-2">
                        <Label className="font-medium">CoinAPI Data</Label>
                        <div className="grid grid-cols-2 gap-3 text-sm pl-4">
                          {selectedSignal.enriched_data.coinapi.spot_basis && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">Spot Basis: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.coinapi.spot_basis)}</span>
                            </div>
                          )}
                          {selectedSignal.enriched_data.coinapi.orderbook && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">Orderbook: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.coinapi.orderbook)}</span>
                            </div>
                          )}
                          {selectedSignal.enriched_data.coinapi.historical_ticks && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">Historical Ticks: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.coinapi.historical_ticks)}</span>
                            </div>
                          )}
                          {selectedSignal.enriched_data.coinapi.ohlcv && (
                            <div className="col-span-2">
                              <span className="text-crypto-text-secondary">OHLCV: </span>
                              <span className="font-mono text-xs">{JSON.stringify(selectedSignal.enriched_data.coinapi.ohlcv)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sentiment Data */}
                    {selectedSignal.enriched_data.sentiment && (
                      <div className="space-y-2">
                        <Label className="font-medium">Sentiment</Label>
                        <div className="flex gap-4 text-sm pl-4">
                          <div>
                            <span className="text-crypto-text-secondary">Fear & Greed: </span>
                            <span className="font-medium">{selectedSignal.enriched_data.sentiment.fear_greed}</span>
                          </div>
                          <div>
                            <span className="text-crypto-text-secondary">Label: </span>
                            <span className="font-medium">{selectedSignal.enriched_data.sentiment.label}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Macro Events */}
                    {selectedSignal.enriched_data.macro && selectedSignal.enriched_data.macro.length > 0 && (
                      <div className="space-y-2">
                        <Label className="font-medium">Macro Events</Label>
                        <div className="space-y-2 pl-4">
                          {selectedSignal.enriched_data.macro.map((event: any, idx: number) => (
                            <div key={idx} className="text-sm flex gap-2">
                              <Badge variant="outline" className="text-xs">
                                {event.impact}
                              </Badge>
                              <span>{event.event} - {event.time_trt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-crypto-text-secondary">
                      Fetched at: {new Date(selectedSignal.enriched_data.fetched_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

