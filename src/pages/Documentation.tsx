import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText, Globe, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";
import { useEffect, useState } from "react";
import { useCMSContent } from "@/hooks/useCMSContent";

const Documentation = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const { content: cmsSections, loading: cmsLoading } = useCMSContent('documentation');
  const [documentContent, setDocumentContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocumentation = async () => {
      // Only load from .txt files if CMS data is not available
      if (cmsSections && cmsSections.length > 0) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        // Load the appropriate documentation file based on current language
        const fileName = i18n.language === 'ar' 
          ? 'bitiq.ai_user_docs_ar_v3.txt'
          : 'bitiq.ai_user_docs_en_v3.txt';
        
        const response = await fetch(`/${fileName}`);
        if (response.ok) {
          const content = await response.text();
          setDocumentContent(content);
        } else {
          console.error('Failed to load documentation file');
          setDocumentContent('Documentation not available');
        }
      } catch (error) {
        console.error('Error loading documentation:', error);
        setDocumentContent('Error loading documentation');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocumentation();
  }, [i18n.language, cmsSections]);


  const renderCMSSections = () => {
    if (!cmsSections || cmsSections.length === 0) return null;

    return cmsSections.map((section: any) => (
      <Card key={section.id} className="bg-crypto-card border-crypto-border mb-4 md:mb-6">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className={`text-crypto-text-primary flex items-center gap-2 text-base md:text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
            <FileText className="w-4 h-4 md:w-5 md:h-5 text-crypto-green flex-shrink-0" />
            <span className="break-words">{i18n.language === 'ar' ? section.title_ar : section.title_en}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
          <div className={`prose prose-invert max-w-none ${isRTL ? 'text-right' : 'text-left'}`}>
            <p className="text-crypto-text-secondary text-xs md:text-sm mb-4 leading-relaxed whitespace-pre-wrap break-words">
              {i18n.language === 'ar' ? section.content_ar : section.content_en}
            </p>
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <header className={`h-14 md:h-16 flex items-center border-b border-crypto-border px-4 md:px-6`}>
            <SidebarTrigger className={isRTL ? 'ml-2 md:ml-4' : 'mr-2 md:mr-4'} />
            <div className="w-2 md:w-4" />
            <div className={`flex items-center gap-2 md:gap-3`}>
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-crypto-green" />
              <h1 className="text-base md:text-xl font-bold text-crypto-text-primary">
                {t('sidebar.docs')}
              </h1>
            </div>
          </header>
          
          <div className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Header Section */}
            <Card className="bg-crypto-card border-crypto-border">
              <CardHeader className="p-4 md:p-6">
                <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4`}>
                  <div className={`flex items-center gap-3 `}>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-crypto-green/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-crypto-green" />
                    </div>  
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg md:text-2xl font-bold text-crypto-text-primary">
                        {i18n.language === 'ar' ? 'دليل المستخدم' : 'User Documentation'}
                      </h2>
                      <p className="text-xs md:text-sm text-crypto-text-secondary">
                        {i18n.language === 'ar' 
                          ? 'دليل شامل لاستخدام منصة Bitiq.ai' 
                          : 'Complete guide to using Bitiq.ai platform'
                        }
                      </p>
                    </div>
                  </div>
                  <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''} flex-wrap`}>
                    <Badge variant="secondary" className="bg-crypto-green/20 text-crypto-green border-crypto-green/30 text-xs">
                      <Globe className="w-3 h-3 mr-1" />
                      {i18n.language === 'ar' ? 'العربية' : 'English'}
                    </Badge>
                    <Badge variant="outline" className="border-crypto-border text-crypto-text-secondary text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      October 2025
                    </Badge>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Content Section */}
            {(cmsLoading || isLoading) ? (
              <Card className="bg-crypto-card border-crypto-border">
                <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
                  <div className="flex items-center justify-center py-8 md:py-12">
                    <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-crypto-green"></div>
                    <span className="ml-3 text-sm md:text-base text-crypto-text-secondary">
                      {i18n.language === 'ar' ? 'جاري تحميل الوثائق...' : 'Loading documentation...'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4 md:space-y-6">                
                  {renderCMSSections()}                
              </div>
            )}

            {/* Footer */}
            <Card className="bg-crypto-yellow/10 border-crypto-yellow/30">
              <CardContent className="pt-4 md:pt-6 p-4 md:p-6">
                <div className="flex items-start gap-2 md:gap-3">
                  <BookOpen className="w-4 h-4 md:w-5 md:h-5 text-crypto-yellow mt-0.5 flex-shrink-0" />
                  <div className={`space-y-1 md:space-y-2 flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h3 className="text-sm md:text-base font-semibold text-crypto-text-primary">
                      {i18n.language === 'ar' ? 'معلومات إضافية' : 'Additional Information'}
                    </h3>
                    <p className="text-xs md:text-sm text-crypto-text-secondary break-words">
                      {i18n.language === 'ar' 
                        ? 'للحصول على المساعدة والدعم، يرجى التواصل معنا عبر البريد الإلكتروني: hello@bitiq.ai'
                        : 'For help and support, please contact us at: hello@bitiq.ai'
                      }
                    </p>
                    <p className="text-xs md:text-sm text-crypto-text-secondary break-words">
                      {i18n.language === 'ar' 
                        ? 'الموقع الإلكتروني: https://www.bitiq.ai'
                        : 'Website: https://www.bitiq.ai'
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Documentation;
