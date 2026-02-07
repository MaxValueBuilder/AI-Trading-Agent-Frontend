import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { 
  Settings as SettingsIcon, 
  Bell, 
  CheckCircle
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";

const Settings = () => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const { toast } = useToast();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);

  const handleSaveSettings = () => {
    toast({
      title: t('settings.settingsSaved'),
      description: t('settings.settingsSavedDesc'),
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <header className={`h-16 flex items-center  border-b border-crypto-border px-6`}>
            <SidebarTrigger className={isRTL ? 'ml-4' : 'mr-4'} />
            <div className="w-4" /> {/* Add space between SidebarTrigger and the rest */}
            <div className={`flex items-center gap-3`}>
              <SettingsIcon className="w-6 h-6 text-crypto-green" />
              <h1 className="text-xl font-bold text-crypto-text-primary">{t('settings.title')}</h1>
            </div>
          </header>
          
          <div className="p-6 max-w-4xl mx-auto">
            <div className="space-y-6">
              <Card className="bg-crypto-card border-crypto-border">
                <CardHeader>
                  <CardTitle className="text-crypto-text-primary flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    {t('settings.notifications.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-crypto-text-primary">{t('settings.notifications.pushNotifications')}</Label>
                        <p className="text-sm text-crypto-text-secondary">{t('settings.notifications.pushDescription')}</p>
                      </div>
                      <Switch 
                        checked={pushNotifications} 
                        onCheckedChange={setPushNotifications}
                        className={isRTL ? "rtl-switch" : ""}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-crypto-text-primary">{t('settings.notifications.soundAlerts')}</Label>
                        <p className="text-sm text-crypto-text-secondary">{t('settings.notifications.soundDescription')}</p>
                      </div>
                      <Switch 
                        checked={soundAlerts} 
                        onCheckedChange={setSoundAlerts}
                        className={isRTL ? "rtl-switch" : ""}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-6">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-crypto-green hover:bg-crypto-green/90 text-background"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {t('settings.saveAllSettings')}
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Settings;