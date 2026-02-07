import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  Shield, 
  Zap,
  CheckCircle,
  Star,
  BarChart3,
  Target,
  Clock,
  Users,
  ChevronDown,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
  Bot,
  Settings,
  Activity,
  Send,
  Lock
} from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";
import { useCMSContent } from "@/hooks/useCMSContent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: React.ComponentType<any> } = {
    Brain,
    Activity,
    TrendingUp,
    Shield,
    Zap,
    CheckCircle,
    Star,
    BarChart3,
    Target,
    Clock,
    Users,
    Bot,
    Settings,
    Lock,
    Send,
    Moon,
    Sun,
    Globe,
    Menu,
    X,
    ChevronDown,
    ArrowRight
  };
  
  return icons[iconName] || Brain; // Default to Brain if icon not found
};

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fetch CMS content with fallback to i18n
  const { content: hero, loading: heroLoading } = useCMSContent('hero');
  const { content: features, loading: featuresLoading } = useCMSContent('features');
  const { content: pricing, loading: pricingLoading } = useCMSContent('pricing');
  const { content: testimonials, loading: testimonialsLoading } = useCMSContent('testimonials');
  const { content: faqs, loading: faqsLoading } = useCMSContent('faqs');

  // Note: Removed automatic redirect to allow logged-in users to view Landing page

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle hash navigation (scroll to section on page load)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Small delay to ensure the page is fully rendered
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  // Allow both authenticated and non-authenticated users to view Landing page

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <style>{`
        @keyframes floatRandom1 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -50px) rotate(90deg); }
          50% { transform: translate(-20px, -100px) rotate(180deg); }
          75% { transform: translate(50px, -30px) rotate(270deg); }
        }
        @keyframes floatRandom2 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-40px, 60px) rotate(-90deg); }
          50% { transform: translate(60px, 40px) rotate(-180deg); }
          75% { transform: translate(-30px, -50px) rotate(-270deg); }
        }
        @keyframes floatRandom3 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(50px, 70px) rotate(120deg); }
          50% { transform: translate(-60px, 30px) rotate(240deg); }
          75% { transform: translate(40px, -60px) rotate(360deg); }
        }
        @keyframes floatRandom4 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-50px, -40px) rotate(-120deg); }
          50% { transform: translate(30px, -80px) rotate(-240deg); }
          75% { transform: translate(-40px, 50px) rotate(-360deg); }
        }
        @keyframes floatRandom5 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(70px, -30px) rotate(150deg); }
          50% { transform: translate(-50px, 60px) rotate(300deg); }
          75% { transform: translate(20px, -70px) rotate(450deg); }
        }
        @keyframes floatRandom6 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-30px, 80px) rotate(-150deg); }
          50% { transform: translate(80px, -20px) rotate(-300deg); }
          75% { transform: translate(-60px, -40px) rotate(-450deg); }
        }
        @keyframes floatRandom7 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(40px, 50px) rotate(200deg); }
          50% { transform: translate(-70px, -30px) rotate(400deg); }
          75% { transform: translate(60px, 40px) rotate(600deg); }
        }
        @keyframes floatRandom8 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-60px, 30px) rotate(-200deg); }
          50% { transform: translate(50px, -50px) rotate(-400deg); }
          75% { transform: translate(-20px, 70px) rotate(-600deg); }
        }
        @keyframes floatRandom9 {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(80px, 20px) rotate(250deg); }
          50% { transform: translate(-40px, -60px) rotate(500deg); }
          75% { transform: translate(30px, 50px) rotate(750deg); }
        }
        
        .coin-animation-1 {
          top: 10%;
          left: 5%;
          animation: floatRandom1 20s ease-in-out infinite;
        }
        .coin-animation-2 {
          top: 60%;
          left: 15%;
          animation: floatRandom2 25s ease-in-out infinite;
        }
        .coin-animation-3 {
          top: 30%;
          left: 80%;
          animation: floatRandom3 22s ease-in-out infinite;
        }
        .coin-animation-4 {
          top: 20%;
          left: 70%;
          animation: floatRandom4 18s ease-in-out infinite;
        }
        .coin-animation-5 {
          top: 70%;
          left: 10%;
          animation: floatRandom5 23s ease-in-out infinite;
        }
        .coin-animation-6 {
          top: 50%;
          left: 85%;
          animation: floatRandom6 21s ease-in-out infinite;
        }
        .coin-animation-7 {
          top: 15%;
          left: 40%;
          animation: floatRandom7 24s ease-in-out infinite;
        }
        .coin-animation-8 {
          top: 75%;
          left: 60%;
          animation: floatRandom8 19s ease-in-out infinite;
        }
        .coin-animation-9 {
          top: 45%;
          left: 25%;
          animation: floatRandom9 26s ease-in-out infinite;
        }
      `}</style>
      <div className="min-h-screen bg-gradient-to-b from-crypto-bg via-crypto-bg to-crypto-card" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Navigation Header */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-crypto-bg/80 backdrop-blur-lg border-b border-crypto-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <img 
                src="/images/logo.png" 
                alt="Bitiq.ai Logo" 
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-crypto-green to-emerald-400 bg-clip-text text-transparent whitespace-nowrap">
                Bitiq.ai
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="#features" className="text-crypto-text-secondary hover:text-crypto-text-primary transition-colors whitespace-nowrap">
                {t('landing.nav.features')}
              </a>
              <Link to="/how-it-works" className="text-crypto-text-secondary hover:text-crypto-text-primary transition-colors whitespace-nowrap">
                {t('landing.nav.howItWorks')}
              </Link>
              <a href="#pricing" className="text-crypto-text-secondary hover:text-crypto-text-primary transition-colors whitespace-nowrap">
                {t('landing.nav.pricing')}
              </a>
              <a href="#testimonials" className="text-crypto-text-secondary hover:text-crypto-text-primary transition-colors whitespace-nowrap">
                {t('landing.nav.testimonials')}
              </a>
              <a href="#faq" className="text-crypto-text-secondary hover:text-crypto-text-primary transition-colors whitespace-nowrap">
                {t('landing.nav.faq')}
              </a>
            </div>

            {/* Desktop Right Actions */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="text-crypto-text-secondary hover:text-crypto-text-primary flex-shrink-0"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              {/* Language Selector */}
              <Select value={i18n.language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-[110px] bg-crypto-bg border-crypto-border text-crypto-text-primary flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-crypto-card border-crypto-border">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
              
              {user ? (
                <Link to="/dashboard">
                  <Button className="bg-crypto-green hover:bg-crypto-green/90 text-white flex items-center gap-2 whitespace-nowrap">
                    {isRTL ? <ArrowRight className="w-4 h-4 rotate-180" /> : null}
                    {t('landing.nav.goToDashboard')}
                    {!isRTL ? <ArrowRight className="w-4 h-4" /> : null}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-crypto-text-primary hover:bg-crypto-green/10 hover:text-crypto-green whitespace-nowrap">
                      {t('landing.nav.signIn')}
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button className="bg-crypto-green hover:bg-crypto-green/90 text-white flex items-center gap-2 whitespace-nowrap">
                      {isRTL ? <ArrowRight className="w-4 h-4 rotate-180" /> : null}
                      {t('landing.nav.startFree')}
                      {!isRTL ? <ArrowRight className="w-4 h-4" /> : null}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Right Actions */}
            <div className="flex lg:hidden items-center gap-2">
              {/* Theme Toggle */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleTheme}
                className="text-crypto-text-secondary hover:text-crypto-text-primary flex-shrink-0"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>

              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-crypto-text-primary hover:text-crypto-text-primary hover:bg-crypto-card/50 flex-shrink-0"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden fixed inset-0 top-[73px] bg-crypto-bg backdrop-blur-xl transition-all duration-300 ${
            mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="container mx-auto px-4 py-6 space-y-6 bg-crypto-bg border border-crypto-border rounded-b-lg">
            {/* Mobile Navigation Links */}
            <div className="space-y-4">
              <a 
                href="#features" 
                onClick={closeMobileMenu}
                className="block text-lg text-crypto-text-secondary hover:text-crypto-text-primary transition-colors py-2"
              >
                {t('landing.nav.features')}
              </a>
              <Link 
                to="/how-it-works" 
                onClick={closeMobileMenu}
                className="block text-lg text-crypto-text-secondary hover:text-crypto-text-primary transition-colors py-2"
              >
                {t('landing.nav.howItWorks')}
              </Link>
              <a 
                href="#pricing" 
                onClick={closeMobileMenu}
                className="block text-lg text-crypto-text-secondary hover:text-crypto-text-primary transition-colors py-2"
              >
                {t('landing.nav.pricing')}
              </a>
              <a 
                href="#testimonials" 
                onClick={closeMobileMenu}
                className="block text-lg text-crypto-text-secondary hover:text-crypto-text-primary transition-colors py-2"
              >
                {t('landing.nav.testimonials')}
              </a>
              <a 
                href="#faq" 
                onClick={closeMobileMenu}
                className="block text-lg text-crypto-text-secondary hover:text-crypto-text-primary transition-colors py-2"
              >
                {t('landing.nav.faq')}
              </a>
            </div>

            {/* Language Selector */}
            <div className="pt-4 border-t border-crypto-border">
              <Select value={i18n.language} onValueChange={changeLanguage}>
                <SelectTrigger className="w-full bg-crypto-card border-crypto-border text-crypto-text-primary">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-crypto-card border-crypto-border">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="space-y-3 pt-4">
              {user ? (
                <Link to="/dashboard" className="block" onClick={closeMobileMenu}>
                  <Button className="w-full bg-crypto-green hover:bg-crypto-green/90 text-white flex items-center justify-center gap-2">
                    {isRTL ? <ArrowRight className="w-4 h-4 rotate-180" /> : null}
                    {t('landing.nav.goToDashboard')}
                    {!isRTL ? <ArrowRight className="w-4 h-4" /> : null}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/login" className="block" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full text-crypto-text-primary border-crypto-border hover:bg-crypto-green/10 hover:text-crypto-green">
                      {t('landing.nav.signIn')}
                    </Button>
                  </Link>
                  <Link to="/login" className="block" onClick={closeMobileMenu}>
                    <Button className="w-full bg-crypto-green hover:bg-crypto-green/90 text-white flex items-center justify-center gap-2">
                      {isRTL ? <ArrowRight className="w-4 h-4 rotate-180" /> : null}
                      {t('landing.nav.startFree')}
                      {!isRTL ? <ArrowRight className="w-4 h-4" /> : null}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Animated Background Coins */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Bitcoin Coins */}
          <div className="absolute coin-animation-1">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-crypto-bg/30 rounded-full flex items-center justify-center backdrop-blur-sm p-2">
              <img src="/images/btc.svg" alt="Bitcoin" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="absolute coin-animation-2">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-crypto-bg/30 rounded-full flex items-center justify-center backdrop-blur-sm p-1.5">
              <img src="/images/btc.svg" alt="Bitcoin" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="absolute coin-animation-3">
            <div className="w-9 h-9 md:w-14 md:h-14 bg-crypto-bg/30 rounded-full flex items-center justify-center backdrop-blur-sm p-1.5">
              <img src="/images/btc.svg" alt="Bitcoin" className="w-full h-full object-contain" />
            </div>
          </div>
          
          {/* Ethereum Coins */}
          <div className="absolute coin-animation-4">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-crypto-bg/30 rounded-full flex items-center justify-center backdrop-blur-sm p-2">
              <img src="/images/eth.svg" alt="Ethereum" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="absolute coin-animation-5">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-crypto-bg/30 rounded-full flex items-center justify-center backdrop-blur-sm p-1.5">
              <img src="/images/eth.svg" alt="Ethereum" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="absolute coin-animation-6">
            <div className="w-9 h-9 md:w-14 md:h-14 bg-crypto-bg/30 rounded-full flex items-center justify-center backdrop-blur-sm p-1.5">
              <img src="/images/eth.svg" alt="Ethereum" className="w-full h-full object-contain" />
            </div>
          </div>
          
          {/* Solana Coins */}
          <div className="absolute coin-animation-7">
            <div className="w-10 h-10 md:w-16 md:h-16 bg-crypto-bg/30 rounded-full flex items-center justify-center backdrop-blur-sm p-2">
              <img src="/images/sol.svg" alt="Solana" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="absolute coin-animation-8">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-crypto-bg/30 rounded-full flex items-center justify-center backdrop-blur-sm p-1.5">
              <img src="/images/sol.svg" alt="Solana" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="absolute coin-animation-9">
            <div className="w-9 h-9 md:w-14 md:h-14 bg-crypto-bg/30 rounded-full flex items-center justify-center backdrop-blur-sm p-1.5">
              <img src="/images/sol.svg" alt="Solana" className="w-full h-full object-contain" />
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-crypto-green/10 border border-crypto-green/20 rounded-full text-sm text-crypto-green">
                <Zap className="w-4 h-4" />
                <span>
                {hero?.badge_en 
                  ? (i18n.language === 'ar' ? hero.badge_ar : hero.badge_en)
                  : t('landing.hero.badge')}
                  </span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-crypto-text-primary via-crypto-green to-emerald-400 bg-clip-text text-transparent">
                {hero?.title_en 
                  ? (i18n.language === 'ar' ? hero.title_ar : hero.title_en)
                  : t('landing.hero.title')}
              </span>
            </h1>            
            <p className="text-xl text-crypto-text-secondary max-w-3xl mx-auto leading-relaxed">
              {hero?.subtitle_en
                ? (i18n.language === 'ar' ? hero.subtitle_ar : hero.subtitle_en)
                : t('landing.hero.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/login">
                <Button size="lg" className="bg-crypto-green hover:bg-crypto-green/90 text-white text-lg px-8 py-6 flex items-center gap-2">
                  {isRTL ? <ArrowRight className="w-5 h-5 rotate-180" /> : null}
                  <span>{t('landing.hero.startTrading')}</span>
                  {!isRTL ? <ArrowRight className="w-5 h-5" /> : null}
                </Button>
              </Link>
              <a href="/how-it-works">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-crypto-border hover:bg-crypto-card hover:text-foreground flex items-center gap-2">
                  <span>{t('landing.hero.seeHow')}</span>
                  <ChevronDown className="w-5 h-5" />
                </Button>
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-8">
              <div className="flex flex-col items-center text-center max-w-[200px]">
                <CheckCircle className="w-6 h-6 text-crypto-green mb-2" />
                <div className="font-semibold text-crypto-text-primary mb-1">
                  {t('landing.hero.benefits.startFree.title')}
                </div>
                <div className="text-sm text-crypto-text-secondary">
                  {t('landing.hero.benefits.startFree.subtitle')}
                </div>
              </div>
              <div className="flex flex-col items-center text-center max-w-[200px]">
                <CheckCircle className="w-6 h-6 text-crypto-green mb-2" />
                <div className="font-semibold text-crypto-text-primary mb-1">
                  {t('landing.hero.benefits.payWithCrypto.title')}
                </div>
                <div className="text-sm text-crypto-text-secondary">
                  {t('landing.hero.benefits.payWithCrypto.subtitle')}
                </div>
              </div>
              <div className="flex flex-col items-center text-center max-w-[200px]">
                <CheckCircle className="w-6 h-6 text-crypto-green mb-2" />
                <div className="font-semibold text-crypto-text-primary mb-1">
                  {t('landing.hero.benefits.cancelAnytime.title')}
                </div>
                <div className="text-sm text-crypto-text-secondary">
                  {t('landing.hero.benefits.cancelAnytime.subtitle')}
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual/Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-crypto-card/50 border-crypto-border backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-crypto-green/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-crypto-green" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-crypto-text-primary">98.5%</div>
                    <div className="text-sm text-crypto-text-secondary">{t('landing.hero.stats.accuracy')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-crypto-card/50 border-crypto-border backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-crypto-text-primary">10K+</div>
                    <div className="text-sm text-crypto-text-secondary">{t('landing.hero.stats.traders')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-crypto-card/50 border-crypto-border backdrop-blur">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-crypto-text-primary">&lt;2s</div>
                    <div className="text-sm text-crypto-text-secondary">{t('landing.hero.stats.alerts')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-crypto-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-crypto-text-primary mb-4">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-crypto-text-secondary max-w-2xl mx-auto">
              {t('landing.features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Render CMS Features */}
            {features && features.length > 0 ? (
              features.map((feature: any, index: number) => {
                const IconComponent = feature.icon ? getIconComponent(feature.icon) : null;
                return (
                  <Card key={feature.id || index} className="bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300">
                    <CardContent className="pt-6 space-y-4">
                      {IconComponent && (
                        <div className="w-14 h-14 bg-gradient-to-br from-crypto-green to-emerald-600 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                      )}+
                      <h3 className="text-xl font-bold text-crypto-text-primary">
                        {i18n.language === 'ar' ? feature.title_ar : feature.title_en}
                      </h3>
                      <p className="text-crypto-text-secondary">
                        {i18n.language === 'ar' ? feature.description_ar : feature.description_en}
                      </p>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              /* Fallback to i18n if no CMS features */
              <>
                {/* Feature 1 - AI Market Analysis */}
                <Card className="bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-crypto-green to-emerald-600 rounded-xl flex items-center justify-center">
                      <Brain className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-crypto-text-primary">{t('landing.features.aiMarketAnalysis.title')}</h3>
                    <p className="text-crypto-text-secondary">
                      {t('landing.features.aiMarketAnalysis.description')}
                    </p>
                  </CardContent>
                </Card>

                {/* Feature 2 - Actionable Signals */}
                <Card className="bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center">
                      <Activity className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-crypto-text-primary">{t('landing.features.actionableSignals.title')}</h3>
                    <p className="text-crypto-text-secondary">
                      {t('landing.features.actionableSignals.description')}
                    </p>
                  </CardContent>
                </Card>

                {/* Feature 3 - Copilot */}
                <Card className="bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center">
                      <Bot className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-crypto-text-primary">{t('landing.features.copilot.title')}</h3>
                    <p className="text-crypto-text-secondary">
                      {t('landing.features.copilot.description')}
                    </p>
                    <div className="pt-2 border-t border-crypto-border">
                      <p className="text-xs text-crypto-yellow font-medium">
                        {t('landing.features.copilot.note')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Feature 4 - AutoTrade */}
                <Card className="bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
                      <Settings className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-crypto-text-primary">{t('landing.features.autoTrade.title')}</h3>
                    <p className="text-crypto-text-secondary">
                      {t('landing.features.autoTrade.description')}
                    </p>
                    <div className="pt-2 border-t border-crypto-border">
                      <p className="text-xs text-crypto-yellow font-medium">
                        {t('landing.features.autoTrade.note')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Feature 5 - Built for Safety */}
                <Card className="bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300">
                  <CardContent className="pt-6 space-y-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center">
                      <Lock className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-crypto-text-primary">{t('landing.features.builtForSafety.title')}</h3>
                    <p className="text-crypto-text-secondary">
                      {t('landing.features.builtForSafety.description')}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-crypto-text-primary mb-4">
              {t('landing.examples.title')}
            </h2>
            <p className="text-xl text-crypto-text-secondary max-w-2xl mx-auto">
              {t('landing.examples.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Example Signal 1 */}
            <Card className="bg-crypto-card border-crypto-border">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-crypto-green" />
                    <span className="font-bold text-lg text-crypto-text-primary">BTC/USDT</span>
                    <span className="px-2 py-1 bg-crypto-green/20 text-crypto-green text-xs font-bold rounded">{t('landing.examples.long')}</span>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-crypto-green to-emerald-600 text-white text-sm font-bold rounded-full whitespace-nowrap">
                    A+ {t('landing.examples.score')}
                  </div>
                </div>
                
                <div className="bg-crypto-bg/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-crypto-text-secondary">{t('landing.examples.entry')}</span>
                    <span className="text-crypto-text-primary font-semibold">$95,250</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-crypto-text-secondary">{t('landing.examples.stopLoss')}</span>
                    <span className="text-crypto-red font-semibold">$93,800</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-crypto-text-secondary">{t('landing.examples.takeProfit')}</span>
                    <span className="text-crypto-green font-semibold">$98,500, $101,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-crypto-text-secondary">{t('landing.examples.riskReward')}</span>
                    <span className="text-crypto-text-primary font-semibold">1:2.24</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-crypto-border">
                  <div className="text-xs font-medium text-purple-400 mb-2 flex items-center gap-2">
                    <Brain className="w-3 h-3" />
                    {t('landing.examples.aiAnalysis')}
                  </div>
                  <ul className="space-y-1 text-xs text-crypto-text-secondary list-disc list-inside">
                    <li>{t('landing.examples.insights.btc1')}</li>
                    <li>{t('landing.examples.insights.btc2')}</li>
                    <li>{t('landing.examples.insights.btc3')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Example Signal 2 */}
            <Card className="bg-crypto-card border-crypto-border">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-crypto-green" />
                    <span className="font-bold text-lg text-crypto-text-primary">ETH/USDT</span>
                    <span className="px-2 py-1 bg-crypto-green/20 text-crypto-green text-xs font-bold rounded">{t('landing.examples.long')}</span>
                  </div>
                  <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm font-bold rounded-full whitespace-nowrap">
                    A {t('landing.examples.score')}
                  </div>
                </div>
                
                <div className="bg-crypto-bg/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-crypto-text-secondary">{t('landing.examples.entry')}</span>
                    <span className="text-crypto-text-primary font-semibold">$3,420</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-crypto-text-secondary">{t('landing.examples.stopLoss')}</span>
                    <span className="text-crypto-red font-semibold">$3,350</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-crypto-text-secondary">{t('landing.examples.takeProfit')}</span>
                    <span className="text-crypto-green font-semibold">$3,560, $3,680</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-crypto-text-secondary">{t('landing.examples.riskReward')}</span>
                    <span className="text-crypto-text-primary font-semibold">1:2.00</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-crypto-border">
                  <div className="text-xs font-medium text-purple-400 mb-2 flex items-center gap-2">
                    <Brain className="w-3 h-3" />
                    {t('landing.examples.aiAnalysis')}
                  </div>
                  <ul className="space-y-1 text-xs text-crypto-text-secondary list-disc list-inside">
                    <li>{t('landing.examples.insights.eth1')}</li>
                    <li>{t('landing.examples.insights.eth2')}</li>
                    <li>{t('landing.examples.insights.eth3')}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-crypto-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-crypto-text-primary mb-4">
              {t('landing.pricing.title')}
            </h2>
            <p className="text-xl text-crypto-text-secondary max-w-2xl mx-auto">
              {t('landing.pricing.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Render CMS Pricing Plans */}
            {pricing && pricing.length > 0 ? (
              pricing.map((plan: any, index: number) => {
                const isPopular = plan.plan_tag === 'Most Popular';
                const features = i18n.language === 'ar' ? plan.features_ar : plan.features_en;
                
                return (
                  <Card 
                    key={plan.id || index} 
                    className={`${
                      isPopular 
                        ? 'bg-gradient-to-b from-crypto-green/20 to-crypto-card border-crypto-green relative overflow-hidden' 
                        : 'bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300'
                    }`}
                  >
                    {isPopular && (
                      <>
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-crypto-green to-emerald-400"></div>
                        <div className="absolute top-4 right-4">
                          <span className="px-3 py-1 bg-crypto-green text-white text-xs font-bold rounded-full">
                            {i18n.language === 'ar' ? 'الأكثر شعبية' : t('landing.pricing.popular')}
                          </span>
                        </div>
                      </>
                    )}
                    <CardContent className="pt-8 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-crypto-text-primary">{plan.plan_name}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-4xl font-bold ${isPopular ? 'text-crypto-green' : 'text-crypto-text-primary'}`}>
                            ${plan.price_usd}
                          </span>
                          <span className="text-crypto-text-secondary">{t('landing.pricing.perMonth')}</span>
                        </div>
                        <p className="text-sm text-crypto-text-secondary">
                          {i18n.language === 'ar' ? plan.short_description_ar : plan.short_description_en}
                        </p>
                      </div>

                      <Link to="/login" className="block">
                        <Button 
                          variant={isPopular ? "default" : "outline"} 
                          className={`w-full ${isPopular ? 'bg-crypto-green hover:bg-crypto-green/90 text-white' : 'border-crypto-border hover:bg-crypto-green/10 hover:text-crypto-green'}`}
                        >
                          {i18n.language === 'ar' ? plan.button_text_ar : plan.button_text_en}
                        </Button>
                      </Link>

                      <div className="space-y-3 pt-4 border-t border-crypto-border">
                        {features && Array.isArray(features) ? (
                          features.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-crypto-text-secondary">{feature}</span>
                            </div>
                          ))
                        ) : (
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-crypto-text-secondary">No features listed</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              /* Fallback to i18n if no CMS pricing */
              <>
                {/* Free Plan */}
                <Card className="bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300">
                  <CardContent className="pt-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-crypto-text-primary">{t('landing.pricing.free.name')}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-crypto-text-primary">{t('landing.pricing.free.price')}</span>
                      </div>
                      <p className="text-sm text-crypto-text-secondary">{t('landing.pricing.free.description')}</p>
                    </div>

                    <Link to="/login" className="block">
                      <Button variant="outline" className="w-full border-crypto-border hover:bg-crypto-green/10 hover:text-crypto-green">
                        {t('landing.pricing.getStarted')}
                      </Button>
                    </Link>

                    <div className="space-y-3 pt-4 border-t border-crypto-border">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.free.feature1')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.free.feature2')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.free.feature3')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.free.feature4')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Plan - Most Popular */}
                <Card className="bg-gradient-to-b from-crypto-green/20 to-crypto-card border-crypto-green relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-crypto-green to-emerald-400"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-crypto-green text-white text-xs font-bold rounded-full">
                      {t('landing.pricing.popular')}
                    </span>
                  </div>
                  <CardContent className="pt-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-crypto-text-primary">{t('landing.pricing.monthly.name')}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-crypto-green">{t('landing.pricing.monthly.price')}</span>
                        <span className="text-crypto-text-secondary">{t('landing.pricing.perMonth')}</span>
                      </div>
                      <p className="text-sm text-crypto-text-secondary">{t('landing.pricing.monthly.description')}</p>
                    </div>

                    <Link to="/login" className="block">
                      <Button className="w-full bg-crypto-green hover:bg-crypto-green/90 text-white">
                        {t('landing.pricing.getStarted')}
                      </Button>
                    </Link>

                    <div className="space-y-3 pt-4 border-t border-crypto-border">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.monthly.feature1')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.monthly.feature2')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.monthly.feature3')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.monthly.feature4')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.monthly.feature5')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.monthly.feature6')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lifetime Plan */}
                <Card className="bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300">
                  <CardContent className="pt-8 space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-crypto-text-primary">{t('landing.pricing.lifetime.name')}</h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-crypto-text-primary">{t('landing.pricing.lifetime.price')}</span>
                      </div>
                      <p className="text-sm text-crypto-text-secondary">{t('landing.pricing.lifetime.description')}</p>
                    </div>

                    <Link to="/login" className="block">
                      <Button variant="outline" className="w-full border-crypto-border hover:bg-crypto-green/10 hover:text-crypto-green">
                        {t('landing.pricing.getStarted')}
                      </Button>
                    </Link>

                    <div className="space-y-3 pt-4 border-t border-crypto-border">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.lifetime.feature1')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.lifetime.feature2')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.lifetime.feature3')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.lifetime.feature4')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.lifetime.feature5')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.lifetime.feature6')}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-crypto-text-secondary">{t('landing.pricing.lifetime.feature7')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Beta Note */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-3 bg-crypto-yellow/10 border border-crypto-yellow/30 rounded-lg">
              <Settings className="w-5 h-5 text-crypto-yellow" />
              <p className="text-sm text-crypto-text-primary font-medium">
                {t('landing.pricing.betaNote')}
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-crypto-text-secondary">
              {t('landing.pricing.moneyBack')}
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-crypto-text-primary mb-4">
              {t('landing.testimonials.title')}
            </h2>
            <p className="text-xl text-crypto-text-secondary max-w-2xl mx-auto">
              {t('landing.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Render CMS Testimonials */}
            {testimonials && testimonials.length > 0 ? (
              testimonials.map((testimonial: any, index: number) => {
                const getInitial = (name: string) => name.charAt(0).toUpperCase();
                const colors = [
                  'from-crypto-green to-emerald-600',
                  'from-purple-500 to-purple-700',
                  'from-blue-500 to-blue-700'
                ];
                const colorClass = colors[index % colors.length];
                
                return (
                  <Card key={testimonial.id || index} className="bg-crypto-card border-crypto-border">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                        ))}
                      </div>
                      <p className="text-crypto-text-secondary italic">
                        "{i18n.language === 'ar' ? testimonial.quote_ar : testimonial.quote_en}"
                      </p>
                      <div className="flex items-center gap-3 pt-2">
                        {testimonial.image_url ? (
                          <img 
                            src={testimonial.image_url} 
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className={`w-10 h-10 bg-gradient-to-br ${colorClass} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                            {getInitial(testimonial.name)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-crypto-text-primary">{testimonial.name}</div>
                          <div className="text-sm text-crypto-text-secondary">
                            {i18n.language === 'ar' ? testimonial.role_ar : testimonial.role_en}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              /* Fallback to i18n if no CMS testimonials */
              <>
                {/* Testimonial 1 */}
                <Card className="bg-crypto-card border-crypto-border">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-crypto-text-secondary italic">
                      "{t('landing.testimonials.testimonial1.text')}"
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-crypto-green to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        M
                      </div>
                      <div>
                        <div className="font-semibold text-crypto-text-primary">{t('landing.testimonials.testimonial1.name')}</div>
                        <div className="text-sm text-crypto-text-secondary">{t('landing.testimonials.testimonial1.role')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Testimonial 2 */}
                <Card className="bg-crypto-card border-crypto-border">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-crypto-text-secondary italic">
                      "{t('landing.testimonials.testimonial2.text')}"
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        S
                      </div>
                      <div>
                        <div className="font-semibold text-crypto-text-primary">{t('landing.testimonials.testimonial2.name')}</div>
                        <div className="text-sm text-crypto-text-secondary">{t('landing.testimonials.testimonial2.role')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Testimonial 3 */}
                <Card className="bg-crypto-card border-crypto-border">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
                    </div>
                    <p className="text-crypto-text-secondary italic">
                      "{t('landing.testimonials.testimonial3.text')}"
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        J
                      </div>
                      <div>
                        <div className="font-semibold text-crypto-text-primary">{t('landing.testimonials.testimonial3.name')}</div>
                        <div className="text-sm text-crypto-text-secondary">{t('landing.testimonials.testimonial3.role')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-crypto-text-primary mb-4">
              {t('landing.howItWorksSection.title')}
            </h2>
            <p className="text-xl text-crypto-text-secondary max-w-2xl mx-auto">
              {t('landing.howItWorksSection.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-crypto-green to-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-crypto-green">01</div>
              <h3 className="text-xl font-bold text-crypto-text-primary">{t('landing.howItWorksSection.step1.title')}</h3>
              <p className="text-crypto-text-secondary">
                {t('landing.howItWorksSection.step1.description')}
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-purple-400">02</div>
              <h3 className="text-xl font-bold text-crypto-text-primary">{t('landing.howItWorksSection.step2.title')}</h3>
              <p className="text-crypto-text-secondary">
                {t('landing.howItWorksSection.step2.description')}
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-blue-400">03</div>
              <h3 className="text-xl font-bold text-crypto-text-primary">{t('landing.howItWorksSection.step3.title')}</h3>
              <p className="text-crypto-text-secondary">
                {t('landing.howItWorksSection.step3.description')}
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-4xl font-bold text-orange-400">04</div>
              <h3 className="text-xl font-bold text-crypto-text-primary">{t('landing.howItWorksSection.step4.title')}</h3>
              <p className="text-crypto-text-secondary">
                {t('landing.howItWorksSection.step4.description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 bg-crypto-card/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-crypto-text-primary mb-4">
              {t('landing.faq.title')}
            </h2>
            <p className="text-xl text-crypto-text-secondary">
              {t('landing.faq.subtitle')}
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {/* Render CMS FAQs */}
            {faqs && faqs.length > 0 ? (
              faqs.map((faq: any, index: number) => (
                <AccordionItem key={faq.id || index} value={`item-${faq.id || index}`} className="bg-crypto-card border-crypto-border rounded-lg px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-crypto-text-primary hover:no-underline">
                    {i18n.language === 'ar' ? faq.question_ar : faq.question_en}
                  </AccordionTrigger>
                  <AccordionContent className="text-crypto-text-secondary">
                    {i18n.language === 'ar' ? faq.answer_ar : faq.answer_en}
                  </AccordionContent>
                </AccordionItem>
              ))
            ) : (
              /* Fallback to i18n if no CMS FAQs */
              <>
                <AccordionItem value="item-1" className="bg-crypto-card border-crypto-border rounded-lg px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-crypto-text-primary hover:no-underline">
                    {t('landing.faq.q1.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-crypto-text-secondary">
                    {t('landing.faq.q1.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="bg-crypto-card border-crypto-border rounded-lg px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-crypto-text-primary hover:no-underline">
                    {t('landing.faq.q2.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-crypto-text-secondary">
                    {t('landing.faq.q2.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="bg-crypto-card border-crypto-border rounded-lg px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-crypto-text-primary hover:no-underline">
                    {t('landing.faq.q3.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-crypto-text-secondary">
                    {t('landing.faq.q3.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="bg-crypto-card border-crypto-border rounded-lg px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-crypto-text-primary hover:no-underline">
                    {t('landing.faq.q4.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-crypto-text-secondary">
                    {t('landing.faq.q4.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="bg-crypto-card border-crypto-border rounded-lg px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-crypto-text-primary hover:no-underline">
                    {t('landing.faq.q5.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-crypto-text-secondary">
                    {t('landing.faq.q5.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="bg-crypto-card border-crypto-border rounded-lg px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-crypto-text-primary hover:no-underline">
                    {t('landing.faq.q6.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-crypto-text-secondary">
                    {t('landing.faq.q6.answer')}
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="bg-crypto-card border-crypto-border rounded-lg px-6">
                  <AccordionTrigger className="text-left text-lg font-semibold text-crypto-text-primary hover:no-underline">
                    {t('landing.faq.q7.question')}
                  </AccordionTrigger>
                  <AccordionContent className="text-crypto-text-secondary">
                    {t('landing.faq.q7.answer')}
                  </AccordionContent>
                </AccordionItem>
              </>
            )}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-gradient-to-r from-crypto-green/20 via-emerald-500/20 to-crypto-green/20 border-crypto-green/30">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-crypto-text-primary">
                {t('landing.cta.title')}
              </h2>
              <p className="text-xl text-crypto-text-secondary max-w-2xl mx-auto">
                {t('landing.cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link to="/login">
                  <Button size="lg" className="bg-crypto-green hover:bg-crypto-green/90 text-white text-lg px-8 py-6 flex items-center gap-2">
                    {isRTL ? <ArrowRight className="w-5 h-5 rotate-180" /> : null}
                    {t('landing.cta.startTrial')}
                    {!isRTL ? <ArrowRight className="w-5 h-5" /> : null}
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-crypto-text-secondary">
                {t('landing.cta.terms')}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

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
                {/* <li><a href="#features" className="hover:text-crypto-green transition-colors">{t('landing.footer.aiAnalysis')}</a></li>
                <li><a href="#features" className="hover:text-crypto-green transition-colors">{t('landing.footer.qualityScoring')}</a></li>
                <li><a href="#features" className="hover:text-crypto-green transition-colors">{t('landing.footer.riskManagement')}</a></li>
                <li><a href="#features" className="hover:text-crypto-green transition-colors">{t('landing.footer.realTimeAlerts')}</a></li> */}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-semibold text-crypto-text-primary mb-4">{t('landing.footer.resources')}</h3>
              <ul className="space-y-2 text-sm text-crypto-text-secondary">
                <li><Link to="/blog" className="hover:text-crypto-green transition-colors">{t('landing.footer.blog')}</Link></li>
                <li><Link to="/documentation" className="hover:text-crypto-green transition-colors">{t('landing.footer.documentation')}</Link></li>
                <li><Link to="/how-it-works" className="hover:text-crypto-green transition-colors">{t('landing.footer.howItWorks')}</Link></li>
                <li><a href="#pricing" className="hover:text-crypto-green transition-colors">{t('landing.footer.pricing')}</a></li>
                <li><a href="#faq" className="hover:text-crypto-green transition-colors">{t('landing.footer.faq')}</a></li>
                <li><a href="#testimonials" className="hover:text-crypto-green transition-colors">{t('landing.footer.testimonials')}</a></li>
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
              <a 
                  href="https://x.com/thebitiqai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-crypto-green transition-colors"
                >{t('landing.footer.social.twitter')}</a>
                <a 
                  href="https://t.me/+i0dT1cOZqok2NTA8" 
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
    </>
  );
};

export default Landing;

