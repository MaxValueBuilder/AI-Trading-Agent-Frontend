import { useState, useEffect, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

// Icons
import { 
  Settings, 
  RotateCcw, 
  Bell, 
  BarChart3, 
  CreditCard, 
  LogOut, 
  Shield, 
  MoreVertical, 
  UserCircle, 
  Users, 
  BookOpen, 
  Bot, 
  Zap, 
  Moon, 
  Sun 
} from "lucide-react";

// UI Components
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger, 
  DropdownMenuSub, 
  DropdownMenuSubContent, 
  DropdownMenuSubTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Hooks & Contexts
import { useRTL } from "@/hooks/useRTL";
import { useNotificationStore } from "@/stores/notificationStore";
import { useAuth } from "@/contexts/AuthContext";
import { useSignalsRefreshStore } from "@/stores/signalsRefreshStore";

// Services & Types
import { subscriptionApiService, UserSubscription } from "@/services/subscriptionApi";
import { adminApiService } from "@/services/adminApi";
import { LogoutConfirmDialog } from "@/components/LogoutConfirmDialog";

// Constants
const NAVIGATION_ITEMS = [
  { title: "AI Signals", url: "/dashboard", icon: BarChart3, isBeta: false },
  { title: "Bitiq.ai Copilot", url: "/copilot", icon: Bot, isBeta: true },
  { title: "Auto Trading", url: "/auto-trading", icon: Zap, isBeta: true },
] as const;

const ACTION_ITEMS = [
  { title: "Settings", url: "/settings", icon: Settings },
  { title: "Notifications", icon: Bell },
] as Array<{ title: string; url?: string; icon: any }>;

// Utility functions
const getUserInitials = (displayName: string | null, email: string | null): string => {
  if (displayName) {
    return displayName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email.charAt(0).toUpperCase();
  }
  return 'U';
};

const getUserDisplayName = (userProfile: any): string => {
  if (userProfile?.displayName) {
    return userProfile.displayName;
  }
  if (userProfile?.email) {
    return userProfile.email.split('@')[0];
  }
  return 'User';
};

const getUserStatus = (userSubscription: UserSubscription | null): string => {
  if (!userSubscription) {
    return 'Loading...';
  }

  const { plan, status, days_remaining } = userSubscription;
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1);
  
  if (status === 'expired' || plan === 'free') {
    return 'Free Plan';
  }
  
  if (plan === 'monthly' && days_remaining && days_remaining > 0) {
    return `${planName} Plan (${days_remaining}d left)`;
  }
  
  return `${planName} Plan`;
};

const getSubscriptionStatusColor = (userSubscription: UserSubscription | null): string => {
  if (!userSubscription) return 'text-gray-400';
  
  const { plan, status } = userSubscription;
  
  if (plan === 'free' || status === 'expired') {
    return 'text-gray-400';
  }
  
  if (plan === 'monthly') {
    return 'text-crypto-green';
  }
  
  if (plan === 'lifetime') {
    return 'text-purple-400';
  }
  
  return 'text-crypto-text-secondary';
};

