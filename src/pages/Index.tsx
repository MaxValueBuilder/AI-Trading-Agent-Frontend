import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import MarketHeader from "@/components/MarketHeader";
import TradingSignals from "@/components/TradingSignals";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";

const Index = () => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-crypto-card/5">
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.03),transparent_50%)] pointer-events-none"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Mobile Header with Sidebar Trigger */}
                <header className={`h-16 flex items-center border-b border-crypto-border px-3 md:px-6} md:hidden`}>
                  <SidebarTrigger className={isRTL ? 'ml-4' : 'mr-4'} />
                  <div className="w-4" /> {/* Add space between SidebarTrigger and the rest */}
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <h1 className="text-lg font-bold text-crypto-text-primary">{t('navigation.aisignals')}</h1>
                  </div>
                </header>
                
                <MarketHeader />
                <TradingSignals />
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;