/**
 * Translation Service using Google Translate API
 * Translates AI analysis notes when user switches language
 */

interface TranslationCache {
  [key: string]: string;
}

class TranslationService {
  private cache: TranslationCache = {};
  private apiKey: string;
  
  constructor() {
    // Get API key from environment variable
    this.apiKey = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY || '';
  }

  /**
   * Translate text using Google Translate API
   * @param text Text to translate
   * @param targetLang Target language code (e.g., 'ar' for Arabic)
   * @param sourceLang Source language code (default: 'en')
   * @returns Translated text
   */
  async translateText(
    text: string, 
    targetLang: string, 
    sourceLang: string = 'en'
  ): Promise<string> {
    // Skip translation if source and target are the same
    if (sourceLang === targetLang) {
      return text;
    }

    // Check cache first
    const cacheKey = `${sourceLang}:${targetLang}:${text}`;
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    // If no API key, return original text
    if (!this.apiKey) {
      console.warn('Google Translate API key not configured');
      return text;
    }

    try {
      const url = `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLang,
          target: targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        console.error('Translation API error:', response.status);
        return text; // Return original text on error
      }

      const data = await response.json();
      const translatedText = data.data.translations[0].translatedText;
      
      // Cache the translation
      this.cache[cacheKey] = translatedText;
      
      return translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original text on error
    }
  }

  /**
   * Translate an array of strings
   * @param texts Array of texts to translate
   * @param targetLang Target language code
   * @param sourceLang Source language code
   * @returns Array of translated texts
   */
  async translateArray(
    texts: string[], 
    targetLang: string, 
    sourceLang: string = 'en'
  ): Promise<string[]> {
    // Skip translation if source and target are the same
    if (sourceLang === targetLang) {
      return texts;
    }

    try {
      // Translate all texts in parallel
      const translations = await Promise.all(
        texts.map(text => this.translateText(text, targetLang, sourceLang))
      );
      
      return translations;
    } catch (error) {
      console.error('Batch translation error:', error);
      return texts; // Return original texts on error
    }
  }

  /**
   * Translate AI analysis notes
   * @param notes Array of AI analysis notes
   * @param targetLang Target language code ('en' or 'ar')
   * @returns Translated notes
   */
  async translateAINotes(notes: string[], targetLang: string): Promise<string[]> {
    // AI notes are in English by default
    return this.translateArray(notes, targetLang, 'en');
  }

  /**
   * Clear translation cache
   */
  clearCache() {
    this.cache = {};
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      size: Object.keys(this.cache).length,
      keys: Object.keys(this.cache)
    };
  }
}

// Export singleton instance
export const translationService = new TranslationService();

