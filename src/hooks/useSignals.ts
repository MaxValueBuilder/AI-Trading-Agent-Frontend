import { useState, useEffect } from 'react';
import { Signal } from '@/types/signal';
import { apiService } from '@/services/api';
import { useNotificationStore } from '@/stores/notificationStore';

export interface SignalFilters {
  pair?: string;
  status?: string;
  strategy?: string;
  limit?: number;
  offset?: number;
  age_filter?: 'active' | 'expired'; // active = within 24h, expired = older than 24h
}

export interface SignalStats {
  total: number;
  executed: number;
  success_rate: number;
  by_pair: Record<string, number>;
  by_strategy: Record<string, number>;
}

export function useSignals(filters: SignalFilters = {}) {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Get notification store actions
  const { refreshSignals } = useNotificationStore();

  const fetchSignals = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiService.getSignalsFiltered(filters);      
      
      // Additional processing if needed for version detection
      const processedSignals: Signal[] = result.signals.map(signal => ({
        ...signal,
        // Ensure version is correctly set based on status
        version: signal.version || (['RAW', 'PROCESSING', 'FAILED'].includes(signal.status) ? 'v1' : 'v2'),
      }));
      
      setSignals(processedSignals);
      setTotal(result.total);
      console.log("📊 Processed signals with versions:", processedSignals.map(s => ({ id: s.id, status: s.status, version: s.version })));
      
      // Clear notification indicator when signals are refreshed
      refreshSignals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch signals');
      console.error('Error fetching signals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, [filters.pair, filters.status, filters.strategy, filters.limit, filters.offset, filters.age_filter]);

  return {
    signals,
    loading,
    error,
    total,
    refetch: fetchSignals,
  };
}

export function useSignalStats() {
  const [stats, setStats] = useState<SignalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiService.getSignalStats();
      setStats(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

export function useSignal(id: number) {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignal = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiService.getSignal(id);
      setSignal(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch signal');
      console.error('Error fetching signal:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSignal();
    }
  }, [id]);

  return {
    signal,
    loading,
    error,
    refetch: fetchSignal,
  };
} 