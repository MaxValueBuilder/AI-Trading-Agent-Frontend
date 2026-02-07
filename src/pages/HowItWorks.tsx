import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap, 
  Target,
  BarChart3,
  Lock,
  Users,
  CheckCircle,
  ArrowRight,
  Bot,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <div className="min-h-screen bg-gradient-to-b from-crypto-bg via-crypto-bg to-crypto-card" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <nav className="bg-crypto-bg/80 backdrop-blur-lg border-b border-crypto-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Bitiq.ai Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-crypto-green to-emerald-400 bg-clip-text text-transparent">
                Bitiq.ai
              </span>
            </div>
            <Link to="/">
              <Button variant="ghost" className="text-crypto-text-primary">
                {t('blog.backToHome')}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="container mx-auto max-w-4xl px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-crypto-text-primary via-crypto-green to-emerald-400 bg-clip-text text-transparent">
              {t('howItWorksPage.hero.title')}
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-crypto-text-secondary">
            <span>{t('howItWorksPage.hero.lastUpdated')}</span>
          </div>
        </div>

        {/* The Idea */}
        <Card className="bg-crypto-card border-crypto-border mb-8">
          <CardContent className="pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-crypto-green/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-crypto-green" />
              </div>
              <h2 className="text-3xl font-bold text-crypto-text-primary">{t('howItWorksPage.idea.title')}</h2>
            </div>
            <p className="text-lg text-crypto-text-secondary leading-relaxed">
              {t('howItWorksPage.idea.description')}
            </p>
          </CardContent>
        </Card>

        {/* Step 1 - AI Market Analysis */}
        <Card className="bg-crypto-card border-crypto-border mb-8">
          <CardContent className="pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-crypto-green/20 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-crypto-green" />
              </div>
              <h2 className="text-3xl font-bold text-crypto-text-primary">{t('howItWorksPage.step1.title')}</h2>
            </div>
            <p className="text-lg text-crypto-text-secondary mb-6 leading-relaxed">
              {t('howItWorksPage.step1.description')}
            </p>
            <div className="bg-crypto-bg/50 rounded-lg p-4">
              <p className="text-crypto-text-primary font-medium">
                {t('howItWorksPage.step1.highlight')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 - Actionable Signals */}
        <Card className="bg-crypto-card border-crypto-border mb-8">
          <CardContent className="pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-crypto-green/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-crypto-green" />
              </div>
              <h2 className="text-3xl font-bold text-crypto-text-primary">{t('howItWorksPage.step2.title')}</h2>
            </div>
            <p className="text-lg text-crypto-text-secondary mb-6 leading-relaxed">
              {t('howItWorksPage.step2.description')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0" />
                <span className="text-crypto-text-primary">{t('howItWorksPage.step2.bullet1')}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0" />
                <span className="text-crypto-text-primary">{t('howItWorksPage.step2.bullet2')}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0" />
                <span className="text-crypto-text-primary">{t('howItWorksPage.step2.bullet3')}</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0" />
                <span className="text-crypto-text-primary">{t('howItWorksPage.step2.bullet4')}</span>
              </div>
            </div>
            <div className="mt-6 bg-crypto-bg/50 rounded-lg p-4">
              <p className="text-crypto-text-primary">
                {t('howItWorksPage.step2.note')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 - Copilot */}
        <Card className="bg-crypto-card border-crypto-border mb-8">
          <CardContent className="pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-crypto-green/20 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-crypto-green" />
              </div>
              <h2 className="text-3xl font-bold text-crypto-text-primary">{t('howItWorksPage.step3.title')}</h2>
            </div>
            <p className="text-lg text-crypto-text-secondary mb-6 leading-relaxed">
              {t('howItWorksPage.step3.description')}
            </p>
            <div className="bg-crypto-yellow/10 border border-crypto-yellow/30 rounded-lg p-4">
              <p className="text-crypto-yellow font-medium">
                {t('howItWorksPage.step3.beta')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 4 - AutoTrade */}
        <Card className="bg-crypto-card border-crypto-border mb-8">
          <CardContent className="pt-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-crypto-green/20 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-crypto-green" />
              </div>
              <h2 className="text-3xl font-bold text-crypto-text-primary">{t('howItWorksPage.step4.title')}</h2>
            </div>
            <p className="text-lg text-crypto-text-secondary mb-6 leading-relaxed">
              {t('howItWorksPage.step4.description')}
            </p>
            <div className="bg-crypto-bg/50 rounded-lg p-6 space-y-3 mb-4">
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-crypto-green mt-0.5 flex-shrink-0" />
                <p className="text-crypto-text-primary">
                  {t('howItWorksPage.step4.security1')}
                </p>
              </div>
              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-crypto-green mt-0.5 flex-shrink-0" />
                <p className="text-crypto-text-primary">
                  {t('howItWorksPage.step4.security2')}
                </p>
              </div>
            </div>
            <div className="bg-crypto-yellow/10 border border-crypto-yellow/30 rounded-lg p-4">
              <p className="text-crypto-yellow font-medium">
                {t('howItWorksPage.step4.beta')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Step 5 - Pricing */}
        <Card className="bg-crypto-card border-crypto-border mb-8">
          <CardContent className="pt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-crypto-green/20 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-crypto-green" />
              </div>
              <h2 className="text-3xl font-bold text-crypto-text-primary">{t('howItWorksPage.step5.title')}</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-crypto-border">
                    <th className="text-left py-3 px-4 text-crypto-text-primary font-semibold">{t('howItWorksPage.step5.plan')}</th>
                    <th className="text-left py-3 px-4 text-crypto-text-primary font-semibold">{t('howItWorksPage.step5.price')}</th>
                    <th className="text-left py-3 px-4 text-crypto-text-primary font-semibold">{t('howItWorksPage.step5.highlights')}</th>
                  </tr>
                </thead>
                <tbody className="text-crypto-text-secondary">
                  <tr className="border-b border-crypto-border">
                    <td className="py-4 px-4 font-medium text-crypto-text-primary">{t('howItWorksPage.step5.freePlan')}</td>
                    <td className="py-4 px-4">$0</td>
                    <td className="py-4 px-4">{t('howItWorksPage.step5.freePlanHighlights')}</td>
                  </tr>
                  <tr className="border-b border-crypto-border">
                    <td className="py-4 px-4 font-medium text-crypto-text-primary">{t('howItWorksPage.step5.monthlyPlan')}</td>
                    <td className="py-4 px-4">$59</td>
                    <td className="py-4 px-4">{t('howItWorksPage.step5.monthlyPlanHighlights')}</td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4 font-medium text-crypto-text-primary">{t('howItWorksPage.step5.lifetimePlan')}</td>
                    <td className="py-4 px-4">$399</td>
                    <td className="py-4 px-4">{t('howItWorksPage.step5.lifetimePlanHighlights')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 bg-crypto-bg/50 rounded-lg p-4 space-y-2">
              <p className="text-crypto-text-primary">
                {t('howItWorksPage.step5.payment')}
              </p>
              <p className="text-crypto-text-secondary">
                {t('howItWorksPage.step5.guarantee')}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Safety */}
        <Card className="bg-crypto-card border-crypto-border mb-8">
          <CardContent className="pt-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-crypto-green/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-crypto-green" />
              </div>
              <h2 className="text-3xl font-bold text-crypto-text-primary">{t('howItWorksPage.safety.title')}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-crypto-green mt-0.5 flex-shrink-0" />
                <span className="text-crypto-text-primary">{t('howItWorksPage.safety.bullet1')}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-crypto-green mt-0.5 flex-shrink-0" />
                <span className="text-crypto-text-primary">{t('howItWorksPage.safety.bullet2')}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-crypto-green mt-0.5 flex-shrink-0" />
                <span className="text-crypto-text-primary">{t('howItWorksPage.safety.bullet3')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community CTA */}
        <Card className="bg-gradient-to-r from-crypto-green/20 via-emerald-500/20 to-crypto-green/20 border-crypto-green/30">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-6 h-6 text-crypto-green" />
              <h2 className="text-2xl md:text-3xl font-bold text-crypto-text-primary">{t('howItWorksPage.community.title')}</h2>
            </div>
            <p className="text-lg md:text-xl text-crypto-text-secondary mb-8 max-w-2xl mx-auto">
              {t('howItWorksPage.community.description')}
            </p>
            <Link to="/login" className="inline-block w-full sm:w-auto">
              <Button size="lg" className="bg-crypto-green hover:bg-crypto-green/90 text-white text-base md:text-lg px-6 md:px-8 py-6 w-full sm:w-auto flex items-center justify-center gap-2">
                {isRTL ? <ArrowRight className="w-5 h-5 rotate-180 flex-shrink-0" /> : null}
                <span className="truncate">{t('howItWorksPage.community.cta')}</span>
                {!isRTL ? <ArrowRight className="w-5 h-5 flex-shrink-0" /> : null}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-crypto-border bg-crypto-card/50 mt-16">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm text-crypto-text-secondary">
            © 2025 Bitiq.ai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HowItWorks;
