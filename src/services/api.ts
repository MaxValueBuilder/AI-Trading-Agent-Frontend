import { Signal } from '@/types/signal';
import { auth } from '@/lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorDetail = `HTTP error! status: ${response.status}`;
        let errorBody = null;
        try {
          errorBody = await response.json();
          errorDetail = errorBody.detail || errorDetail;
        } catch (e) {
          // If response body is not JSON, use status text
        }
        
        // Create a custom error with response data
        const error = new Error(errorDetail) as any;
        error.response = {
          status: response.status,
          data: errorBody
        };
        throw error;
      }
      
      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  async authenticatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    // Get current user's ID token
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    const idToken = await currentUser.getIdToken();
    
    // Merge Authorization header with existing options
    const authOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        'Authorization': `Bearer ${idToken}`,
      },
    };

    return this.request<T>(endpoint, authOptions);
  }

  // Authentication endpoints
  async upsertMe(idToken: string, fcmToken?: string, language: string = 'en', displayName?: string, provider?: string): Promise<any> {
    return this.request('/api/v1/auth/me', {
      method: 'POST',
      body: JSON.stringify({ 
        id_token: idToken, 
        fcm_token: fcmToken, 
        language, 
        display_name: displayName,
        provider: provider || 'email'
      }),
    });
  }

  async updateUserProfile(data: { display_name?: string; language?: string; photo_url?: string }): Promise<any> {
    return this.authenticatedRequest('/api/v1/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async logPasswordChange(): Promise<any> {
    return this.authenticatedRequest('/api/v1/auth/password-changed', {
      method: 'POST',
    });
  }

  async updateUserFCMToken(idToken: string, fcmToken: string, language: string = 'en'): Promise<any> {
    console.log('updateUserFCMToken called with:', { idToken: idToken ? 'present' : 'missing', fcmToken, language });
    
    return this.request('/api/v1/auth/fcm-token', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({ fcm_token: fcmToken, language }),
    });
  }

  // Signal endpoints
  async getSignals(): Promise<Signal[]> {
    return this.request('/api/v1/signals/');
  }

  async getSignalsFiltered(filters: {
    pair?: string;
    status?: string;
    strategy?: string;
    limit?: number;
    offset?: number;
    age_filter?: 'active' | 'expired'; // active = within 24h, expired = older than 24h
  } = {}): Promise<{ signals: Signal[]; total: number }> {
    const params = new URLSearchParams();
    
    if (filters.pair) params.append('pair', filters.pair);
    if (filters.status) params.append('status', filters.status);
    if (filters.strategy) params.append('strategy', filters.strategy);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());
    if (filters.age_filter) params.append('age_filter', filters.age_filter);

    const queryString = params.toString();
    const endpoint = queryString ? `/api/v1/signals/?${queryString}` : '/api/v1/signals/';
    
    const rawSignals = await this.request<any[]>(endpoint);
    // Transform signals to include version info and AI-adjusted levels
    const signals: Signal[] = rawSignals.map(signal => {
      const transformedSignal = {
        ...signal,
        // Determine version based on status
        version: ['RAW', 'PROCESSING', 'FAILED'].includes(signal.status) ? 'v1' : 'v2',
        // Include AI-adjusted levels if available from signal_versions table
        ai_adjusted_entry: signal.latest_version?.entry || undefined,
        ai_adjusted_stop_loss: signal.latest_version?.stop_loss || undefined,
        ai_adjusted_take_profits: signal.latest_version?.take_profits || undefined,
      };
    
      return transformedSignal;
    });
    
    return { signals, total: signals.length }; // Backend doesn't return total count, so using signals.length
  }

  async getSignal(id: number): Promise<Signal> {
    return this.request(`/api/v1/signals/${id}`);
  }

  async getSignalById(id: string): Promise<Signal> {
    return this.request(`/api/v1/signals/${id}`);
  }

  async getSignalsByStrategy(strategy: string): Promise<Signal[]> {
    return this.request(`/api/v1/signals/strategy/${strategy}`);
  }

  async getSignalsBySymbol(symbol: string): Promise<Signal[]> {
    return this.request(`/api/v1/signals/symbol/${symbol}`);
  }

  // Statistics endpoints
  async getSignalStats(): Promise<any> {
    return this.request('/api/v1/signals/stats/summary');
  }

  // AI Analysis endpoints
  async getAIAnalysis(signalId: number): Promise<any> {
    return this.request(`/api/v1/ai-analysis/analysis/${signalId}`);
  }

  async triggerAIAnalysis(signalId: number): Promise<any> {
    return this.request(`/api/v1/ai-analysis/analyze/${signalId}`, {
      method: 'POST',
      body: JSON.stringify({}),
    });
  }

  async getAIAnalysisStats(): Promise<any> {
    return this.request('/api/v1/ai-analysis/stats');
  }

  // Market data endpoints (using CoinMarketCap via backend)
  async getFearAndGreedIndex(): Promise<any> {
    try {
      const data = await this.request<any>('/api/v1/market/fear-greed-index');
      // Transform to match the expected format
      return {
        data: [{
          value: data.value,
          value_classification: data.value_classification,
          timestamp: data.timestamp
        }]
      };
    } catch (error) {
      console.error('Failed to fetch Fear & Greed Index:', error);
      return { data: [{ value: '50', value_classification: 'Neutral' }] };
    }
  }

  async getGlobalMarketData(): Promise<any> {
    try {
      const data = await this.request<any>('/api/v1/market/global-metrics');
      // Transform CoinMarketCap data to match expected format
      return {
        data: {
          total_market_cap: { usd: data.total_market_cap },
          total_volume_24h: { usd: data.total_volume_24h },
          market_cap_percentage: { 
            btc: data.btc_dominance,
            eth: data.eth_dominance 
          },
          market_cap_change_percentage_24h_usd: data.market_cap_change_percentage_24h,
          active_cryptocurrencies: data.active_cryptocurrencies,
          markets: data.active_exchanges
        }
      };
    } catch (error) {
      console.error('Failed to fetch global market data:', error);
      return {
        data: {
          market_cap_percentage: { btc: 0, eth: 0 },
          total_market_cap: { usd: 0 },
          total_volume_24h: { usd: 0 },
          market_cap_change_percentage_24h_usd: 0
        }
      };
    }
  }

  async getMarketCapChart(): Promise<any> {
    try {
      // Get Bitcoin price chart as a proxy for market trends (7 days, simplified)
      const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30&interval=daily');
      if (!response.ok) {
        throw new Error('Failed to fetch market cap chart data');
      }
      const data = await response.json();
      
      // Transform to our format using market_caps data
      return {
        market_cap_chart: {
          timestamps: data.market_caps?.map((item: any) => item[0]) || [],
          market_caps: data.market_caps?.map((item: any) => item[1]) || []
        }
      };
    } catch (error) {
      console.error('Failed to fetch market cap chart data:', error);
      return { market_cap_chart: { timestamps: [], market_caps: [] } };
    }
  }
}

export const apiService = new ApiService(); 