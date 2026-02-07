import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";
import { useCMSContent } from "@/hooks/useCMSContent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  User
} from "lucide-react";
import { Helmet } from "react-helmet-async";

interface BlogPost {
  id: number;
  slug: string;
  title: {
    en: string;
    ar: string;
  };
  excerpt: {
    en: string;
    ar: string;
  };
  body: {
    en: string;
    ar: string;
  };
  category: {
    en: string;
    ar: string;
  };
  image: string;
  author: {
    en: string;
    ar: string;
  };
  date: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

const sampleBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "understanding-crypto-signals-ai-analysis",
    title: {
      en: "Understanding Crypto Trading Signals: A Comprehensive Guide to AI-Powered Market Analysis",
      ar: "فهم إشارات تداول العملات المشفرة: دليل شامل لتحليل السوق بالذكاء الاصطناعي"
    },
    excerpt: {
      en: "Discover how AI-powered trading signals can help you make informed decisions in the volatile cryptocurrency market. Learn about signal accuracy, risk management, and the latest trends.",
      ar: "اكتشف كيف يمكن لإشارات التداول بالذكاء الاصطناعي أن تساعدك في اتخاذ قرارات مستنيرة في سوق العملات المشفرة المتقلب. تعلم عن دقة الإشارات وإدارة المخاطر وأحدث الاتجاهات."
    },
    body: {
      en: `
        <p class="mb-4">AI-powered trading signals have revolutionized cryptocurrency trading by providing actionable insights through automated analysis of multiple market factors.</p>
        
        <h2 class="text-2xl font-bold text-crypto-text-primary mb-4 mt-6">What Are Crypto Trading Signals?</h2>
        <p class="mb-4">Crypto trading signals are automated alerts that suggest optimal entry and exit points for trading. They combine technical analysis, fundamental data, and on-chain metrics to provide comprehensive market insights.</p>
        
        <h2 class="text-2xl font-bold text-crypto-text-primary mb-4 mt-6">Key Benefits</h2>
        <p class="mb-4">Our AI models analyze vast amounts of data including historical price patterns, on-chain metrics, social sentiment, and macroeconomic indicators to deliver:</p>
        <ul class="list-disc list-inside mb-4 space-y-2 text-crypto-text-secondary">
          <li>98.5% accuracy rate through combined analysis methods</li>
          <li>Real-time processing in under 2 seconds</li>
          <li>Risk management with stop-loss and take-profit levels</li>
          <li>Quality scoring from A+ to C based on confidence and risk-reward ratios</li>
        </ul>
        
        <p class="mb-4">Always review AI analysis insights before making a trade, set appropriate stop-loss orders, and never invest more than you can afford to lose.</p>
      `,
      ar: `
        <p class="mb-4">لقد أحدثت إشارات التداول بالذكاء الاصطناعي ثورة في تداول العملات المشفرة من خلال توفير رؤى قابلة للتنفيذ من خلال التحليل الآلي لعوامل السوق المتعددة.</p>
        
        <h2 class="text-2xl font-bold text-crypto-text-primary mb-4 mt-6">ما هي إشارات تداول العملات المشفرة؟</h2>
        <p class="mb-4">إشارات تداول العملات المشفرة هي تنبيهات آلية تقترح نقاط الدخول والخروج المثلى للتداول. تجمع بين التحليل الفني والبيانات الأساسية ومقاييس السلسلة لتوفير رؤى شاملة للسوق.</p>
        
        <h2 class="text-2xl font-bold text-crypto-text-primary mb-4 mt-6">الفوائد الرئيسية</h2>
        <p class="mb-4">تحلل نماذج الذكاء الاصطناعي لدينا كميات هائلة من البيانات بما في ذلك أنماط الأسعار التاريخية ومقاييس السلسلة والمشاعر الاجتماعية والمؤشرات الاقتصادية الكلية لتقديم:</p>
        <ul class="list-disc list-inside mb-4 space-y-2 text-crypto-text-secondary">
          <li>معدل دقة 98.5% من خلال طرق التحليل المجمعة</li>
          <li>المعالجة في الوقت الفعلي في أقل من ثانيتين</li>
          <li>إدارة المخاطر مع مستويات وقف الخسارة وجني الأرباح</li>
          <li>تقييم الجودة من A+ إلى C بناءً على الثقة ونسب المخاطرة-العائد</li>
        </ul>
        
        <p class="mb-4">راجع دائمًا رؤى تحليل الذكاء الاصطناعي قبل إجراء صفقة، وقم بتعيين أوامر وقف الخسارة المناسبة، ولا تستثمر أبدًا أكثر مما يمكنك تحمل خسارته.</p>
      `
    },
    category: {
      en: "Market Analysis",
      ar: "تحليل السوق"
    },
    image: "/images/blog-ai-signals.jpg",
    author: {
      en: "Bitiq.ai Team",
      ar: "فريق Bitiq.ai"
    },
    date: "2025-01-15",
    seo: {
      title: "Understanding Crypto Trading Signals: AI-Powered Market Analysis Guide",
      description: "Learn how AI-powered trading signals work and how to use them for successful cryptocurrency trading. Comprehensive guide to signal accuracy, risk management, and best practices.",
      keywords: ["crypto trading signals", "AI trading", "cryptocurrency analysis", "trading bots", "market signals", "crypto signals guide"]
    }
  },
  {
    id: 2,
    slug: "risk-management-crypto-trading",
    title: {
      en: "Mastering Risk Management in Cryptocurrency Trading",
      ar: "إتقان إدارة المخاطر في تداول العملات المشفرة"
    },
    excerpt: {
      en: "Learn essential risk management strategies for crypto trading. Discover how to protect your capital, set proper stop-losses, and maximize profits while minimizing losses in volatile markets.",
      ar: "تعلم استراتيجيات إدارة المخاطر الأساسية لتداول العملات المشفرة. اكتشف كيفية حماية رأس مالك وتحديد خسائر الوقف المناسبة وتعظيم الأرباح مع تقليل الخسائر في الأسواق المتقلبة."
    },
    body: {
      en: `
        <p class="mb-4">Risk management is essential for successful cryptocurrency trading. Without proper risk management, even the best trading signals won't protect you from significant losses.</p>
        
        <h2 class="text-2xl font-bold text-crypto-text-primary mb-4 mt-6">The 1% Rule</h2>
        <p class="mb-4">Never risk more than 1% of your trading capital on a single trade. This means if you have $10,000 in your account, your maximum loss per trade should be $100.</p>
        
        <h2 class="text-2xl font-bold text-crypto-text-primary mb-4 mt-6">Stop-Loss Strategies</h2>
        <p class="mb-4">Always set stop-loss orders to protect your capital:</p>
        <ul class="list-disc list-inside mb-4 space-y-2 text-crypto-text-secondary">
          <li>Fixed percentage stop-loss (e.g., 5% below entry price)</li>
          <li>Support level stop-loss (below key technical support)</li>
          <li>Trailing stop-loss (adjusts automatically as price moves in your favor)</li>
        </ul>
        
        <h2 class="text-2xl font-bold text-crypto-text-primary mb-4 mt-6">Risk-Reward Ratio</h2>
        <p class="mb-4">Always aim for favorable risk-reward ratios of at least 1:2 or better. This means risk $1 to make $2 or more.</p>
        
        <p class="mb-4">Remember: In trading, survival comes before profitability. Protect your capital above all else, and the profits will follow.</p>
      `,
      ar: `
        <p class="mb-4">إدارة المخاطر ضرورية لنجاح تداول العملات المشفرة. بدون إدارة مخاطر مناسبة، حتى أفضل إشارات التداول لن تحميك من الخسائر الكبيرة.</p>
        
        <h2 class="text-2xl font-bold text-crypto-text-primary mb-4 mt-6">قاعدة 1%</h2>
        <p class="mb-4">لا تخاطر أبدًا بأكثر من 1% من رأس مال التداول في صفقة واحدة. هذا يعني إذا كان لديك 10,000 دولار، يجب أن تكون خسارتك القصوى 100 دولار.</p>
        
        <h2 class="text-2xl font-bold text-crypto-text-primary mb-4 mt-6">استراتيجيات وقف الخسارة</h2>
        <p class="mb-4">قم دائمًا بتعيين أوامر وقف الخسارة لحماية رأس مالك:</p>
        <ul class="list-disc list-inside mb-4 space-y-2 text-crypto-text-secondary">
          <li>وقف الخسارة بنسبة ثابتة (مثل 5% أسفل سعر الدخول)</li>
          <li>وقف الخسارة عند مستوى الدعم (أسفل الدعم التقني الرئيسي)</li>
          <li>وقف الخسارة المتحرك (يتكيف تلقائيًا مع تحرك السعر في صالحك)</li>
        </ul>
        
        <h2 class="text-2xl font-bold text-crypto-text-primary mb-4 mt-6">نسبة المخاطرة-العائد</h2>
        <p class="mb-4">الهدف دائماً لتحقيق نسب مخاطرة-عائد مواتية 1:2 على الأقل. هذا يعني اخاطر بـ 1 دولار لتحقيق 2 دولار أو أكثر.</p>
        
        <p class="mb-4">تذكر: في التداول، البقاء يأتي قبل الربحية. احمي رأس مالك قبل كل شيء، والأرباح ستتبع.</p>
      `
    },
    category: {
      en: "Risk Management",
      ar: "إدارة المخاطر"
    },
    image: "/images/blog-risk-management.jpg",
    author: {
      en: "Bitiq.ai Team",
      ar: "فريق Bitiq.ai"
    },
    date: "2025-01-10",
    seo: {
      title: "Risk Management Guide for Cryptocurrency Trading",
      description: "Master risk management strategies for crypto trading. Learn about stop-losses, position sizing, risk-reward ratios, and how to protect your capital in volatile markets.",
      keywords: ["crypto risk management", "stop loss trading", "position sizing", "risk reward ratio", "cryptocurrency risk"]
    }
  }
];

