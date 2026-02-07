import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useRTL } from "@/hooks/useRTL";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const { t } = useTranslation();
  const { isRTL } = useRTL();
  const { signIn, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signIn(email, password);
      toast.success("Successfully signed in!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    
    try {
      await signInWithGoogle();
      toast.success("Successfully signed in with Google!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Logo - Top Left */}
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img 
          src="/images/logo.png" 
          alt="Bitiq.ai Logo" 
          className="w-10 h-10"
        />
        <span className="text-2xl font-bold bg-gradient-to-r from-crypto-green to-emerald-400 bg-clip-text text-transparent">
          Bitiq.ai
        </span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className={`text-2xl font-bold text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('auth.welcome_back')}
          </CardTitle>
          <CardDescription className={`text-center ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('auth.sign_in_description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className={isRTL ? 'text-right' : 'text-left'}>{t('auth.email')}</Label>
              <div className="relative">
                <Mail className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  id="email"
                  placeholder={t('auth.email_placeholder')}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${isRTL ? 'pr-12 text-right' : 'pl-12 text-left'}`}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className={isRTL ? 'text-right' : 'text-left'}>{t('auth.password')}</Label>
              <div className="relative">
                <Lock className={`absolute top-3 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                <Input
                  id="password"
                  placeholder={t('auth.password_placeholder')}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${isRTL ? 'pr-12 pl-12 text-right' : 'pl-12 pr-12 text-left'}`}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-3 h-4 w-4 text-muted-foreground hover:text-foreground ${isRTL ? 'left-3' : 'right-3'}`}
                  disabled={loading}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className={`flex items-center ${isRTL ? 'justify-end' : 'justify-between'}`}>
              <Link 
                to="/forgot-password" 
                className={`text-sm text-primary hover:underline ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {t('auth.forgot_password')}
              </Link>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : t('auth.sign_in')}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {t('auth.or_continue_with')}
              </span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleGoogleAuth}
            disabled={loading}
            type="button"
          >
            <svg className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "Signing in..." : t('auth.continue_with_google')}
          </Button>

          <div className={`text-center text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-muted-foreground">
              {t('auth.no_account')}{" "}
            </span>
            <Link to="/signup" className="text-primary hover:underline">
              {t('auth.sign_up')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;