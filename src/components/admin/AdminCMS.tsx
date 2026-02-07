import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { adminApiService } from "@/services/adminApi";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Save, X, Brain, Activity, TrendingUp, Shield, Zap, CheckCircle, Star, BarChart3, Target, Clock, Users, Bot, Settings, Lock, Send, Moon, Sun, Globe, Menu, ChevronDown, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";

interface CMSHero {
  id?: number;
  badge_en:string;
  badge_ar:string;
  title_en: string;
  title_ar: string;
  subtitle_en: string;
  subtitle_ar: string;
  cta_text_en: string;
  cta_text_ar: string;
  meta_title_en?: string;
  meta_title_ar?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
}

interface CMSFeature {
  id?: number;
  title_en: string;
  title_ar: string;
  description_en: string;
  description_ar: string;
  icon?: string;
  image_url?: string;
  order: number;
  active: boolean;
}

interface CMSPricing {
  id?: number;
  plan_name: string;
  plan_tag?: string;
  price_usd: number;
  short_description_en: string;
  short_description_ar: string;
  features_en: string[];
  features_ar: string[];
  button_text_en: string;
  button_text_ar: string;
  order: number;
  active: boolean;
}

interface CMSTestimonial {
  id?: number;
  name: string;
  role_en: string;
  role_ar: string;
  quote_en: string;
  quote_ar: string;
  image_url?: string;
  order: number;
  active: boolean;
}

interface CMSFAQ {
  id?: number;
  question_en: string;
  question_ar: string;
  answer_en: string;
  answer_ar: string;
  order: number;
  active: boolean;
}

interface CMSDocumentationSection {
  id?: number;
  section_number: number;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  order: number;
  active: boolean;
}

interface CMSLegalLink {
  id: string;
  text_en: string;
  text_ar: string;
  href: string;
  type: string;
}

interface CMSLegalPage {
  id?: number;
  page_slug: string;
  title_en: string;
  title_ar: string;
  content_en: string;
  content_ar: string;
  links: CMSLegalLink[];
  effective_date?: string;
  meta_title_en?: string;
  meta_title_ar?: string;
  meta_description_en?: string;
  meta_description_ar?: string;
  published: boolean;
}

interface CMSBlogPost {
  id?: number;
  slug: string;
  title_en: string;
  title_ar: string;
  excerpt_en: string;
  excerpt_ar: string;
  body_en: string;
  body_ar: string;
  category_en: string;
  category_ar: string;
  image_url?: string;
  author_en: string;
  author_ar: string;
  publish_date?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords: string[];
  published: boolean;
  featured: boolean;
  order: number;
}

// Icon mapping function
const getIconComponent = (iconName: string) => {
  const icons: { [key: string]: React.ComponentType<any> } = {
    Brain,
    Activity,
    TrendingUp,
    Shield,
    Zap,
    CheckCircle,
    Star,
    BarChart3,
    Target,
    Clock,
    Users,
    Bot,
    Settings,
    Lock,
    Send,
    Moon,
    Sun,
    Globe,
    Menu,
    ChevronDown,
    ArrowRight
  };
  
  return icons[iconName] || Brain; // Default to Brain if icon not found
};

