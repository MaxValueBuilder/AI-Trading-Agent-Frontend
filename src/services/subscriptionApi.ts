import { auth } from '@/lib/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface SubscriptionPlan {
  plan: 'free' | 'monthly' | 'lifetime';
  name: string;
  price_usd: number;
  duration_days?: number;
  features: string[];
  crypto_prices?: Record<string, number>;
  is_popular: boolean;
  description: string;
}

export interface UserSubscription {
  has_subscription: boolean;
  plan: 'free' | 'monthly' | 'lifetime';
  status: string;
  expires_at?: string;
  auto_renew: boolean;
  days_remaining?: number;
}

export interface Payment {
  payment_id: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  amount: number;
  currency: string;
  plan: 'free' | 'monthly' | 'lifetime';
  payment_url?: string;
  expires_at?: string;
  paid_at?: string;
  oxapay_payment_id?: string;
  oxapay_tx_hash?: string;
  oxapay_address?: string;
  oxapay_network?: string;
}

class SubscriptionApiService {
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
        try {
          const errorBody = await response.json();
          errorDetail = errorBody.detail || errorDetail;
          console.error('API error response:', errorBody);
        } catch (e) {
          // If response body is not JSON, use status text
        }
        throw new Error(errorDetail);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
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

  async publicRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, options);
  }

  // Subscription Plans
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const response = await this.request<{ plans: SubscriptionPlan[] }>('/api/v1/subscription/plans');
    return response.plans;
  }

  async getSubscriptionPlan(plan: string): Promise<SubscriptionPlan> {
    return this.request<SubscriptionPlan>(`/api/v1/subscription/plans/${plan}`);
  }

  // User Subscription
  async getUserSubscriptionStatus(): Promise<UserSubscription> {
    return this.authenticatedRequest<UserSubscription>('/api/v1/subscription/status');
  }

  async getSubscriptionUsage(): Promise<any> {
    return this.authenticatedRequest('/api/v1/subscription/usage');
  }

  // Payment Processing
  async initiatePayment(plan: string, currency: string = 'USD'): Promise<{
    success: boolean;
    payment_id?: number;
    payment_url?: string;
    expires_at?: string;
    subscription?: any;
    payment_required: boolean;
    error?: string;
  }> {
    return this.authenticatedRequest('/api/v1/subscription/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ plan, currency }),
    });
  }

  async getPaymentStatus(paymentId: number): Promise<Payment> {
    return this.authenticatedRequest<Payment>(`/api/v1/subscription/payments/${paymentId}`);
  }

  async getPaymentByOrderId(orderId: string): Promise<Payment> {
    return this.authenticatedRequest<Payment>(`/api/v1/subscription/payments/by-order/${orderId}`);
  }

  async getPaymentByOrderIdPublic(orderId: string): Promise<Payment> {
    return this.publicRequest<Payment>(`/api/v1/subscription/payments/public/by-order/${orderId}`);
  }

  async getPaymentHistory(limit: number = 10): Promise<{ payments: Payment[]; total: number }> {
    return this.authenticatedRequest(`/api/v1/subscription/payments?limit=${limit}`);
  }

  // Admin endpoints
  async getSubscriptionStats(): Promise<any> {
    return this.authenticatedRequest('/api/v1/subscription/admin/stats/subscriptions');
  }

  async getPaymentStats(): Promise<any> {
    return this.authenticatedRequest('/api/v1/subscription/admin/stats/payments');
  }
}

export const subscriptionApiService = new SubscriptionApiService();
