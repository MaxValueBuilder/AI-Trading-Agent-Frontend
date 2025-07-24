import { useQuery } from '@tanstack/react-query';
import { getRealTimePrices, CoinPriceData } from '@/lib/api';

export function useRealTimePrices(symbols: string[]) {
  return useQuery({
    queryKey: ['realTimePrices', symbols],
    queryFn: () => getRealTimePrices(symbols),
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
    refetchIntervalInBackground: true, // Continue refetching even when tab is not active
    staleTime: 0, // Data is always considered stale to ensure fresh updates
    gcTime: 1000 * 60 * 5, // Keep data in cache for 5 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

export function useSingleCoinPrice(symbol: string) {
  return useQuery({
    queryKey: ['singleCoinPrice', symbol],
    queryFn: () => getRealTimePrices([symbol]).then(data => data[0]),
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
} 