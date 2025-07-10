import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Database, 
  Brain, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: Database,
      title: 'Data Collection',
      description: 'Our AI continuously monitors multiple data sources including Binance API, TradingView charts, and Coinglass derivatives data for comprehensive market analysis.',
      sources: ['Binance API', 'TradingView', 'Coinglass', 'On-chain metrics']
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'GPT-4 powered analysis processes market data, technical indicators, sentiment analysis, and historical patterns to identify high-probability trading opportunities.',
      features: ['Technical Analysis', 'Sentiment Analysis', 'Pattern Recognition', 'Risk Assessment']
    },
    {
      icon: TrendingUp,
      title: 'Signal Generation',
      description: 'When our AI identifies a trading opportunity that meets our criteria, it generates a detailed signal with entry, stop loss, and take profit levels.',
      criteria: ['High Confidence Score', 'Favorable Risk/Reward', 'Market Confluence', 'Volume Confirmation']
    },
    {
      icon: CheckCircle,
      title: 'Execution & Monitoring',
      description: 'Signals are delivered to verified users with real-time monitoring and updates as market conditions evolve.',
      monitoring: ['Real-time updates', 'Risk management', 'Performance tracking', 'Market alerts']
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Continuous 24/7 market monitoring and instant signal generation'
    },
    {
      icon: BarChart3,
      title: 'Multiple Timeframes',
      description: 'Analysis across multiple timeframes for comprehensive market view'
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Built-in risk management with proper stop loss and position sizing'
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">How Crypto AI Agent Works</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Our advanced AI system combines cutting-edge technology with proven trading strategies 
          to deliver high-quality cryptocurrency trading signals.
        </p>
      </div>

      {/* Process Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Our 4-Step Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <Card key={index} className="relative">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-2">
                  <step.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{step.description}</p>
                <div className="space-y-2">
                  {(step.sources || step.features || step.criteria || step.monitoring)?.map((item, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-border" />
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Data Sources</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Binance API</h4>
              <p className="text-sm text-muted-foreground">
                Real-time price data, order book information, and trading volume metrics from the world's largest crypto exchange.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">TradingView</h4>
              <p className="text-sm text-muted-foreground">
                Professional charting data, technical indicators, and market analysis from the leading trading platform.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Coinglass</h4>
              <p className="text-sm text-muted-foreground">
                Derivatives data including liquidations, funding rates, and institutional trading metrics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Technology */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5" />
            <span>AI Technology</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Our system leverages GPT-4's advanced language processing capabilities combined with specialized 
            trading algorithms to analyze market conditions and generate trading signals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Machine Learning Models</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Pattern recognition algorithms</li>
                <li>• Sentiment analysis models</li>
                <li>• Volatility prediction systems</li>
                <li>• Risk assessment frameworks</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Analysis Capabilities</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Multi-timeframe technical analysis</li>
                <li>• Market structure evaluation</li>
                <li>• News sentiment processing</li>
                <li>• Historical pattern matching</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Disclaimer */}
      <Alert className="border-warning bg-warning/10">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Risk Disclaimer:</strong> Cryptocurrency trading involves substantial risk of loss. 
          Our AI signals are for informational purposes only and should not be considered as financial advice. 
          Past performance does not guarantee future results. Please trade responsibly and never risk more 
          than you can afford to lose. Always conduct your own research before making trading decisions.
        </AlertDescription>
      </Alert>
    </div>
  );
}