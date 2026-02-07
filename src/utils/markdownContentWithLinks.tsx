import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

// ==================== Types ====================

export interface ContentLink {
  id: string;
  text_en: string;
  text_ar: string;
  href: string;
  type: string;
}

interface ContentPart {
  type: 'text' | 'link';
  content?: string;
  text?: string;
  href?: string;
  linkType?: string;
}

/**
 * Renders content with embedded link placeholders
 * 
 * @param content - The content string with [PLACEHOLDER] markers
 * @param links - Array of link objects with id, text, and href
 * @param language - Current language ('en' or 'ar')
 * @param linkClassName - Optional CSS class for links
 * @returns Array of React elements (text and links)
 * 
 * @example
 * const content = "See our [PRIVACY_POLICY] for details.";

/**
 * Checks if a URL is external
 */
const isExternalUrl = (href?: string): boolean => {
  if (!href) return false;
  return href.startsWith('http') || href.startsWith('mailto:');
};


const replaceLinkPlaceholders = (
  content: string,
  links: ContentLink[],
  language: 'en' | 'ar'
): string => {
  let processedContent = content;
  
  links.forEach(link => {
    const linkText = language === 'ar' ? link.text_ar : link.text_en;
    const regex = new RegExp(`\\[${link.id}\\]`, 'g');
    processedContent = processedContent.replace(regex, `[${linkText}](${link.href})`);
  });
  
  return processedContent;
};

const createMarkdownComponents = (): Components => ({
  // Paragraphs
  p: ({ children }) => (
    <p className="text-crypto-text-secondary mb-4 leading-relaxed">
      {children}
    </p>
  ),
  
  // Bold text
  strong: ({ children }) => (
    <strong className="font-bold text-crypto-text-primary">
      {children}
    </strong>
  ),
  
  // Italic text
  em: ({ children }) => (
    <em className="italic">
      {children}
    </em>
  ),
  
  // Headings
  h1: ({ children }) => (
    <h1 className="text-2xl font-bold text-crypto-text-primary mb-4 mt-8">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-xl font-bold text-crypto-text-primary mb-4 mt-6">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-lg font-bold text-crypto-text-primary mb-3 mt-5">
      {children}
    </h3>
  ),
  
  // Links (internal/external)
  a: ({ href, children }) => {
    if (isExternalUrl(href)) {
      return (
        <a
          href={href}
          className="text-crypto-green hover:text-crypto-green/80 underline transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    
    return (
      <Link
        to={href || '#'}
        className="text-crypto-green hover:text-crypto-green/80 underline transition-colors"
      >
        {children}
      </Link>
    );
  },
  
  // Lists
  ul: ({ children }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-crypto-text-secondary">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-crypto-text-secondary">
      {children}
    </ol>
  ),
  li: ({ children }) => (
    <li className="leading-relaxed">
      {children}
    </li>
  ),
  
  // Inline code
  code: ({ children }) => (
    <code className="bg-crypto-card px-1.5 py-0.5 rounded text-sm font-mono text-crypto-green">
      {children}
    </code>
  ),
  
  // Blockquotes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-crypto-green pl-4 italic text-crypto-text-secondary mb-4">
      {children}
    </blockquote>
  ),
});


export const MarkdownContentWithLinks: React.FC<{
  content: string;
  links: ContentLink[];
  language?: 'en' | 'ar';
}> = ({ content, links, language = 'en' }) => {
  // Memoize processed content to avoid re-processing on every render
  const processedContent = useMemo(
    () => replaceLinkPlaceholders(content, links, language),
    [content, links, language]
  );

  // Memoize components to avoid recreation on every render
  const components = useMemo(() => createMarkdownComponents(), []);

  if (!content) return null;

  return (
    <ReactMarkdown components={components}>
      {processedContent}
    </ReactMarkdown>
  );
};

