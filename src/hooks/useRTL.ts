import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useRTL = () => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  useEffect(() => {
    // Update HTML dir attribute based on language
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Save language to localStorage when it changes
    localStorage.setItem('i18nextLng', i18n.language);
  }, [isRTL, i18n.language]);

  return { isRTL, language: i18n.language };
};