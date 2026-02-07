import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingDown, TrendingUp, Clock, RefreshCw, AlertCircle, Loader2, Check, Brain, Zap, Filter, Grid3X3, List, Eye } from "lucide-react";
import { useSignals, useSignalStats } from "@/hooks/useSignals";
import { useEffect, useRef, useState } from "react";
import { useSignalsRefreshStore } from "@/stores/signalsRefreshStore";
import { useTranslation } from "react-i18next";
import { Signal, AIAnalysis } from "@/types/signal";
import { QualityScoreBadge } from "@/components/QualityScoreBadge";
import { apiService } from "@/services/api";
import { useRTL } from "@/hooks/useRTL";
import { translationService } from "@/services/translationService";

type FilterTab = 'newest' | 'short' | 'long' | 'history';
type ViewMode = 'grid' | 'list';

const TradingSignals = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const [activeTab, setActiveTab] = useState<FilterTab>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState({
    limit: 25,
    offset: 0,
    age_filter: 'active' as 'active' | 'expired',
    direction: undefined as string | undefined,
  });

  const { signals, loading, error, total, refetch } = useSignals(filters);
  console.log("signals from backend: ", signals);
  const { stats } = useSignalStats();

  // Handle tab changes
  const handleTabChange = (tab: FilterTab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'newest':
        setFilters(prev => ({
          ...prev,
          age_filter: 'active',
          direction: undefined,
          offset: 0,
        }));
        break;
      case 'short':
        setFilters(prev => ({
          ...prev,
          age_filter: 'active',
          direction: 'SHORT',
          offset: 0,
        }));
        break;
      case 'long':
        setFilters(prev => ({
          ...prev,
          age_filter: 'active',
          direction: 'LONG',
          offset: 0,
        }));
        break;
      case 'history':
        setFilters(prev => ({
          ...prev,
          age_filter: 'expired',
          direction: undefined,
          offset: 0,
        }));
        break;
    }
  };

  const lastUpdatedAt = useSignalsRefreshStore((s) => s.lastUpdatedAt);
  const debounceRef = useRef<number | null>(null);

  // AI Analysis state for each signal
  const [aiAnalyses, setAiAnalyses] = useState<Record<number, AIAnalysis>>({});
  const [loadingAnalyses, setLoadingAnalyses] = useState<Record<number, boolean>>({});
  
  // Translated notes cache
  const [translatedNotes, setTranslatedNotes] = useState<Record<number, string[]>>({});

  // Real-time update for expiry times
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute for real-time expiry countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Debounced refetch when store updates (foreground FCM)
  useEffect(() => {
    if (!lastUpdatedAt) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      refetch();
    }, 300);
  }, [lastUpdatedAt]);

  // Listen for background SW messages
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log("📱 TradingSignals: Service Worker not supported");
      return;
    }
    
    console.log("📱 TradingSignals: Setting up service worker message listener");
    
    const handler = (event: MessageEvent) => {
      console.log("📱 TradingSignals: Service worker message received:", event.data);
      
      if (event?.data?.type === 'signals:new' || event?.data?.type === 'signals:ai_complete') {
        console.log("📱 TradingSignals: Triggering refetch due to service worker message:", event.data.type);
        if (debounceRef.current) window.clearTimeout(debounceRef.current);
        debounceRef.current = window.setTimeout(() => {
          console.log("📱 TradingSignals: Executing refetch");
          refetch();
        }, 300);
      } else {
        console.log("📱 TradingSignals: Ignoring service worker message:", event.data?.type);
      }
    };
    
    navigator.serviceWorker.addEventListener('message', handler);
    return () => {
      console.log("📱 TradingSignals: Removing service worker message listener");
      navigator.serviceWorker.removeEventListener('message', handler);
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ENRICHED': return 'bg-crypto-green/20 text-crypto-green border-crypto-green/30';
      case 'PROCESSING': return 'bg-crypto-yellow/20 text-crypto-yellow border-crypto-yellow/30';
      case 'FAILED': return 'bg-crypto-red/20 text-crypto-red border-crypto-red/30';
      case 'RAW': return 'bg-crypto-yellow/20 text-crypto-yellow border-crypto-yellow/30';
      default: return 'bg-crypto-text-secondary/20 text-crypto-text-secondary border-crypto-text-secondary/30';
    }
  };

  const getDirectionIcon = (direction: string) => {
    return direction === 'LONG' ? 
      <TrendingUp className="w-5 h-5 text-crypto-green" /> : 
      <TrendingDown className="w-5 h-4 text-crypto-red" />;
  };

  const formatPrice = (price: number | number[]) => {
    if (Array.isArray(price)) {
      return price.map(p => `$${p.toLocaleString()}`).join(', ');
    }
    return `$${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  // Calculate remaining time until signal expires (24h after creation)
  const calculateTimeUntilExpiry = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = currentTime; // Use currentTime state for real-time updates
    const expiry = new Date(created.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours
    const remainingMs = expiry.getTime() - now.getTime();
    
    if (remainingMs <= 0) {
      return { expired: true, hours: 0, minutes: 0 };
    }
    
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return { expired: false, hours, minutes };
  };

  // Fetch AI analysis for a signal
  const fetchAIAnalysis = async (signalId: number) => {
    if (loadingAnalyses[signalId] || aiAnalyses[signalId]) return;
    
    setLoadingAnalyses(prev => ({ ...prev, [signalId]: true }));
    try {
      const response = await apiService.getAIAnalysis(signalId);
      const analysis = response.analysis;
      setAiAnalyses(prev => ({ ...prev, [signalId]: analysis }));
      
      // Translate notes if current language is not English
      const currentLang = i18n.language;
      if (currentLang !== 'en' && analysis.notes && analysis.notes.length > 0) {
        translateNotes(signalId, analysis.notes, currentLang);
      }
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
    } finally {
      setLoadingAnalyses(prev => ({ ...prev, [signalId]: false }));
    }
  };

  // Translate AI analysis notes
  const translateNotes = async (signalId: number, notes: string[], targetLang: string) => {
    try {
      const translated = await translationService.translateAINotes(notes, targetLang);
      setTranslatedNotes(prev => ({ ...prev, [signalId]: translated }));
    } catch (error) {
      console.error('Error translating notes:', error);
      // Keep original notes on error
      setTranslatedNotes(prev => ({ ...prev, [signalId]: notes }));
    }
  };

  // Re-translate notes when language changes
  useEffect(() => {
    const currentLang = i18n.language;
    
    // Re-translate all loaded AI analyses when language changes
    Object.entries(aiAnalyses).forEach(([signalIdStr, analysis]) => {
      const signalId = parseInt(signalIdStr);
      if (analysis.notes && analysis.notes.length > 0) {
        if (currentLang === 'en') {
          // For English, clear translations to use original
          setTranslatedNotes(prev => {
            const newCache = { ...prev };
            delete newCache[signalId];
            return newCache;
          });
        } else {
          // For other languages, translate
          translateNotes(signalId, analysis.notes, currentLang);
        }
      }
    });
  }, [i18n.language]);

  // Calculate risk-reward ratio (version-agnostic)
  const calculateRiskReward = (entry: number[], stopLoss: number, takeProfits: number[]) => {
    try {
      if (!entry || !stopLoss || !takeProfits) return null;
      
      const entryPrice = Array.isArray(entry) ? entry[0] : entry;
      const firstTP = Array.isArray(takeProfits) ? takeProfits[0] : takeProfits;
      
      const risk = Math.abs(entryPrice - stopLoss);
      const reward = Math.abs(firstTP - entryPrice);
      const ratio = reward / risk;
      
      return {
        risk: risk.toFixed(2),
        reward: reward.toFixed(2),
        ratio: ratio.toFixed(2)
      };
    } catch (error) {
      return null;
    }
  };

  // Check if signal has version differences
  const hasVersionDifferences = (signal: Signal) => {
    if (signal.version === 'v1') return false;
    
    return !(
      JSON.stringify(signal.entry) === JSON.stringify(signal.ai_adjusted_entry) &&
      signal.stop_loss === signal.ai_adjusted_stop_loss &&
      JSON.stringify(signal.take_profits) === JSON.stringify(signal.ai_adjusted_take_profits)
    );
  };

  // Get display levels based on version
  const getDisplayLevels = (signal: Signal) => {
    if (signal.version === 'v2' && signal.ai_adjusted_entry) {
      return {
        entry: signal.ai_adjusted_entry,
        stop_loss: signal.ai_adjusted_stop_loss || signal.stop_loss,
        take_profits: signal.ai_adjusted_take_profits || signal.take_profits
      };
    }
    return {
      entry: signal.entry,
      stop_loss: signal.stop_loss,
      take_profits: signal.take_profits
    };
  };

  if (error) {
    return (
      <div className="px-6 pb-6">
       
        
        <Card className="bg-crypto-card border-crypto-border p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-crypto-red mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-crypto-text-primary mb-2">{t('tradingSignals.errorTitle')}</h3>
            <p className="text-crypto-text-secondary mb-4">{error}</p>
            <Button onClick={refetch} className="bg-crypto-green hover:bg-crypto-green/90">
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('tradingSignals.tryAgain')}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const tabConfig = [
    { key: 'newest' as FilterTab, label: t('tradingSignals.filters.newest'), icon: Zap },
    { key: 'short' as FilterTab, label: t('tradingSignals.filters.short'), icon: TrendingDown },
    { key: 'long' as FilterTab, label: t('tradingSignals.filters.long'), icon: TrendingUp },
    { key: 'history' as FilterTab, label: t('tradingSignals.filters.history'), icon: Clock },
  ];

  return (
    <div className="px-3 md:px-6 pt-3 md:pt-4 pb-6 md:pb-8">

      {/* Professional Filter Tabs */}
      <div className="mb-6 md:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 md:mb-6 gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-crypto-green/20 to-crypto-green/10 flex items-center justify-center border border-crypto-green/20 shadow-sm">
              <Filter className="w-4 h-4 md:w-5 md:h-5 text-crypto-green" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-crypto-text-primary">{t('tradingSignals.filters.title')}</h3>
              <p className="text-xs md:text-sm text-crypto-text-secondary font-medium">{t('tradingSignals.filters.subtitle')}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4">
            {/* Professional View Mode Toggle */}
            <div className="flex items-center gap-1 bg-crypto-bg/30 border border-crypto-border/50 rounded-xl p-1 md:p-1.5 shadow-sm backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('grid')}
                className={`h-8 md:h-9 px-2 md:px-4 transition-all duration-300 rounded-lg font-medium ${
                  viewMode === 'grid'
                    ? 'bg-crypto-green text-white shadow-lg shadow-crypto-green/25 border border-crypto-green/30'
                    : 'text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-bg/50'
                }`}
              >
                <div className="flex items-center gap-1 md:gap-2">
                  <Grid3X3 className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm hidden sm:inline">Grid</span>
                </div>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode('list')}
                className={`h-8 md:h-9 px-2 md:px-4 transition-all duration-300 rounded-lg font-medium ${
                  viewMode === 'list'
                    ? 'bg-crypto-green text-white shadow-lg shadow-crypto-green/25 border border-crypto-green/30'
                    : 'text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-bg/50'
                }`}
              >
                <div className="flex items-center gap-1 md:gap-2">
                  <List className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm hidden sm:inline">List</span>
                </div>
              </Button>
            </div>
            
            {/* Professional Signal Count Display */}
            <div className="flex items-center justify-center sm:justify-start gap-2 md:gap-3 bg-crypto-bg/20 border border-crypto-border/40 rounded-xl px-3 md:px-4 py-2 md:py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-base md:text-lg font-bold text-crypto-green">{total || 0}</span>
                <span className="text-xs md:text-sm text-crypto-text-secondary">{t('tradingSignals.filters.signals')}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-crypto-card/50 border border-crypto-border/60 rounded-xl p-2 md:p-3 shadow-lg backdrop-blur-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-3">
            {tabConfig.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <Button
                  key={tab.key}
                  variant="ghost"
                  onClick={() => handleTabChange(tab.key)}
                  className={`relative h-12 md:h-16 transition-all duration-300 rounded-xl font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-crypto-green to-crypto-green/90 text-white shadow-xl shadow-crypto-green/25 border border-crypto-green/40'
                      : 'text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-bg/40 border border-transparent hover:border-crypto-border/50 hover:shadow-md'
                  }`}
                >
                  <div className={`flex flex-col items-center gap-1 ${isRTL ? 'flex-col-reverse' : ''}`}>
                    <IconComponent className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
                      isActive ? 'text-white' : 'text-crypto-text-secondary'
                    }`} />
                    <span className={`text-xs md:text-sm font-medium transition-colors ${
                      isActive ? 'text-white' : 'text-crypto-text-secondary'
                    }`}>
                      {tab.label}
                    </span>
                  </div>
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-crypto-green shadow-lg flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-crypto-green rounded-full"></div>
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-crypto-card border-crypto-border p-4 md:p-6">
              <div className="animate-pulse space-y-3 md:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-crypto-bg rounded"></div>
                    <div className="h-3 md:h-4 bg-crypto-bg rounded w-12 md:w-16"></div>
                    <div className="h-5 md:h-6 bg-crypto-bg rounded w-6 md:w-8"></div>
                  </div>
                  <div className="h-3 md:h-4 bg-crypto-bg rounded w-16 md:w-24"></div>
                </div>
                <div className="h-2 md:h-3 bg-crypto-bg rounded w-24 md:w-32"></div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-2 md:h-3 bg-crypto-bg rounded w-8 md:w-12"></div>
                    <div className="h-2 md:h-3 bg-crypto-bg rounded w-12 md:w-16"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-2 md:h-3 bg-crypto-bg rounded w-12 md:w-16"></div>
                    <div className="h-2 md:h-3 bg-crypto-bg rounded w-12 md:w-16"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-2 md:h-3 bg-crypto-bg rounded w-16 md:w-20"></div>
                    <div className="h-2 md:h-3 bg-crypto-bg rounded w-16 md:w-24"></div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : signals.length === 0 ? (
        <Card className="bg-crypto-card border-crypto-border p-4 md:p-6">
          <div className="text-center">
            <TrendingUp className="w-10 h-10 md:w-12 md:h-12 text-crypto-text-secondary mx-auto mb-3 md:mb-4" />
            <h3 className="text-base md:text-lg font-semibold text-crypto-text-primary mb-2">{t('tradingSignals.emptyTitle')}</h3>
            <p className="text-sm md:text-base text-crypto-text-secondary">{t('tradingSignals.emptySubtitle')}</p>
          </div>
        </Card>
      ) : viewMode === 'list' ? (
        // Table List View
        <Card className="bg-crypto-card border-crypto-border overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="border-crypto-border hover:bg-crypto-bg/20">
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.pair')}</TableHead>
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.direction')}</TableHead>
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.version')}</TableHead>
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.status')}</TableHead>
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.entry')}</TableHead>
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.stopLoss')}</TableHead>
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.takeProfit')}</TableHead>
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.riskReward')}</TableHead>
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.aiScore')}</TableHead>
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.expires')}</TableHead>
                  <TableHead className="text-crypto-text-secondary font-medium whitespace-nowrap">{t('tradingSignals.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {signals.map((signal) => {
                const IconComponent = signal.direction === 'LONG' ? TrendingUp : TrendingDown;
                const aiAnalysis = aiAnalyses[signal.id];
                const isLoadingAnalysis = loadingAnalyses[signal.id];
                const displayLevels = getDisplayLevels(signal);
                const riskReward = calculateRiskReward(displayLevels.entry, displayLevels.stop_loss, displayLevels.take_profits);
                const hasDifferences = hasVersionDifferences(signal);
                
                // Fetch AI analysis when signal becomes ENRICHED
                if (signal.status === 'ENRICHED' && !aiAnalysis && !isLoadingAnalysis) {
                  fetchAIAnalysis(signal.id);
                }
                
                return (
                  <TableRow key={signal.id} className="border-crypto-border hover:bg-crypto-bg/10">
                    <TableCell className="text-crypto-text-primary font-semibold whitespace-nowrap">{signal.pair}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <IconComponent className={`w-4 h-4 ${signal.direction === 'LONG' ? 'text-crypto-green' : 'text-crypto-red'}`} />
                        <span className={`text-sm font-medium ${
                          signal.direction === 'LONG' ? 'text-crypto-green' : 'text-crypto-red'
                        }`}>
                          {signal.direction}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge 
                        variant={signal.version === 'v2' ? 'default' : 'secondary'} 
                        className={`px-2 py-1 text-xs font-bold ${
                          signal.version === 'v2' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        {signal.version === 'v2' ? (
                          <div className="flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            v2
                          </div>
                        ) : (
                          'v1'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge className={`${getStatusColor(signal.status)}`}>
                        {signal.status === 'PROCESSING' ? (
                          <div className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span className="text-xs">Processing</span>
                          </div>
                        ) : signal.status === 'ENRICHED' ? (
                          <div className="flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            <span className="text-xs">Enriched</span>
                          </div>
                        ) : (
                          <span className="text-xs">{signal.status}</span>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-semibold ${hasDifferences ? 'text-purple-600' : 'text-crypto-text-primary'}`}>
                          {formatPrice(displayLevels.entry)}
                        </span>
                        {signal.version === 'v2' && hasDifferences && (
                          <Badge variant="secondary" className="bg-purple-600 text-white text-xs px-1 py-0">
                            AI
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-semibold ${signal.ai_adjusted_stop_loss && signal.ai_adjusted_stop_loss !== signal.stop_loss ? 'text-purple-600' : 'text-crypto-red'}`}>
                          {formatPrice(displayLevels.stop_loss)}
                        </span>
                        {signal.ai_adjusted_stop_loss && signal.ai_adjusted_stop_loss !== signal.stop_loss && (
                          <Badge variant="secondary" className="bg-purple-600 text-white text-xs px-1 py-0">
                            AI
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className={`text-sm font-semibold ${signal.ai_adjusted_take_profits && JSON.stringify(signal.ai_adjusted_take_profits) !== JSON.stringify(signal.take_profits) ? 'text-purple-600' : 'text-crypto-green'}`}>
                          {formatPrice(displayLevels.take_profits)}
                        </span>
                        {signal.ai_adjusted_take_profits && JSON.stringify(signal.ai_adjusted_take_profits) !== JSON.stringify(signal.take_profits) && (
                          <Badge variant="secondary" className="bg-purple-600 text-white text-xs px-1 py-0">
                            AI
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {riskReward ? (
                        <span className="text-sm text-crypto-text-primary font-semibold">
                          1:{riskReward.ratio}
                        </span>
                      ) : (
                        <span className="text-xs text-crypto-text-secondary">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {signal.status === 'ENRICHED' ? (
                        isLoadingAnalysis ? (
                          <div className="flex items-center gap-1">
                            <Loader2 className="w-3 h-3 text-purple-600 animate-spin" />
                            <span className="text-xs text-crypto-text-secondary">Loading...</span>
                          </div>
                        ) : aiAnalysis?.quality_score ? (
                          <QualityScoreBadge 
                            score={aiAnalysis.quality_score} 
                            scoreBreakdown={aiAnalysis.score_breakdown}
                            className="text-xs px-2 py-1 font-bold"
                          />
                        ) : (
                          <Badge variant="secondary" className="bg-gray-500 text-white text-xs px-2 py-1">
                            N/A
                          </Badge>
                        )
                      ) : (
                        <Badge variant="secondary" className="bg-crypto-yellow/20 text-crypto-yellow border-crypto-yellow/30 text-xs px-2 py-1">
                          Analyzing
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-crypto-text-secondary" />
                        {(() => {
                          const timeInfo = calculateTimeUntilExpiry(signal.created_at);
                          if (timeInfo.expired) {
                            return (
                              <span className="text-xs text-crypto-red font-medium">
                                Expired
                              </span>
                            );
                          } else {
                            return (
                              <span className="text-xs text-crypto-text-secondary font-medium">
                                {timeInfo.hours}h {timeInfo.minutes}m
                              </span>
                            );
                          }
                        })()}
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        {/* View AI Analysis Modal */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-crypto-green/20 hover:text-crypto-green"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-crypto-card border-crypto-border">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2 text-crypto-text-primary">
                                <Brain className="w-5 h-5 text-purple-600" />
                                AI Analysis - {signal.pair} {signal.direction}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              {/* Quality Score */}
                              {signal.status === 'ENRICHED' && aiAnalysis?.quality_score && (
                                <div className="bg-crypto-bg/20 rounded-lg p-4">
                                  <h4 className="text-sm font-medium text-crypto-text-primary mb-2">Quality Score</h4>
                                  <QualityScoreBadge 
                                    score={aiAnalysis.quality_score} 
                                    scoreBreakdown={aiAnalysis.score_breakdown}
                                    className="text-base px-4 py-2 font-bold"
                                  />
                                </div>
                              )}
                              
                              {/* AI Notes */}
                              <div className="bg-crypto-bg/20 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-crypto-text-primary mb-3">Market Insights</h4>
                                {signal.status === 'ENRICHED' ? (
                                  isLoadingAnalysis ? (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                                        <span className="text-sm text-crypto-text-secondary">{t('tradingSignals.ai.insightsLoading')}</span>
                                      </div>
                                      <div className="space-y-2">
                                        <div className="h-3 bg-crypto-bg/20 rounded animate-pulse"></div>
                                        <div className="h-3 bg-crypto-bg/20 rounded animate-pulse w-4/5"></div>
                                        <div className="h-3 bg-crypto-bg/20 rounded animate-pulse w-3/5"></div>
                                      </div>
                                    </div>
                                  ) : aiAnalysis?.notes && aiAnalysis.notes.length > 0 ? (
                                    <div className="space-y-2">
                                      {(() => {
                                        // Use translated notes if available, otherwise use original
                                        const notesToDisplay = translatedNotes[signal.id] || aiAnalysis.notes;
                                        return notesToDisplay.map((note, index) => (
                                          <p key={index} className="text-sm text-crypto-text-secondary leading-relaxed">• {note}</p>
                                        ));
                                      })()}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-crypto-text-secondary italic">{t('tradingSignals.ai.insightsNA')}</p>
                                  )
                                ) : (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                                      <span className="text-sm text-crypto-text-secondary">{t('tradingSignals.ai.marketAnalyzing')}</span>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="h-3 bg-crypto-bg/20 rounded animate-pulse"></div>
                                      <div className="h-3 bg-crypto-bg/20 rounded animate-pulse w-4/5"></div>
                                      <div className="h-3 bg-crypto-bg/20 rounded animate-pulse w-3/5"></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          </div>
        </Card>
      ) : (
        // Grid View (Original Card Layout)
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {signals.map((signal) => {
            const IconComponent = signal.direction === 'LONG' ? TrendingUp : TrendingDown;
            const aiAnalysis = aiAnalyses[signal.id];
            const isLoadingAnalysis = loadingAnalyses[signal.id];
            const displayLevels = getDisplayLevels(signal);
            const riskReward = calculateRiskReward(displayLevels.entry, displayLevels.stop_loss, displayLevels.take_profits);
            const hasDifferences = hasVersionDifferences(signal);
            
            // Fetch AI analysis when signal becomes ENRICHED
            if (signal.status === 'ENRICHED' && !aiAnalysis && !isLoadingAnalysis) {
              fetchAIAnalysis(signal.id);
            }
            
            return (
              <Card key={signal.id} className="bg-gradient-to-br from-crypto-card to-crypto-card/80 border-crypto-border p-4 hover:border-crypto-green/30 hover:shadow-lg hover:shadow-crypto-green/5 transition-all duration-300 shadow-sm group">
                <div className="space-y-4">
                  {/* Header - Pair + Direction + Version + Status */}
                  <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <IconComponent className={`w-4 h-4 ${signal.direction === 'LONG' ? 'text-crypto-green' : 'text-crypto-red'}`} />
                      <span className="font-bold text-crypto-text-primary text-sm">{signal.pair}</span>
                      {/* Direction Badge */}
                      <Badge 
                        variant="outline" 
                        className={`px-1.5 py-0.5 text-xs font-medium ${
                          signal.direction === 'LONG' 
                            ? 'border-crypto-green text-crypto-green bg-crypto-green/10' 
                            : 'border-crypto-red text-crypto-red bg-crypto-red/10'
                        }`}
                      >
                        {signal.direction === 'LONG' ? 'LONG' : 'SHORT'}
                      </Badge>
                      {/* Version Badge */}
                      <Badge 
                        variant={signal.version === 'v2' ? 'default' : 'secondary'} 
                        className={`px-1.5 py-0.5 text-xs font-bold ${
                          signal.version === 'v2' 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-500 text-white'
                        }`}
                      >
                        {signal.version === 'v2' ? (
                          <div className="flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" />
                            v2
                          </div>
                        ) : (
                          'v1'
                        )}
                      </Badge>
                    </div>
                    {/* Status Badge */}
                    <Badge
                      className={`flex items-center justify-center rounded-full w-6 h-6 p-0 ${getStatusColor(signal.status)}`}
                    >
                      {signal.status === 'PROCESSING' ? (
                        <Loader2 className="w-3 h-3 text-crypto-yellow animate-spin" />
                      ) : signal.status === 'ENRICHED' ? (
                        <Check className="w-3 h-3 text-crypto-green" />
                      ) : (
                        <Clock className="w-3 h-3 text-crypto-text-secondary" />
                      )}
                    </Badge>
                  </div>

                  {/* Trade Details */}
                  <div className="bg-crypto-bg/10 rounded-lg p-3 space-y-3">
                    {/* Version Comparison Section */}
                    {signal.version === 'v2' && hasDifferences && (
                      <div className="border-b border-crypto-border pb-2 mb-2">
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="w-3 h-3 text-purple-600" />
                          <span className="text-xs font-medium text-purple-600">AI Adjustments Applied</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {/* Original Levels */}
                          <div className="space-y-1">
                            <span className="text-crypto-text-secondary font-medium">Original (v1):</span>
                            <div className="space-y-1">
                              <div>Entry: <span className="text-crypto-text-primary">{formatPrice(signal.entry)}</span></div>
                              <div>SL: <span className="text-crypto-red">{formatPrice(signal.stop_loss)}</span></div>
                              <div>TP: <span className="text-crypto-green">{formatPrice(signal.take_profits)}</span></div>
                            </div>
                          </div>
                          
                          {/* Adjusted Levels */}
                          <div className="space-y-1">
                            <span className="text-crypto-text-secondary font-medium">AI-Adjusted (v2):</span>
                            <div className="space-y-1">
                              <div>
                                Entry: 
                                <span className={signal.ai_adjusted_entry && JSON.stringify(signal.ai_adjusted_entry) !== JSON.stringify(signal.entry) ? 'text-purple-600 font-bold' : 'text-crypto-text-primary'}>
                                  {formatPrice(displayLevels.entry)}
                                </span>
                              </div>
                              <div>
                                SL: 
                                <span className={signal.ai_adjusted_stop_loss && signal.ai_adjusted_stop_loss !== signal.stop_loss ? 'text-purple-600 font-bold' : 'text-crypto-red'}>
                                  {formatPrice(displayLevels.stop_loss)}
                                </span>
                              </div>
                              <div>
                                TP: 
                                <span className={signal.ai_adjusted_take_profits && JSON.stringify(signal.ai_adjusted_take_profits) !== JSON.stringify(signal.take_profits) ? 'text-purple-600 font-bold' : 'text-crypto-green'}>
                                  {formatPrice(displayLevels.take_profits)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Display Active Levels */}
                    <div className="space-y-2">
                      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm text-crypto-text-secondary font-medium">
                          {isRTL ? formatPrice(displayLevels.entry) : t('tradingSignals.fields.currentEntry')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${hasDifferences ? 'text-purple-600' : 'text-crypto-text-primary'}`}>
                            {isRTL ? t('tradingSignals.fields.currentEntry') : formatPrice(displayLevels.entry)}
                          </span>
                          {signal.version === 'v2' && hasDifferences && (
                            <Badge variant="secondary" className="bg-purple-600 text-white text-xs px-1 py-0">
                              AI
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm text-crypto-text-secondary font-medium">
                          {isRTL ? formatPrice(displayLevels.stop_loss) : t('tradingSignals.fields.currentStopLoss')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${signal.ai_adjusted_stop_loss && signal.ai_adjusted_stop_loss !== signal.stop_loss ? 'text-purple-600' : 'text-crypto-red'}`}>
                            {isRTL ? t('tradingSignals.fields.currentStopLoss') : formatPrice(displayLevels.stop_loss)}
                          </span>
                          {signal.ai_adjusted_stop_loss && signal.ai_adjusted_stop_loss !== signal.stop_loss && (
                            <Badge variant="secondary" className="bg-purple-600 text-white text-xs px-1 py-0">
                              AI
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm text-crypto-text-secondary font-medium">
                          {isRTL ? formatPrice(displayLevels.take_profits) : t('tradingSignals.fields.currentTakeProfit')}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${signal.ai_adjusted_take_profits && JSON.stringify(signal.ai_adjusted_take_profits) !== JSON.stringify(signal.take_profits) ? 'text-purple-600' : 'text-crypto-green'}`}>
                            {isRTL ? t('tradingSignals.fields.currentTakeProfit') : formatPrice(displayLevels.take_profits)}
                          </span>
                          {signal.ai_adjusted_take_profits && JSON.stringify(signal.ai_adjusted_take_profits) !== JSON.stringify(signal.take_profits) && (
                            <Badge variant="secondary" className="bg-purple-600 text-white text-xs px-1 py-0">
                              AI
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {riskReward && (
                        <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-sm text-crypto-text-secondary font-medium">
                            {isRTL ? `1:${riskReward.ratio}` : t('tradingSignals.fields.riskReward')}
                          </span>
                          <span className="text-crypto-text-primary font-semibold">
                            {isRTL ? t('tradingSignals.fields.riskReward') : `1:${riskReward.ratio}`}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* AI Score */}
                    {(signal.status === 'ENRICHED' || signal.status === 'PROCESSING' || signal.status === 'RAW') && (
                      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm text-crypto-text-secondary font-medium">{t('tradingSignals.ai.score')}</span>
                        {signal.status === 'ENRICHED' ? (
                          isLoadingAnalysis ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                              <span className="text-sm text-crypto-text-secondary">{t('tradingSignals.ai.loading')}</span>
                            </div>
                          ) : aiAnalysis?.quality_score ? (
                            <QualityScoreBadge 
                              score={aiAnalysis.quality_score} 
                              scoreBreakdown={aiAnalysis.score_breakdown}
                              className="text-sm px-3 py-1 font-bold"
                            />
                          ) : (
                            <Badge variant="secondary" className="bg-gray-500 text-white px-3 py-1">
                              {t('tradingSignals.ai.scoreNA')}
                            </Badge>
                          )
                        ) : (
                          <Badge variant="secondary" className="bg-crypto-yellow/20 text-crypto-yellow border-crypto-yellow/30 px-3 py-1 font-medium">
                            {t('tradingSignals.ai.analyzing')}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* AI Analysis Button */}
                  {(signal.status === 'ENRICHED' || signal.status === 'PROCESSING' || signal.status === 'RAW') && (
                    <div className="pt-2 border-t border-crypto-border">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full bg-purple-600/10 border-purple-600/30 text-purple-600 hover:bg-purple-600/20 hover:border-purple-600/50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-2">
                              <Brain className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {signal.status === 'ENRICHED' ? 'View AI Analysis' : 'AI Analyzing...'}
                              </span>
                              <Eye className="w-3 h-3" />
                            </div>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl bg-crypto-card border-crypto-border">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-crypto-text-primary">
                              <Brain className="w-5 h-5 text-purple-600" />
                              AI Analysis - {signal.pair} {signal.direction}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Quality Score */}
                            {signal.status === 'ENRICHED' && aiAnalysis?.quality_score && (
                              <div className="bg-crypto-bg/20 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-crypto-text-primary mb-2">Quality Score</h4>
                                <QualityScoreBadge 
                                  score={aiAnalysis.quality_score} 
                                  scoreBreakdown={aiAnalysis.score_breakdown}
                                  className="text-base px-4 py-2 font-bold"
                                />
                              </div>
                            )}
                            
                            {/* AI Notes */}
                            <div className="bg-crypto-bg/20 rounded-lg p-4">
                              <h4 className="text-sm font-medium text-crypto-text-primary mb-3">Market Insights</h4>
                              {signal.status === 'ENRICHED' ? (
                                isLoadingAnalysis ? (
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                                      <span className="text-sm text-crypto-text-secondary">{t('tradingSignals.ai.insightsLoading')}</span>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="h-3 bg-crypto-bg/20 rounded animate-pulse"></div>
                                      <div className="h-3 bg-crypto-bg/20 rounded animate-pulse w-4/5"></div>
                                      <div className="h-3 bg-crypto-bg/20 rounded animate-pulse w-3/5"></div>
                                    </div>
                                  </div>
                                ) : aiAnalysis?.notes && aiAnalysis.notes.length > 0 ? (
                                  <div className="space-y-2">
                                    {(() => {
                                      // Use translated notes if available, otherwise use original
                                      const notesToDisplay = translatedNotes[signal.id] || aiAnalysis.notes;
                                      return notesToDisplay.map((note, index) => (
                                        <p key={index} className="text-sm text-crypto-text-secondary leading-relaxed">• {note}</p>
                                      ));
                                    })()}
                                  </div>
                                ) : (
                                  <p className="text-sm text-crypto-text-secondary italic">{t('tradingSignals.ai.insightsNA')}</p>
                                )
                              ) : (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
                                    <span className="text-sm text-crypto-text-secondary">{t('tradingSignals.ai.marketAnalyzing')}</span>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="h-3 bg-crypto-bg/20 rounded animate-pulse"></div>
                                    <div className="h-3 bg-crypto-bg/20 rounded animate-pulse w-4/5"></div>
                                    <div className="h-3 bg-crypto-bg/20 rounded animate-pulse w-3/5"></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {/* Expiry Notice */}
                  <div className="pt-3 border-t border-crypto-border h-[3rem] flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-crypto-text-secondary" />
                      {(() => {
                        const timeInfo = calculateTimeUntilExpiry(signal.created_at);
                        if (timeInfo.expired) {
                          return (
                            <p className="text-xs text-crypto-red font-medium">
                              {t('tradingSignals.expiry.expired')}
                            </p>
                          );
                        } else {
                          return (
                            <p className="text-xs text-crypto-text-secondary font-medium">
                              {t('tradingSignals.expiry.expiresIn', { hours: timeInfo.hours, minutes: timeInfo.minutes })}
                            </p>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TradingSignals;