export default function AdminCMS() {
  const [hero, setHero] = useState<CMSHero | null>(null);
  const [features, setFeatures] = useState<CMSFeature[]>([]);
  const [pricing, setPricing] = useState<CMSPricing[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [faqs, setFAQs] = useState<CMSFAQ[]>([]);
  const [documentation, setDocumentation] = useState<CMSDocumentationSection[]>([]);
  const [legalPages, setLegalPages] = useState<CMSLegalPage[]>([]);
  const [blogPosts, setBlogPosts] = useState<CMSBlogPost[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [showHeroDialog, setShowHeroDialog] = useState(false);
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);
  const [showPricingDialog, setShowPricingDialog] = useState(false);
  const [showTestimonialDialog, setShowTestimonialDialog] = useState(false);
  const [showFAQDialog, setShowFAQDialog] = useState(false);
  const [showDocumentationDialog, setShowDocumentationDialog] = useState(false);
  const [showLegalPageDialog, setShowLegalPageDialog] = useState(false);
  const [showBlogPostDialog, setShowBlogPostDialog] = useState(false);
  
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name?: string; type: 'feature' | 'pricing' | 'testimonial' | 'faq' | 'documentation' | 'legal' | 'blog' } | null>(null);

  useEffect(() => {
    loadCMSData();
  }, []);

  // Function to clear all CMS cache
  const clearCMSCache = (section?: string) => {
    if (section) {
      // Clear specific section cache
      localStorage.removeItem(`cms_content_${section}_en`);
      localStorage.removeItem(`cms_content_${section}_ar`);
    } else {
      // Clear all CMS cache
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cms_content_')) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  const loadCMSData = async () => {
    try {
      setLoading(true);
      const [heroRes, featuresRes, pricingRes, testimonialsRes, faqsRes, documentationRes, legalPagesRes, blogPostsRes] = await Promise.all([
        adminApiService.getHero(),
        adminApiService.getFeatures(),
        adminApiService.getPricing(false),
        adminApiService.getTestimonials(false),
        adminApiService.getFAQs(false),
        adminApiService.getDocumentation(),
        adminApiService.getLegalPages(false),
        adminApiService.getBlogPosts(false)
      ]);

      if (heroRes.content) setHero(heroRes.content);
      console.log("featuresRes--------->", featuresRes.features);
      setFeatures(featuresRes.features || []);
      setPricing(pricingRes.pricing || []);
      setTestimonials(testimonialsRes.testimonials || []);
      setFAQs(faqsRes.faqs || []);
      setDocumentation(documentationRes.sections || []);
      setLegalPages(legalPagesRes.pages || []);
      setBlogPosts(blogPostsRes.posts || []);
    } catch (error) {
      console.error("Error loading CMS data:", error);
      toast.error("Failed to load CMS data");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHero = async () => {
    try {
      await adminApiService.updateHero(formData);
      
      // Clear cache for hero section to show changes immediately
      clearCMSCache('hero');
      
      toast.success("Hero section updated successfully! Changes will appear on the site immediately.");
      setShowHeroDialog(false);
      loadCMSData();
    } catch (error) {
      toast.error("Failed to update hero section");
    }
  };

  const handleSaveFeature = async () => {
    try {
      if (editingItem?.id) {
        await adminApiService.updateFeature(editingItem.id, formData);
        toast.success("Feature updated successfully! Changes will appear immediately.");
      } else {
        await adminApiService.createFeature(formData);
        toast.success("Feature created successfully! Changes will appear immediately.");
      }
      
      clearCMSCache('features');
      setShowFeatureDialog(false);
      loadCMSData();
    } catch (error) {
      toast.error("Failed to save feature");
    }
  };

  const handleDeleteFeature = (featureId: number, feature: CMSFeature) => {
    setItemToDelete({ id: featureId, name: feature.title_en, type: 'feature' });
    setShowDeleteDialog(true);
  };

  const handleDeleteTestimonial = (testimonialId: number, testimonial: CMSTestimonial) => {
    setItemToDelete({ id: testimonialId, name: testimonial.name, type: 'testimonial' });
    setShowDeleteDialog(true);
  };

  const handleDeletePricing = (pricingId: number, plan: CMSPricing) => {
    setItemToDelete({ id: pricingId, name: plan.plan_name, type: 'pricing' });
    setShowDeleteDialog(true);
  };

  const handleDeleteFAQ = (faqId: number, faq: CMSFAQ) => {
    setItemToDelete({ id: faqId, name: faq.question_en, type: 'faq' });
    setShowDeleteDialog(true);
  };

  const handleSaveDocumentation = async () => {
    try {
      if (editingItem?.id) {
        await adminApiService.updateDocumentation(editingItem.id, formData);
        toast.success("Documentation section updated successfully! Changes will appear immediately.");
      } else {
        await adminApiService.createDocumentation(formData);
        toast.success("Documentation section created successfully! Changes will appear immediately.");
      }
      
      clearCMSCache('documentation');
      setShowDocumentationDialog(false);
      loadCMSData();
    } catch (error) {
      toast.error("Failed to save documentation section");
    }
  };

  const handleDeleteDocumentation = (sectionId: number, section: CMSDocumentationSection) => {
    setItemToDelete({ id: sectionId, name: section.title_en, type: 'documentation' });
    setShowDeleteDialog(true);
  };

  const handleSaveLegalPage = async () => {
    try {
      if (editingItem?.id) {
        await adminApiService.updateLegalPage(editingItem.id, formData);
        toast.success("Legal page updated successfully! Changes will appear immediately.");
      } else {
        await adminApiService.createLegalPage(formData);
        toast.success("Legal page created successfully! Changes will appear immediately.");
      }
      
      clearCMSCache('legal');
      setShowLegalPageDialog(false);
      loadCMSData();
    } catch (error) {
      toast.error("Failed to save legal page");
    }
  };

  const handleDeleteLegalPage = (pageId: number, page: CMSLegalPage) => {
    setItemToDelete({ id: pageId, name: page.title_en, type: 'legal' });
    setShowDeleteDialog(true);
  };

  const handleSaveBlogPost = async () => {
    try {
      if (editingItem?.id) {
        await adminApiService.updateBlogPost(editingItem.id, formData);
        toast.success("Blog post updated successfully! Changes will appear immediately.");
      } else {
        await adminApiService.createBlogPost(formData);
        toast.success("Blog post created successfully! Changes will appear immediately.");
      }
      
      clearCMSCache('blog-posts');
      setShowBlogPostDialog(false);
      loadCMSData();
    } catch (error) {
      toast.error("Failed to save blog post");
    }
  };

  const handleDeleteBlogPost = (postId: number, post: CMSBlogPost) => {
    setItemToDelete({ id: postId, name: post.title_en, type: 'blog' });
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      switch (itemToDelete.type) {
        case 'feature':
          await adminApiService.deleteFeature(itemToDelete.id);
          clearCMSCache('features');
          toast.success("Feature deleted successfully! Changes will appear immediately.");
          break;
        case 'pricing':
          await adminApiService.deletePricing(itemToDelete.id);
          clearCMSCache('pricing');
          toast.success("Pricing plan deleted successfully! Changes will appear immediately.");
          break;
        case 'testimonial':
          await adminApiService.deleteTestimonial(itemToDelete.id);
          clearCMSCache('testimonials');
          toast.success("Testimonial deleted successfully! Changes will appear immediately.");
          break;
        case 'faq':
          await adminApiService.deleteFAQ(itemToDelete.id);
          clearCMSCache('faqs');
          toast.success("FAQ deleted successfully! Changes will appear immediately.");
          break;
        case 'documentation':
          await adminApiService.deleteDocumentation(itemToDelete.id);
          clearCMSCache('documentation');
          toast.success("Documentation section deleted successfully! Changes will appear immediately.");
          break;
        case 'legal':
          await adminApiService.deleteLegalPage(itemToDelete.id);
          clearCMSCache('legal');
          toast.success("Legal page deleted successfully! Changes will appear immediately.");
          break;
        case 'blog':
          await adminApiService.deleteBlogPost(itemToDelete.id);
          clearCMSCache('blog-posts');
          toast.success("Blog post deleted successfully! Changes will appear immediately.");
          break;
      }
      loadCMSData();
      setShowDeleteDialog(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(`Failed to delete ${itemToDelete.type}`);
    }
  };

  const handleSavePricing = async () => {
    try {
      if (editingItem?.id) {
        await adminApiService.updatePricing(editingItem.id, formData);
        toast.success("Pricing plan updated successfully! Changes will appear immediately.");
      } else {
        await adminApiService.createPricing(formData);
        toast.success("Pricing plan created successfully! Changes will appear immediately.");
      }
      
      clearCMSCache('pricing');
      setShowPricingDialog(false);
      loadCMSData();
    } catch (error) {
      toast.error("Failed to save pricing plan");
    }
  };

  const handleSaveTestimonial = async () => {
    try {
      if (editingItem?.id) {
        await adminApiService.updateTestimonial(editingItem.id, formData);
        toast.success("Testimonial updated successfully! Changes will appear immediately.");
      } else {
        await adminApiService.createTestimonial(formData);
        toast.success("Testimonial created successfully! Changes will appear immediately.");
      }
      
      clearCMSCache('testimonials');
      setShowTestimonialDialog(false);
      loadCMSData();
    } catch (error) {
      toast.error("Failed to save testimonial");
    }
  };

  const handleSaveFAQ = async () => {
    try {
      if (editingItem?.id) {
        await adminApiService.updateFAQ(editingItem.id, formData);
        toast.success("FAQ updated successfully! Changes will appear immediately.");
      } else {
        await adminApiService.createFAQ(formData);
        toast.success("FAQ created successfully! Changes will appear immediately.");
      }
      
      clearCMSCache('faqs');
      setShowFAQDialog(false);
      loadCMSData();
    } catch (error) {
      toast.error("Failed to save FAQ");
    }
  };

  if (loading) {
    return <div className="text-crypto-text-secondary">Loading CMS data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-crypto-text-primary">Content Management System</CardTitle>
              <p className="text-crypto-text-secondary">Manage all website content including landing page, pricing, and more.</p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                clearCMSCache();
                toast.success("All CMS cache cleared! Changes will be visible on the site immediately.");
              }}
            >
              <X className="w-4 h-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="faqs">FAQs</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="legal">Legal Pages</TabsTrigger>
              <TabsTrigger value="blog">Blog</TabsTrigger>
            </TabsList>

            {/* Hero Tab */}
            <TabsContent value="hero" className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-crypto-text-primary">Hero Section</h3>
                  <p className="text-sm text-crypto-text-secondary">Main landing page hero content</p>
                </div>
                <Button onClick={() => {
                  setEditingItem(null);
                  setFormData(hero || {});
                  setShowHeroDialog(true);
                }}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Hero
                </Button>
              </div>
              {hero && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* English Content */}
                  <Card className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-crypto-green flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        English Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-xs text-crypto-text-secondary uppercase">Badge</Label>
                        <p className="text-crypto-text-primary mt-1 font-medium">{hero.badge_en}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-crypto-text-secondary uppercase">Title</Label>
                        <p className="text-crypto-text-primary mt-1 text-lg font-bold">{hero.title_en}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-crypto-text-secondary uppercase">Subtitle</Label>
                        <p className="text-crypto-text-secondary mt-1">{hero.subtitle_en}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-crypto-text-secondary uppercase">CTA Button</Label>
                        <p className="text-crypto-text-primary mt-1 font-medium">{hero.cta_text_en}</p>
                      </div>
                      {hero.meta_title_en && (
                        <div className="pt-3 border-t border-crypto-border">
                          <Label className="text-xs text-crypto-text-secondary uppercase">SEO Meta Title</Label>
                          <p className="text-crypto-text-secondary mt-1 text-sm">{hero.meta_title_en}</p>
                        </div>
                      )}
                      {hero.meta_description_en && (
                        <div>
                          <Label className="text-xs text-crypto-text-secondary uppercase">SEO Meta Description</Label>
                          <p className="text-crypto-text-secondary mt-1 text-sm">{hero.meta_description_en}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Arabic Content */}
                  <Card className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-crypto-green flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Arabic Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4" dir="rtl">
                      <div>
                        <Label className="text-xs text-crypto-text-secondary uppercase">شارة</Label>
                        <p className="text-crypto-text-primary mt-1 font-medium">{hero.badge_ar}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-crypto-text-secondary uppercase">عنوان</Label>
                        <p className="text-crypto-text-primary mt-1 text-lg font-bold">{hero.title_ar}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-crypto-text-secondary uppercase">عنوان فرعي</Label>
                        <p className="text-crypto-text-secondary mt-1">{hero.subtitle_ar}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-crypto-text-secondary uppercase">زر الدعوة</Label>
                        <p className="text-crypto-text-primary mt-1 font-medium">{hero.cta_text_ar}</p>
                      </div>
                      {hero.meta_title_ar && (
                        <div className="pt-3 border-t border-crypto-border">
                          <Label className="text-xs text-crypto-text-secondary uppercase">عنوان ميتا SEO</Label>
                          <p className="text-crypto-text-secondary mt-1 text-sm">{hero.meta_title_ar}</p>
                        </div>
                      )}
                      {hero.meta_description_ar && (
                        <div>
                          <Label className="text-xs text-crypto-text-secondary uppercase">وصف ميتا SEO</Label>
                          <p className="text-crypto-text-secondary mt-1 text-sm">{hero.meta_description_ar}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-crypto-text-primary">Features</h3>
                <Button onClick={() => {
                  setEditingItem(null);
                  setFormData({ section: 'main', active: true, order: features.length });
                  setShowFeatureDialog(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => {
                  const IconComponent = feature.icon ? getIconComponent(feature.icon) : null;
                  return (
                    <Card key={feature.id} className="bg-crypto-card border-crypto-border">
                      <CardHeader>
                        {IconComponent && (
                          <div className="w-14 h-14 bg-gradient-to-br from-crypto-green to-emerald-600 rounded-xl flex items-center justify-center mb-3">
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>
                        )}
                        <CardTitle className="text-crypto-text-primary">{feature.title_en}</CardTitle>
                        <p className="text-crypto-text-secondary text-sm">{feature.description_en.substring(0, 100)}...</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingItem(feature);
                              setFormData(feature);
                              setShowFeatureDialog(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteFeature(feature.id!, feature)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-crypto-text-primary">Pricing Plans</h3>
                <Button onClick={() => {
                  setEditingItem(null);
                  setFormData({ active: true, order: pricing.length });
                  setShowPricingDialog(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Plan
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pricing.map((plan) => (
                  <Card key={plan.id} className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-crypto-text-primary">{plan.plan_name}</CardTitle>
                      <p className="text-2xl font-bold text-crypto-green">${plan.price_usd}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-crypto-text-secondary text-sm mb-4">{plan.short_description_en}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(plan);
                            setFormData(plan);
                            setShowPricingDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePricing(plan.id!, plan)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-crypto-text-primary">Testimonials</h3>
                <Button onClick={() => {
                  setEditingItem(null);
                  setFormData({ active: true, order: testimonials.length });
                  setShowTestimonialDialog(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-crypto-text-primary">{testimonial.name}</CardTitle>
                      <p className="text-crypto-text-secondary text-sm">{testimonial.role_en}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-crypto-text-secondary italic mb-4">"{testimonial.quote_en.substring(0, 100)}..."</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(testimonial);
                            setFormData(testimonial);
                            setShowTestimonialDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteTestimonial(testimonial.id!, testimonial)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* FAQs Tab */}
            <TabsContent value="faqs" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-crypto-text-primary">FAQs</h3>
                <Button onClick={() => {
                  setEditingItem(null);
                  setFormData({ active: true, order: faqs.length });
                  setShowFAQDialog(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Card key={faq.id} className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-crypto-text-primary">{faq.question_en}</CardTitle>
                      <p className="text-crypto-text-secondary">{faq.answer_en.substring(0, 150)}...</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(faq);
                            setFormData(faq);
                            setShowFAQDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteFAQ(faq.id!, faq)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Documentation Tab */}
            <TabsContent value="documentation" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-crypto-text-primary">Documentation Sections</h3>
                <Button onClick={() => {
                  setEditingItem(null);
                  setFormData({ active: true, order: documentation.length, section_number: documentation.length + 1 });
                  setShowDocumentationDialog(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </div>
              <div className="space-y-4">
                {documentation.map((section) => (
                  <Card key={section.id} className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-crypto-text-primary">{section.title_en}</CardTitle>
                      <p className="text-crypto-text-secondary text-sm">Section #{section.section_number}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-crypto-text-secondary mb-4">{section.content_en.substring(0, 100)}...</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(section);
                            setFormData(section);
                            setShowDocumentationDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDocumentation(section.id!, section)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Legal Pages Tab */}
            <TabsContent value="legal" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-crypto-text-primary">Legal Pages</h3>
                <Button onClick={() => {
                  setEditingItem(null);
                  setFormData({ published: true, links: [] });
                  setShowLegalPageDialog(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Legal Page
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {legalPages.map((page) => (
                  <Card key={page.id} className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-crypto-text-primary">{page.title_en}</CardTitle>
                      <p className="text-crypto-text-secondary text-sm">Slug: {page.page_slug}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-crypto-text-secondary mb-2 text-sm">{page.content_en.substring(0, 100)}...</p>
                      <div className="flex gap-4 mb-4 text-xs text-crypto-text-secondary">
                        <span>Links: {page.links?.length || 0}</span>
                        {page.effective_date && (
                          <span className="text-crypto-green">Effective: {page.effective_date}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(page);
                            setFormData(page);
                            setShowLegalPageDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteLegalPage(page.id!, page)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Blog Tab */}
            <TabsContent value="blog" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-crypto-text-primary">Blog Posts</h3>
                <Button onClick={() => {
                  setEditingItem(null);
                  setFormData({ published: true, featured: false, order: blogPosts.length, author_en: "Bitiq.ai Team", author_ar: "فريق Bitiq.ai", seo_keywords: [] });
                  setShowBlogPostDialog(true);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blog Post
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogPosts.map((post) => (
                  <Card key={post.id} className="bg-crypto-card border-crypto-border">
                    <CardHeader>
                      <CardTitle className="text-crypto-text-primary">{post.title_en}</CardTitle>
                      <p className="text-crypto-text-secondary text-sm">Slug: {post.slug}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="border-crypto-green text-crypto-green text-xs">
                          {post.category_en}
                        </Badge>
                        {post.featured && (
                          <Badge variant="outline" className="border-yellow-500 text-yellow-500 text-xs">
                            Featured
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-crypto-text-secondary mb-2 text-sm line-clamp-2">{post.excerpt_en}</p>
                      <div className="flex gap-4 mb-4 text-xs text-crypto-text-secondary">
                        <span>Date: {post.publish_date || 'Not set'}</span>
                        <span>Author: {post.author_en}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingItem(post);
                            setFormData(post);
                            setShowBlogPostDialog(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBlogPost(post.id!, post)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Hero Dialog */}
      <Dialog open={showHeroDialog} onOpenChange={setShowHeroDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Hero Section</DialogTitle>
            <DialogDescription>
              Update the main landing page hero content for both English and Arabic
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            {/* English Content Section */}
            <div className="border border-crypto-border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-crypto-green flex items-center gap-2">
                <Globe className="w-5 h-5" />
                English Content
              </h3>
              <div>
                <Label>Badge Text</Label>
                <Input 
                  value={formData.badge_en || ''} 
                  onChange={(e) => setFormData({...formData, badge_en: e.target.value})} 
                  placeholder="e.g., AI-Powered Trading Signals"
                />
                <p className="text-xs text-crypto-text-secondary mt-1">Small badge text above the main title</p>
              </div>
              <div>
                <Label>Main Title</Label>
                <Input 
                  value={formData.title_en || ''} 
                  onChange={(e) => setFormData({...formData, title_en: e.target.value})} 
                  placeholder="e.g., Trade Smarter with AI"
                />
                <p className="text-xs text-crypto-text-secondary mt-1">Primary headline (large, bold)</p>
              </div>
              <div>
                <Label>Subtitle</Label>
                <Textarea 
                  value={formData.subtitle_en || ''} 
                  onChange={(e) => setFormData({...formData, subtitle_en: e.target.value})} 
                  rows={3}
                  placeholder="e.g., Get real-time trading signals powered by advanced AI..."
                />
                <p className="text-xs text-crypto-text-secondary mt-1">Supporting text below the title</p>
              </div>
              <div>
                <Label>CTA Button Text</Label>
                <Input 
                  value={formData.cta_text_en || ''} 
                  onChange={(e) => setFormData({...formData, cta_text_en: e.target.value})} 
                  placeholder="e.g., Get Started"
                />
                <p className="text-xs text-crypto-text-secondary mt-1">Call-to-action button text</p>
              </div>
            </div>

            {/* Arabic Content Section */}
            <div className="border border-crypto-border rounded-lg p-4 space-y-4" dir="rtl">
              <h3 className="text-lg font-semibold text-crypto-green flex items-center gap-2">
                <Globe className="w-5 h-5" />
                المحتوى العربي
              </h3>
              <div>
                <Label>نص الشارة</Label>
                <Input 
                  value={formData.badge_ar || ''} 
                  onChange={(e) => setFormData({...formData, badge_ar: e.target.value})} 
                  placeholder="مثال: إشارات تداول مدعومة بالذكاء الاصطناعي"
                />
                <p className="text-xs text-crypto-text-secondary mt-1">نص الشارة الصغيرة فوق العنوان الرئيسي</p>
              </div>
              <div>
                <Label>العنوان الرئيسي</Label>
                <Input 
                  value={formData.title_ar || ''} 
                  onChange={(e) => setFormData({...formData, title_ar: e.target.value})} 
                  placeholder="مثال: تداول بذكاء مع الذكاء الاصطناعي"
                />
                <p className="text-xs text-crypto-text-secondary mt-1">العنوان الأساسي (كبير، عريض)</p>
              </div>
              <div>
                <Label>العنوان الفرعي</Label>
                <Textarea 
                  value={formData.subtitle_ar || ''} 
                  onChange={(e) => setFormData({...formData, subtitle_ar: e.target.value})} 
                  rows={3}
                  placeholder="مثال: احصل على إشارات تداول في الوقت الفعلي..."
                />
                <p className="text-xs text-crypto-text-secondary mt-1">النص الداعم أسفل العنوان</p>
              </div>
              <div>
                <Label>نص زر الدعوة</Label>
                <Input 
                  value={formData.cta_text_ar || ''} 
                  onChange={(e) => setFormData({...formData, cta_text_ar: e.target.value})} 
                  placeholder="مثال: ابدأ الآن"
                />
                <p className="text-xs text-crypto-text-secondary mt-1">نص زر الدعوة لاتخاذ إجراء</p>
              </div>
            </div>

            {/* SEO Meta Section */}
            <div className="border border-crypto-border rounded-lg p-4 space-y-4">
              <h3 className="text-lg font-semibold text-crypto-green flex items-center gap-2">
                <Settings className="w-5 h-5" />
                SEO Settings (Optional)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Meta Title (EN)</Label>
                  <Input 
                    value={formData.meta_title_en || ''} 
                    onChange={(e) => setFormData({...formData, meta_title_en: e.target.value})} 
                    placeholder="SEO title for search engines"
                  />
                </div>
                <div>
                  <Label>Meta Title (AR)</Label>
                  <Input 
                    value={formData.meta_title_ar || ''} 
                    onChange={(e) => setFormData({...formData, meta_title_ar: e.target.value})} 
                    placeholder="عنوان SEO لمحركات البحث"
                  />
                </div>
                <div>
                  <Label>Meta Description (EN)</Label>
                  <Textarea 
                    value={formData.meta_description_en || ''} 
                    onChange={(e) => setFormData({...formData, meta_description_en: e.target.value})} 
                    rows={2}
                    placeholder="SEO description (150-160 characters)"
                  />
                </div>
                <div>
                  <Label>Meta Description (AR)</Label>
                  <Textarea 
                    value={formData.meta_description_ar || ''} 
                    onChange={(e) => setFormData({...formData, meta_description_ar: e.target.value})} 
                    rows={2}
                    placeholder="وصف SEO (150-160 حرف)"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHeroDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSaveHero}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feature Dialog */}
      <Dialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit Feature' : 'Add New Feature'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title (EN)</Label>
              <Input value={formData.title_en || ''} onChange={(e) => setFormData({...formData, title_en: e.target.value})} />
            </div>
            <div>
              <Label>Title (AR)</Label>
              <Input value={formData.title_ar || ''} onChange={(e) => setFormData({...formData, title_ar: e.target.value})} />
            </div>
            <div>
              <Label>Description (EN)</Label>
              <Textarea value={formData.description_en || ''} onChange={(e) => setFormData({...formData, description_en: e.target.value})} />
            </div>
            <div>
              <Label>Description (AR)</Label>
              <Textarea value={formData.description_ar || ''} onChange={(e) => setFormData({...formData, description_ar: e.target.value})} />
            </div>
            <div>
              <Label>Icon Name</Label>
              <Input value={formData.icon || ''} onChange={(e) => setFormData({...formData, icon: e.target.value})} placeholder="e.g., Brain, Activity" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.active !== false} onCheckedChange={(checked) => setFormData({...formData, active: checked})} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeatureDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveFeature}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pricing Dialog */}
      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Plan Name</Label>
              <Input value={formData.plan_name || ''} onChange={(e) => setFormData({...formData, plan_name: e.target.value})} />
            </div>
            <div>
              <Label>Plan Tag (optional)</Label>
              <Input value={formData.plan_tag || ''} onChange={(e) => setFormData({...formData, plan_tag: e.target.value})} placeholder="e.g., Most Popular" />
            </div>
            <div>
              <Label>Price (USD)</Label>
              <Input type="number" value={formData.price_usd || 0} onChange={(e) => setFormData({...formData, price_usd: parseFloat(e.target.value)})} />
            </div>
            <div>
              <Label>Short Description (EN)</Label>
              <Textarea value={formData.short_description_en || ''} onChange={(e) => setFormData({...formData, short_description_en: e.target.value})} />
            </div>
            <div>
              <Label>Short Description (AR)</Label>
              <Textarea value={formData.short_description_ar || ''} onChange={(e) => setFormData({...formData, short_description_ar: e.target.value})} />
            </div>
            <div>
              <Label>Features (EN) - One per line</Label>
              <Textarea value={Array.isArray(formData.features_en) ? formData.features_en.join('\n') : formData.features_en || ''} onChange={(e) => setFormData({...formData, features_en: e.target.value.split('\n').filter(f => f.trim())})} rows={5} />
            </div>
            <div>
              <Label>Features (AR) - One per line</Label>
              <Textarea value={Array.isArray(formData.features_ar) ? formData.features_ar.join('\n') : formData.features_ar || ''} onChange={(e) => setFormData({...formData, features_ar: e.target.value.split('\n').filter(f => f.trim())})} rows={5} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.active !== false} onCheckedChange={(checked) => setFormData({...formData, active: checked})} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPricingDialog(false)}>Cancel</Button>
            <Button onClick={handleSavePricing}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog open={showTestimonialDialog} onOpenChange={setShowTestimonialDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit Testimonial' : 'Add New Testimonial'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <Label>Role (EN)</Label>
              <Input value={formData.role_en || ''} onChange={(e) => setFormData({...formData, role_en: e.target.value})} />
            </div>
            <div>
              <Label>Role (AR)</Label>
              <Input value={formData.role_ar || ''} onChange={(e) => setFormData({...formData, role_ar: e.target.value})} />
            </div>
            <div>
              <Label>Quote (EN)</Label>
              <Textarea value={formData.quote_en || ''} onChange={(e) => setFormData({...formData, quote_en: e.target.value})} rows={4} />
            </div>
            <div>
              <Label>Quote (AR)</Label>
              <Textarea value={formData.quote_ar || ''} onChange={(e) => setFormData({...formData, quote_ar: e.target.value})} rows={4} />
            </div>
            <div>
              <Label>Image URL (optional)</Label>
              <Input value={formData.image_url || ''} onChange={(e) => setFormData({...formData, image_url: e.target.value})} />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={formData.order || 0} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.active !== false} onCheckedChange={(checked) => setFormData({...formData, active: checked})} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestimonialDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveTestimonial}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={showFAQDialog} onOpenChange={setShowFAQDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit FAQ' : 'Add New FAQ'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question (EN)</Label>
              <Input value={formData.question_en || ''} onChange={(e) => setFormData({...formData, question_en: e.target.value})} />
            </div>
            <div>
              <Label>Question (AR)</Label>
              <Input value={formData.question_ar || ''} onChange={(e) => setFormData({...formData, question_ar: e.target.value})} />
            </div>
            <div>
              <Label>Answer (EN)</Label>
              <Textarea value={formData.answer_en || ''} onChange={(e) => setFormData({...formData, answer_en: e.target.value})} rows={6} />
            </div>
            <div>
              <Label>Answer (AR)</Label>
              <Textarea value={formData.answer_ar || ''} onChange={(e) => setFormData({...formData, answer_ar: e.target.value})} rows={6} />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={formData.order || 0} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.active !== false} onCheckedChange={(checked) => setFormData({...formData, active: checked})} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFAQDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveFAQ}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Documentation Dialog */}
      <Dialog open={showDocumentationDialog} onOpenChange={setShowDocumentationDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit Documentation Section' : 'Add New Documentation Section'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Section Number</Label>
              <Input type="number" value={formData.section_number || ''} onChange={(e) => setFormData({...formData, section_number: parseInt(e.target.value)})} placeholder="e.g., 1, 2, 3..." />
            </div>
            <div>
              <Label>Title (EN)</Label>
              <Input value={formData.title_en || ''} onChange={(e) => setFormData({...formData, title_en: e.target.value})} placeholder="e.g., Welcome to Bitiq.ai" />
            </div>
            <div>
              <Label>Title (AR)</Label>
              <Input value={formData.title_ar || ''} onChange={(e) => setFormData({...formData, title_ar: e.target.value})} placeholder="e.g., مرحباً بك في Bitiq.ai" />
            </div>
            <div>
              <Label>Content (EN)</Label>
              <Textarea value={formData.content_en || ''} onChange={(e) => setFormData({...formData, content_en: e.target.value})} rows={10} placeholder="Enter the content for this section..." />
            </div>
            <div>
              <Label>Content (AR)</Label>
              <Textarea value={formData.content_ar || ''} onChange={(e) => setFormData({...formData, content_ar: e.target.value})} rows={10} placeholder="أدخل المحتوى لهذا القسم..." />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={formData.order || 0} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.active !== false} onCheckedChange={(checked) => setFormData({...formData, active: checked})} />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDocumentationDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveDocumentation}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Legal Page Dialog */}
      <Dialog open={showLegalPageDialog} onOpenChange={setShowLegalPageDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit Legal Page' : 'Add New Legal Page'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Page Slug</Label>
              <Input value={formData.page_slug || ''} onChange={(e) => setFormData({...formData, page_slug: e.target.value})} placeholder="e.g., privacy-policy" />
              <p className="text-xs text-crypto-text-secondary mt-1">URL-friendly identifier (e.g., privacy-policy, terms-and-conditions)</p>
            </div>
            <div>
              <Label>Title (EN)</Label>
              <Input value={formData.title_en || ''} onChange={(e) => setFormData({...formData, title_en: e.target.value})} placeholder="e.g., Privacy Policy" />
            </div>
            <div>
              <Label>Title (AR)</Label>
              <Input value={formData.title_ar || ''} onChange={(e) => setFormData({...formData, title_ar: e.target.value})} placeholder="e.g., سياسة الخصوصية" />
            </div>
            <div>
              <Label>Content (EN)</Label>
              <Textarea value={formData.content_en || ''} onChange={(e) => setFormData({...formData, content_en: e.target.value})} rows={10} placeholder="Use [LINK_ID] for link placeholders..." />
              <p className="text-xs text-crypto-text-secondary mt-1">Use [LINK_ID] placeholders for links (e.g., See our [PRIVACY_POLICY])</p>
            </div>
            <div>
              <Label>Content (AR)</Label>
              <Textarea value={formData.content_ar || ''} onChange={(e) => setFormData({...formData, content_ar: e.target.value})} rows={10} placeholder="استخدم [LINK_ID] للروابط..." />
            </div>
            <div>
              <Label>Effective Date</Label>
              <Input value={formData.effective_date || ''} onChange={(e) => setFormData({...formData, effective_date: e.target.value})} placeholder="e.g., January 1, 2025 or 2025-01-01" />
              <p className="text-xs text-crypto-text-secondary mt-1">The date when this legal document becomes effective</p>
            </div>
            <div>
              <Label>Meta Title (EN)</Label>
              <Input value={formData.meta_title_en || ''} onChange={(e) => setFormData({...formData, meta_title_en: e.target.value})} placeholder="SEO title" />
            </div>
            <div>
              <Label>Meta Description (EN)</Label>
              <Textarea value={formData.meta_description_en || ''} onChange={(e) => setFormData({...formData, meta_description_en: e.target.value})} rows={2} placeholder="SEO description" />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={formData.published !== false} onCheckedChange={(checked) => setFormData({...formData, published: checked})} />
              <Label>Published</Label>
            </div>
            <div className="border-t pt-4">
              <Label className="text-lg">Links (JSON)</Label>
              <p className="text-xs text-crypto-text-secondary mb-2">Add links as JSON array. Each link needs: id, text_en, text_ar, href, type</p>
              <Textarea 
                value={typeof formData.links === 'string' ? formData.links : JSON.stringify(formData.links || [], null, 2)} 
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    setFormData({...formData, links: parsed});
                  } catch {
                    setFormData({...formData, links: e.target.value});
                  }
                }} 
                rows={8} 
                placeholder='[{"id": "PRIVACY_POLICY", "text_en": "Privacy Policy", "text_ar": "سياسة الخصوصية", "href": "/legal/privacy-policy", "type": "internal"}]'
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLegalPageDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveLegalPage}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Post Dialog */}
      <Dialog open={showBlogPostDialog} onOpenChange={setShowBlogPostDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem?.id ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Slug</Label>
              <Input value={formData.slug || ''} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="e.g., understanding-crypto-signals" />
              <p className="text-xs text-crypto-text-secondary mt-1">URL-friendly identifier (e.g., understanding-crypto-signals)</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title (EN)</Label>
                <Input value={formData.title_en || ''} onChange={(e) => setFormData({...formData, title_en: e.target.value})} placeholder="Blog post title" />
              </div>
              <div>
                <Label>Title (AR)</Label>
                <Input value={formData.title_ar || ''} onChange={(e) => setFormData({...formData, title_ar: e.target.value})} placeholder="عنوان المقالة" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Excerpt (EN)</Label>
                <Textarea value={formData.excerpt_en || ''} onChange={(e) => setFormData({...formData, excerpt_en: e.target.value})} rows={3} placeholder="Short summary..." />
              </div>
              <div>
                <Label>Excerpt (AR)</Label>
                <Textarea value={formData.excerpt_ar || ''} onChange={(e) => setFormData({...formData, excerpt_ar: e.target.value})} rows={3} placeholder="ملخص قصير..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Body (EN)</Label>
                <Textarea value={formData.body_en || ''} onChange={(e) => setFormData({...formData, body_en: e.target.value})} rows={10} placeholder="Full article content (HTML allowed)..." />
              </div>
              <div>
                <Label>Body (AR)</Label>
                <Textarea value={formData.body_ar || ''} onChange={(e) => setFormData({...formData, body_ar: e.target.value})} rows={10} placeholder="محتوى المقالة الكامل (HTML مسموح)..." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category (EN)</Label>
                <Input value={formData.category_en || ''} onChange={(e) => setFormData({...formData, category_en: e.target.value})} placeholder="e.g., Market Analysis" />
              </div>
              <div>
                <Label>Category (AR)</Label>
                <Input value={formData.category_ar || ''} onChange={(e) => setFormData({...formData, category_ar: e.target.value})} placeholder="مثال: تحليل السوق" />
              </div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={formData.image_url || ''} onChange={(e) => setFormData({...formData, image_url: e.target.value})} placeholder="/images/blog-post.jpg" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Author (EN)</Label>
                <Input value={formData.author_en || ''} onChange={(e) => setFormData({...formData, author_en: e.target.value})} placeholder="Bitiq.ai Team" />
              </div>
              <div>
                <Label>Author (AR)</Label>
                <Input value={formData.author_ar || ''} onChange={(e) => setFormData({...formData, author_ar: e.target.value})} placeholder="فريق Bitiq.ai" />
              </div>
            </div>
            <div>
              <Label>Publish Date</Label>
              <Input value={formData.publish_date || ''} onChange={(e) => setFormData({...formData, publish_date: e.target.value})} placeholder="2025-01-15" />
              <p className="text-xs text-crypto-text-secondary mt-1">Format: YYYY-MM-DD</p>
            </div>
            <div>
              <Label>SEO Title</Label>
              <Input value={formData.seo_title || ''} onChange={(e) => setFormData({...formData, seo_title: e.target.value})} placeholder="SEO optimized title" />
            </div>
            <div>
              <Label>SEO Description</Label>
              <Textarea value={formData.seo_description || ''} onChange={(e) => setFormData({...formData, seo_description: e.target.value})} rows={2} placeholder="SEO description (150-160 characters)" />
            </div>
            <div>
              <Label>SEO Keywords (comma-separated)</Label>
              <Input 
                value={Array.isArray(formData.seo_keywords) ? formData.seo_keywords.join(', ') : formData.seo_keywords || ''} 
                onChange={(e) => setFormData({...formData, seo_keywords: e.target.value.split(',').map((k: string) => k.trim()).filter((k: string) => k)})} 
                placeholder="crypto trading, AI signals, market analysis" 
              />
            </div>
            <div>
              <Label>Order</Label>
              <Input type="number" value={formData.order || 0} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} />
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <Switch checked={formData.published !== false} onCheckedChange={(checked) => setFormData({...formData, published: checked})} />
                <Label>Published</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={formData.featured === true} onCheckedChange={(checked) => setFormData({...formData, featured: checked})} />
                <Label>Featured</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBlogPostDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveBlogPost}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteConfirm}
        itemName={itemToDelete?.name}
        itemType={itemToDelete?.type || 'feature'}
      />
    </div>
  );
}

