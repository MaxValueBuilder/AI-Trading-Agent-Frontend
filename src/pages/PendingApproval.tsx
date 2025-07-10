import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Mail, Bot } from 'lucide-react';

export default function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md text-center shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="mx-auto w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center">
            <Clock className="h-8 w-8 text-warning" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Access Pending</h1>
            <p className="text-muted-foreground">
              Your access is pending admin approval.
            </p>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <p>
              Thank you for signing up! Our team is reviewing your application 
              and you'll receive access within 24-48 hours.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>We'll notify you via email once approved</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Bot className="h-5 w-5" />
              <span className="font-medium">Crypto AI Agent</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}