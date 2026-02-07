import { ReactNode, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useRTL } from "@/hooks/useRTL";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

// ==================== Types ====================

interface LegalLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  metaTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
}

// ==================== Constants ====================

const SITE_NAME = "Bitiq.ai";
const LOGO_PATH = "/images/logo.png";

// ==================== Component ====================

const LegalLayout = ({ 
  children, 
  title, 
  metaTitle, 
  metaDescription, 
  canonicalUrl 
}: LegalLayoutProps) => {
  const { isRTL } = useRTL();
  const { t } = useTranslation();

  // Memoize computed values
  const finalMetaTitle = useMemo(() => metaTitle || title, [metaTitle, title]);
  const finalMetaDescription = useMemo(() => metaDescription , [metaDescription]);
  const finalCanonicalUrl = useMemo(
    () => canonicalUrl || `https://bitiq.ai${window.location.pathname}`,
    [canonicalUrl]
  );

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-crypto-bg" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{finalMetaTitle}</title>
        <meta name="description" content={finalMetaDescription} />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph */}
        <meta property="og:title" content={finalMetaTitle} />
        <meta property="og:description" content={finalMetaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={finalCanonicalUrl} />
        <meta property="og:site_name" content={SITE_NAME} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={finalMetaTitle} />
        <meta name="twitter:description" content={finalMetaDescription} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={finalCanonicalUrl} />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-crypto-border bg-crypto-card/50 backdrop-blur-lg">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <img 
              src={LOGO_PATH}
              alt={`${SITE_NAME} Logo`}
              className="w-10 h-10"
              loading="eager"
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-crypto-green to-emerald-400 bg-clip-text text-transparent">
              {SITE_NAME}
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="space-y-8">
          {/* Title Section */}
          <header className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-crypto-text-primary">
              {title}
            </h1>    
          </header>

          {/* Content */}
          <section className="prose prose-invert max-w-none">
            {children}
          </section>
        </article>
      </main>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-crypto-border bg-crypto-card/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img 
                  src="/images/logo.png" 
                  alt="Bitiq.ai Logo" 
                  className="w-10 h-10"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-crypto-green to-emerald-400 bg-clip-text text-transparent">
                  Bitiq.ai
                </span>
              </div>
              <p className="text-sm text-crypto-text-secondary">
                {t('landing.footer.description')}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="font-semibold text-crypto-text-primary mb-4">{t('landing.footer.features')}</h3>
              <ul className="space-y-2 text-sm text-crypto-text-secondary">
                <li><Link to="/dashboard" className="hover:text-crypto-green transition-colors">{t('landing.footer.aiSignals')}</Link></li>
                <li><Link to="/copilot" className="hover:text-crypto-green transition-colors">{t('landing.footer.bitiqCopilot')}</Link></li>
                <li><Link to="/auto-trading" className="hover:text-crypto-green transition-colors">{t('landing.footer.bitiqAutoTrade')}</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-crypto-text-primary mb-4">{t('landing.footer.resources')}</h3>
              <ul className="space-y-2 text-sm text-crypto-text-secondary">
                <li><Link to="/blog" className="hover:text-crypto-green transition-colors">{t('landing.footer.blog')}</Link></li>
                <li><Link to="/documentation" className="hover:text-crypto-green transition-colors">{t('landing.footer.documentation')}</Link></li>
                <li><Link to="/how-it-works" className="hover:text-crypto-green transition-colors">{t('landing.footer.howItWorks')}</Link></li>
                <li><a href="/#pricing" className="hover:text-crypto-green transition-colors">{t('landing.footer.pricing')}</a></li>
                <li><a href="/#faq" className="hover:text-crypto-green transition-colors">{t('landing.footer.faq')}</a></li>
                <li><a href="/#testimonials" className="hover:text-crypto-green transition-colors">{t('landing.footer.testimonials')}</a></li>
                <li><Link to="/login" className="hover:text-crypto-green transition-colors">{t('landing.footer.signIn')}</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-crypto-text-primary mb-4">{t('landing.footer.legal')}</h3>
              <ul className="space-y-2 text-sm text-crypto-text-secondary">
                <li><Link to="/legal/terms" className="hover:text-crypto-green transition-colors">{t('landing.footer.termsAndConditions')}</Link></li>
                <li><Link to="/legal/sales-terms" className="hover:text-crypto-green transition-colors">{t('landing.footer.salesTerms')}</Link></li>
                <li><Link to="/legal/privacy-policy" className="hover:text-crypto-green transition-colors">{t('landing.footer.privacyPolicy')}</Link></li>
                <li><Link to="/legal/refund-policy" className="hover:text-crypto-green transition-colors">{t('landing.footer.refundPolicy')}</Link></li>
                <li><Link to="/legal/risk-disclosure" className="hover:text-crypto-green transition-colors">{t('landing.footer.riskDisclosure')}</Link></li>
                <li><Link to="/legal/cookie-policy" className="hover:text-crypto-green transition-colors">{t('landing.footer.cookiePolicy')}</Link></li>
                <li><Link to="/legal/acceptable-use" className="hover:text-crypto-green transition-colors">{t('landing.footer.acceptableUse')}</Link></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold text-crypto-text-primary mb-4">{t('landing.footer.contact')}</h3>
              <ul className="space-y-2 text-sm text-crypto-text-secondary">
                <li>
                  <a 
                    href="mailto:hello@bitiq.ai" 
                    className="hover:text-crypto-green transition-colors"
                  >
                    {t('landing.footer.email')}: hello@bitiq.ai
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-crypto-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-crypto-text-secondary">
                {t('landing.footer.copyright')}
              </p>
              <div className="flex items-center gap-6 text-sm text-crypto-text-secondary">
                <a href="#" className="hover:text-crypto-green transition-colors">{t('landing.footer.social.twitter')}</a>
                <a 
                  href="https://t.me/c/3281153257/1" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-crypto-green transition-colors"
                >
                  {t('landing.footer.social.telegram')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LegalLayout;
