import { useState, useEffect, useRef } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  User, 
  CreditCard,
  Shield,
  Mail,
  Calendar,
  TrendingUp,
  CheckCircle,
  Edit,
  Send,
  Users,
  Bot,
  Lock,
  X,
  Camera,
  Upload,
  Loader2
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";
import { useAuth } from "@/contexts/AuthContext";
import { userInvitationApiService } from "@/services/userInvitationApi";
import { apiService } from "@/services/api";
import { auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "firebase/auth";
import { uploadProfilePhoto, compressImage } from "@/lib/supabase";
import { toast } from "sonner";

const Account = () => {
  const { t, i18n } = useTranslation();
  const { isRTL } = useRTL();
  const { userProfile, refreshUserProfile } = useAuth();
  
  // State for personal information
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user display name (same logic as AppSidebar)
  const getUserDisplayName = () => {
    if (userProfile?.displayName) {
      return userProfile.displayName;
    }
    if (userProfile?.email) {
      return userProfile.email.split('@')[0];
    }
    return 'User';
  };

  // Get user initials for avatar fallback (same logic as AppSidebar)
  const getUserInitials = (displayName: string | null, email: string | null) => {
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
  
  // State for invitation feature
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);
  const [invitationLink, setInvitationLink] = useState("");
  const [showInvitationLinkDialog, setShowInvitationLinkDialog] = useState(false);
  
  // State for password change
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // Check if user signed up with email (not Google)
  // More robust check using Firebase auth provider
  const isEmailUser = auth.currentUser?.providerData?.some(
    provider => provider.providerId === 'password'
  ) || false;

  // Initialize display name from userProfile
  useEffect(() => {
    if (userProfile?.displayName) {
      setDisplayName(userProfile.displayName);
    }
  }, [userProfile?.displayName]);

  // Ensure language is properly loaded on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      toast.error(t('account.messages.displayNameRequired') || 'Display name is required');
      return;
    }

    setIsSavingProfile(true);
    try {
      // Update profile via API
      const updateData: { display_name: string; photo_url?: string } = {
        display_name: displayName.trim(),
      };
      
      // Include photo URL if it was changed
      if (photoUrl) {
        updateData.photo_url = photoUrl;
      }
      
      await apiService.updateUserProfile(updateData);
      
      // Refresh user profile to update UI everywhere
      await refreshUserProfile();
      
      toast.success(t('account.messages.profileUpdated'), {
        description: t('account.messages.profileUpdatedDesc'),
      });
      setIsEditing(false);
      setPhotoUrl(null); // Clear local photo state after save
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || t('account.messages.profileUpdateFailed') || 'Failed to update profile');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      // Compress image before upload
      const compressedFile = await compressImage(file, 800, 800, 0.8);
      
      // Upload to Supabase Storage
      const user = auth.currentUser;
      if (!user) throw new Error('No user found');
      
      const publicUrl = await uploadProfilePhoto(compressedFile, user.uid);
      
      // Save to backend immediately
      await apiService.updateUserProfile({ photo_url: publicUrl });
      
      // Refresh user profile to update UI everywhere
      await refreshUserProfile();
      
      toast.success(t('account.messages.photoUploaded') || 'Profile photo updated successfully!');
    } catch (error: any) {
      console.error('Failed to upload photo:', error);
      toast.error(error.message || t('account.messages.photoUploadFailed') || 'Failed to upload photo');
    } finally {
      setIsUploadingPhoto(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleInviteUser = () => {
    setInviteEmail("");
    setShowInviteDialog(true);
  };

  const confirmInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error(t('account.messages.enterEmail'));
      return;
    }

    setSendingInvite(true);
    try {
      // Use user invitation service instead of admin service
      const result = await userInvitationApiService.createInvitation(inviteEmail, 3);
      
      if (result.success) {
        toast.success(t('account.messages.invitationCreated'));
        if (result.email_sent) {
          toast.success(t('account.messages.invitationEmailSent', { email: inviteEmail }));
        } else {
          toast.warning(t('account.messages.emailFailed'));
          setInvitationLink(result.invitation_link);
          setShowInvitationLinkDialog(true);
        }
      } else {
        toast.error(t('account.messages.invitationFailed'));
      }
      
      setShowInviteDialog(false);
    } catch (error: any) {
      // Handle different error types
      let errorMessage = t('account.messages.invitationFailed');
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
    } finally {
      setSendingInvite(false);
    }
  };

  const copyInvitationLink = () => {
    navigator.clipboard.writeText(invitationLink);
    toast.success(t('account.messages.linkCopied'));
  };

  const handlePasswordChange = async () => {
    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t('account.messages.allFieldsRequired') || 'All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t('account.messages.passwordsDontMatch'));
      return;
    }

    if (newPassword.length < 6) {
      toast.error(t('account.messages.passwordTooShort'));
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(t('account.messages.passwordSameAsOld') || 'New password must be different from current password');
      return;
    }

    setChangingPassword(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('No user found');
      }

      // Step 1: Re-authenticate user (Firebase security requirement)
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Step 2: Update password in Firebase
      await updatePassword(user, newPassword);

      // Step 3: Log password change event in backend (optional but recommended for audit)
      try {
        await apiService.logPasswordChange();
      } catch (logError) {
        console.warn('Failed to log password change:', logError);
        // Non-fatal, continue
      }

      // Step 4: Success
      toast.success(t('account.messages.passwordChanged'));
      setShowPasswordDialog(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      console.error('Password change error:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'auth/wrong-password') {
        toast.error(t('account.messages.wrongPassword') || 'Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        toast.error(t('account.messages.weakPassword') || 'Password is too weak');
      } else if (error.code === 'auth/requires-recent-login') {
        toast.error(t('account.messages.requiresRecentLogin') || 'Please log out and log in again before changing password');
      } else {
        toast.error(error.message || t('account.messages.passwordChangeFailed'));
      }
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <SidebarProvider key={`account-${i18n.language}`}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <header className={`h-14 md:h-16 flex items-center border-b border-crypto-border px-4 md:px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <SidebarTrigger className={isRTL ? 'ml-2 md:ml-4' : 'mr-2 md:mr-4'} />
            <div className="w-2 md:w-4" /> {/* Add space between SidebarTrigger and the rest */}
            <div className={`flex items-center gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <User className="w-5 h-5 md:w-6 md:h-6 text-crypto-green" />
              <h1 className="text-base md:text-xl font-bold text-crypto-text-primary">{t('account.title')}</h1>
            </div>
          </header>
          
          <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-3 space-y-4 md:space-y-6">
                {/* Invite Friends Section */}
                <Card className="bg-crypto-card border-crypto-border shadow-sm">
                  <CardHeader className="pb-3 md:pb-4 p-4 md:p-6">
                    <CardTitle className={`text-base md:text-lg font-semibold text-crypto-text-primary flex items-center gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-crypto-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-crypto-green" />
                      </div>
                      <span className="break-words">{t('account.inviteFriends.title')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 md:p-6 md:pt-0">
                    <p className="text-xs md:text-sm text-crypto-text-secondary mb-3 md:mb-4 leading-relaxed">
                      {t('account.inviteFriends.description')}
                    </p>
                    
                    <div className="space-y-1.5 md:space-y-2 mb-4 md:mb-6 text-xs md:text-sm text-crypto-text-secondary">
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-1.5 h-1.5 bg-crypto-green rounded-full flex-shrink-0"></div>
                        <span className="break-words">{t('account.inviteFriends.benefit1')}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-1.5 h-1.5 bg-crypto-green rounded-full flex-shrink-0"></div>
                        <span className="break-words">{t('account.inviteFriends.benefit2')}</span>
                      </div>                  
                    </div>
                    
                    <Button 
                      onClick={handleInviteUser}
                      className="w-full bg-crypto-green hover:bg-crypto-green/90 text-white h-10 md:h-11 font-medium text-sm md:text-base"
                    >
                      <Send className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('account.inviteFriends.button')}
                    </Button>
                  </CardContent>
                </Card>

                {/* Telegram Account Section */}
                <Card className="bg-crypto-card border-crypto-border shadow-sm">
                  <CardHeader className="pb-3 md:pb-4 p-4 md:p-6">
                    <CardTitle className={`text-base md:text-lg font-semibold text-crypto-text-primary flex items-center gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-crypto-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Bot className="w-3.5 h-3.5 md:w-4 md:h-4 text-crypto-green" />
                      </div>
                      <span className="break-words">{t('account.telegramAccount.title')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 md:p-6 md:pt-0">
                    <p className="text-xs md:text-sm text-crypto-text-secondary mb-4 md:mb-6 leading-relaxed break-words">
                      {t('account.telegramAccount.description')} <span className="text-crypto-green font-semibold">{t('account.telegramAccount.botName')}</span>.
                    </p>
                    <Button className="w-full md:w-auto bg-crypto-card border border-crypto-border hover:bg-crypto-green/10 hover:text-crypto-green hover:border-crypto-green text-crypto-text-primary h-9 md:h-10 font-medium text-sm md:text-base">
                      <Send className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('account.telegramAccount.button')}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Side Content */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                {/* Personal Information */}
                <Card className="bg-crypto-card border-crypto-border shadow-sm">
                  <CardHeader className="pb-3 md:pb-4 p-4 md:p-6">
                    <CardTitle className={`text-base md:text-lg font-semibold text-crypto-text-primary flex items-center gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-7 h-7 md:w-8 md:h-8 bg-crypto-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-crypto-green" />
                      </div>
                      <span className="break-words">{t('account.personalInfo.title')}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 p-4 md:p-6 md:pt-0 space-y-4 md:space-y-5">
                    {/* User Avatar and Display Name */}
                    <div className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-crypto-bg rounded-lg border border-crypto-border ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="relative flex-shrink-0">
                        {photoUrl || userProfile?.photo_url || userProfile?.photoURL ? (
                          <img 
                            src={photoUrl || userProfile?.photo_url || userProfile?.photoURL || ''} 
                            alt={getUserDisplayName()}
                            className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-crypto-green/30"
                          />
                        ) : (
                          <div className="w-14 h-14 md:w-16 md:h-16 bg-crypto-green/20 rounded-full flex items-center justify-center border-2 border-crypto-green/30">
                            <span className="text-lg md:text-xl font-semibold text-crypto-green">
                              {getUserInitials(userProfile?.displayName, userProfile?.email)}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={handlePhotoClick}
                          disabled={isUploadingPhoto}
                          className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-7 h-7 md:w-8 md:h-8 bg-crypto-green hover:bg-crypto-green/90 rounded-full flex items-center justify-center border-2 border-crypto-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title={t('account.personalInfo.changePhoto') || 'Change photo'}
                        >
                          {isUploadingPhoto ? (
                            <Loader2 className="w-3 h-3 md:w-4 md:h-4 text-white animate-spin" />
                          ) : (
                            <Camera className="w-3 h-3 md:w-4 md:h-4 text-white" />
                          )}
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base md:text-lg font-semibold text-crypto-text-primary truncate">
                          {getUserDisplayName()}
                        </h3>
                        <p className="text-xs md:text-sm text-crypto-text-secondary truncate">
                          {userProfile?.email}
                        </p>
                        {isUploadingPhoto && (
                          <p className="text-xs text-crypto-green mt-1">
                            {t('account.personalInfo.uploadingPhoto') || 'Uploading photo...'}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label className="text-xs md:text-sm font-medium text-crypto-text-primary">{t('account.personalInfo.displayName')}</Label>
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Input
                          value={isEditing ? displayName : (displayName || getUserDisplayName())}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="bg-crypto-bg border-crypto-border h-9 md:h-10 text-sm md:text-base"
                          disabled={!isEditing}
                          placeholder={t('account.personalInfo.displayNamePlaceholder')}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 md:space-y-2">
                      <Label className="text-xs md:text-sm font-medium text-crypto-text-primary flex items-center gap-1.5 md:gap-2">
                        {t('account.personalInfo.email')}
                        <Lock className="w-2.5 h-2.5 md:w-3 md:h-3 text-crypto-text-secondary" />
                      </Label>
                      <div className="relative">
                        <Input
                          value={userProfile?.email || ''}
                          type="email"
                          className="bg-crypto-bg/50 border-crypto-border h-9 md:h-10 text-sm md:text-base text-crypto-text-secondary cursor-not-allowed pr-24 md:pr-32"
                          disabled={true}
                          readOnly
                        />
                        <div className="absolute inset-y-0 right-2 md:right-3 flex items-center pointer-events-none">
                          <span className="text-[10px] md:text-xs text-crypto-text-secondary whitespace-nowrap">
                            {t('account.personalInfo.cannotChange') || 'Cannot be changed'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex gap-2 md:gap-3 pt-1 md:pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      {isEditing ? (
                        <>
                          <Button 
                            onClick={handleSaveProfile}
                            disabled={isSavingProfile || !displayName.trim()}
                            className="bg-crypto-green hover:bg-crypto-green/90 text-white flex-1 h-9 md:h-10 font-medium text-sm md:text-base"
                          >
                            {isSavingProfile ? t('account.personalInfo.saving') || 'Saving...' : t('account.personalInfo.saveChanges')}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setIsEditing(false);
                              setDisplayName(userProfile?.displayName || getUserDisplayName());
                            }}
                            disabled={isSavingProfile}
                            className="border-crypto-border flex-1 h-9 md:h-10 font-medium text-sm md:text-base"
                          >
                            {t('account.personalInfo.cancel')}
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(true)}
                          className="border-crypto-border flex-1 h-9 md:h-10 font-medium text-sm md:text-base"
                        >
                          <Edit className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                          {t('account.personalInfo.edit')}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Change Password - Only for email users */}
                {isEmailUser && (
                  <Card className="bg-crypto-card border-crypto-border shadow-sm">
                    <CardHeader className="pb-3 md:pb-4 p-4 md:p-6">
                      <CardTitle className={`text-base md:text-lg font-semibold text-crypto-text-primary flex items-center gap-2 md:gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <div className="w-7 h-7 md:w-8 md:h-8 bg-crypto-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Lock className="w-3.5 h-3.5 md:w-4 md:h-4 text-crypto-green" />
                        </div>
                        <span className="break-words">{t('account.changePassword.title')}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 p-4 md:p-6 md:pt-0">
                      <p className="text-xs md:text-sm text-crypto-text-secondary mb-3 md:mb-4 break-words">
                        {t('account.changePassword.description') || 'Update your password to keep your account secure'}
                      </p>
                      <Button 
                        onClick={() => setShowPasswordDialog(true)}
                        className="w-full bg-crypto-card border border-crypto-border hover:bg-crypto-green/10 hover:text-crypto-green hover:border-crypto-green text-crypto-text-primary h-9 md:h-10 font-medium text-sm md:text-base"
                      >
                        <Lock className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                        {t('account.changePassword.button')}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent className={`${isRTL ? 'text-right' : 'text-left'} max-w-[95vw] sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">{t('account.dialogs.inviteFriend.title')}</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              {t('account.dialogs.inviteFriend.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 md:space-y-4 py-3 md:py-4">
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-xs md:text-sm">{t('account.dialogs.inviteFriend.emailLabel')}</Label>
              <Input
                type="email"
                placeholder={t('account.dialogs.inviteFriend.emailPlaceholder')}
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="h-9 md:h-10 text-sm md:text-base"
              />
            </div>
            <div className="text-xs md:text-sm text-crypto-text-secondary">
              <p>{t('account.dialogs.inviteFriend.emailDescription')}</p>
            </div>
          </div>
          <DialogFooter className={`${isRTL ? 'flex-row-reverse' : ''} gap-2 flex-col sm:flex-row`}>
            <Button 
              variant="outline" 
              onClick={() => setShowInviteDialog(false)}
              disabled={sendingInvite}
              className="h-9 md:h-10 text-sm md:text-base w-full sm:w-auto"
            >
              {t('account.dialogs.inviteFriend.cancel')}
            </Button>
            <Button 
              onClick={confirmInvite} 
              disabled={!inviteEmail.trim() || sendingInvite}
              className="bg-crypto-green hover:bg-crypto-green/90 h-9 md:h-10 text-sm md:text-base w-full sm:w-auto"
            >
              {sendingInvite ? t('account.dialogs.inviteFriend.sending') : t('account.dialogs.inviteFriend.sendInvitation')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invitation Link Dialog */}
      <Dialog open={showInvitationLinkDialog} onOpenChange={setShowInvitationLinkDialog}>
        <DialogContent className={`${isRTL ? 'text-right' : 'text-left'} max-w-[95vw] sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">{t('account.dialogs.invitationLink.title')}</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              {t('account.dialogs.invitationLink.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 md:space-y-4 py-3 md:py-4">
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-xs md:text-sm">{t('account.dialogs.invitationLink.linkLabel')}</Label>
              <div className={`flex flex-col sm:flex-row gap-2 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                <Input
                  readOnly
                  value={invitationLink}
                  className="font-mono text-xs md:text-sm h-9 md:h-10 flex-1"
                />
                <Button onClick={copyInvitationLink} variant="outline" className="h-9 md:h-10 text-sm md:text-base w-full sm:w-auto">
                  {t('account.dialogs.invitationLink.copy')}
                </Button>
              </div>
              <p className="text-xs md:text-sm text-yellow-500 break-words">
                {t('account.dialogs.invitationLink.warning')}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowInvitationLinkDialog(false)} className="h-9 md:h-10 text-sm md:text-base w-full sm:w-auto">
              {t('account.dialogs.invitationLink.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className={`${isRTL ? 'text-right' : 'text-left'} max-w-[95vw] sm:max-w-md`}>
          <DialogHeader>
            <DialogTitle className="text-base md:text-lg">{t('account.dialogs.changePassword.title')}</DialogTitle>
            <DialogDescription className="text-xs md:text-sm">
              {t('account.dialogs.changePassword.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 md:space-y-4 py-3 md:py-4">
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-xs md:text-sm">{t('account.dialogs.changePassword.currentPassword')}</Label>
              <Input
                type="password"
                placeholder={t('account.dialogs.changePassword.currentPasswordPlaceholder')}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-9 md:h-10 text-sm md:text-base"
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-xs md:text-sm">{t('account.dialogs.changePassword.newPassword')}</Label>
              <Input
                type="password"
                placeholder={t('account.dialogs.changePassword.newPasswordPlaceholder')}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-9 md:h-10 text-sm md:text-base"
              />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <Label className="text-xs md:text-sm">{t('account.dialogs.changePassword.confirmPassword')}</Label>
              <Input
                type="password"
                placeholder={t('account.dialogs.changePassword.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-9 md:h-10 text-sm md:text-base"
              />
            </div>
          </div>
          <DialogFooter className={`${isRTL ? 'flex-row-reverse' : ''} gap-2 flex-col sm:flex-row`}>
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordDialog(false)}
              disabled={changingPassword}
              className="h-9 md:h-10 text-sm md:text-base w-full sm:w-auto"
            >
              {t('account.dialogs.changePassword.cancel')}
            </Button>
            <Button 
              onClick={handlePasswordChange} 
              disabled={!currentPassword || !newPassword || !confirmPassword || changingPassword}
              className="bg-crypto-green hover:bg-crypto-green/90 h-9 md:h-10 text-sm md:text-base w-full sm:w-auto"
            >
              {changingPassword ? t('account.dialogs.changePassword.changing') : t('account.dialogs.changePassword.changePassword')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Account;
