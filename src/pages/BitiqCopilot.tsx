import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Edit3, 
  Send, 
  HelpCircle, 
  TrendingUp, 
  Globe, 
  Monitor,
  MessageSquare,
  Bot,
  Info
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";
import { useState, useEffect } from "react";

const BitiqCopilot = () => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const [message, setMessage] = useState("");

  const suggestedActions = [
    {
      icon: HelpCircle,
      title: t('copilot.actions.whatCanYouDo'),
      action: "Tell me about your capabilities"
    },
    {
      icon: Globe,
      title: t('copilot.actions.discussNews'),
      action: "Analyze recent market news"
    },
    {
      icon: Monitor,
      title: t('copilot.actions.learnTrading'),
      action: "Teach me about trading concepts"
    }
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // TODO: Implement message sending logic
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleSuggestedAction = (action: string) => {
    setMessage(action);
  };

  // Set SEO meta tags
  useEffect(() => {
    // Set page title
    document.title = "Bitiq.ai Copilot – AI Trading Assistant (Beta)";
    
    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Try Bitiq.ai Copilot, your AI trading assistant. Analyze signals, plan trades, and make smarter decisions — currently in Beta.');
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Try Bitiq.ai Copilot, your AI trading assistant. Analyze signals, plan trades, and make smarter decisions — currently in Beta.';
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
        <main className="flex-1 flex flex-col">
          <header className={`h-16 flex items-center border-b border-crypto-border px-6`}>
            <SidebarTrigger className={`${isRTL ? 'ml-4' : 'mr-4'}`} />
            <div className="w-4" /> {/* Add space between SidebarTrigger and the rest */}
            <div className={`flex items-center gap-3`}>
              <Bot className="w-6 h-6 text-crypto-green" />
              <h1 className="text-xl font-bold text-crypto-text-primary">{t('copilot.title')}</h1>
            </div>
          </header>
          
          <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
            {/* Beta Notification */}
            <Card className="w-full max-w-4xl bg-crypto-yellow/10 border-crypto-yellow/30">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-crypto-yellow mt-0.5 flex-shrink-0" />
                  <div className={`space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="font-semibold text-crypto-text-primary">
                      {t('copilot.beta.title', 'These features are in Beta.')}
                    </h3>
                    <p className="text-sm text-crypto-text-secondary">
                      {t('copilot.beta.description', 'Some functionalities may be limited or unavailable while we finalize testing.')}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Main Question */}
            <div className={`text-center space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
              <h2 className="text-3xl font-semibold text-crypto-text-primary">
                {t('copilot.greeting', 'How can I help you today?')}
              </h2>
            </div>

             {/* Input Field */}
             <div className="w-full max-w-2xl">
               <div className="relative">
                 <Textarea
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   placeholder={t('copilot.placeholder', 'Send a message to Bitiq.ai Copilot')}
                   className="w-full h-28 bg-crypto-card border-crypto-border text-crypto-text-primary text-base pl-4 pr-16 pt-3 pb-3 rounded-xl focus:border-crypto-green focus:ring-crypto-green/20 resize-none"
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       handleSendMessage();
                     }
                   }}
                 />
                 <div className={`absolute bottom-2 ${isRTL ? 'left-2' : 'right-2'}`}>
                   <Button
                     onClick={handleSendMessage}
                     size="sm"
                     className="bg-crypto-green hover:bg-crypto-green/90 text-white p-2"
                     disabled={!message.trim()}
                   >
                     <Send className="w-4 h-4" />
                   </Button>
                 </div>
               </div>
             </div>

            {/* Suggested Actions */}
            <div className="w-full max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suggestedActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      onClick={() => handleSuggestedAction(action.action)}
                      className="h-auto p-4 bg-crypto-card border-crypto-border hover:border-crypto-green/30 hover:bg-crypto-card/70 transition-all duration-200"
                    >
                      <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <IconComponent className="w-5 h-5 text-crypto-green flex-shrink-0" />
                        <span className="text-crypto-text-primary font-medium text-sm text-center">
                          {action.title}
                        </span>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-center">
              <p className="text-crypto-text-secondary text-sm max-w-2xl">
                {t('copilot.disclaimer', 'Bitiq.ai Copilot is prone to errors. It is recommended to check important information.')}
              </p>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BitiqCopilot;
