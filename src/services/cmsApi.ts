import { apiService } from './api';

class CMSApiService {
  private baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

  /**
   * Get hero section content
   */
  async getHero(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/public/cms/hero`);
    const data = await response.json();
    return data;
  }

  /**
   * Get features
   */
  async getFeatures(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/public/cms/features`);
    const data = await response.json();
    return data;
  }

  /**
   * Get pricing plans
   */
  async getPricing(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/public/cms/pricing`);
    const data = await response.json();
    return data;
  }

  /**
   * Get testimonials
   */
  async getTestimonials(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/public/cms/testimonials`);
    const data = await response.json();
    return data;
  }

  /**
   * Get FAQs
   */
  async getFAQs(): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/v1/public/cms/faqs`);
    const data = await response.json();
    return data;
  }
}

export const cmsApiService = new CMSApiService();

