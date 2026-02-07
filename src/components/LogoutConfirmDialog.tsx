import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({ open, onOpenChange, onConfirm }: LogoutConfirmDialogProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`${isRTL ? 'text-right' : 'text-left'}`}>
        <AlertDialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <AlertDialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {t('auth.confirmLogout', 'Confirm Logout')}
          </AlertDialogTitle>
          <AlertDialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('auth.logoutMessage', 'Are you sure you want to logout? You will need to sign in again to access your account.')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className={`${isRTL ? 'flex-row-reverse' : ''}`}>
          <AlertDialogCancel className={isRTL ? 'mr-2' : ''}>
            {t('auth.cancel', 'Cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {t('auth.logout', 'Logout')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}