export function AppSidebar() {
  // Hooks
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  
  // Store hooks
  const { hasUnreadNotifications, unreadCount, markAsRead, clearNotifications } = useNotificationStore();
  const notifications = useNotificationStore((s) => s.notifications);
  const { userProfile, logout } = useAuth();
  const bumpSignals = useSignalsRefreshStore((state) => state.bump);

  // Local state
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Computed values
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? `bg-crypto-green/10 text-crypto-green ${isRTL ? 'border-l-2 border-crypto-green' : 'border-r-2 border-crypto-green'}` 
      : "hover:bg-crypto-card/50 text-crypto-text-secondary hover:text-crypto-text-primary";

  // Event handlers
  const handleNotificationClick = () => setIsNotifOpen(true);
  const handleLogoutClick = () => setShowLogoutDialog(true);
  
  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setShowLogoutDialog(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setShowLogoutDialog(false);
    }
  };

  const handleProfileMenuClick = (action: string) => {
    setIsProfileDropdownOpen(false);
    const actions: Record<string, () => void> = {
      account: () => window.location.href = '/account',
      subscription: () => window.location.href = '/subscription',
      community: () => window.open('https://t.me/+i0dT1cOZqok2NTA8', '_blank', 'noopener,noreferrer'),
      docs: () => window.location.href = '/documentation',
      theme: () => setTheme(theme === "dark" ? "light" : "dark"),
      'language-en': () => i18n.changeLanguage('en'),
      'language-ar': () => i18n.changeLanguage('ar'),
      logout: handleLogoutClick,
    };
    
    actions[action]?.();
  };

  const handleHeaderClick = () => {
    navigate('/');
  };

  const refreshSubscriptionStatus = async () => {
    if (!userProfile) return;
    
    try {
      const subscription = await subscriptionApiService.getUserSubscriptionStatus();
      setUserSubscription(subscription);
    } catch (error) {
      console.error('Failed to refresh subscription status:', error);
    }
  };

  // Effects
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (userProfile) {
        try {
          const subscription = await subscriptionApiService.getUserSubscriptionStatus();
          setUserSubscription(subscription);
        } catch (error) {
          console.error('Failed to fetch subscription status:', error);
          setUserSubscription({
            has_subscription: false,
            plan: 'free',
            status: 'expired',
            auto_renew: false
          });
        }
      } else {
        setUserSubscription(null);
      }
    };

    fetchSubscriptionStatus();
  }, [userProfile]);

  useEffect(() => {
    if (isNotifOpen) {
      markAsRead();
    } else if (notifications.length > 0) {
      clearNotifications();
    }
  }, [isNotifOpen, markAsRead, clearNotifications, notifications.length]);

  // Memoized components
  const SidebarHeader = useMemo(() => (
    !isCollapsed ? (
      <div className="p-4 border-b border-crypto-border">
        <div 
          className={`flex items-center gap-3 cursor-pointer hover:bg-crypto-card/50 rounded-lg p-2 transition-colors`}
          onClick={handleHeaderClick}
        >
          <img
            src="/images/logo.png"
            alt="Bitiq.ai Logo"
            className="w-8 h-8 rounded-lg object-cover"
          />
          <div className={`flex items-center gap-2 `}>
            <h1 className={`text-xl font-bold text-crypto-text-primary`}>Bitiq.ai</h1>
          </div>
        </div>
      </div>
    ) : (
      <div className="p-3 border-b border-crypto-border flex justify-center">
        <div 
          className="cursor-pointer hover:bg-crypto-card/50 rounded-lg p-2 transition-colors"
          onClick={handleHeaderClick}
        >
          <img
            src="/images/logo.png"
            alt="Bitiq.ai Logo"
            className="w-8 h-8 rounded-lg object-cover"
          />
        </div>
      </div>
    )
  ), [isCollapsed, isRTL, handleHeaderClick]);

  return (
    <>
      <Sidebar
        key={`sidebar-${i18n.language}-${isCollapsed ? 'collapsed' : 'expanded'}`}
        className={`${isCollapsed ? "w-16" : "w-64"} ${i18n.language === 'ar' ? 'sidebar-right mobile-sidebar-right' : 'sidebar-left mobile-sidebar-left'}`}
        collapsible="icon"
        side={i18n.language === 'ar' ? "right" : "left"}
      >
        <SidebarContent className={`bg-crypto-card ${isRTL ? 'border-l border-crypto-border' : 'border-r border-crypto-border'} !flex !flex-col !overflow-hidden h-full`}>
          {SidebarHeader}

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Navigation Items */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-crypto-text-primary font-semibold">
                {t('navigation.dashboard')}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAVIGATION_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} end className={getNavCls}>
                          <item.icon className={`h-5 w-5`} />
                          {!isCollapsed && (
                            <div className={`flex items-center gap-2 ${isRTL ? 'mr-3' : ''}`}>
                              <span className={`font-medium text-base`}>
                                {t(`navigation.${item.title.toLowerCase().replace(/\s+/g, '').replace('.', '')}`)}
                              </span>
                              {item.isBeta && (
                                <Badge variant="secondary" className="bg-crypto-white text-crypto-text-primary border-crypto-white text-xs">
                                  BETA
                                </Badge>
                              )}
                            </div>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}

                  {/* Admin Console Link - Only for admin users */}
                  {userProfile?.role === 'admin' && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink to="/admin" className={getNavCls}>
                          <Shield className={`h-5 w-5`} />
                          {!isCollapsed && (
                            <span className={`font-medium text-base ${isRTL ? 'mr-3' : ''}`}>
                              {t('sidebar.adminConsole')}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Action Items */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-crypto-text-primary font-semibold">
                {t('actions.title')}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ACTION_ITEMS.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        {item.url ? (
                          <NavLink to={item.url} className={getNavCls}>
                            <item.icon className={`h-5 w-5`} />
                            {!isCollapsed && (
                              <span className={`font-medium text-base ${isRTL ? 'mr-3' : ''}`}>
                                {t(`actions.${item.title.toLowerCase()}`)}
                              </span>
                            )}
                          </NavLink>
                        ) : item.title === "Notifications" ? (
                          <Button 
                            variant="ghost" 
                            onClick={handleNotificationClick}
                            className={`w-full text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 relative ${isRTL ? 'justify-start' : 'justify-start'}`}
                          >
                            <div className="relative">
                              <item.icon className={`h-5 w-5`} />
                              {hasUnreadNotifications && (
                                <div className={`absolute -top-1 w-2 h-2 bg-red-500 rounded-full ${isRTL ? '-left-1' : '-right-1'}`} />
                              )}
                              {unreadCount > 0 && (
                                <Badge 
                                  variant="destructive" 
                                  className={`absolute -top-2 w-4 h-4 flex items-center justify-center p-0 text-xs min-w-4 h-4 ${isRTL ? '-left-2' : '-right-2'}`}
                                >
                                  {unreadCount > 9 ? '9+' : unreadCount}
                                </Badge>
                              )}
                            </div>
                            {!isCollapsed && (
                              <span className={`font-medium text-base ${isRTL ? 'mr-2' : 'ml-2'}`}>
                                {t(`actions.${item.title.toLowerCase()}`)}
                              </span>
                            )}
                          </Button>
                        ) : (
                          <Button variant="ghost" className={`w-full text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 ${isRTL ? 'justify-start' : 'justify-start'}`}>
                            <item.icon className="h-5 w-5" />
                            {!isCollapsed && (
                              <span className={`font-medium ${isRTL ? 'mr-2' : 'ml-2'}`}>
                                {t(`actions.${item.title.toLowerCase()}`)}
                              </span>
                            )}
                          </Button>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>

          {/* User Profile Section - Sticky at Bottom */}
          {userProfile && (
            <div className="flex-shrink-0 border-t border-crypto-border bg-crypto-card">
              <UserProfileSection
                isCollapsed={isCollapsed}
                userProfile={userProfile}
                userSubscription={userSubscription}
                isProfileDropdownOpen={isProfileDropdownOpen}
                setIsProfileDropdownOpen={setIsProfileDropdownOpen}
                handleProfileMenuClick={handleProfileMenuClick}
                theme={theme}
                setTheme={setTheme}
                i18n={i18n}
                isRTL={isRTL}
                t={t}
              />
            </div>
          )}
        </SidebarContent>
      </Sidebar>

      {/* Notifications Panel */}
      <NotificationsPanel
        isNotifOpen={isNotifOpen}
        setIsNotifOpen={setIsNotifOpen}
        notifications={notifications}
        i18n={i18n}
        t={t}
      />

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
}

// User Profile Section Component
const UserProfileSection = ({
  isCollapsed,
  userProfile,
  userSubscription,
  isProfileDropdownOpen,
  setIsProfileDropdownOpen,
  handleProfileMenuClick,
  theme,
  setTheme,
  i18n,
  isRTL,
  t
}: {
  isCollapsed: boolean;
  userProfile: any;
  userSubscription: UserSubscription | null;
  isProfileDropdownOpen: boolean;
  setIsProfileDropdownOpen: (open: boolean) => void;
  handleProfileMenuClick: (action: string) => void;
  theme: string | undefined;
  setTheme: (theme: string) => void;
  i18n: any;
  isRTL: boolean;
  t: any;
}) => {
  console.log("userSubscription", userSubscription);
  console.log("userProfile", userProfile);
  if (!isCollapsed) {
    return (
      <div className="mt-auto p-4">
        <DropdownMenu open={isProfileDropdownOpen} onOpenChange={setIsProfileDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="w-full flex items-center gap-3 py-8 px-2 bg-crypto-card/50 rounded-lg border border-crypto-border hover:bg-crypto-card/70 transition-all duration-200"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage 
                  src={userProfile.photo_url || userProfile.photoURL || undefined} 
                  alt={getUserDisplayName(userProfile)} 
                />
                <AvatarFallback className="bg-crypto-green/20 text-crypto-green border border-crypto-green/30">
                  {getUserInitials(userProfile.displayName, userProfile.email)}
                </AvatarFallback>
              </Avatar>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-medium text-crypto-text-primary truncate">
                  {getUserDisplayName(userProfile)}
                </p>
                <div className="flex items-center gap-2">
                  {userProfile?.role === 'admin' ? (
                    <p className="text-xs font-medium text-crypto-green">
                      Admin
                    </p>
                  ) : userProfile?.role === 'user' ? (
                    <>
                      <p className={`text-xs font-medium ${getSubscriptionStatusColor(userSubscription)}`}>
                        {getUserStatus(userSubscription)}
                      </p>
                      {userSubscription && (
                        <div className={`w-2 h-2 rounded-full ${
                          userSubscription.plan === 'free' || userSubscription.status === 'expired' 
                            ? 'bg-gray-400' 
                            : userSubscription.plan === 'monthly' 
                              ? 'bg-crypto-green' 
                              : 'bg-purple-500'
                        }`} />
                      )}
                    </>
                  ) : null}
                </div>
                {userProfile.email && (
                  <p className="text-xs text-crypto-text-secondary truncate">
                    {userProfile.email}
                  </p>
                )}
              </div>
              <MoreVertical className="w-4 h-4 text-crypto-text-secondary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align={isRTL ? "start" : "end"} 
            className={`w-56 bg-crypto-card border-crypto-border shadow-lg space-y-2 py-3 ${isRTL ? 'text-right' : 'text-left'}`}
          >                  
          <DropdownMenuItem 
            onClick={() => handleProfileMenuClick('account')}
            className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
          >
            {isRTL ? (
              <>
                {t('sidebar.myAccount')}
                <UserCircle className="w-5 h-5 mr-4" />
              </>
            ) : (
              <>
                <UserCircle className="w-5 h-5 mr-4" />
                {t('sidebar.myAccount')}
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleProfileMenuClick('subscription')}
            className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
          >
            {isRTL ? (
              <>
                {t('sidebar.mySubscription')}
                <CreditCard className="w-5 h-5 mr-4" />
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-4" />
                {t('sidebar.mySubscription')}
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleProfileMenuClick('community')}
            className={`text-crypto-text-secondary  hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
          >
            {isRTL ? (
              <>
                {t('sidebar.community')}
                <Users className="w-5 h-5 mr-4" />
              </>
            ) : (
              <>
                <Users className="w-5 h-5 mr-4" />
                {t('sidebar.community')}
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleProfileMenuClick('docs')}
            className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
          >
            {isRTL ? (
              <>
                {t('sidebar.docs')}
                <BookOpen className="w-5 h-5 mr-4" />
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5 mr-4" />
                {t('sidebar.docs')}
              </>
            )}
          </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-crypto-border" />
            
            <DropdownMenuItem 
              onClick={() => handleProfileMenuClick('theme')}
              className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer flex items-center justify-between text-base py-2 px-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span>{t('sidebar.theme')}</span>
              <div className={`flex items-center bg-crypto-bg rounded-full p-1 border border-crypto-border ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTheme('light');
                  }}
                  className={`p-1 rounded-full transition-all duration-200 ${
                    theme === 'light' 
                      ? 'bg-crypto-green text-white' 
                      : 'text-crypto-text-secondary hover:text-crypto-text-primary'
                  }`}
                >
                  <Sun className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTheme('dark');
                  }}
                  className={`p-1 rounded-full transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'bg-crypto-green text-white' 
                      : 'text-crypto-text-secondary hover:text-crypto-text-primary'
                  }`}
                >
                  <Moon className="w-3 h-3" />
                </button>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuSub>

              <DropdownMenuSubTrigger isRTL={isRTL ? true : false} className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 flex items-center text-base py-2 px-4 ${isRTL ? 'flex-row-reverse' : ''} ${isRTL ? '[&>svg]:rotate-180':'' }`}>
                <span>{t('sidebar.language')}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="bg-crypto-card border-crypto-border shadow-lg">
                <DropdownMenuItem 
                  onClick={() => handleProfileMenuClick('language-en')}
                  className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${
                    i18n.language === 'en' ? 'bg-crypto-green/10 text-crypto-green' : ''
                  }`}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => handleProfileMenuClick('language-ar')}
                  className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${
                    i18n.language === 'ar' ? 'bg-crypto-green/10 text-crypto-green' : ''
                  }`}
                >
                  العربية
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            
            <DropdownMenuSeparator className="bg-crypto-border" />
            
            <DropdownMenuItem 
              onClick={() => handleProfileMenuClick('logout')}
              className={`text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer text-base py-2 px-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
            >
              {isRTL ? (
                <>
                  {t('sidebar.logout')}
                  <LogOut className="w-5 h-5 text-red-500 mr-4" />
                </>
              ) : (
                <>
                  <LogOut className="w-5 h-5 text-red-500 mr-4" />
                  {t('sidebar.logout')}
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Collapsed state
  return (
    <div className="mt-auto p-2">
      <DropdownMenu open={isProfileDropdownOpen} onOpenChange={setIsProfileDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full flex items-center justify-center p-2 hover:bg-crypto-card/50 transition-colors"
            title="Profile Menu"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage 
                src={userProfile.photo_url || userProfile.photoURL || undefined} 
                alt={getUserDisplayName(userProfile)} 
              />
              <AvatarFallback className="bg-crypto-green/20 text-crypto-green border border-crypto-green/30 text-xs">
                {getUserInitials(userProfile.displayName, userProfile.email)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align={isRTL ? "start" : "end"} 
          className={`w-56 bg-crypto-card border-crypto-border shadow-lg space-y-1 ${isRTL ? 'text-right' : 'text-left'}`}
        >
          <DropdownMenuLabel className="text-crypto-text-primary font-semibold">
            {getUserDisplayName(userProfile)}
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-crypto-border" />
          
          <DropdownMenuItem 
            onClick={() => handleProfileMenuClick('account')}
            className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
          >
            {isRTL ? (
              <>
                {t('sidebar.myAccount')}
                <UserCircle className="w-5 h-5 ml-4" />
              </>
            ) : (
              <>
                <UserCircle className="w-5 h-5 mr-4" />
                {t('sidebar.myAccount')}
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleProfileMenuClick('subscription')}
            className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
          >
            {isRTL ? (
              <>
                {t('sidebar.mySubscription')}
                <CreditCard className="w-5 h-5 ml-4" />
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-4" />
                {t('sidebar.mySubscription')}
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleProfileMenuClick('community')}
            className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
          >
            {isRTL ? (
              <>
                {t('sidebar.community')}
                <Users className="w-5 h-5 ml-4" />
              </>
            ) : (
              <>
                <Users className="w-5 h-5 mr-4" />
                {t('sidebar.community')}
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => handleProfileMenuClick('docs')}
            className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
          >
            {isRTL ? (
              <>
                {t('sidebar.docs')}
                <BookOpen className="w-5 h-5 ml-4" />
              </>
            ) : (
              <>
                <BookOpen className="w-5 h-5 mr-4" />
                {t('sidebar.docs')}
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="bg-crypto-border" />
          
          <DropdownMenuItem 
            onClick={() => handleProfileMenuClick('theme')}
            className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer flex items-center justify-between text-base py-2 px-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <span>{t('sidebar.theme')}</span>
            <div className={`flex items-center bg-crypto-bg rounded-full p-1 border border-crypto-border ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme('light');
                }}
                className={`p-1 rounded-full transition-all duration-200 ${
                  theme === 'light' 
                    ? 'bg-crypto-green text-white' 
                    : 'text-crypto-text-secondary hover:text-crypto-text-primary'
                }`}
              >
                <Sun className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme('dark');
                }}
                className={`p-1 rounded-full transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'bg-crypto-green text-white' 
                    : 'text-crypto-text-secondary hover:text-crypto-text-primary'
                }`}
              >
                <Moon className="w-3 h-3" />
              </button>
            </div>
          </DropdownMenuItem>
          
          <DropdownMenuSub>
            <DropdownMenuSubTrigger isRTL={isRTL ? true : false}  className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer flex items-center text-base py-2 px-4 `}>
              <span>{t('sidebar.language')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-crypto-card border-crypto-border shadow-lg">
              <DropdownMenuItem 
                onClick={() => handleProfileMenuClick('language-en')}
                className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${
                  i18n.language === 'en' ? 'bg-crypto-green/10 text-crypto-green' : ''
                }`}
              >
                English
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleProfileMenuClick('language-ar')}
                className={`text-crypto-text-secondary hover:text-crypto-text-primary hover:bg-crypto-card/50 cursor-pointer text-base py-2 px-4 ${
                  i18n.language === 'ar' ? 'bg-crypto-green/10 text-crypto-green' : ''
                }`}
              >
                العربية
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator className="bg-crypto-border" />
          
          <DropdownMenuItem 
            onClick={() => handleProfileMenuClick('logout')}
            className={`text-red-500 hover:text-red-600 hover:bg-red-500/10 cursor-pointer text-base py-2 px-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
          >
            {isRTL ? (
              <>
                {t('sidebar.logout')}
                <LogOut className="w-5 h-5 text-red-500 ml-4" />
              </>
            ) : (
              <>
                <LogOut className="w-5 h-5 text-red-500 mr-4" />
                {t('sidebar.logout')}
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

// Notifications Panel Component
const NotificationsPanel = ({
  isNotifOpen,
  setIsNotifOpen,
  notifications,
  i18n,
  t
}: {
  isNotifOpen: boolean;
  setIsNotifOpen: (open: boolean) => void;
  notifications: any[];
  i18n: any;
  t: any;
}) => (
  <Sheet open={isNotifOpen} onOpenChange={setIsNotifOpen}>
    <SheetContent side={i18n.language === 'ar' ? "left" : "right"} className="w-[90vw] sm:max-w-md">
      <SheetHeader>
        <SheetTitle>{t('actions.notifications') || 'Notifications'}</SheetTitle>
      </SheetHeader>
      <div className="mt-4 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-sm text-crypto-text-secondary">{t('sidebar.noNewNotifications')}</div>
        ) : (
          notifications.map((notification) => (
            <div key={`${notification.signalId}-${notification.type}-${notification.timestamp}`} className="p-3 rounded-md border border-crypto-border bg-crypto-card/50">
              {notification.type === 'new_signal' ? (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {notification.direction === 'LONG' ? (
                      <div className="w-2 h-2 bg-crypto-green rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-crypto-red rounded-full"></div>
                    )}
                    <div className="text-sm font-medium text-crypto-text-primary">
                      {t('sidebar.newSignal')}: {notification.pair} {notification.direction}
                    </div>
                  </div>
                  <div className="text-xs text-crypto-text-secondary">
                    {notification.strategy && `{t('sidebar.strategy')}: ${notification.strategy}`}
                    {notification.timeframe && ` • {t('sidebar.timeframe')}: ${notification.timeframe}`}
                  </div>
                  <div className="text-xs text-crypto-yellow mt-1">
                    🤖 {t('sidebar.aiAnalysisStarting')}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-crypto-green rounded-full animate-pulse"></div>
                    <div className="text-sm font-medium text-crypto-text-primary">
                      {t('sidebar.aiAnalysisComplete')}: {notification.pair} {notification.direction}
                    </div>
                  </div>
                  <div className="text-xs text-crypto-text-secondary mb-1">
                    {notification.strategy && `{t('sidebar.strategy')}: ${notification.strategy}`}
                    {notification.timeframe && ` • {t('sidebar.timeframe')}: ${notification.timeframe}`}
                  </div>
                  {notification.qualityScore && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="text-xs font-medium text-crypto-green">
                        {t('sidebar.qualityScore')}: {notification.qualityScore}
                      </div>
                      <div className="text-xs text-crypto-text-secondary">
                        • {t('sidebar.readyToTrade')}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="text-xs text-crypto-text-secondary mt-2">
                {new Date(notification.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          ))
        )}
      </div>
    </SheetContent>
  </Sheet>
);