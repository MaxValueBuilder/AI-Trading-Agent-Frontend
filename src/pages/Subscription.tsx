import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, Crown, Star, ArrowRight, Clock, Shield, Brain, BarChart3, Target, Users, CreditCard, Loader2, Settings } from "lucide-react";
import { subscriptionApiService, SubscriptionPlan, UserSubscription } from "@/services/subscriptionApi";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";

const Subscription = () => {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);

  // Ensure language is properly loaded on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansData, subscriptionData] = await Promise.all([
        subscriptionApiService.getSubscriptionPlans(),
        subscriptionApiService.getUserSubscriptionStatus()
      ]);
      
      setPlans(plansData);
      setUserSubscription(subscriptionData);
    } catch (error) {
      console.error("Error loading subscription data:", error);
      toast.error(t('subscription.failedToLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!userProfile) {
      toast.error(t('subscription.pleaseLogin'));
      navigate("/login");
      return;
    }

    try {
      setProcessingPayment(plan.plan);
      
      const result = await subscriptionApiService.initiatePayment(plan.plan, "USD");
      
      if (result.success) {
        if (result.payment_required && result.payment_url) {
          // Redirect to OxaPay payment page in the same window
          window.location.href = result.payment_url;
          toast.success(t('subscription.redirectingToPayment'));
        } else if (result.subscription) {
          // Free plan - subscription created immediately
          toast.success(t('subscription.subscriptionActivated'));
          await loadData(); // Reload data
        }
      } else {
        toast.error(result.error || t('subscription.paymentFailed'));
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      toast.error(t('subscription.paymentFailed'));
    } finally {
      setProcessingPayment(null);
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'free':
        return <Zap className="w-6 h-6" />;
      case 'monthly':
        return <Crown className="w-6 h-6" />;
      case 'lifetime':
        return <Star className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free':
        return "from-blue-500 to-blue-700";
      case 'monthly':
        return "from-crypto-green to-emerald-600";
      case 'lifetime':
        return "from-purple-500 to-purple-700";
      default:
        return "from-gray-500 to-gray-700";
    }
  };

  const getCurrentPlanBadge = (plan: string) => {
    if (userSubscription?.plan === plan) {
      return (
        <Badge variant="default" className="bg-crypto-green text-white px-4 py-1.5 text-sm font-medium mx-auto inline-block">
          {t('subscription.currentPlanBadge')}
        </Badge>
      );
    }
    return null;
  };

  const formatCryptoPrice = (cryptoPrices: Record<string, number> | undefined, currency: string) => {
    if (!cryptoPrices || !cryptoPrices[currency]) return null;
    
    const price = cryptoPrices[currency];
    const symbol = currency.toUpperCase();
    
    if (currency === 'btc') {
      return `${price.toFixed(8)} BTC`;
    } else if (currency === 'eth') {
      return `${price.toFixed(6)} ETH`;
    } else {
      return `${price.toFixed(2)} ${symbol}`;
    }
  };

  const getTranslatedPlanDetails = (plan: SubscriptionPlan) => {
    const planKey = plan.plan as 'free' | 'monthly' | 'lifetime';
    
    const translatedName = t(`subscription.plans.${planKey}.name`);
    const translatedDescription = t(`subscription.plans.${planKey}.description`);
    const translatedFeatures = t(`subscription.plans.${planKey}.features`, { returnObjects: true }) as string[];
    
    return {
      ...plan,
      name: translatedName,
      description: translatedDescription,
      features: Array.isArray(translatedFeatures) ? translatedFeatures : []
    };
  };

  if (loading || !i18n.isInitialized) {
    return (
      <SidebarProvider key={`subscription-${i18n.language}`}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          <main className="flex-1">
            <div className="min-h-screen bg-crypto-bg flex items-center justify-center">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-crypto-green mx-auto mb-4" />
                <p className="text-crypto-text-secondary">{t('subscription.loadingPlans')}</p>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider key={`subscription-${i18n.language}`}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <header className={`h-16 flex items-center border-b border-crypto-border px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <SidebarTrigger className={isRTL ? 'ml-4' : 'mr-4'} />
            <div className="w-4" />
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <CreditCard className="w-6 h-6 text-crypto-green" />
              <h1 className="text-xl font-bold text-crypto-text-primary">{t('subscription.title')}</h1>
            </div>
          </header>
          
          <div className="bg-crypto-bg">
            <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-crypto-green mb-4">
            {t('subscription.title')}
          </h1>
          <p className="text-xl text-crypto-text-secondary max-w-2xl mx-auto">
            {t('subscription.subtitle')}
          </p>
          
          {/* Current Subscription Status */}
          {userSubscription && (
            <div className={`mt-6 inline-flex items-center gap-2 px-4 py-2 bg-crypto-card border border-crypto-border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-2 h-2 bg-crypto-green rounded-full"></div>
              <span className="text-crypto-text-primary font-medium">
                {t('subscription.currentPlan')}: {userSubscription.plan.charAt(0).toUpperCase() + userSubscription.plan.slice(1)} Plan
              </span>
              {userSubscription.days_remaining && (
                <span className="text-crypto-text-secondary">
                  • {userSubscription.days_remaining} {t('subscription.daysRemaining')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => {
            const translatedPlan = getTranslatedPlanDetails(plan);
            return (
            <Card 
              key={plan.plan} 
              className={`bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300 relative ${
                plan.is_popular ? 'ring-2 ring-crypto-green/20' : ''
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-crypto-green text-white px-3 py-1">
                    {t('subscription.mostPopular')}
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${getPlanColor(plan.plan)} rounded-xl flex items-center justify-center mx-auto mb-4 text-white`}>
                  {getPlanIcon(plan.plan)}
                </div>
                
                <CardTitle className="text-2xl font-bold text-crypto-text-primary mb-2">
                  {translatedPlan.name}
                </CardTitle>
                
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl font-bold text-crypto-text-primary">
                      ${plan.price_usd}
                    </span>
                    {plan.duration_days && (
                      <span className="text-crypto-text-secondary">
                        /{plan.duration_days === 1 ? t('subscription.duration.day') : plan.duration_days === 30 ? t('subscription.duration.month') : t('subscription.duration.lifetime')}
                      </span>
                    )}
                  </div>
                  
                  {/* Crypto Prices */}
                  {plan.crypto_prices && (
                    <div className="space-y-1">
                      {Object.entries(plan.crypto_prices).slice(0, 3).map(([currency, price]) => (
                        <div key={currency} className="text-sm text-crypto-text-secondary">
                          {formatCryptoPrice(plan.crypto_prices, currency)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-center">
                  {getCurrentPlanBadge(plan.plan)}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <p className="text-crypto-text-secondary text-center">
                  {translatedPlan.description}
                </p>
                
                <div className="space-y-3">
                  {translatedPlan.features.map((feature, index) => (
                    <div key={index} className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <CheckCircle className="w-5 h-5 text-crypto-green flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-crypto-text-secondary">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button
                  onClick={() => handleSubscribe(plan)}
                  disabled={processingPayment === plan.plan || userSubscription?.plan === plan.plan}
                  className={`w-full ${
                    plan.is_popular 
                      ? 'bg-crypto-green hover:bg-crypto-green/90 text-white' 
                      : userSubscription?.plan === plan.plan
                        ? 'bg-crypto-green/20 border border-crypto-green text-crypto-green'
                        : 'bg-crypto-card border border-crypto-border hover:bg-crypto-green/10 hover:text-crypto-green hover:border-crypto-green text-crypto-text-primary'
                  }`}
                >
                  {processingPayment === plan.plan ? (
                    <>
                      <Loader2 className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                      {t('subscription.processing')}
                    </>
                  ) : userSubscription?.plan === plan.plan ? (
                    t('subscription.currentPlanBadge')
                  ) : plan.price_usd === 0 ? (
                    t('subscription.startFreeTrial')
                  ) : (
                    <>
                      {t('subscription.subscribeNow')}
                      <ArrowRight className={`w-4 h-4 ${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        {/* <Card className="bg-crypto-card border-crypto-border mb-12">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-crypto-text-primary text-center">
              Feature Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-crypto-border">
                    <th className="text-left py-4 px-2 text-crypto-text-primary font-semibold">Features</th>
                    <th className="text-center py-4 px-2 text-crypto-text-primary font-semibold">Free</th>
                    <th className="text-center py-4 px-2 text-crypto-text-primary font-semibold">Monthly</th>
                    <th className="text-center py-4 px-2 text-crypto-text-primary font-semibold">Lifetime</th>
                  </tr>
                </thead>
                <tbody className="space-y-2">
                  {[
                    { feature: "AI-Powered Signals", free: "Limited", monthly: "Unlimited", lifetime: "Unlimited" },
                    { feature: "Real-time Notifications", free: "❌", monthly: "✅", lifetime: "✅" },
                    { feature: "Quality Scoring", free: "Basic", monthly: "Advanced", lifetime: "Advanced" },
                    { feature: "Risk Management", free: "❌", monthly: "✅", lifetime: "✅" },
                    { feature: "Priority Support", free: "❌", monthly: "✅", lifetime: "Premium" },
                    { feature: "Custom Alerts", free: "❌", monthly: "✅", lifetime: "✅" },
                    { feature: "Advanced Analytics", free: "❌", monthly: "❌", lifetime: "✅" },
                    { feature: "Early Access", free: "❌", monthly: "❌", lifetime: "✅" }
                  ].map((row, index) => (
                    <tr key={index} className="border-b border-crypto-border/50">
                      <td className="py-3 px-2 text-crypto-text-primary font-medium">{row.feature}</td>
                      <td className="py-3 px-2 text-center text-crypto-text-secondary">{row.free}</td>
                      <td className="py-3 px-2 text-center text-crypto-text-secondary">{row.monthly}</td>
                      <td className="py-3 px-2 text-center text-crypto-text-secondary">{row.lifetime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card> */}

        {/* Beta Note */}
        <Card className="bg-crypto-yellow/10 border-crypto-yellow/30 mb-8">
          <CardContent className="pt-6">
            <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Settings className="w-5 h-5 text-crypto-yellow mt-0.5 flex-shrink-0" />
              <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <p className="text-sm text-crypto-text-primary font-medium">
                  {t('subscription.betaNote')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card className="bg-crypto-card border-crypto-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-crypto-text-primary text-center">
              {t('subscription.securePaymentMethods')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg flex items-center justify-center mx-auto">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-crypto-text-primary">{t('subscription.cryptocurrency')}</h3>
                <p className="text-sm text-crypto-text-secondary">
                  {t('subscription.cryptocurrencyDescription')}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-crypto-text-primary">{t('subscription.securePrivate')}</h3>
                <p className="text-sm text-crypto-text-secondary">
                  {t('subscription.securePrivateDescription')}
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center mx-auto">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-crypto-text-primary">{t('subscription.instantAccess')}</h3>
                <p className="text-sm text-crypto-text-secondary">
                  {t('subscription.instantAccessDescription')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Subscription;
