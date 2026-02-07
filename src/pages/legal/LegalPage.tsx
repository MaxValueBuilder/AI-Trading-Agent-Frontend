import { useParams } from "react-router-dom";
import { useMemo } from "react";
import LegalLayout from "./LegalLayout";
import { useLegalPage } from "@/hooks/useLegalPage";
import { useTranslation } from "react-i18next";
import { MarkdownContentWithLinks } from "@/utils/markdownContentWithLinks";

// ==================== Constants ====================

/**
 * Maps URL slugs to CMS slugs for backward compatibility
 */
const SLUG_MAP: Record<string, string> = {
  'terms': 'terms-and-conditions',
  'acceptable-use': 'acceptable-use-policy'
};

/**
 * Default metadata for each legal page
 */
const DEFAULT_META: Record<string, { title: string; description: string }> = {
  'cookie-policy': {
    title: 'Cookie Policy',
    description: 'Bitiq.ai uses minimal cookies for functionality and analytics.'
  },
  'acceptable-use-policy': {
    title: 'Acceptable Use Policy',
    description: "View Bitiq.ai's AUP outlining permitted and prohibited uses."
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    description: 'Learn how Bitiq.ai collects, uses, and protects your personal data.'
  },
  'refund-policy': {
    title: 'Refund Policy',
    description: "Understand Bitiq.ai's refund terms for crypto payments."
  },
  'risk-disclosure': {
    title: 'Risk Disclosure',
    description: 'Trading crypto involves risk.'
  },
  'sales-terms': {
    title: 'General Terms of Sale',
    description: "Review Bitiq.ai's General Terms of Sale."
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    description: 'Read the official Terms and Conditions for Bitiq.ai.'
  }
};

const FALLBACK_META = { 
  title: 'Legal', 
  description: 'Bitiq.ai Legal Information' 
};

// ==================== Helper Functions ====================

/**
 * Maps URL slug to CMS slug
 */
const getCMSSlug = (urlSlug: string): string => {
  return SLUG_MAP[urlSlug] || urlSlug;
};

/**
 * Gets default metadata for a slug
 */
const getDefaultMeta = (slug: string) => {
  return DEFAULT_META[slug] || FALLBACK_META;
};

// ==================== Component ====================

const LegalPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  
  // Memoize CMS slug to avoid recalculation
  const cmsSlug = useMemo(() => getCMSSlug(slug), [slug]);
  
  // Fetch content from CMS
  const { content, loading, error } = useLegalPage(cmsSlug);
  
  // Memoize metadata
  const defaultMeta = useMemo(() => getDefaultMeta(slug), [slug]);
  const canonicalUrl = useMemo(() => `https://bitiq.ai/legal/${slug}`, [slug]);

  // ==================== Loading State ====================
  
  if (loading) {
    return (
      <LegalLayout 
        title={defaultMeta.title}
        metaTitle={`${defaultMeta.title} – Bitiq.ai`}
        metaDescription={defaultMeta.description}
        canonicalUrl={canonicalUrl}
      >
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto-green" />
          <span className="ml-3 text-crypto-text-secondary">Loading...</span>
        </div>
      </LegalLayout>
    );
  }

  // ==================== Error State ====================
  
  if (error || !content) {
    return (
      <LegalLayout 
        title={defaultMeta.title}
        metaTitle={`${defaultMeta.title} – Bitiq.ai`}
        metaDescription={defaultMeta.description}
        canonicalUrl={canonicalUrl}
      >
        <div className="text-crypto-text-secondary">
          <p>Content not available. Please try again later.</p>
        </div>
      </LegalLayout>
    );
  }

  // ==================== Content Rendering ====================
  
  const currentLanguage = i18n.language as 'en' | 'ar';
  const title = currentLanguage === 'ar' ? content.title_ar : content.title_en;
  const contentText = currentLanguage === 'ar' ? content.content_ar : content.content_en;
  const metaDescription = content.meta_description_en || defaultMeta.description;
  const metaTitle = content.meta_title_en || `${defaultMeta.title} – Bitiq.ai`;

  return (
    <LegalLayout 
      title={title}
      metaTitle={metaTitle}
      metaDescription={metaDescription}
      canonicalUrl={canonicalUrl}
    >
      <div className="space-y-6 text-crypto-text-primary">
        {/* Effective Date Badge */}
        {content.effective_date && (
          <div className="text-sm text-crypto-text-secondary italic border-l-2 border-crypto-green pl-4 py-2 mb-6">
            Effective Date: {content.effective_date}
          </div>
        )}
        
        {/* Main Content with Markdown */}
        <MarkdownContentWithLinks 
          content={contentText} 
          links={content.links || []} 
          language={currentLanguage}
        />
      </div>
    </LegalLayout>
  );
};

export default LegalPage;

