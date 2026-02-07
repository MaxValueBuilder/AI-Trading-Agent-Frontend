import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      navigation: {
        dashboard: 'Dashboard',
        aisignals: 'AI Signals',
        bitiqaicopilot: 'Bitiq.ai Copilot',
        autotrading: 'Auto Trading',
        history: 'History',
        howitworks: 'How It Works',
      },
      tradingSignals: {
        title: 'Current Trade Signals',
        errorTitle: 'Error Loading Signals',
        tryAgain: 'Try Again',
        emptyTitle: 'No Signals Available',
        emptySubtitle: 'No trading signals found. Check back later for new signals.',
        status: {
          analyzing: 'AI analyzing...',
          analyzed: 'AI Analyzed',
          failed: 'Failed'
        },
        version: {
          v1: 'v1 Raw',
          v2: 'AI-Adjusted',
          adjustmentsApplied: 'AI Adjustments Applied',
          original: 'Original (v1):',
          adjusted: 'AI-Adjusted (v2):'
        },
        fields: {
          entry: 'Entry',
          stopLoss: 'SL',
          takeProfit: 'TP',
          currentEntry: 'Current Entry',
          currentStopLoss: 'Current Stop Loss',
          currentTakeProfit: 'Current Take Profit',
          riskReward: 'Risk/Reward Ratio'
        },
        ai: {
          score: 'AI Score',
          loading: 'Loading...',
          scoreNA: 'Score N/A',
          analyzing: 'Analyzing...',
          sectionTitle: 'AI Analysis (based on On-Chain + Macro Data)',
          insightsLoading: 'Loading AI insights...',
          insightsNA: 'No AI insights available',
          marketAnalyzing: 'Analyzing market data...'
        },
        expiry: {
          expired: 'Signal expired',
          expiresIn: 'Signal expires in {{hours}}h {{minutes}}m'
        },
        filters: {
          title: 'Signal Filters',
          subtitle: 'Filter signals by type and timeframe',
          newest: 'Newest',
          short: 'Short',
          long: 'Long',
          history: 'History',
          signals: 'signals'
        },
        table: {
          pair: 'Pair',
          direction: 'Direction',
          version: 'Version',
          status: 'Status',
          entry: 'Entry',
          stopLoss: 'Stop Loss',
          takeProfit: 'Take Profit',
          riskReward: 'Risk:Reward',
          aiScore: 'AI Score',
          expires: 'Expires',
          actions: 'Actions'
        }
      },
      actions: {
        title: 'Actions',
        settings: 'Settings',
        refresh: 'Refresh',
        notifications: 'Notifications',
      },
      sidebar: {
        adminConsole: 'Admin Console',
        myAccount: 'My Account',
        mySubscription: 'My Subscription',
        community: 'Community',
        docs: 'Docs',
        theme: 'Theme',
        language: 'Language',
        logout: 'Logout',
        profileMenu: 'Profile Menu',
        noNewNotifications: 'No new notifications',
        newSignal: 'New Signal',
        aiAnalysisComplete: 'AI Analysis Complete',
        strategy: 'Strategy',
        timeframe: 'Timeframe',
        aiAnalysisStarting: 'AI analysis starting...',
        qualityScore: 'Quality Score',
        readyToTrade: 'Ready to trade',
        freePlan: 'Free Plan',
        monthlyPlan: 'Monthly Plan',
        lifetimePlan: 'Lifetime Plan',
        daysLeft: 'days left'
      },
      profile: {
        myAccount: 'My Account',
        mySubscription: 'My Subscription',
        community: 'Community',
        docs: 'Docs',
        help: 'Help',
        theme: 'Theme',
        language: 'Language',
        logout: 'Logout',
      },
      copilot: {
        greeting: 'How can I help you today?',
        placeholder: 'Send a message to Bitiq.ai Copilot',
        disclaimer: 'Bitiq.ai Copilot is prone to errors. It is recommended to check important information.',
        actions: {
          whatCanYouDo: 'What can you do?',
          createStrategy: 'Create a strategy',
          discussNews: 'Discuss the news',
          learnTrading: 'Learn trading',
        },
        title: 'Bitiq.ai Copilot',
        viewAnalysis: 'View AI Analysis',
        aiAnalyzing: 'AI Analyzing...',
        beta: {
          title: 'These features are in Beta.',
          description: 'Some functionalities may be limited or unavailable while we finalize testing.'
        }
      },
      autoTrading: {
        title: 'My brokers',
        searchPlaceholder: 'Search a broker...',
        connected: 'Connected',
        available: 'Available',
        noConnectedBrokers: 'No connected brokers',
        noAvailableBrokers: 'No brokers found',
        connectFirstBroker: 'Connect your first broker to start auto trading',
        searchDifferent: 'Try searching with different keywords',
        info: {
          title: 'Start Auto Trading',
          description: 'Connect your exchange accounts to enable automated trading based on our AI signals. Your trades will be executed automatically with proper risk management.',
          secure: 'Secure API connections',
          customizable: 'Fully customizable'
        },
        beta: {
          title: 'These features are in Beta.',
          description: 'Some functionalities may be limited or unavailable while we finalize testing.'
        }
      },
      preferences: 'Preferences',
      theme: {
        lightMode: 'Light Mode',
        darkMode: 'Dark Mode',
      },
      user: {
        user: 'User',
        premiumPlan: 'Premium Plan',
      },
      dashboard: {
        title: 'Crypto AI Agent',
        greeting: 'Hello {{name}}',
        currentTradeSignals: 'Current Trade Signals',
        activeLabel: 'Active',
        market: {
          fearGreed: 'Fear & Greed',
          btcDominance: 'Bitcoin Dominance',
          marketCap: 'Market Cap'
        },
        marketAlert: {
          title: 'Market Alert',
          message: 'High volatility detected in BTC. Our AI is monitoring closely for optimal entry points.'
        },
        stats: {
          activeSignals: 'Active Signals',
          todaysProfit: "PnL (24h)",
          avgScore: 'Avg Score',
          riskLevel: 'Risk Level',
          riskMedium: 'Medium'
        }
      },
      history: {
        title: 'Trading History',
        errorLoading: 'Error Loading Data',
        tryAgain: 'Try Again',
        loading: 'Loading signals...',
        noSignals: 'No signals found',
        totalSignals: 'Total Signals',
        executed: 'Executed',
        successRate: 'Success Rate',
        filters: 'Filters',
        allPairs: 'All Pairs',
        allStatus: 'All Status',
        allStrategies: 'All Strategies',
        dateRange: 'Date Range',
        signalHistory: 'Signal History',
        signalId: 'Signal ID',
        pair: 'Pair',
        direction: 'Direction',
        entry: 'Entry',
        stopLoss: 'Stop Loss',
        takeProfits: 'Take Profits',
        strategy: 'Strategy',
        status: 'Status',
        date: 'Date',
      },
      howitworks: {
        title: 'How It Works',
        subtitle: 'AI-Powered Crypto Trading Signals',
        description: 'Leverage advanced artificial intelligence and Smart Money Concepts to identify high-probability trading opportunities in the cryptocurrency market.',
        processTitle: 'Signal Generation Process',
        features: {
          aiPowered: {
            title: 'AI-Powered Signal Generation',
            description: 'Our advanced AI analyzes market data, price action, and smart money concepts to generate high-probability trading signals in real-time.',
            points: [
              'Real-time market data analysis',
              'Pattern recognition algorithms',
              'Multi-timeframe confirmation',
              'Backtested strategies'
            ]
          },
          smartMoney: {
            title: 'Smart Money Concepts (SMC)',
            description: 'We follow institutional trading patterns and liquidity zones to identify where smart money is positioned in the market.',
            points: [
              'Order block identification',
              'Liquidity sweep detection',
              'Market structure analysis',
              'Institutional footprints'
            ]
          },
          riskManagement: {
            title: 'Advanced Risk Management',
            description: 'Every signal comes with calculated stop losses, multiple take profit levels, and position sizing recommendations.',
            points: [
              'Dynamic stop loss placement',
              'Multiple take profit targets',
              'Risk-reward optimization',
              'Position size calculation'
            ]
          },
          realtime: {
            title: 'Real-time Execution',
            description: 'Instant alerts and webhook integration ensure you never miss a trading opportunity with our lightning-fast delivery system.',
            points: [
              'Instant push notifications',
              'Webhook integrations',
              'Multi-platform alerts',
              'Real-time status updates'
            ]
          }
        },
        process: {
          step1: {
            title: 'Market Analysis',
            description: 'AI scans multiple timeframes and trading pairs for optimal setups'
          },
          step2: {
            title: 'Signal Generation',
            description: 'SMC-based algorithms identify high-probability entry points'
          },
          step3: {
            title: 'Risk Calculation',
            description: 'Automatic calculation of stop loss and take profit levels'
          },
          step4: {
            title: 'Instant Delivery',
            description: 'Real-time alerts sent to your preferred platforms'
          }
        },
        signalStructure: 'Signal Structure',
        faq: 'Frequently Asked Questions',
        faqItems: [
          {
            question: 'What is Smart Money Concepts (SMC)?',
            answer: 'SMC is a trading methodology that focuses on understanding how institutional traders (banks, hedge funds) move the market. It involves identifying liquidity zones, order blocks, and market structure to trade alongside smart money rather than against it.'
          },
          {
            question: 'How accurate are the AI-generated signals?',
            answer: 'Our AI system has been backtested extensively with historical data showing consistent performance. However, no trading system is 100% accurate. We provide detailed risk management rules with every signal to help protect your capital.'
          },
          {
            question: 'What timeframes do you cover?',
            answer: 'We analyze multiple timeframes from 1-minute to daily charts. Our signals primarily focus on 15-minute to 4-hour timeframes for optimal risk-reward ratios and practical execution.'
          },
          {
            question: 'How quickly are signals delivered?',
            answer: "Signals are generated and delivered in real-time, typically within seconds of market conditions aligning with our criteria. You'll receive instant notifications through our platform and optional webhook integrations."
          },
          {
            question: 'Can I customize the risk management settings?',
            answer: 'Yes, you can adjust risk tolerance, position sizing, and notification preferences in your settings. However, we recommend following our calculated stop losses and take profits for optimal results.'
          },
          {
            question: 'What trading pairs are supported?',
            answer: "We currently support major cryptocurrency pairs including BTC/USDT, ETH/USDT, SOL/USDT, and other high-volume pairs. We're continuously expanding our coverage based on market demand."
          }
        ],
        riskDisclaimer: {
          title: 'Risk Disclaimer',
          content: 'Trading cryptocurrencies involves substantial risk and may not be suitable for all investors. Past performance does not guarantee future results. Always trade responsibly and never risk more than you can afford to lose. Our signals are for educational purposes and should not be considered as financial advice.'
        }
      },
      settings: {
        title: 'Settings',
        generalSettings: 'General Settings',
        account: 'Account',
        notifications: {
          title: 'Notification Preferences',
          pushNotifications: 'Push Notifications',
          pushDescription: 'Browser push notifications for instant alerts',
          soundAlerts: 'Sound Alerts',
          soundDescription: 'Play sound when new signals arrive',
          alertFrequency: 'Alert Frequency',
          instant: 'Instant',
          fiveMin: 'Every 5 minutes',
          fifteenMin: 'Every 15 minutes',
          hourly: 'Hourly digest'
        },
        trading: {
          title: 'Trading Preferences',
          defaultPairs: 'Default Trading Pairs',
          riskTolerance: 'Risk Tolerance',
          conservative: 'Conservative',
          moderate: 'Moderate',
          aggressive: 'Aggressive'
        },
        dataManagement: 'Data Management',
        exportSettings: 'Export Settings',
        importSettings: 'Import Settings',
        saveAllSettings: 'Save All Settings',
        settingsSaved: 'Settings saved',
        settingsSavedDesc: 'Your preferences have been updated successfully.',
        settingsExported: 'Settings exported',
        settingsExportedDesc: 'Your settings have been downloaded as a JSON file.',
        accountInfo: {
          title: 'Account Information',
          currentPlan: 'Current Plan',
          premium: 'Premium',
          signalsThisMonth: 'Signals This Month',
          memberSince: 'Member Since',
          successRate: 'Success Rate'
        },
        billing: {
          title: 'Billing & Usage',
          nextBilling: 'Next Billing Date',
          manageBilling: 'Manage Billing',
          signalsUsed: 'Signals Used',
          remaining: 'Remaining',
          monthly: 'Monthly'
        }
      },
      auth: {
        welcome_back: "Welcome Back",
        sign_in_description: "Enter your credentials to access your account",
        continue_with_google: "Continue with Google",
        or_continue_with: "or continue with",
        email: "Email",
        email_placeholder: "Enter your email",
        password: "Password",
        password_placeholder: "Enter your password",
        forgot_password: "Forgot password?",
        sign_in: "Sign In",
        no_account: "Don't have an account?",
        sign_up: "Sign up",
        create_account: "Create Account",
        sign_up_description: "Enter your information to create an account",
        full_name: "Full Name",
        full_name_placeholder: "Enter your full name",
        confirm_password: "Confirm Password",
        confirm_password_placeholder: "Confirm your password",
        agree_to: "I agree to the",
        terms_and_conditions: "Terms and Conditions",
        already_have_account: "Already have an account?",
        confirmLogout: "Confirm Logout",
        logoutMessage: "Are you sure you want to logout? You will need to sign in again to access your account.",
        cancel: "Cancel",
        logout: "Logout"
      },
      landing: {
        nav: {
          features: "Features",
          howItWorks: "How It Works",
          pricing: "Pricing",
          testimonials: "Testimonials",
          faq: "FAQ",
          signIn: "Sign In",
          startFree: "Start for Free",
          dashboard: "Dashboard",
          goToDashboard: "Go to Dashboard"
        },
        hero: {
          badge: "AI-Powered Crypto Trading Signals",
          title: "Trade Smarter",
          description: "Bitiq.ai turns complex crypto trading into a simple, data-driven experience. Our AI scans the market 24/7 to find high-confidence trade opportunities — so you can trade smarter, not harder.",
          startTrading: "Start Trading Now",
          seeHow: "See How It Works",
          benefits: {
            startFree: {
              title: "Start Free — Trade Smarter",
              subtitle: "Enjoy a 24-hour free trial."
            },
            payWithCrypto: {
              title: "Pay with Crypto",
              subtitle: "Fast, secure, global."
            },
            cancelAnytime: {
              title: "Cancel Anytime",
              subtitle: "No contracts. Total freedom."
            }
          },
          stats: {
            accuracy: "Signal Accuracy",
            traders: "Active Traders",
            alerts: "Real-time Alerts"
          }
        },
        features: {
          title: "Powerful Features for Serious Traders",
          subtitle: "Everything you need to trade cryptocurrencies with confidence and precision",
          aiMarketAnalysis: {
            title: "AI Market Analysis",
            description: "AI monitors hundreds of coins across multiple timeframes, analyzing momentum, volume, liquidity, and sentiment to detect early setups."
          },
          actionableSignals: {
            title: "Actionable Signals in Real Time",
            description: "When an opportunity appears, Bitiq.ai sends entry, stop-loss, and take-profit targets with AI Confidence Score and optional leverage suggestion."
          },
          copilot: {
            title: "Bitiq.ai Copilot (Beta)",
            description: "Your personal AI companion. Analyze signals, assess risk, or plan strategies — all in plain language.",
            note: "Currently in Beta"
          },
          autoTrade: {
            title: "AutoTrade (Beta)",
            description: "Connect your exchange and let Bitiq.ai AutoTrade execute verified signals automatically while keeping your funds secure.",
            note: "Currently in Beta"
          },
          builtForSafety: {
            title: "Built for Safety",
            description: "All API connections are encrypted. Bitiq.ai cannot withdraw or move funds. You stay in full control."
          }
        },
        examples: {
          title: "See Real Signals in Action",
          subtitle: "Examples of actual signals generated by our AI system",
          long: "LONG",
          short: "SHORT",
          score: "Score",
          entry: "Entry",
          stopLoss: "Stop Loss",
          takeProfit: "Take Profit",
          riskReward: "Risk/Reward",
          aiAnalysis: "AI Analysis",
          insights: {
            btc1: "Strong bullish order blocks at $95k level",
            btc2: "Positive funding rate indicates long bias",
            btc3: "OI increasing with upward price action",
            eth1: "Liquidity sweep completed at $3,380",
            eth2: "Volume increasing on higher timeframes",
            eth3: "Strong support from orderbook data"
          }
        },
        testimonials: {
          title: "Trusted by Traders Worldwide",
          subtitle: "See what our community says about their experience",
          testimonial1: {
            text: "The AI analysis is incredibly accurate. I've increased my win rate by 40% since using Bitiq.ai. The quality scores help me filter out low-probability setups.",
            name: "Michael Chen",
            role: "Day Trader"
          },
          testimonial2: {
            text: "Real-time alerts are game-changing. I never miss an opportunity anymore. The risk management features alone are worth the subscription.",
            name: "Sarah Williams",
            role: "Swing Trader"
          },
          testimonial3: {
            text: "As a beginner, Bitiq.ai's AI guidance gave me the confidence to start trading. The explanations are clear and the signals are reliable.",
            name: "James Rodriguez",
            role: "New Trader"
          }
        },
        howItWorksSection: {
          title: "How Bitiq.ai Works",
          subtitle: "From market analysis to your trading platform in seconds",
          step1: {
            title: "Market Scan",
            description: "Our AI continuously monitors multiple timeframes and trading pairs for optimal setups"
          },
          step2: {
            title: "AI Analysis",
            description: "AI analyzes on-chain data, orderbook depth, and macro indicators to validate signals"
          },
          step3: {
            title: "Quality Score",
            description: "Each signal receives an A+ to C grade based on 5 deterministic factors"
          },
          step4: {
            title: "Instant Alert",
            description: "Receive real-time notifications with entry, stop loss, and take profit levels"
          }
        },
        pricing: {
          title: "Simple, Transparent Pricing",
          subtitle: "Choose the plan that fits your trading needs",
          perMonth: "/month",
          popular: "Most Popular",
          getStarted: "Get Started",
          moneyBack: "Secure crypto payments via OxaPay. No auto-renewals. No hidden fees. Copilot and AutoTrade are currently in Beta — all paying users will receive full access automatically upon release.",
          betaNote: "⚙️ Copilot and AutoTrade are currently in Beta. All paying users will receive full access automatically upon official release — no extra charge.",
          free: {
            name: "Free",
            price: "$0",
            description: "Perfect for trying out the platform",
            feature1: "24-hour trial",
            feature2: "Limited signals",
            feature3: "3 Copilot messages/day",
            feature4: "Basic AI analysis"
          },
          monthly: {
            name: "Monthly",
            price: "$59",
            description: "Best for active traders",
            feature1: "Full access to Signals",
            feature2: "Full access to Copilot",
            feature3: "Full access to AutoTrade",
            feature4: "Real-time notifications",
            feature5: "Priority support",
            feature6: "Advanced analytics"
          },
          lifetime: {
            name: "Lifetime",
            price: "$399",
            description: "Best value - pay once, use forever",
            feature1: "Permanent access to all features",
            feature2: "Premium support",
            feature3: "Early access to new features",
            feature4: "Custom integrations",
            feature5: "Advanced analytics",
            feature6: "No recurring payments",
            feature7: "All future updates included"
          }
        },
        faq: {
          title: "Frequently Asked Questions",
          subtitle: "Everything you need to know about Bitiq.ai",
          q1: {
            question: "How accurate are the AI trading signals?",
            answer: "Our AI system maintains a 98.5% accuracy rate on A+ and A-rated signals. However, no trading system is 100% accurate. We provide detailed risk management guidelines with every signal, including stop losses and position sizing recommendations. Historical performance data shows consistent profitability when following our risk management rules."
          },
          q2: {
            question: "What cryptocurrency pairs do you support?",
            answer: "We currently support major trading pairs including BTC/USDT, ETH/USDT, SOL/USDT, and other high-volume pairs. Our AI analyzes multiple timeframes (15m, 1h, 4h, daily) for each pair. We're continuously expanding our coverage based on trading volume and user demand. Enterprise users can request specific pairs to be added."
          },
          q3: {
            question: "How quickly are signals delivered after market conditions align?",
            answer: "Signals are generated and delivered in real-time, typically within 1-2 seconds of our AI confirming a setup. You'll receive instant push notifications on both desktop and mobile devices. Our infrastructure is optimized for ultra-low latency to ensure you can act on opportunities immediately. Background notifications work even when your browser is closed."
          },
          q4: {
            question: "Can I customize risk management and notification preferences?",
            answer: "Yes! You can customize notification preferences, including which pairs to follow, minimum quality scores (only receive A+ signals, for example), and risk tolerance levels. You can also set custom alert thresholds for specific market conditions like funding rates or OI changes. However, we recommend following our AI-calculated stop losses and take profits for optimal risk-reward ratios."
          },
          q5: {
            question: "What is the difference between v1 and v2 signals?",
            answer: "v1 signals are raw setups identified by our Smart Money Concepts algorithms. v2 signals are AI-enhanced versions where AI has analyzed market data, on-chain metrics, and macro indicators to propose optimized entry, stop loss, and take profit levels. All AI adjustments must pass strict guardrails (maximum ±20% changes, risk-reward minimums) before being applied. You can see both versions side-by-side for transparency."
          },
          q6: {
            question: "When will AutoTrade be available?",
            answer: "AutoTrade is currently in Beta testing and will soon allow users to connect exchanges like Binance, Bybit, OKX, and KuCoin for automated execution."
          },
          q7: {
            question: "What does Copilot do?",
            answer: "Copilot is an AI assistant that helps you analyze market trends, understand signals, and plan trades more effectively. It's currently in Beta and being improved for public launch."
          }
        },
        cta: {
          title: "Ready to Trade Smarter?",
          subtitle: "Join thousands of traders using AI-powered signals to improve their trading performance",
          startTrial: "Start Your Free Trial",
          terms: "Free 24 hours • No credit card required • Cancel anytime"
        },
        footer: {
          description: "The world’s most advanced AI trading companion, powered by Bitiq.ai",
          features: "Features",
          aiSignals: "AI Signals",
          bitiqCopilot: "Bitiq.ai Copilot (Beta)",
          bitiqAutoTrade: "Bitiq.ai AutoTrade (Beta)",
          aiAnalysis: "AI Analysis",
          qualityScoring: "Quality Scoring",
          riskManagement: "Risk Management",
          realTimeAlerts: "Real-time Alerts",
          resources: "Resources",
          documentation: "Documentation",
          howItWorks: "How It Works",
          pricing: "Pricing",
          faq: "FAQ",
          testimonials: "Testimonials",
          signIn: "Sign In",
          company: "Company",
          aboutUs: "About Us",
          termsOfService: "Terms of Service",
          privacyPolicy: "Privacy Policy",
          contact: "Contact",
          email: "Email",
          copyright: "© 2025 Bitiq.ai. All rights reserved.",
          social: {
            twitter: "Twitter",
            telegram: "Telegram"
          },
          blog: "Blog",
          legal: "Legal",
          termsAndConditions: "Terms & Conditions",
          salesTerms: "Sales Terms",
          refundPolicy: "Refund Policy",
          riskDisclosure: "Risk Disclosure",
          cookiePolicy: "Cookie Policy",
          acceptableUse: "Acceptable Use"
        }
      },
      blog: {
        seo: {
          title: "Bitiq.ai Blog - Cryptocurrency Trading Insights",
          description: "Expert articles on crypto trading, AI signals, risk management, and market analysis."
        },
        hero: {
          title: "Bitiq.ai Blog",
          subtitle: "Expert articles on cryptocurrency trading, AI-powered signals, and market analysis to help you stay ahead."
        },
        backToBlog: "Back to Blog",
        backToHome: "Back to Home",
        footer: {
          description: "Stay updated with the latest cryptocurrency trading insights and strategies.",
          copyright: "© 2025 Bitiq.ai Blog. All rights reserved."
        }
      },
      howItWorksPage: {
        hero: {
          title: "How it Works",
          lastUpdated: "Last updated: October 2025"
        },
        idea: {
          title: "The Idea",
          description: "Bitiq.ai turns complex crypto trading into a simple, data-driven experience. Our AI scans the market 24/7, identifies high-probability opportunities, and delivers clear, ready-to-trade signals — so you can trade smarter, not harder."
        },
        step1: {
          title: "Step 1 — AI Market Analysis",
          description: "Our engine continuously monitors hundreds of coins across multiple timeframes. It studies momentum, volume, liquidity, and sentiment to spot early setups before most traders notice them.",
          highlight: "You'll only see filtered, high-confidence signals — not random noise."
        },
        step2: {
          title: "Step 2 — Actionable Signals in Real Time",
          description: "When an opportunity appears, Bitiq.ai instantly sends you:",
          bullet1: "Pair name and direction (LONG / SHORT)",
          bullet2: "Entry, Stop-Loss, and Take-Profit targets",
          bullet3: "AI Confidence Score",
          bullet4: "Optional leverage suggestion",
          note: "You can view signals directly in your dashboard or receive them via your private Telegram channel (English or Arabic)."
        },
        step3: {
          title: "Step 3 — Trade Smarter with Bitiq.ai Copilot",
          description: "Copilot is your personal AI companion. Ask it to analyze signals, evaluate risk, or plan long-term strategies — all in plain language. It learns from your trading style to keep advice relevant.",
          beta: "Currently in Beta — available soon to all paid users."
        },
        step4: {
          title: "Step 4 — Execute Automatically with AutoTrade",
          description: "AutoTrade connects your Bitiq.ai account to major exchanges like Binance, Bybit, OKX, and KuCoin. Once enabled, it mirrors approved signals on your exchange automatically — using your preset risk and capital.",
          security1: "Your funds never leave your account. You remain in full control.",
          security2: "Connects via secure API — read-only access for safety.",
          beta: "Currently in Beta."
        },
        step5: {
          title: "Step 5 — Simple, Transparent Plans",
          plan: "Plan",
          price: "Price",
          highlights: "Highlights",
          freePlan: "Free",
          freePlanHighlights: "24-hour trial, limited signals, 3 Copilot messages/day",
          monthlyPlan: "Monthly",
          monthlyPlanHighlights: "Full access to Signals, Copilot, and AutoTrade",
          lifetimePlan: "Lifetime",
          lifetimePlanHighlights: "Lifetime access + premium support",
          payment: "Secure crypto payments via OxaPay.",
          guarantee: "No auto-renewals. No hidden fees."
        },
        safety: {
          title: "Built for Safety",
          bullet1: "All API connections are encrypted.",
          bullet2: "Bitiq.ai cannot withdraw or move your funds.",
          bullet3: "You decide your capital and leverage — always."
        },
        community: {
          title: "Join the Community",
          description: "Trade alongside thousands of smart traders who rely on AI precision instead of guesswork.",
          cta: "Start Free Trial"
        }
      },
      signalStructure: {
        pair: "Pair",
        direction: "Direction",
        entryZone: "Entry Zone",
        stopLoss: "Stop Loss",
        takeProfits: "Take Profits",
        strategy: "Strategy",
        riskReward: "Risk/Reward"
      },
      account: {
        title: "My Account",
        inviteFriends: {
          title: "Invite Friends",
          description: "Send an invitation to a friend to join Bitiq.ai and help them get started.",
          benefit1: "Your friend will get access to Bitiq.ai with full features",
          benefit2: "You’ll receive an extra day of use, and your friend will get an additional three days when they join through your invitation.",
          button: "Invite Friend"
        },
        telegramAccount: {
          title: "Telegram Account",
          description: "Receive notifications from your strategies directly on Telegram",
          botName: "@bitiqbot",
          button: "Set up"
        },
        personalInfo: {
          title: "Personal Information",
          displayName: "Display Name",
          displayNamePlaceholder: "Enter your display name",
          email: "Email",
          emailPlaceholder: "Enter your email",
          saveChanges: "Save Changes",
          cancel: "Cancel",
          edit: "Edit",
          cannotChange: "Cannot be changed",
          saving: "Saving...",
          changePhoto: "Change photo",
          uploadingPhoto: "Uploading photo..."
        },
        changePassword: {
          title: "Change Password",
          button: "Change Password",
          description: "Update your password to keep your account secure"
        },
        dialogs: {
          inviteFriend: {
            title: "Invite Friend",
            description: "Send an invitation to a friend to join Bitiq.ai",
            emailLabel: "Email Address",
            emailPlaceholder: "friend@example.com",
            emailDescription: "Enter your friend's email address to send them an invitation.",
            cancel: "Cancel",
            sendInvitation: "Send Invitation",
            sending: "Sending..."
          },
          invitationLink: {
            title: "⚠️ Email Failed - Manual Link Required",
            description: "The invitation email couldn't be sent. Please share this link manually with your friend.",
            linkLabel: "Invitation Link",
            copy: "Copy",
            warning: "⚠️ This link will expire in 3 days. Please share it with your friend immediately.",
            close: "Close"
          },
          changePassword: {
            title: "Change Password",
            description: "Enter your current password and choose a new one",
            currentPassword: "Current password",
            currentPasswordPlaceholder: "Current password",
            newPassword: "New password",
            newPasswordPlaceholder: "New password",
            confirmPassword: "Confirm new password",
            confirmPasswordPlaceholder: "Confirm new password",
            cancel: "Cancel",
            changePassword: "Change Password",
            changing: "Changing..."
          }
        },
        messages: {
          profileUpdated: "Profile Updated",
          profileUpdatedDesc: "Your profile information has been updated successfully.",
          profileUpdateFailed: "Failed to update profile",
          displayNameRequired: "Display name is required",
          passwordChanged: "Password changed successfully!",
          passwordChangeFailed: "Failed to change password",
          passwordsDontMatch: "New passwords don't match",
          passwordTooShort: "Password must be at least 6 characters",
          passwordSameAsOld: "New password must be different from current password",
          allFieldsRequired: "All fields are required",
          wrongPassword: "Current password is incorrect",
          weakPassword: "Password is too weak",
          requiresRecentLogin: "Please log out and log in again before changing password",
          invitationCreated: "Invitation created successfully!",
          invitationEmailSent: "Invitation email sent to {{email}}!",
          emailFailed: "Email failed to send. Please share the link manually.",
          invitationFailed: "Failed to create invitation",
          linkCopied: "Invitation link copied to clipboard!",
          enterEmail: "Please enter an email address",
          photoUploaded: "Profile photo updated successfully!",
          photoUploadFailed: "Failed to upload photo"
        }
      },
      subscription: {
        title: "Choose Your Plan",
        subtitle: "Unlock the full potential of AI-powered crypto trading signals",
        currentPlan: "Current",
        daysRemaining: "days remaining",
        mostPopular: "Most Popular",
        currentPlanBadge: "Current Plan",
        startFreeTrial: "Start Free Trial",
        subscribeNow: "Subscribe Now",
        processing: "Processing...",
        loadingPlans: "Loading subscription plans...",
        failedToLoad: "Failed to load subscription information",
        pleaseLogin: "Please log in to subscribe",
        redirectingToPayment: "Redirecting to payment page...",
        subscriptionActivated: "Subscription activated successfully!",
        paymentFailed: "Failed to process payment",
        securePaymentMethods: "Secure Payment Methods",
        cryptocurrency: "Cryptocurrency",
        cryptocurrencyDescription: "Pay with Bitcoin, Ethereum, USDT, and other major cryptocurrencies",
        securePrivate: "Secure & Private",
        securePrivateDescription: "Powered by OxaPay for secure, anonymous payments",
        instantAccess: "Instant Access",
        instantAccessDescription: "Get immediate access to all features after payment confirmation",
        betaNote: "⚙️ Copilot and AutoTrade are currently in Beta. All paying users will receive full access automatically upon official release — no extra charge.",
        duration: {
          day: "day",
          month: "month",
          lifetime: "lifetime"
        },
        plans: {
          free: {
            name: "Free Plan",
            description: "Try Bitiq.ai for 24 hours with limited features",
            features: [
              "24-hour trial",
              "Limited signals",
              "3 Copilot messages/day",
              "Basic AI analysis"
            ]
          },
          monthly: {
            name: "Monthly Plan",
            description: "Full access to all Bitiq.ai features for one month",
            features: [
              "Full access to Signals",
              "Full access to Copilot",
              "Full access to AutoTrade",
              "Real-time notifications",
              "Priority support",
              "Advanced analytics"
            ]
          },
          lifetime: {
            name: "Lifetime Plan",
            description: "One-time payment for lifetime access to all features",
            features: [
              "Permanent access to all features",
              "Premium support",
              "Early access to new features",
              "Custom integrations",
              "Advanced analytics",
              "No recurring payments",
              "All future updates included"
            ]
          }
        }
      }
    },
  },
  ar: {
    translation: {
      navigation: {
        dashboard: 'لوحة التحكم',
        aisignals: 'إشارات الذكاء الاصطناعي',
        bitiqaicopilot: 'مساعد Bitiq.ai',
        autotrading: 'التداول التلقائي',
        history: 'التاريخ',
        howitworks: 'كيف يعمل',
      },
      tradingSignals: {
        title: 'الإشارات الحالية للتداول',
        errorTitle: 'خطأ في تحميل الإشارات',
        tryAgain: 'حاول مرة أخرى',
        emptyTitle: 'لا توجد إشارات متاحة',
        emptySubtitle: 'لم يتم العثور على إشارات تداول. تحقق لاحقًا للحصول على إشارات جديدة.',
        status: {
          analyzing: '...الذكاء الاصطناعي يقوم بالتحليل',
          analyzed: 'تم تحليل الذكاء الاصطناعي',
          failed: 'فشل'
        },
        version: {
          v1: 'v1 خام',
          v2: 'معدلة بالذكاء الاصطناعي',
          adjustmentsApplied: 'تم تطبيق تعديلات الذكاء الاصطناعي',
          original: 'الأصلي (v1):',
          adjusted: 'المعدل بالذكاء الاصطناعي (v2):'
        },
        fields: {
          entry: 'الدخول',
          stopLoss: 'وقف الخسارة',
          takeProfit: 'جني الأرباح',
          currentEntry: 'الدخول الحالي',
          currentStopLoss: 'وقف الخسارة الحالي',
          currentTakeProfit: 'جني الأرباح الحالي',
          riskReward: 'نسبة المخاطرة إلى العائد'
        },
        ai: {
          score: 'تقييم الذكاء الاصطناعي',
          loading: 'جاري التحميل...',
          scoreNA: 'لا يوجد تقييم',
          analyzing: '...جارٍ التحليل',
          sectionTitle: 'تحليل الذكاء الاصطناعي (استنادًا إلى البيانات على السلسلة والاقتصاد الكلي)',
          insightsLoading: 'جاري تحميل رؤى الذكاء الاصطناعي...',
          insightsNA: 'لا توجد رؤى متاحة',
          marketAnalyzing: '...جارٍ تحليل بيانات السوق'
        },
        expiry: {
          expired: 'انتهت صلاحية الإشارة',
          expiresIn: 'تنتهي صلاحية الإشارة خلال {{hours}}س {{minutes}}د'
        },
        filters: {
          title: 'مرشحات الإشارات',
          subtitle: 'تصفية الإشارات حسب النوع والإطار الزمني',
          newest: 'الأحدث',
          short: 'البيع',
          long: 'الشراء',
          history: 'التاريخ',
          signals: 'إشارات'
        },
        table: {
          pair: 'الزوج',
          direction: 'الاتجاه',
          version: 'الإصدار',
          status: 'الحالة',
          entry: 'الدخول',
          stopLoss: 'وقف الخسارة',
          takeProfit: 'جني الأرباح',
          riskReward: 'المخاطرة:العائد',
          aiScore: 'تقييم الذكاء الاصطناعي',
          expires: 'ينتهي',
          actions: 'الإجراءات'
        }
      },
      actions: {
        title: 'الإجراءات',
        settings: 'الإعدادات',
        refresh: 'تحديث',
        notifications: 'الإشعارات',
      },
      sidebar: {
        adminConsole: 'وحدة تحكم الإدارة',
        myAccount: 'حسابي',
        mySubscription: 'اشتراكي',
        community: 'المجتمع',
        docs: 'الوثائق',
        theme: 'المظهر',
        language: 'اللغة',
        logout: 'تسجيل الخروج',
        profileMenu: 'قائمة الملف الشخصي',
        noNewNotifications: 'لا توجد إشعارات جديدة',
        newSignal: 'إشارة جديدة',
        aiAnalysisComplete: 'اكتمل تحليل الذكاء الاصطناعي',
        strategy: 'الاستراتيجية',
        timeframe: 'الإطار الزمني',
        aiAnalysisStarting: 'بدء تحليل الذكاء الاصطناعي...',
        qualityScore: 'تقييم الجودة',
        readyToTrade: 'جاهز للتداول',
        freePlan: 'الخطة المجانية',
        monthlyPlan: 'الخطة الشهرية',
        lifetimePlan: 'الخطة مدى الحياة',
        daysLeft: 'أيام متبقية'
      },
      profile: {
        myAccount: 'حسابي',
        mySubscription: 'اشتراكي',
        community: 'المجتمع',
        docs: 'الوثائق',
        help: 'المساعدة',
        theme: 'المظهر',
        language: 'اللغة',
        logout: 'تسجيل الخروج',
      },
      copilot: {
        greeting: 'كيف يمكنني مساعدتك اليوم؟',
        placeholder: 'أرسل رسالة إلى مساعد Bitiq.ai',
        disclaimer: 'مساعد Bitiq.ai عرضة للأخطاء. يُنصح بالتحقق من المعلومات المهمة.',
        actions: {
          whatCanYouDo: 'ماذا يمكنك أن تفعل؟',
          createStrategy: 'إنشاء استراتيجية',
          discussNews: 'مناقشة الأخبار',
          learnTrading: 'تعلم التداول',
        },
        title: 'مساعد Bitiq.ai',
        viewAnalysis: 'عرض تحليل الذكاء الاصطناعي',
        aiAnalyzing: 'الذكاء الاصطناعي يحلل...',
        beta: {
          title: 'هذه الميزات في مرحلة التجريب.',
          description: 'قد تكون بعض الوظائف محدودة أو غير متاحة بينما ننهي الاختبار.'
        }
      },
      autoTrading: {
        title: 'وسطائي',
        searchPlaceholder: 'البحث عن وسيط...',
        connected: 'متصل',
        available: 'متاح',
        noConnectedBrokers: 'لا يوجد وسطاء متصلين',
        noAvailableBrokers: 'لم يتم العثور على وسطاء',
        connectFirstBroker: 'قم بتوصيل أول وسيط لك لبدء التداول التلقائي',
        searchDifferent: 'جرب البحث بكلمات مفتاحية مختلفة',
        info: {
          title: 'ابدأ التداول التلقائي',
          description: 'قم بتوصيل حسابات البورصة الخاصة بك لتمكين التداول الآلي بناءً على إشارات الذكاء الاصطناعي. ستتم تنفيذ صفقاتك تلقائياً مع إدارة مخاطر مناسبة.',
          secure: 'اتصالات API آمنة',
          customizable: 'قابل للتخصيص بالكامل'
        },
        beta: {
          title: 'هذه الميزات في مرحلة التجريب.',
          description: 'قد تكون بعض الوظائف محدودة أو غير متاحة بينما ننهي الاختبار.'
        }
      },
      preferences: 'التفضيلات',
      theme: {
        lightMode: 'النمط المضيء',
        darkMode: 'النمط المظلم',
      },
      user: {
        user: 'المستخدم',
        premiumPlan: 'الخطة المميزة',
      },
      dashboard: {
        title: 'وكيل العملات المشفرة بالذكاء الاصطناعي',
        greeting: 'مرحباً {{name}}',
        currentTradeSignals: 'الإشارات الحالية للتداول',
        activeLabel: 'نشطة',
        market: {
          fearGreed: 'مؤشر الخوف والجشع',
          btcDominance: 'هيمنة البيتكوين',
          marketCap: 'القيمة السوقية'
        },
        marketAlert: {
          title: 'تنبيه السوق',
          message: 'تم رصد تقلبات عالية في عملة BTC. نظام الذكاء الاصطناعي يراقب عن كثب لاختيار أفضل نقاط الدخول.'
        },
        stats: {
          activeSignals: 'الإشارات النشطة',
          todaysProfit: 'الأرباح (٢٤ ساعة)',
          avgScore: 'متوسط التقييم',
          riskLevel: 'مستوى المخاطرة',
          riskMedium: 'متوسط'
        }
      },
      history: {
        title: 'تاريخ التداول',
        errorLoading: 'خطأ في تحميل البيانات',
        tryAgain: 'حاول مرة أخرى',
        loading: 'جاري تحميل الإشارات...',
        noSignals: 'لم يتم العثور على إشارات',
        totalSignals: 'إجمالي الإشارات',
        executed: 'منفذة',
        successRate: 'معدل النجاح',
        filters: 'المرشحات',
        allPairs: 'جميع الأزواج',
        allStatus: 'جميع الحالات',
        allStrategies: 'جميع الاستراتيجيات',
        dateRange: 'نطاق التاريخ',
        signalHistory: 'تاريخ الإشارات',
        signalId: 'معرف الإشارة',
        pair: 'الزوج',
        direction: 'الاتجاه',
        entry: 'الدخول',
        stopLoss: 'وقف الخسارة',
        takeProfits: 'جني الأرباح',
        strategy: 'الاستراتيجية',
        status: 'الحالة',
        date: 'التاريخ',
      },
      howitworks: {
        title: 'كيف يعمل',
        subtitle: 'إشارات تداول العملات المشفرة بالذكاء الاصطناعي',
        description: 'استفد من الذكاء الاصطناعي المتقدم ومفاهيم الأموال الذكية لتحديد فرص التداول عالية الاحتمال في سوق العملات المشفرة.',
        processTitle: 'عملية إنتاج الإشارات',
        features: {
          aiPowered: {
            title: 'إنتاج الإشارات بالذكاء الاصطناعي',
            description: 'يحلل الذكاء الاصطناعي المتقدم بيانات السوق وحركة الأسعار ومفاهيم الأموال الذكية لإنتاج إشارات تداول عالية الاحتمال في الوقت الفعلي.',
            points: [
              'تحليل بيانات السوق في الوقت الفعلي',
              'خوارزميات التعرف على الأنماط',
              'تأكيد متعدد الأطر الزمنية',
              'استراتيجيات مختبرة تاريخياً'
            ]
          },
          smartMoney: {
            title: 'مفاهيم الأموال الذكية (SMC)',
            description: 'نتبع أنماط التداول المؤسسي ومناطق السيولة لتحديد مكان تموضع الأموال الذكية في السوق.',
            points: [
              'تحديد كتل الطلبات',
              'اكتشاف مسح السيولة',
              'تحليل هيكل السوق',
              'بصمات المؤسسات'
            ]
          },
          riskManagement: {
            title: 'إدارة المخاطر المتقدمة',
            description: 'كل إشارة تأتي مع وقف خسائر محسوب ومستويات متعددة لجني الأرباح وتوصيات حجم المركز.',
            points: [
              'وضع وقف الخسارة الديناميكي',
              'أهداف متعددة لجني الأرباح',
              'تحسين المخاطرة مقابل العائد',
              'حساب حجم المركز'
            ]
          },
          realtime: {
            title: 'التنفيذ في الوقت الفعلي',
            description: 'التنبيهات الفورية وتكامل الـ webhook يضمنان عدم تفويت أي فرصة تداول مع نظام التسليم فائق السرعة.',
            points: [
              'إشعارات فورية',
              'تكاملات webhook',
              'تنبيهات متعددة المنصات',
              'تحديثات الحالة في الوقت الفعلي'
            ]
          }
        },
        process: {
          step1: {
            title: 'تحليل السوق',
            description: 'الذكاء الاصطناعي يفحص عدة أطر زمنية وأزواج تداول للحصول على إعدادات مثلى'
          },
          step2: {
            title: 'إنتاج الإشارات',
            description: 'خوارزميات قائمة على SMC تحدد نقاط دخول عالية الاحتمال'
          },
          step3: {
            title: 'حساب المخاطر',
            description: 'حساب تلقائي لوقف الخسارة ومستويات جني الأرباح'
          },
          step4: {
            title: 'التسليم الفوري',
            description: 'تنبيهات فورية ترسل إلى المنصات المفضلة لديك'
          }
        },
        signalStructure: 'هيكل الإشارة',
        faq: 'الأسئلة الشائعة',
        faqItems: [
          {
            question: 'ما هي مفاهيم الأموال الذكية (SMC)?',
            answer: 'SMC هي منهجية تداول تركز على فهم كيفية تحرك المتداولين المؤسساتيين (البنوك، صناديق التحوط) في السوق. تتضمن تحديد مناطق السيولة وكتل الأوامر وهيكل السوق للتداول مع الأموال الذكية وليس ضدها.'
          },
          {
            question: 'ما مدى دقة الإشارات التي يولدها الذكاء الاصطناعي؟',
            answer: 'تم اختبار نظام الذكاء الاصطناعي لدينا تاريخياً على نطاق واسع ببيانات سابقة وأظهر أداءً ثابتاً. ومع ذلك، لا يوجد نظام تداول دقيق بنسبة 100%. نوفر قواعد دقيقة لإدارة المخاطر مع كل إشارة لحماية رأس المال.'
          },
          {
            question: 'ما هي الأطر الزمنية التي تغطونها؟',
            answer: 'نقوم بتحليل عدة أطر زمنية من دقيقة واحدة إلى الرسوم اليومية. تركز إشاراتنا بشكل رئيسي على الأطر من 15 دقيقة حتى 4 ساعات لتحقيق أفضل نسب المخاطرة إلى العائد والتنفيذ العملي.'
          },
          {
            question: 'ما مدى سرعة تسليم الإشارات؟',
            answer: 'تُولد الإشارات وتُسلّم في الوقت الفعلي عادةً خلال ثوانٍ من توافق ظروف السوق مع معاييرنا. ستتلقى إشعارات فورية عبر منصتنا وتكاملات webhook الاختيارية.'
          },
          {
            question: 'هل يمكنني تخصيص إعدادات إدارة المخاطر؟',
            answer: 'نعم، يمكنك ضبط تحمل المخاطر وحجم المركز وتفضيلات الإشعارات في الإعدادات. ومع ذلك، نوصي باتباع مستويات وقف الخسارة وجني الأرباح المحسوبة لتحقيق أفضل النتائج.'
          },
          {
            question: 'ما هي أزواج التداول المدعومة؟',
            answer: 'ندعم حالياً الأزواج الرئيسية للعملات المشفرة بما في ذلك BTC/USDT و ETH/USDT و SOL/USDT وغيرها من الأزواج عالية السيولة. ونواصل توسيع التغطية وفقاً لطلب السوق.'
          }
        ],
        riskDisclaimer: {
          title: 'إخلاء مسؤولية المخاطر',
          content: 'ينطوي تداول العملات المشفرة على مخاطر كبيرة وقد لا يكون مناسباً لجميع المستثمرين. الأداء السابق لا يضمن النتائج المستقبلية. تداول دائماً بمسؤولية ولا تخاطر أبداً بأكثر مما يمكنك تحمل خسارته. إشاراتنا للأغراض التعليمية ولا ينبغي اعتبارها نصيحة مالية.'
        }
      },
      settings: {
        title: 'الإعدادات',
        generalSettings: 'الإعدادات العامة',
        account: 'الحساب',
        notifications: {
          title: 'تفضيلات الإشعارات',
          pushNotifications: 'الإشعارات الفورية',
          pushDescription: 'إشعارات المتصفح الفورية للتنبيهات الفورية',
          soundAlerts: 'تنبيهات صوتية',
          soundDescription: 'تشغيل صوت عند وصول إشارات جديدة',
          alertFrequency: 'تكرار التنبيهات',
          instant: 'فوري',
          fiveMin: 'كل 5 دقائق',
          fifteenMin: 'كل 15 دقيقة',
          hourly: 'ملخص كل ساعة'
        },
        trading: {
          title: 'تفضيلات التداول',
          defaultPairs: 'أزواج التداول الافتراضية',
          riskTolerance: 'تحمل المخاطر',
          conservative: 'محافظ',
          moderate: 'معتدل',
          aggressive: 'عدواني'
        },
        dataManagement: 'إدارة البيانات',
        exportSettings: 'تصدير الإعدادات',
        importSettings: 'استيراد الإعدادات',
        saveAllSettings: 'حفظ جميع الإعدادات',
        settingsSaved: 'تم حفظ الإعدادات',
        settingsSavedDesc: 'تم تحديث تفضيلاتك بنجاح.',
        settingsExported: 'تم تصدير الإعدادات',
        settingsExportedDesc: 'تم تنزيل إعداداتك كملف JSON.',
        accountInfo: {
          title: 'معلومات الحساب',
          currentPlan: 'الخطة الحالية',
          premium: 'مميزة',
          signalsThisMonth: 'الإشارات هذا الشهر',
          memberSince: 'عضو منذ',
          successRate: 'معدل النجاح'
        },
        billing: {
          title: 'الفواتير والاستخدام',
          nextBilling: 'تاريخ الفاتورة التالية',
          manageBilling: 'إدارة الفواتير',
          signalsUsed: 'الإشارات المستخدمة',
          remaining: 'المتبقي',
          monthly: 'شهرياً'
        }
      },
      auth: {
        welcome_back: 'مرحباً بعودتك',
        sign_in_description: 'أدخل بياناتك للوصول إلى حسابك',
        continue_with_google: 'المتابعة مع جوجل',
        or_continue_with: 'أو المتابعة مع',
        email: 'البريد الإلكتروني',
        email_placeholder: 'أدخل بريدك الإلكتروني',
        password: 'كلمة المرور',
        password_placeholder: 'أدخل كلمة المرور',
        forgot_password: 'نسيت كلمة المرور؟',
        sign_in: 'تسجيل الدخول',
        no_account: 'ليس لديك حساب؟',
        sign_up: 'إنشاء حساب',
        create_account: 'إنشاء حساب',
        sign_up_description: 'أدخل معلوماتك لإنشاء حساب',
        full_name: 'الاسم الكامل',
        full_name_placeholder: 'أدخل اسمك الكامل',
        confirm_password: 'تأكيد كلمة المرور',
        confirm_password_placeholder: 'أكد كلمة المرور',
        agree_to: 'أوافق على',
        terms_and_conditions: 'الشروط والأحكام',
        already_have_account: 'لديك حساب بالفعل؟',
        confirmLogout: 'تأكيد تسجيل الخروج',
        logoutMessage: 'هل أنت متأكد من أنك تريد تسجيل الخروج؟ ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.',
        cancel: 'إلغاء',
        logout: 'تسجيل الخروج'
      },
      landing: {
        nav: {
          features: "الميزات",
          howItWorks: "كيف يعمل",
          pricing: "الأسعار",
          testimonials: "آراء العملاء",
          faq: "الأسئلة الشائعة",
          signIn: "تسجيل الدخول",
          startFree: "ابدأ مجانًا",
          dashboard: "لوحة التحكم",
          goToDashboard: "انتقل إلى لوحة التحكم"
        },
        hero: {
          badge: "إشارات تداول العملات المشفرة بالذكاء الاصطناعي",
          title: "تداول بذكاء",
          description: "يحول Bitiq.ai التداول المعقد للعملات المشفرة إلى تجربة بسيطة مدعومة بالبيانات. يقوم الذكاء الاصطناعي لدينا بفحص السوق على مدار الساعة طوال أيام الأسبوع للعثور على فرص تداول عالية الثقة — حتى تتمكن من التداول بذكاء، وليس بصعوبة.",
          startTrading: "ابدأ التداول الآن",
          seeHow: "شاهد كيف يعمل",
          benefits: {
            startFree: {
              title: "ابدأ مجانًا — تداول بذكاء",
              subtitle: "استمتع بتجربة مجانية لمدة 24 ساعة."
            },
            payWithCrypto: {
              title: "الدفع بالعملات المشفرة",
              subtitle: "سريع، آمن، عالمي."
            },
            cancelAnytime: {
              title: "إلغاء في أي وقت",
              subtitle: "بدون عقود. حرية كاملة."
            }
          },
          stats: {
            accuracy: "دقة الإشارات",
            traders: "المتداولون النشطون",
            alerts: "التنبيهات الفورية"
          }
        },
        features: {
          title: "ميزات قوية للمتداولين الجادين",
          subtitle: "كل ما تحتاجه لتداول العملات المشفرة بثقة ودقة",
          aiMarketAnalysis: {
            title: "تحليل السوق بالذكاء الاصطناعي",
            description: "يراقب الذكاء الاصطناعي مئات العملات عبر عدة أطر زمنية، ويحلل الزخم والحجم والسيولة والمشاعر لاكتشاف الإعدادات المبكرة."
          },
          actionableSignals: {
            title: "إشارات قابلة للتنفيذ في الوقت الفعلي",
            description: "عندما تظهر فرصة، يرسل Bitiq.ai أهداف الدخول ووقف الخسارة وجني الأرباح مع تقييم ثقة الذكاء الاصطناعي واقتراح الرافعة المالية الاختياري."
          },
          copilot: {
            title: "مساعد Bitiq.ai (تجريبي)",
            description: "رفيقك الشخصي بالذكاء الاصطناعي. حلل الإشارات، وقيّم المخاطر، أو خطط للاستراتيجيات — كل ذلك بلغة بسيطة.",
            note: "حالياً في مرحلة التجريب"
          },
          autoTrade: {
            title: "التداول التلقائي (تجريبي)",
            description: "قم بتوصيل بورصتك واترك Bitiq.ai AutoTrade ينفذ الإشارات المؤكدة تلقائياً مع الحفاظ على أموالك آمنة.",
            note: "حالياً في مرحلة التجريب"
          },
          builtForSafety: {
            title: "مبني للأمان",
            description: "جميع اتصالات API مشفرة. لا يمكن لـ Bitiq.ai سحب أو نقل الأموال. تبقى في سيطرة كاملة."
          }
        },
        examples: {
          title: "شاهد الإشارات الحقيقية أثناء العمل",
          subtitle: "أمثلة على الإشارات الفعلية التي يولدها نظام الذكاء الاصطناعي لدينا",
          long: "شراء",
          short: "بيع",
          score: "التقييم",
          entry: "الدخول",
          stopLoss: "وقف الخسارة",
          takeProfit: "جني الأرباح",
          riskReward: "المخاطرة/العائد",
          aiAnalysis: "تحليل الذكاء الاصطناعي",
          insights: {
            btc1: "كتل أوامر صعودية قوية عند مستوى 95 ألف دولار",
            btc2: "معدل التمويل الإيجابي يشير إلى التحيز الطويل",
            btc3: "الفائدة المفتوحة تتزايد مع حركة السعر الصاعدة",
            eth1: "اكتمل مسح السيولة عند 3,380 دولار",
            eth2: "الحجم يتزايد على الأطر الزمنية الأعلى",
            eth3: "دعم قوي من بيانات دفتر الطلبات"
          }
        },
        testimonials: {
          title: "موثوق به من قبل المتداولين في جميع أنحاء العالم",
          subtitle: "اطلع على ما يقوله مجتمعنا عن تجربتهم",
          testimonial1: {
            text: "تحليل الذكاء الاصطناعي دقيق بشكل لا يصدق. لقد زدت معدل الفوز بنسبة 40٪ منذ استخدام Bitiq.ai. تساعدني تقييمات الجودة في تصفية الإعدادات ذات الاحتمال المنخفض.",
            name: "مايكل تشن",
            role: "متداول يومي"
          },
          testimonial2: {
            text: "التنبيهات الفورية تغير قواعد اللعبة. لم أعد أفوت أي فرصة بعد الآن. ميزات إدارة المخاطر وحدها تستحق الاشتراك.",
            name: "سارة ويليامز",
            role: "متداول متأرجح"
          },
          testimonial3: {
            text: "كمبتدئ، أعطاني توجيه الذكاء الاصطناعي من Bitiq.ai الثقة لبدء التداول. التفسيرات واضحة والإشارات موثوقة.",
            name: "جيمس رودريغيز",
            role: "متداول جديد"
          }
        },
        howItWorksSection: {
          title: "كيف يعمل Bitiq.ai",
          subtitle: "من تحليل السوق إلى منصة التداول الخاصة بك في ثوانٍ",
          step1: {
            title: "مسح السوق",
            description: "يراقب الذكاء الاصطناعي لدينا باستمرار عدة أطر زمنية وأزواج تداول للحصول على إعدادات مثالية"
          },
          step2: {
            title: "تحليل الذكاء الاصطناعي",
            description: "يحلل AI البيانات على السلسلة وعمق دفتر الطلبات ومؤشرات الاقتصاد الكلي للتحقق من صحة الإشارات"
          },
          step3: {
            title: "تقييم الجودة",
            description: "تحصل كل إشارة على درجة من A+ إلى C بناءً على 5 عوامل حتمية"
          },
          step4: {
            title: "تنبيه فوري",
            description: "استقبل إشعارات فورية مع مستويات الدخول ووقف الخسارة وجني الأرباح"
          }
        },
        pricing: {
          title: "تسعير بسيط وشفاف",
          subtitle: "اختر الخطة التي تناسب احتياجات التداول الخاصة بك",
          perMonth: "/شهر",
          popular: "الأكثر شعبية",
          getStarted: "ابدأ الآن",
          moneyBack: "مدفوعات آمنة بالعملات المشفرة عبر OxaPay. بدون تجديد تلقائي. بدون رسوم مخفية. مساعد الذكاء الاصطناعي والتداول التلقائي حالياً في مرحلة التجريب — سيحصل جميع المستخدمين المدفوعين على وصول كامل تلقائياً عند الإصدار.",
          betaNote: "⚙️ مساعد الذكاء الاصطناعي والتداول التلقائي حالياً في مرحلة التجريب. سيحصل جميع المستخدمين المدفوعين على وصول كامل تلقائياً عند الإصدار الرسمي — بدون رسوم إضافية.",
          free: {
            name: "مجاني",
            price: "$0",
            description: "مثالي لتجربة المنصة",
            feature1: "تجربة لمدة 24 ساعة",
            feature2: "إشارات محدودة",
            feature3: "3 رسائل مساعد ذكاء اصطناعي/يوم",
            feature4: "تحليل أساسي بالذكاء الاصطناعي"
          },
          monthly: {
            name: "شهري",
            price: "$59",
            description: "الأفضل للمتداولين النشطين",
            feature1: "وصول كامل للإشارات",
            feature2: "وصول كامل لمساعد الذكاء الاصطناعي",
            feature3: "وصول كامل للتداول التلقائي",
            feature4: "إشعارات فورية",
            feature5: "دعم ذو أولوية",
            feature6: "تحليلات متقدمة"
          },
          lifetime: {
            name: "مدى الحياة",
            price: "$399",
            description: "أفضل قيمة - ادفع مرة واحدة، استخدم إلى الأبد",
            feature1: "وصول دائم لجميع الميزات",
            feature2: "دعم مميز",
            feature3: "وصول مبكر للميزات الجديدة",
            feature4: "تكاملات مخصصة",
            feature5: "تحليلات متقدمة",
            feature6: "بدون دفعات متكررة",
            feature7: "جميع التحديثات المستقبلية مشمولة"
          }
        },
        faq: {
          title: "الأسئلة الشائعة",
          subtitle: "كل ما تحتاج معرفته عن Bitiq.ai",
          q1: {
            question: "ما مدى دقة إشارات التداول بالذكاء الاصطناعي؟",
            answer: "يحافظ نظام الذكاء الاصطناعي لدينا على معدل دقة 98.5٪ على الإشارات المصنفة A+ و A. ومع ذلك، لا يوجد نظام تداول دقيق بنسبة 100٪. نوفر إرشادات تفصيلية لإدارة المخاطر مع كل إشارة، بما في ذلك وقف الخسائر وتوصيات حجم المركز. تُظهر بيانات الأداء التاريخية ربحية متسقة عند اتباع قواعد إدارة المخاطر لدينا."
          },
          q2: {
            question: "ما هي أزواج العملات المشفرة التي تدعمونها؟",
            answer: "ندعم حاليًا أزواج التداول الرئيسية بما في ذلك BTC/USDT و ETH/USDT و SOL/USDT وأزواج أخرى عالية الحجم. يحلل الذكاء الاصطناعي لدينا عدة أطر زمنية (15 دقيقة، 1 ساعة، 4 ساعات، يومي) لكل زوج. نواصل توسيع تغطيتنا بناءً على حجم التداول وطلب المستخدمين. يمكن لمستخدمي المؤسسات طلب إضافة أزواج محددة."
          },
          q3: {
            question: "ما مدى سرعة تسليم الإشارات بعد توافق ظروف السوق؟",
            answer: "يتم إنشاء الإشارات وتسليمها في الوقت الفعلي، عادةً خلال 1-2 ثانية من تأكيد الذكاء الاصطناعي للإعداد. ستتلقى إشعارات فورية على أجهزة سطح المكتب والأجهزة المحمولة. تم تحسين البنية التحتية لدينا لزمن انتقال منخفض للغاية لضمان إمكانية التصرف في الفرص على الفور. تعمل الإشعارات في الخلفية حتى عندما يكون المتصفح مغلقًا."
          },
          q4: {
            question: "هل يمكنني تخصيص إدارة المخاطر وتفضيلات الإشعارات؟",
            answer: "نعم! يمكنك تخصيص تفضيلات الإشعارات، بما في ذلك الأزواج التي تريد متابعتها، والحد الأدنى لتقييمات الجودة (استلام إشارات A+ فقط، على سبيل المثال)، ومستويات تحمل المخاطر. يمكنك أيضًا تعيين عتبات تنبيه مخصصة لظروف السوق المحددة مثل معدلات التمويل أو تغييرات الفائدة المفتوحة. ومع ذلك، نوصي باتباع مستويات وقف الخسارة وجني الأرباح المحسوبة بالذكاء الاصطناعي للحصول على أفضل نسب المخاطرة إلى العائد."
          },
          q5: {
            question: "ما الفرق بين إشارات v1 و v2؟",
            answer: "إشارات v1 هي إعدادات خام تم تحديدها بواسطة خوارزميات مفاهيم الأموال الذكية لدينا. إشارات v2 هي نسخ محسّنة بالذكاء الاصطناعي حيث قام AI بتحليل بيانات السوق والمقاييس على السلسلة ومؤشرات الاقتصاد الكلي لاقتراح مستويات محسّنة للدخول ووقف الخسارة وجني الأرباح. يجب أن تجتاز جميع تعديلات الذكاء الاصطناعي ضمانات صارمة (حد أقصى ±20٪ تغييرات، الحد الأدنى للمخاطرة-العائد) قبل تطبيقها. يمكنك رؤية كلا الإصدارين جنبًا إلى جنب للشفافية."
          },
          q6: {
            question: "متى سيكون التداول التلقائي متاحاً؟",
            answer: "التداول التلقائي حالياً في مرحلة الاختبار التجريبي وسيسمح قريباً للمستخدمين بتوصيل بورصات مثل Binance و Bybit و OKX و KuCoin للتنفيذ الآلي."
          },
          q7: {
            question: "ماذا يفعل مساعد الذكاء الاصطناعي؟",
            answer: "مساعد الذكاء الاصطناعي هو مساعد ذكي يساعدك في تحليل اتجاهات السوق وفهم الإشارات والتخطيط للصفقات بشكل أكثر فعالية. إنه حالياً في مرحلة التجريب ويتم تحسينه للإطلاق العام."
          }
        },
        cta: {
          title: "هل أنت مستعد للتداول بذكاء؟",
          subtitle: "انضم إلى آلاف المتداولين الذين يستخدمون إشارات مدعومة بالذكاء الاصطناعي لتحسين أداء التداول",
          startTrial: "ابدأ تجربتك المجانية",
          terms: "تجربة مجانية لمدة 24 ساعة • لا حاجة لبطاقة ائتمان • إلغاء في أي وقت"
        },
        footer: {
          description: "رفيق التداول بالذكاء الاصطناعي الأكثر تقدماً في العالم، مدعوم من Bitiq.ai",
          features: "الميزات",
          aiSignals: "إشارات الذكاء الاصطناعي",
          bitiqCopilot: "مساعد Bitiq.ai (تجريبي)",
          bitiqAutoTrade: "التداول التلقائي Bitiq.ai (تجريبي)",
          aiAnalysis: "تحليل الذكاء الاصطناعي",
          qualityScoring: "تقييم الجودة",
          riskManagement: "إدارة المخاطر",
          realTimeAlerts: "التنبيهات الفورية",
          resources: "الموارد",
          documentation: "الوثائق",
          howItWorks: "كيف يعمل",
          pricing: "الأسعار",
          faq: "الأسئلة الشائعة",
          testimonials: "آراء العملاء",
          signIn: "تسجيل الدخول",
          company: "الشركة",
          aboutUs: "من نحن",
          termsOfService: "شروط الخدمة",
          privacyPolicy: "سياسة الخصوصية",
          contact: "اتصل بنا",
          email: "البريد الإلكتروني",
          copyright: "© 2025 Bitiq.ai. جميع الحقوق محفوظة.",
          social: {
            twitter: "تويتر",
            telegram: "تليجرام"
          },
          blog: "المدونة",
          legal: "القانونية",
          termsAndConditions: "الشروط والأحكام",
          salesTerms: "شروط البيع",
          refundPolicy: "سياسة الاسترداد",
          riskDisclosure: "الإفصاح عن المخاطر",
          cookiePolicy: "سياسة ملفات تعريف الارتباط",
          acceptableUse: "الاستخدام المقبول"
        }
      },
      blog: {
        seo: {
          title: "مدونة Bitiq.ai - رؤى تداول العملات المشفرة",
          description: "مقالات خبيرة عن تداول العملات المشفرة وإشارات الذكاء الاصطناعي وإدارة المخاطر وتحليل السوق."
        },
        hero: {
          title: "مدونة Bitiq.ai",
          subtitle: "مقالات خبيرة حول تداول العملات المشفرة وإشارات الذكاء الاصطناعي وتحليل السوق لمساعدتك على البقاء في المقدمة."
        },
        backToBlog: "العودة إلى المدونة",
        backToHome: "العودة إلى الصفحة الرئيسية",
        footer: {
          description: "ابقَ محدثًا بأحدث رؤى واستراتيجيات تداول العملات المشفرة.",
          copyright: "© 2025 مدونة Bitiq.ai. جميع الحقوق محفوظة."
        }
      },
      howItWorksPage: {
        hero: {
          title: "كيف يعمل",
          lastUpdated: "آخر تحديث: أكتوبر 2025"
        },
        idea: {
          title: "الفكرة",
          description: "يحول Bitiq.ai تداول العملات المشفرة المعقد إلى تجربة بسيطة مدفوعة بالبيانات. يفحص الذكاء الاصطناعي الخاص بنا السوق على مدار الساعة طوال أيام الأسبوع، ويتعرف على الفرص عالية الاحتمالية، ويوفر إشارات جاهزة للتداول بشكل واضح — حتى تتمكن من التداول بذكاء، وليس بجهد."
        },
        step1: {
          title: "الخطوة 1 — تحليل السوق بالذكاء الاصطناعي",
          description: "يشغل محركنا مئات العملات المشفرة عبر أطر زمنية متعددة باستمرار. يدرس الزخم والحجم والسيولة والمشاعر لتحديد الإعدادات المبكرة قبل أن يلاحظها معظم المتداولين.",
          highlight: "سترى فقط إشارات عالية الثقة منقاة — وليس ضوضاء عشوائية."
        },
        step2: {
          title: "الخطوة 2 — إشارات قابلة للتنفيذ في الوقت الفعلي",
          description: "عندما تظهر فرصة، يرسل لك Bitiq.ai فورًا:",
          bullet1: "اسم الزوج والاتجاه (LONG / SHORT)",
          bullet2: "أهداف الدخول ووقف الخسارة وجني الأرباح",
          bullet3: "نتيجة ثقة الذكاء الاصطناعي",
          bullet4: "اقتراح الرافعة المالية الاختياري",
          note: "يمكنك عرض الإشارات مباشرة في لوحة التحكم الخاصة بك أو استلامها عبر قناة Telegram الخاصة بك (الإنجليزية أو العربية)."
        },
        step3: {
          title: "الخطوة 3 — التداول بذكاء مع مساعد Bitiq.ai",
          description: "المساعد هو رفيق الذكاء الاصطناعي الشخصي الخاص بك. اطلب منه تحليل الإشارات أو تقييم المخاطر أو تخطيط الاستراتيجيات طويلة المدى — كل ذلك بلغة بسيطة. يتعلم من أسلوب التداول الخاص بك لإبقاء النصيحة ذات صلة.",
          beta: "حاليًا في النسخة التجريبية — متاح قريبًا لجميع المستخدمين المدفوعين."
        },
        step4: {
          title: "الخطوة 4 — تنفيذ تلقائي مع التداول التلقائي",
          description: "يربط التداول التلقائي حساب Bitiq.ai الخاص بك بالبورصات الكبرى مثل Binance و Bybit و OKX و KuCoin. عند التفعيل، يعكس الإشارات المعتمدة تلقائيًا على البورصة الخاصة بك — باستخدام مخاطرك ورأس مالك المحدد مسبقًا.",
          security1: "أموالك لا تغادر حسابك أبدًا. أنت تبقى في السيطرة الكاملة.",
          security2: "يتصل عبر واجهة برمجة تطبيقات آمنة — وصول للقراءة فقط للأمان.",
          beta: "حاليًا في النسخة التجريبية."
        },
        step5: {
          title: "الخطوة 5 — خطط بسيطة وشفافة",
          plan: "الخطة",
          price: "السعر",
          highlights: "الميزات البارزة",
          freePlan: "مجاني",
          freePlanHighlights: "تجربة 24 ساعة، إشارات محدودة، 3 رسائل مساعد/يوم",
          monthlyPlan: "شهري",
          monthlyPlanHighlights: "وصول كامل للإشارات والمساعد والتداول التلقائي",
          lifetimePlan: "مدى الحياة",
          lifetimePlanHighlights: "وصول مدى الحياة + دعم ممتاز",
          payment: "مدفوعات آمنة بالعملة المشفرة عبر OxaPay.",
          guarantee: "لا تجديدات تلقائية. لا رسوم مخفية."
        },
        safety: {
          title: "مصمم للأمان",
          bullet1: "جميع اتصالات واجهة برمجة التطبيقات مشفرة.",
          bullet2: "لا يمكن لـ Bitiq.ai سحب أموالك أو نقلها.",
          bullet3: "أنت تقرر رأس مالك ونسبة الرافعة المالية — دائمًا."
        },
        community: {
          title: "انضم إلى المجتمع",
          description: "تداول إلى جانب آلاف المتداولين الأذكياء الذين يعتمدون على دقة الذكاء الاصطناعي بدلاً من التخمين.",
          cta: "ابدأ التجربة المجانية"
        }
      },
      signalStructure: {
        pair: "الزوج",
        direction: "الاتجاه",
        entryZone: "منطقة الدخول",
        stopLoss: "وقف الخسارة",
        takeProfits: "جني الأرباح",
        strategy: "الاستراتيجية",
        riskReward: "المخاطرة/العائد"
      },
      account: {
        title: "حسابي",
        inviteFriends: {
          title: "دعوة الأصدقاء",
          description: "أرسل دعوة لصديق للانضمام إلى Bitiq.ai ومساعدته على البدء.",
          benefit1: "سيحصل صديقك على وصول كامل إلى Bitiq.ai مع جميع الميزات",
          benefit2: "ستحصل على يوم استخدام إضافي، وسيحصل صديقك على ثلاثة أيام إضافية عند الانضمام من خلال دعوتك.",
          benefit3: "تنتهي صلاحية الدعوة خلال 3 أيام",
          button: "دعوة صديق"
        },
        telegramAccount: {
          title: "حساب تليجرام",
          description: "استقبل إشعارات من استراتيجياتك مباشرة على تليجرام",
          botName: "@bitiqbot",
          button: "إعداد"
        },
        personalInfo: {
          title: "المعلومات الشخصية",
          displayName: "اسم العرض",
          displayNamePlaceholder: "أدخل اسم العرض الخاص بك",
          email: "البريد الإلكتروني",
          emailPlaceholder: "أدخل بريدك الإلكتروني",
          saveChanges: "حفظ التغييرات",
          cancel: "إلغاء",
          edit: "تعديل",
          cannotChange: "لا يمكن تغييره",
          saving: "جاري الحفظ...",
          changePhoto: "تغيير الصورة",
          uploadingPhoto: "جاري رفع الصورة..."
        },
        changePassword: {
          title: "تغيير كلمة المرور",
          button: "تغيير كلمة المرور",
          description: "قم بتحديث كلمة المرور الخاصة بك للحفاظ على أمان حسابك"
        },
        dialogs: {
          inviteFriend: {
            title: "دعوة صديق",
            description: "أرسل دعوة لصديق للانضمام إلى Bitiq.ai",
            emailLabel: "عنوان البريد الإلكتروني",
            emailPlaceholder: "friend@example.com",
            emailDescription: "أدخل عنوان البريد الإلكتروني لصديقك لإرسال دعوة له.",
            cancel: "إلغاء",
            sendInvitation: "إرسال الدعوة",
            sending: "جاري الإرسال..."
          },
          invitationLink: {
            title: "⚠️ فشل البريد الإلكتروني - رابط يدوي مطلوب",
            description: "لم يتم إرسال بريد الدعوة الإلكتروني. يرجى مشاركة هذا الرابط يدوياً مع صديقك.",
            linkLabel: "رابط الدعوة",
            copy: "نسخ",
            warning: "⚠️ سينتهي هذا الرابط خلال 3 أيام. يرجى مشاركته مع صديقك فوراً.",
            close: "إغلاق"
          },
          changePassword: {
            title: "تغيير كلمة المرور",
            description: "أدخل كلمة المرور الحالية واختر كلمة مرور جديدة",
            currentPassword: "كلمة المرور الحالية",
            currentPasswordPlaceholder: "كلمة المرور الحالية",
            newPassword: "كلمة المرور الجديدة",
            newPasswordPlaceholder: "كلمة المرور الجديدة",
            confirmPassword: "تأكيد كلمة المرور الجديدة",
            confirmPasswordPlaceholder: "تأكيد كلمة المرور الجديدة",
            cancel: "إلغاء",
            changePassword: "تغيير كلمة المرور",
            changing: "جاري التغيير..."
          }
        },
        messages: {
          profileUpdated: "تم تحديث الملف الشخصي",
          profileUpdatedDesc: "تم تحديث معلومات ملفك الشخصي بنجاح.",
          profileUpdateFailed: "فشل في تحديث الملف الشخصي",
          displayNameRequired: "اسم العرض مطلوب",
          passwordChanged: "تم تغيير كلمة المرور بنجاح!",
          passwordChangeFailed: "فشل في تغيير كلمة المرور",
          passwordsDontMatch: "كلمات المرور الجديدة غير متطابقة",
          passwordTooShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
          passwordSameAsOld: "يجب أن تكون كلمة المرور الجديدة مختلفة عن كلمة المرور الحالية",
          allFieldsRequired: "جميع الحقول مطلوبة",
          wrongPassword: "كلمة المرور الحالية غير صحيحة",
          weakPassword: "كلمة المرور ضعيفة جداً",
          requiresRecentLogin: "يرجى تسجيل الخروج وتسجيل الدخول مرة أخرى قبل تغيير كلمة المرور",
          invitationCreated: "تم إنشاء الدعوة بنجاح!",
          invitationEmailSent: "تم إرسال بريد دعوة إلى {{email}}!",
          emailFailed: "فشل إرسال البريد الإلكتروني. يرجى مشاركة الرابط يدوياً.",
          invitationFailed: "فشل في إنشاء الدعوة",
          linkCopied: "تم نسخ رابط الدعوة إلى الحافظة!",
          enterEmail: "يرجى إدخال عنوان بريد إلكتروني",
          photoUploaded: "تم تحديث صورة الملف الشخصي بنجاح!",
          photoUploadFailed: "فشل في رفع الصورة"
        }
      },
      subscription: {
        title: "اختر خطتك",
        subtitle: "اكتشف الإمكانات الكاملة لإشارات تداول العملات المشفرة بالذكاء الاصطناعي",
        currentPlan: "الحالية",
        daysRemaining: "أيام متبقية",
        mostPopular: "الأكثر شعبية",
        currentPlanBadge: "الخطة الحالية",
        startFreeTrial: "ابدأ التجربة المجانية",
        subscribeNow: "اشترك الآن",
        processing: "جاري المعالجة...",
        loadingPlans: "جاري تحميل خطط الاشتراك...",
        failedToLoad: "فشل في تحميل معلومات الاشتراك",
        pleaseLogin: "يرجى تسجيل الدخول للاشتراك",
        redirectingToPayment: "جاري التوجيه إلى صفحة الدفع...",
        subscriptionActivated: "تم تفعيل الاشتراك بنجاح!",
        paymentFailed: "فشل في معالجة الدفع",
        securePaymentMethods: "طرق الدفع الآمنة",
        cryptocurrency: "العملات المشفرة",
        cryptocurrencyDescription: "ادفع بالبيتكوين والإيثيريوم وUSDT والعملات المشفرة الرئيسية الأخرى",
        securePrivate: "آمن وخاص",
        securePrivateDescription: "مدعوم بـ OxaPay للمدفوعات الآمنة والمجهولة",
        instantAccess: "وصول فوري",
        instantAccessDescription: "احصل على وصول فوري لجميع الميزات بعد تأكيد الدفع",
        betaNote: "⚙️ مساعد الذكاء الاصطناعي والتداول التلقائي حالياً في مرحلة التجريب. سيحصل جميع المستخدمين المدفوعين على وصول كامل تلقائياً عند الإصدار الرسمي — بدون رسوم إضافية.",
        duration: {
          day: "يوم",
          month: "شهر",
          lifetime: "مدى الحياة"
        },
        plans: {
          free: {
            name: "الخطة المجانية",
            description: "جرب Bitiq.ai لمدة 24 ساعة مع ميزات محدودة",
            features: [
              "تجربة لمدة 24 ساعة",
              "إشارات محدودة",
              "3 رسائل مساعد ذكاء اصطناعي/يوم",
              "تحليل أساسي بالذكاء الاصطناعي"
            ]
          },
          monthly: {
            name: "الخطة الشهرية",
            description: "وصول كامل لجميع ميزات Bitiq.ai لمدة شهر واحد",
            features: [
              "وصول كامل للإشارات",
              "وصول كامل لمساعد الذكاء الاصطناعي",
              "وصول كامل للتداول التلقائي",
              "إشعارات فورية",
              "دعم ذو أولوية",
              "تحليلات متقدمة"
            ]
          },
          lifetime: {
            name: "الخطة مدى الحياة",
            description: "دفعة واحدة للوصول مدى الحياة لجميع الميزات",
            features: [
              "وصول دائم لجميع الميزات",
              "دعم مميز",
              "وصول مبكر للميزات الجديدة",
              "تكاملات مخصصة",
              "تحليلات متقدمة",
              "بدون دفعات متكررة",
              "جميع التحديثات المستقبلية مشمولة"
            ]
          }
        }
      }
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('i18nextLng') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;