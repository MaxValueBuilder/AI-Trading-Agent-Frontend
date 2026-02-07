export interface Signal {
  id: number;
  alert_id: string;
  pair: string;
  direction: 'LONG' | 'SHORT';
  // Original v1 levels (always present)
  entry: number[];
  stop_loss: number;
  take_profits: number[];
  // AI-adjusted v2 levels (present when status = ENRICHED)
  ai_adjusted_entry?: number[];
  ai_adjusted_stop_loss?: number;
  ai_adjusted_take_profits?: number[];
  timeframe: string;
  strategy: string;
  status: 'RAW' | 'PROCESSING' | 'ENRICHED' | 'FAILED';
  // Version flag derived from status
  version: 'v1' | 'v2';
  created_at: string;
  updated_at?: string;
  screenshot_15m?: string;
  screenshot_1h?: string;
  note?: string;
  // M4: AI Analysis fields
  ai_analysis?: AIAnalysis;
}

export interface AIAnalysis {
  notes: string[];
  quality_score: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C';
  score_breakdown: ScoreBreakdown;
  proposed_adjustments?: ProposedAdjustments;
  applied_adjustments?: ProposedAdjustments;
  guardrails_passed: boolean;
  guardrails_reasons?: string[];
  processing_time_ms: number;
  language: string;
}

export interface ScoreBreakdown {
  trend_alignment: number;
  liquidity_edge: number;
  positioning: number;
  orderbook_support: number;
  event_risk: number;
  penalties: Record<string, number>;
  raw_score: number;
  final_score: number;
}

export interface ProposedAdjustments {
  entry?: number;
  stop_loss?: number;
  take_profits?: number[];
}