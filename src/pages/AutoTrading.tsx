import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Info,
  Link,
  Zap,
  TrendingUp,
  Shield,
  Settings
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";
import { useState, useEffect } from "react";

const AutoTrading = () => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [activeTab, setActiveTab] = useState<'connected' | 'available'>('available');
  const [searchQuery, setSearchQuery] = useState("");

  const brokers = [
    {
      id: 'binance',
      name: 'Binance',
      logo: '/images/binance_logo.png',
      features: ['Spot', 'Futures', 'Crypto'],
      connected: false,
      description: 'World\'s largest cryptocurrency exchange'
    },
    {
      id: 'bybit',
      name: 'Bybit',
      logo: '/images/bybit_logo.png',
      features: ['Spot', 'Futures', 'Crypto'],
      connected: false,
      description: 'Leading cryptocurrency derivatives exchange'
    },
    {
      id: 'bitget',
      name: 'Bitget',
      logo: '/images/bitget_logo.png',
      features: ['Spot', 'Futures', 'Crypto'],
      connected: false,
      description: 'Global cryptocurrency exchange platform'
    },
    {
      id: 'kucoin',
      name: 'KuCoin',
      logo: '/images/kucoin_logo.png',
      features: ['Spot', 'Futures', 'Crypto'],
      connected: false,
      description: 'Secure and reliable crypto exchange'
    }
  ];

  const connectedBrokers = brokers.filter(broker => broker.connected);
  const availableBrokers = brokers.filter(broker => !broker.connected);

  const filteredBrokers = activeTab === 'connected' 
    ? connectedBrokers.filter(broker => 
        broker.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : availableBrokers.filter(broker => 
        broker.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleConnectBroker = (brokerId: string) => {
    // TODO: Implement broker connection logic
    console.log(`Connecting to ${brokerId}`);
  };

  // Set SEO meta tags
  useEffect(() => {
    // Set page title
    document.title = "Bitiq.ai AutoTrade – Automated Crypto Trading (Beta)";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Connect your exchange and let Bitiq.ai AutoTrade execute verified signals automatically. Currently in Beta.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Connect your exchange and let Bitiq.ai AutoTrade execute verified signals automatically. Currently in Beta.';
      document.head.appendChild(meta);
    }
    
    // Set robots meta tag
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'index,follow');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'index,follow';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <header className={`h-14 md:h-16 flex items-center border-b border-crypto-border px-4 md:px-6`} >
            <SidebarTrigger className={isRTL ? 'ml-2 md:ml-4' : 'mr-2 md:mr-4'} />
            <div className="w-2 md:w-4" />
            <div className={`flex items-center gap-2 md:gap-3`}>
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-crypto-green" />
              <h1 className="text-base md:text-xl font-bold text-crypto-text-primary">{t('autoTrading.title')}</h1>
            </div>
          </header>
          
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Beta Notification */}
            <Card className="bg-crypto-yellow/10 border-crypto-yellow/30">
              <div className="p-3 md:p-4">
                <div className="flex items-start gap-2 md:gap-3">
                  <Info className="w-4 h-4 md:w-5 md:h-5 text-crypto-yellow mt-0.5 flex-shrink-0" />
                  <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-sm md:text-base font-semibold text-crypto-text-primary">
                      {t('autoTrading.beta.title', 'These features are in Beta.')}
                    </h3>
                    <p className="text-xs md:text-sm text-crypto-text-secondary">
                      {t('autoTrading.beta.description', 'Some functionalities may be limited or unavailable while we finalize testing.')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-4">
              <h2 className="text-lg md:text-2xl font-bold text-crypto-text-primary">
                {t('autoTrading.title', 'My brokers')}
              </h2>
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-auto">
                <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 w-4 h-4 text-crypto-text-secondary`} />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('autoTrading.searchPlaceholder', 'Search a broker...')}
                  className={`bg-crypto-card border-crypto-border text-crypto-text-primary ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} w-full sm:w-64 rounded-lg text-sm`}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 border-b border-crypto-border overflow-x-auto">
              <button
                onClick={() => setActiveTab('connected')}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'connected'
                    ? 'text-crypto-text-primary border-b-2 border-crypto-green'
                    : 'text-crypto-text-secondary hover:text-crypto-text-primary'
                }`}
              >
                {t('autoTrading.connected', 'Connected')} ({connectedBrokers.length})
              </button>
              <button
                onClick={() => setActiveTab('available')}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === 'available'
                    ? 'text-crypto-text-primary border-b-2 border-crypto-green'
                    : 'text-crypto-text-secondary hover:text-crypto-text-primary'
                }`}
              >
                {t('autoTrading.available', 'Available')}
              </button>
            </div>

            {/* Broker Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {filteredBrokers.map((broker) => (
                <Card key={broker.id} className="bg-crypto-card border-crypto-border hover:border-crypto-green/30 transition-all duration-200">
                  <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                    {/* Logo and Name */}
                    <div className={`flex items-start justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex items-start gap-2 md:gap-3 flex-1 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <img 
                          src={broker.logo} 
                          alt={`${broker.name} logo`}
                          className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className={`flex items-center gap-1 md:gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <h3 className="text-sm md:text-base font-semibold text-crypto-text-primary truncate">{broker.name}</h3>
                            <Info className="w-3 h-3 md:w-4 md:h-4 text-crypto-text-secondary cursor-help flex-shrink-0" />
                          </div>
                          <p className="text-xs text-crypto-text-secondary mt-1 line-clamp-2">{broker.description}</p>
                        </div>
                      </div>
                      
                      {/* Connect Button */}
                      <Button
                        onClick={() => handleConnectBroker(broker.id)}
                        size="sm"
                        className="bg-crypto-green hover:bg-crypto-green/90 text-white p-1.5 md:p-2 h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
                      >
                        <Plus className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                      {broker.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="text-crypto-text-secondary border-crypto-border bg-crypto-card/50 text-xs px-2 py-0.5"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {filteredBrokers.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-crypto-card rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                  <Link className="w-6 h-6 md:w-8 md:h-8 text-crypto-text-secondary" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-crypto-text-primary mb-2">
                  {activeTab === 'connected' 
                    ? t('autoTrading.noConnectedBrokers', 'No connected brokers')
                    : t('autoTrading.noAvailableBrokers', 'No brokers found')
                  }
                </h3>
                <p className="text-sm md:text-base text-crypto-text-secondary px-4">
                  {activeTab === 'connected'
                    ? t('autoTrading.connectFirstBroker', 'Connect your first broker to start auto trading')
                    : t('autoTrading.searchDifferent', 'Try searching with different keywords')
                  }
                </p>
              </div>
            )}

            {/* Auto Trading Info */}
            <Card className="bg-gradient-to-r from-crypto-card to-crypto-card/80 border-crypto-border">
              <div className="p-4 md:p-6">
                <div className={`flex items-start gap-3 md:gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-crypto-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-crypto-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base md:text-lg font-semibold text-crypto-text-primary mb-2">
                      {t('autoTrading.info.title', 'Start Auto Trading')}
                    </h3>
                    <p className="text-xs md:text-sm text-crypto-text-secondary mb-3 md:mb-4">
                      {t('autoTrading.info.description', 'Connect your exchange accounts to enable automated trading based on our AI signals. Your trades will be executed automatically with proper risk management.')}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-4">
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Shield className="w-3 h-3 md:w-4 md:h-4 text-crypto-green flex-shrink-0" />
                        <span className="text-xs md:text-sm text-crypto-text-secondary">
                          {t('autoTrading.info.secure', 'Secure API connections')}
                        </span>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Settings className="w-3 h-3 md:w-4 md:h-4 text-crypto-green flex-shrink-0" />
                        <span className="text-xs md:text-sm text-crypto-text-secondary">
                          {t('autoTrading.info.customizable', 'Fully customizable')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AutoTrading;