const Blog = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  
  // Fetch blog posts from CMS
  const { content: cmsPosts, loading: cmsLoading } = useCMSContent('blog-posts');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(sampleBlogPosts);

  const isEnglish = i18n.language === 'en';

  // Use CMS posts if available, otherwise fallback to sample posts
  useEffect(() => {
    if (cmsPosts && Array.isArray(cmsPosts) && cmsPosts.length > 0) {
      // Transform CMS posts to BlogPost format
      const transformedPosts: BlogPost[] = cmsPosts.map((post: any) => ({
        id: post.id,
        slug: post.slug,
        title: {
          en: post.title_en,
          ar: post.title_ar
        },
        excerpt: {
          en: post.excerpt_en,
          ar: post.excerpt_ar
        },
        body: {
          en: post.body_en,
          ar: post.body_ar
        },
        category: {
          en: post.category_en,
          ar: post.category_ar
        },
        image: post.image_url || "/images/blog-ai-signals.jpg",
        author: {
          en: post.author_en || "Bitiq.ai Team",
          ar: post.author_ar || "فريق Bitiq.ai"
        },
        date: post.publish_date || new Date().toISOString().split('T')[0],
        seo: {
          title: post.seo_title || post.title_en,
          description: post.seo_description || post.excerpt_en,
          keywords: post.seo_keywords || []
        }
      }));
      setBlogPosts(transformedPosts);
    } else {
      // Fallback to sample posts
      setBlogPosts(sampleBlogPosts);
    }
  }, [cmsPosts]);

  const posts = blogPosts;

  if (selectedPost) {
    const currentLanguage = isEnglish ? 'en' : 'ar';
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-crypto-bg via-crypto-bg to-crypto-card" dir={isRTL ? 'rtl' : 'ltr'}>
        <Helmet>
          <title>{selectedPost.seo.title}</title>
          <meta name="description" content={selectedPost.seo.description} />
          <meta name="keywords" content={selectedPost.seo.keywords.join(', ')} />
          <meta property="og:title" content={selectedPost.title[currentLanguage]} />
          <meta property="og:description" content={selectedPost.excerpt[currentLanguage]} />
          <meta property="og:image" content={selectedPost.image} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={selectedPost.title[currentLanguage]} />
          <meta name="twitter:description" content={selectedPost.excerpt[currentLanguage]} />
          <meta name="twitter:image" content={selectedPost.image} />
        </Helmet>

        {/* Header */}
        <nav className="bg-crypto-bg/80 backdrop-blur-lg border-b border-crypto-border sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src="/images/logo.png" alt="Bitiq.ai Logo" className="w-10 h-10" />
                <span className="text-2xl font-bold bg-gradient-to-r from-crypto-green to-emerald-400 bg-clip-text text-transparent">
                  Bitiq.ai
                </span>
              </div>
              <Button
                variant="ghost"
                onClick={() => setSelectedPost(null)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('blog.backToBlog')}
              </Button>
            </div>
          </div>
        </nav>

        {/* Article */}
        <article className="container mx-auto max-w-4xl px-4 py-12">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPost(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('blog.backToBlog')}
            </Button>
            
            <div className="flex items-center gap-3 mb-4 text-sm text-crypto-text-secondary">
              <Badge variant="outline" className="border-crypto-green text-crypto-green">
                {selectedPost.category[currentLanguage]}
              </Badge>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {selectedPost.date}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {selectedPost.author[currentLanguage]}
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-crypto-text-primary mb-6">
              {selectedPost.title[currentLanguage]}
            </h1>

            <div className="mb-8 aspect-video bg-crypto-card rounded-lg overflow-hidden">
              <img 
                src={selectedPost.image} 
                alt={selectedPost.title[currentLanguage]}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/800x450/1a1a1a/00ff88?text=Crypto+Trading+Blog";
                }}
              />
            </div>
          </div>

          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: selectedPost.body[currentLanguage] }}
          />
        </article>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-crypto-border bg-crypto-card/50">
          <div className="container mx-auto max-w-4xl px-4 text-center text-sm text-crypto-text-secondary">
            <p>{t('blog.footer.copyright')}</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-crypto-bg via-crypto-bg to-crypto-card" dir={isRTL ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{t('blog.seo.title')}</title>
        <meta name="description" content={t('blog.seo.description')} />
      </Helmet>

      {/* Header */}
      <nav className="bg-crypto-bg/80 backdrop-blur-lg border-b border-crypto-border sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt="Bitiq.ai Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-crypto-green to-emerald-400 bg-clip-text text-transparent">
                Bitiq.ai
              </span>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              {t('blog.backToHome')}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-crypto-text-primary via-crypto-green to-emerald-400 bg-clip-text text-transparent">
              {t('blog.hero.title')}
            </span>
          </h1>
          <p className="text-xl text-crypto-text-secondary max-w-2xl mx-auto">
            {t('blog.hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => {
              const currentLanguage = isEnglish ? 'en' : 'ar';
              
              return (
                <Card 
                  key={post.id}
                  className="bg-crypto-card border-crypto-border hover:border-crypto-green/50 transition-all duration-300 cursor-pointer h-full"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="aspect-video bg-crypto-card rounded-t-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title[currentLanguage]}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://placehold.co/800x450/1a1a1a/00ff88?text=Crypto+Trading+Blog";
                      }}
                    />
                  </div>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                      <Badge variant="outline" className="border-crypto-green text-crypto-green">
                        {post.category[currentLanguage]}
                      </Badge>
                      <div className="flex items-center gap-1 text-crypto-text-secondary">
                        <Calendar className="w-4 h-4" />
                        {post.date}
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-crypto-text-primary line-clamp-2">
                      {post.title[currentLanguage]}
                    </h2>

                    <p className="text-crypto-text-secondary line-clamp-3">
                      {post.excerpt[currentLanguage]}
                    </p>

                    <div className="flex items-center pt-4 border-t border-crypto-border">
                      <div className="flex items-center gap-4 text-sm text-crypto-text-secondary">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author[currentLanguage]}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-crypto-border bg-crypto-card/50">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-sm text-crypto-text-secondary mb-4">
            {t('blog.footer.description')}
          </p>
          <p className="text-xs text-crypto-text-secondary">
            {t('blog.footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;

