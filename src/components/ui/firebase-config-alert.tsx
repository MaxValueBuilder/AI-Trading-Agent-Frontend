import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export function FirebaseConfigAlert() {
  return (
    <Alert className="mb-4 border-orange-500/50 bg-orange-500/10">
      <AlertTriangle className="h-4 w-4 text-orange-500" />
      <AlertDescription className="text-sm">
        <strong>Firebase Configuration Required:</strong> Please update your Firebase config in <code className="bg-muted px-1 rounded text-xs">src/lib/firebase.ts</code> with your project credentials.
      </AlertDescription>
    </Alert>
  );
}