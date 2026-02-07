import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface CMSContent {
  [key: string]: any;
}

interface CacheEntry {
  content: CMSContent;
  timestamp: number;
  language: string;
}

const CACHE_DURATION = 3600000; // 1 hour in milliseconds
const CACHE_KEY_PREFIX = 'cms_content_';

/**
 * Hook to fetch and cache CMS content with fallback to i18n
 * @param section - Content section (e.g., 'hero', 'features')
 * @returns CMS content or fallback to i18n translations
 */
export function useCMSContent(section: string) {
  const { i18n } = useTranslation();
  const [content, setContent] = useState<CMSContent | null>(null);
  const [loading, setLoading] = useState(false);
  const language = i18n.language;

  useEffect(() => {
    loadContent();
  }, [section, language]);

  const loadContent = async () => {
    // Check cache first
    const cacheKey = `${CACHE_KEY_PREFIX}${section}_${language}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      try {
        const entry: CacheEntry = JSON.parse(cached);
        const now = Date.now();
        
        // Return cached content if still valid
        if (now - entry.timestamp < CACHE_DURATION && entry.language === language) {
          setContent(entry.content);
          return;
        }
      } catch (e) {
        // If cache is corrupted, clear it
        localStorage.removeItem(cacheKey);
      }
    }

    // Fetch from API (only if section exists)
    if (section) {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/public/cms/${section}?lang=${language}`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          // Extract content based on section type
          // API returns: {content: {...}} for hero, {features: [...]} for features, etc.
          let extractedContent = data;
          if (section === 'hero' && data.content) {
            extractedContent = data.content;
          } else if (section === 'features' && data.features) {
            extractedContent = data.features;
          } else if (section === 'pricing' && data.pricing) {
            extractedContent = data.pricing;
          } else if (section === 'testimonials' && data.testimonials) {
            extractedContent = data.testimonials;
          } else if (section === 'faqs' && data.faqs) {
            extractedContent = data.faqs;
          } else if (section === 'documentation' && data.sections) {
            extractedContent = data.sections;
          } else if (section === 'blog-posts' && data.posts) {
            extractedContent = data.posts;
          }
          
          // Cache the extracted content
          const cacheEntry: CacheEntry = {
            content: extractedContent,
            timestamp: Date.now(),
            language: language
          };
          localStorage.setItem(cacheKey, JSON.stringify(cacheEntry));
          
          setContent(extractedContent);
        } else {
          setContent(null);
        }
      } catch (error) {
        console.error(`Error fetching CMS content for ${section}:`, error);
        setContent(null);
      } finally {
        setLoading(false);
      }
    } else {
      setContent(null);
    }
  };

  const invalidateCache = () => {
    // Clear all CMS cache entries
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
    loadContent(); // Reload
  };

  return { content, loading, invalidateCache };
}

/**
 * Hook to get a specific CMS content value with i18n fallback
 * @param section - Content section
 * @param key - Content key (e.g., 'title')
 * @param fallbackKey - i18n fallback key (e.g., 'landing.hero.title1')
 */
export function useCMSValue(
  section: string,
  key: string,
  fallbackKey: string
): string {
  const { content } = useCMSContent(section);
  const { t } = useTranslation();

  if (content && content[key]) {
    return content[key];
  }
  
  return t(fallbackKey);
}

/**
 * Hook to get CMS content with nested key support
 * @param section - Content section
 * @param path - Nested path (e.g., 'hero.title')
 */
export function useCMSNested(
  section: string,
  path: string
): any {
  const { content } = useCMSContent(section);
  
  if (!content) return null;
  
  return path.split('.').reduce((obj, key) => obj?.[key], content);
}

