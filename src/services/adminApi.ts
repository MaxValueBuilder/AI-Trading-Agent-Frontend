import { apiService } from './api';

export interface SystemMetrics {
  total_signals: number;
  signals_today: number;
  signals_this_week: number;
  signals_pending_enrichment: number;
  signals_with_ai_complete: number;
  failed_signals_count: number;
  total_users: number;
  active_users: number;
  users_with_fcm_tokens: number;
  signups_today: number;
  signups_this_week: number;
  last_signal_timestamp?: string;
}

export interface SignalAnalytics {
  signals_by_pair: Record<string, number>;
  signals_by_strategy: Record<string, number>;
  signals_by_direction: Record<string, number>;
  signals_by_status: Record<string, number>;
  quality_score_distribution: Record<string, number>;
}

class AdminApiService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  // User Management
  async getUsers(page: number = 1, pageSize: number = 50, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
      ...filters
    });
    
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/users?${params}`);
  }

  async updateUserRole(userId: string, newRole: string, reason?: string) {
    console.log('🔧 updateUserRole called with:', { userId, newRole, reason });
    return await apiService.authenticatedRequest<any>('/api/v1/admin/users/role', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, new_role: newRole, reason })
    });
  }

  // Signal Management
  async getSignalsAdmin(page: number = 1, pageSize: number = 50, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    
    if (filters) {
      if (filters.pair) params.append('pair', filters.pair);
      if (filters.status) params.append('status', filters.status);
      if (filters.direction) params.append('direction', filters.direction);
      if (filters.strategy) params.append('strategy', filters.strategy);
    }
    
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/signals/list?${params}`);
  }

  async retrySignalEnrichment(signalId: number, forceAiAnalysis: boolean = true) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/signals/retry', {
      method: 'POST',
      body: JSON.stringify({ signal_id: signalId, force_ai_analysis: forceAiAnalysis })
    });
  }

  async editSignal(signalId: number, updates: any, reason: string) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/signals/edit', {
      method: 'POST',
      body: JSON.stringify({ signal_id: signalId, ...updates, reason })
    });
  }

  async deleteSignal(signalId: number, reason: string) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/signals/delete', {
      method: 'POST',
      body: JSON.stringify({ signal_id: signalId, reason })
    });
  }

  // System Configuration
  async getSystemConfig() {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/config');
  }

  async updateConfig(key: string, value: string, reason?: string) {
    const body: any = { key, value };
    if (reason) body.reason = reason;
    
    return await apiService.authenticatedRequest<any>('/api/v1/admin/config', {
      method: 'POST',
      body: JSON.stringify(body)
    });
  }

  // Metrics & Analytics
  async getSystemMetrics() {
    return await apiService.authenticatedRequest<{ metrics: SystemMetrics; timestamp: string }>('/api/v1/admin/metrics');
  }

  async getSignalAnalytics(dateFrom?: string, dateTo?: string) {
    const params = new URLSearchParams();
    if (dateFrom) params.append('date_from', dateFrom);
    if (dateTo) params.append('date_to', dateTo);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/api/v1/admin/analytics/signals?${queryString}` : '/api/v1/admin/analytics/signals';
    
    return await apiService.authenticatedRequest<{ analytics: SignalAnalytics; date_range: any }>(endpoint);
  }

  // Audit Logs
  async getAuditLogs(page: number = 1, pageSize: number = 50, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    
    if (filters) {
      if (filters.admin_user_id) params.append('admin_user_id', filters.admin_user_id);
      if (filters.action) params.append('action', filters.action);
      if (filters.resource_type) params.append('resource_type', filters.resource_type);
    }
    
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/audit-logs?${params}`);
  }

  // User Invitations
  async createInvitation(email: string, role: string, expirationDays: number = 7) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/invitations/create', {
      method: 'POST',
      body: JSON.stringify({ email, role, expiration_days: expirationDays })
    });
  }

  async getInvitations(page: number = 1, pageSize: number = 50, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    
    if (status) params.append('status', status);
    
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/invitations/list?${params}`);
  }

  // Health Check
  async healthCheck() {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/health');
  }

  // CMS - Hero
  async getHero() {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/cms/hero');
  }

  async updateHero(data: any) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/cms/hero', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // CMS - Features
  async getFeatures() {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/features`);
  }

  async createFeature(data: any) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/cms/features', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateFeature(featureId: number, data: any) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/features/${featureId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteFeature(featureId: number) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/features/${featureId}`, {
      method: 'DELETE'
    });
  }

  // CMS - Pricing
  async getPricing(activeOnly: boolean = true) {
    const params = `?active_only=${activeOnly}`;
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/pricing${params}`);
  }

  async createPricing(data: any) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/cms/pricing', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updatePricing(pricingId: number, data: any) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/pricing/${pricingId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deletePricing(pricingId: number) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/pricing/${pricingId}`, {
      method: 'DELETE'
    });
  }

  // CMS - Testimonials
  async getTestimonials(activeOnly: boolean = true) {
    const params = `?active_only=${activeOnly}`;
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/testimonials${params}`);
  }

  async createTestimonial(data: any) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/cms/testimonials', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateTestimonial(testimonialId: number, data: any) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/testimonials/${testimonialId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteTestimonial(testimonialId: number) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/testimonials/${testimonialId}`, {
      method: 'DELETE'
    });
  }

  // CMS - FAQs
  async getFAQs(activeOnly: boolean = true) {
    const params = `?active_only=${activeOnly}`;
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/faqs${params}`);
  }

  async createFAQ(data: any) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/cms/faqs', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateFAQ(faqId: number, data: any) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/faqs/${faqId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteFAQ(faqId: number) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/faqs/${faqId}`, {
      method: 'DELETE'
    });
  }

  // CMS - Documentation Sections
  async getDocumentation() {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/documentation`);
  }

  async createDocumentation(data: any) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/cms/documentation', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateDocumentation(sectionId: number, data: any) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/documentation/${sectionId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteDocumentation(sectionId: number) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/documentation/${sectionId}`, {
      method: 'DELETE'
    });
  }

  // CMS - Legal Pages
  async getLegalPages(publishedOnly: boolean = false) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/legal-pages?published_only=${publishedOnly}`);
  }

  async getLegalPageBySlug(pageSlug: string) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/legal-pages/${pageSlug}`);
  }

  async createLegalPage(data: any) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/cms/legal-pages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateLegalPage(pageId: number, data: any) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/legal-pages/${pageId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async updateLegalPageBySlug(pageSlug: string, data: any) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/legal-pages/slug/${pageSlug}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteLegalPage(pageId: number) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/legal-pages/${pageId}`, {
      method: 'DELETE'
    });
  }

  // CMS - Blog Posts
  async getBlogPosts(publishedOnly: boolean = false) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/blog-posts?published_only=${publishedOnly}`);
  }

  async getBlogPostBySlug(postSlug: string) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/blog-posts/${postSlug}`);
  }

  async createBlogPost(data: any) {
    return await apiService.authenticatedRequest<any>('/api/v1/admin/cms/blog-posts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateBlogPost(postId: number, data: any) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/blog-posts/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  async deleteBlogPost(postId: number) {
    return await apiService.authenticatedRequest<any>(`/api/v1/admin/cms/blog-posts/${postId}`, {
      method: 'DELETE'
    });
  }
}

export const adminApiService = new AdminApiService();

