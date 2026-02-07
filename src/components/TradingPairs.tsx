import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TradingPairs = () => {
  const pairs = [
    {
      symbol: "SOL",
      name: "Solana",
      price: "$227.63",
      change: "+2.32%",
      volume: "Vol: 4,106,637.322",
      isPositive: true,
      isSelected: false
    },
    
    {
      symbol: "BTC",
      name: "Bitcoin",
      price: "$114,578.25",
      change: "+0.85%",
      volume: "Vol: 19,979.171",
      isPositive: true,
      isSelected: true
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      price: "$4438.11",
      change: "+1.87%",
      volume: "Vol: 472,808.902",
      isPositive: true,
      isSelected: false
    }
  ];

  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-crypto-text-primary">Select Trading Pair</h2>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-crypto-green rounded-full animate-pulse"></div>
          <span className="text-crypto-green text-sm font-medium">Live</span>
          <button className="ml-2 text-crypto-text-secondary hover:text-crypto-text-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {pairs.map((pair, index) => (
          <Card 
            key={index} 
            className={`p-6 cursor-pointer transition-all duration-300 hover:border-crypto-green/50 ${
              pair.isSelected 
                ? 'bg-crypto-green/10 border-crypto-green shadow-lg' 
                : 'bg-crypto-card border-crypto-border hover:bg-crypto-card/80'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-crypto-text-primary">{pair.symbol}</h3>
                  <p className="text-crypto-text-secondary text-sm">{pair.name}</p>
                </div>
                <Badge 
                  variant="secondary" 
                  className={`${
                    pair.isPositive ? 'bg-crypto-green/20 text-crypto-green' : 'bg-crypto-red/20 text-crypto-red'
                  }`}
                >
                  {pair.change}
                </Badge>
              </div>
              
              <div>
                <p className="text-2xl font-bold text-crypto-text-primary">{pair.price}</p>
                <p className="text-crypto-text-secondary text-sm mt-1">{pair.volume}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <p className="text-center text-crypto-text-secondary text-sm mt-4">
        Real-time updates via WebSocket • Powered by Binance API
      </p>
    </div>
  );
};

export default TradingPairs;
