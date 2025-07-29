import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { closeTrade } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface CloseTradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  signalId: string;
  asset: string;
  onTradeClosed: () => void;
}

export function CloseTradeModal({ 
  isOpen, 
  onClose, 
  signalId, 
  asset, 
  onTradeClosed 
}: CloseTradeModalProps) {
  const [pnl, setPnl] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pnl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a P&L value",
        variant: "destructive",
      });
      return;
    }

    const pnlValue = parseFloat(pnl);
    if (isNaN(pnlValue)) {
      toast({
        title: "Error",
        description: "Please enter a valid number for P&L",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await closeTrade(signalId, pnlValue, notes.trim() || undefined);
      toast({
        title: "Success",
        description: `Trade closed successfully with P&L: $${pnlValue.toFixed(2)}`,
      });
      onTradeClosed();
      handleClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to close trade",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPnl('');
    setNotes('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Close Trade</DialogTitle>
          <DialogDescription>
            Enter the final P&L for your {asset} trade. This will mark the trade as completed.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pnl" className="text-right">
                P&L ($)
              </Label>
              <Input
                id="pnl"
                type="number"
                step="0.01"
                placeholder="150.00 or -50.00"
                value={pnl}
                onChange={(e) => setPnl(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Optional notes about the trade..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="col-span-3"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Closing...' : 'Close Trade'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}