import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";
import { apiService } from "@/services/api";
import { auth } from "@/lib/firebase";
import { TrendingUp, TrendingDown } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

interface MarketData {
  fearGreedValue: string;
  fearGreedClassification: string;
  btcDominance: number;
  marketCap: number;
  marketCapChange: number;
  marketCapChartData: Array<{ timestamp: number; value: number }>;
}

const MarketHeader = () => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [profileName, setProfileName] = useState<string>("");
  const [marketData, setMarketData] = useState<MarketData>({
    fearGreedValue: "50",
    fearGreedClassification: "Neutral",
    btcDominance: 0,
    marketCap: 0,
    marketCapChange: 0,
    marketCapChartData: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get profile name from Firebase Auth
        const user = auth.currentUser;
        if (user) {
          setProfileName(user.displayName || user.email?.split('@')[0] || "User");
        }

        // Fetch Fear & Greed Index
        const fearGreedData = await apiService.getFearAndGreedIndex();
        
        // Fetch Bitcoin dominance and Market Cap
        const globalData = await apiService.getGlobalMarketData();
        console.log('Global market data:', globalData);

        // Fetch Market Cap chart data
        const chartData = await apiService.getMarketCapChart();
        console.log('Chart data:', chartData);
        
        // Process chart data
        let processedChartData: Array<{ timestamp: number; value: number }> = [];
        if (chartData?.market_cap_chart?.timestamps && chartData?.market_cap_chart?.market_caps) {
          processedChartData = chartData.market_cap_chart.timestamps.map((timestamp: number, index: number) => ({
            timestamp,
            value: chartData.market_cap_chart.market_caps[index]
          }));
        }

        const btcDominance = globalData?.data?.market_cap_percentage?.btc || globalData?.market_cap_percentage?.btc || 51.2;
        const marketCap = globalData?.data?.total_market_cap?.usd || globalData?.total_market_cap?.usd || 2650000000000;
        const marketCapChange = globalData?.data?.market_cap_change_percentage_24h_usd || globalData?.market_cap_change_percentage_24h_usd || 0.5;

        console.log('Final values:', { btcDominance, marketCap, marketCapChange });

        setMarketData({
          fearGreedValue: fearGreedData.data?.[0]?.value || "50",
          fearGreedClassification: fearGreedData.data?.[0]?.value_classification || "Neutral",
          btcDominance,
          marketCap,
          marketCapChange,
          marketCapChartData: processedChartData,
        });
      } catch (error) {
        console.error("Failed to load market data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getFearGreedColor = (value: string) => {
    const numValue = parseInt(value);
    if (numValue <= 25) return "text-crypto-red";
    if (numValue <= 45) return "text-crypto-yellow";
    if (numValue <= 55) return "text-gray-400";
    if (numValue <= 75) return "text-crypto-green";
    return "text-crypto-green";
  };

  const getFearGreedIcon = (value: string) => {
    const numValue = parseInt(value);
    if (numValue <= 50) return <TrendingDown className="w-5 h-5" />;
    return <TrendingUp className="w-5 h-5" />;
  };

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`;
    }
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    }
    return `$${value.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="px-3 md:px-6 pt-3 md:pt-6 space-y-4 md:space-y-6">
        <div className="animate-pulse space-y-4 md:space-y-6">
          {/* Greeting skeleton */}
          <div>
            <div className="h-6 md:h-9 bg-crypto-card rounded-lg w-48 md:w-64 mb-2"></div>
            <div className="h-3 md:h-4 bg-crypto-card rounded w-72 md:w-96"></div>
          </div>
          {/* Cards skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-crypto-card border border-crypto-border rounded-lg p-3 md:p-5 h-36 md:h-44">
                <div className="h-3 md:h-4 bg-crypto-border rounded w-1/2 mb-2 md:mb-3"></div>
                <div className="h-8 md:h-10 bg-crypto-border rounded w-3/4 mb-2 md:mb-3"></div>
                <div className="h-10 md:h-14 bg-crypto-border rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 md:px-6 pt-3 md:pt-6 pb-4 md:pb-8 space-y-4 md:space-y-6">
      {/* Greeting */}
      <div className={isRTL ? 'text-right' : 'text-left'}>
        <h2 className="text-xl md:text-3xl font-bold text-crypto-text-primary tracking-tight">
          {t('dashboard.greeting', { name: profileName })}
        </h2>
        <p className="text-crypto-text-secondary text-xs md:text-sm mt-1">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Market Data Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Fear & Greed Index with Gauge */}
        <Card className="bg-gradient-to-br from-crypto-card to-crypto-card/50 border-crypto-border p-3 md:p-5 hover:border-crypto-green/30 hover:shadow-lg hover:shadow-crypto-green/5 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-crypto-text-secondary text-xs uppercase tracking-wider font-medium">
                {t('dashboard.market.fearGreed', 'Fear & Greed')}
              </p>
              <p className="text-crypto-text-primary/60 text-[10px] mt-0.5">Index</p>
            </div>
           
          </div>
          <div className="relative h-28 flex items-center justify-center -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="25%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="75%" stopColor="#a3e635" />
                    <stop offset="100%" stopColor="#22c55e" />
                  </linearGradient>
                </defs>
                <Pie
                  data={[
                    { value: parseInt(marketData.fearGreedValue) },
                    { value: 100 - parseInt(marketData.fearGreedValue) }
                  ]}
                  cx="50%"
                  cy="75%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius="70%"
                  outerRadius="95%"
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill={
                    parseInt(marketData.fearGreedValue) <= 25 ? '#ef4444' :
                    parseInt(marketData.fearGreedValue) <= 45 ? '#f59e0b' :
                    parseInt(marketData.fearGreedValue) <= 55 ? '#94a3b8' :
                    parseInt(marketData.fearGreedValue) <= 75 ? '#a3e635' :
                    '#22c55e'
                  } />
                  <Cell fill="#0f172a" opacity={0.3} />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 text-center">
              <p className={`text-3xl font-bold ${getFearGreedColor(marketData.fearGreedValue)} tracking-tight`}>
                {marketData.fearGreedValue}
              </p>
              <p className="text-[10px] text-crypto-text-secondary mt-1 font-medium">
                {marketData.fearGreedClassification}
              </p>
            </div>
          </div>
        </Card>

        {/* Bitcoin Dominance */}
        <Card className="bg-gradient-to-br from-crypto-card to-crypto-card/50 border-crypto-border p-3 md:p-5 hover:border-crypto-yellow/30 hover:shadow-lg hover:shadow-crypto-yellow/5 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-crypto-text-secondary text-xs uppercase tracking-wider font-medium">
                {t('dashboard.market.btcDominance', 'Bitcoin Dominance')}
              </p>
              <p className="text-crypto-text-primary/60 text-[10px] mt-0.5">Market Share</p>
            </div>
            <div className="w-7 h-7 rounded-full bg-crypto-yellow/10 flex items-center justify-center group-hover:bg-crypto-yellow/20 transition-colors">
              <svg className="w-4 h-4 text-crypto-yellow" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.075.166-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z"/>
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-crypto-yellow tracking-tight">
                {marketData.btcDominance.toFixed(2)}
              </p>
              <span className="text-xl font-bold text-crypto-yellow/60">%</span>
            </div>
            <div className="relative pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] text-crypto-text-secondary uppercase tracking-wider">Dominance</span>
                <span className="text-[10px] text-crypto-text-secondary">{(100 - marketData.btcDominance).toFixed(2)}% Altcoins</span>
              </div>
              <div className="w-full bg-crypto-border/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-crypto-yellow to-crypto-yellow/80 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${marketData.btcDominance}%` }}
                >
                  <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Market Cap with Chart */}
        <Card className={`bg-gradient-to-br from-crypto-card to-crypto-card/50 border-crypto-border p-3 md:p-5 hover:shadow-lg transition-all duration-300 group ${
          marketData.marketCapChange >= 0 ? 'hover:border-crypto-green/30 hover:shadow-crypto-green/5' : 'hover:border-crypto-red/30 hover:shadow-crypto-red/5'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-crypto-text-secondary text-xs uppercase tracking-wider font-medium">
                {t('dashboard.market.marketCap', 'Market Cap')}
              </p>
              <p className="text-crypto-text-primary/60 text-[10px] mt-0.5">Total Crypto</p>
            </div>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              marketData.marketCapChange >= 0 
                ? 'bg-crypto-green/10 group-hover:bg-crypto-green/20' 
                : 'bg-crypto-red/10 group-hover:bg-crypto-red/20'
            }`}>
              {marketData.marketCapChange >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-crypto-green" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-crypto-red" />
              )}
            </div>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-baseline gap-2">
              <p className={`text-3xl font-bold tracking-tight ${
                marketData.marketCapChange >= 0 ? 'text-crypto-green' : 'text-crypto-red'
              }`}>
                {formatMarketCap(marketData.marketCap)}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-semibold ${
                  marketData.marketCapChange >= 0 ? 'text-crypto-green' : 'text-crypto-red'
                }`}>
                  {marketData.marketCapChange >= 0 ? '+' : ''}{marketData.marketCapChange.toFixed(2)}%
                </span>
                <span className="text-[10px] text-crypto-text-secondary">24h</span>
              </div>
              <span className="text-[10px] text-crypto-text-secondary uppercase tracking-wider">30 Day Trend</span>
            </div>
             <div className="h-24 -mx-2 -mb-2">
               {marketData.marketCapChartData.length > 0 && (
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart 
                     data={marketData.marketCapChartData} 
                     margin={{ top: 10, right: 5, left: 5, bottom: 5 }}
                   >
                     <defs>
                       <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                         <stop 
                           offset="5%" 
                           stopColor={marketData.marketCapChange >= 0 ? '#22c55e' : '#ef4444'} 
                           stopOpacity={0.3}
                         />
                         <stop 
                           offset="95%" 
                           stopColor={marketData.marketCapChange >= 0 ? '#22c55e' : '#ef4444'} 
                           stopOpacity={0}
                         />
                       </linearGradient>
                     </defs>
                     <YAxis 
                       domain={['dataMin', 'dataMax']}
                       hide={true}
                     />
                     <Line 
                       type="monotone" 
                       dataKey="value" 
                       stroke={marketData.marketCapChange >= 0 ? '#22c55e' : '#ef4444'}
                       strokeWidth={2.5}
                       dot={false}
                       fill="url(#colorGradient)"
                       fillOpacity={1}
                     />
                   </LineChart>
                 </ResponsiveContainer>
               )}
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MarketHeader;

