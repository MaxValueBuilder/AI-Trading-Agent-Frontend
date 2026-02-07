import { useState, useEffect } from 'react';
import { apiService } from '@/services/api';

interface LegalLink {
  id: string;
  text_en: string;
  text_ar: string;
  href: string;
  type: string;
}

interface LegalPage {
  id?: number;
  page_slug: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  links: LegalLink[];
  effective_date?: string;
  meta_title_en?: string;
  meta_title_ar?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
  published: boolean;
}

export const useLegalPage = (pageSlug: string) => {
  const [content, setContent] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLegalPage = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get from cache first
        const cacheKey = `legal_page_${pageSlug}`;
        const cached = localStorage.getItem(cacheKey);
        
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          // Cache for 1 hour
          if (now - timestamp < 3600000) {
            setContent(data);
            setLoading(false);
            return;
          }
        }

        // Fetch from API
        const response = await apiService.request<LegalPage>(
          `/api/v1/public/cms/legal-pages/${pageSlug}`
        );

        setContent(response);
        
        // Cache the response
        localStorage.setItem(cacheKey, JSON.stringify({
          data: response,
          timestamp: Date.now()
        }));
      } catch (err: any) {
        console.error(`Error fetching legal page ${pageSlug}:`, err);
        setError(err.message || 'Failed to load legal page');
      } finally {
        setLoading(false);
      }
    };

    if (pageSlug) {
      fetchLegalPage();
    }
  }, [pageSlug]);

  return { content, loading, error };
};

