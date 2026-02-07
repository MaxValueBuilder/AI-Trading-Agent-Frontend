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

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  itemName?: string;
  itemType: 'feature' | 'pricing' | 'testimonial' | 'faq' | 'user' | 'signal' | 'documentation' | 'legal' | 'blog' | 'general';
}

export function DeleteConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  itemName, 
  itemType 
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  
  const getTitle = () => {
    switch (itemType) {
      case 'feature':
        return 'Delete Feature';
      case 'pricing':
        return 'Delete Pricing Plan';
      case 'testimonial':
        return 'Delete Testimonial';
      case 'faq':
        return 'Delete FAQ';
      case 'user':
        return 'Delete User';
      case 'signal':
        return 'Delete Signal';
      case 'documentation':
        return 'Delete Documentation Section';
      case 'legal':
        return 'Delete Legal Page';
      case 'blog':
        return 'Delete Blog Post';
      default:
        return 'Confirm Deletion';
    }
  };

  const getMessage = () => {
    const item = itemName ? `"${itemName}"` : 'this item';
    
    switch (itemType) {
      case 'feature':
        return `Are you sure you want to delete the feature ${item}? This action cannot be undone.`;
      case 'pricing':
        return `Are you sure you want to delete the pricing plan ${item}? This action cannot be undone.`;
      case 'testimonial':
        return `Are you sure you want to delete the testimonial ${item}? This action cannot be undone.`;
      case 'faq':
        return `Are you sure you want to delete the FAQ ${item}? This action cannot be undone.`;
      case 'user':
        return `Are you sure you want to delete the user ${item}? This action cannot be undone.`;
      case 'signal':
        return `Are you sure you want to delete the signal ${item}? This action cannot be undone.`;
      case 'documentation':
        return `Are you sure you want to delete the documentation section ${item}? This action cannot be undone.`;
      case 'legal':
        return `Are you sure you want to delete the legal page ${item}? This action cannot be undone.`;
      case 'blog':
        return `Are you sure you want to delete the blog post ${item}? This action cannot be undone.`;
      default:
        return `Are you sure you want to delete ${item}? This action cannot be undone.`;
    }
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={`${isRTL ? 'text-right' : 'text-left'}`}>
        <AlertDialogHeader className={isRTL ? 'text-right' : 'text-left'}>
          <AlertDialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {getTitle()}
          </AlertDialogTitle>
          <AlertDialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {getMessage()}
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
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

