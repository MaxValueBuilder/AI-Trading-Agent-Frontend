import { TrendingUp, Settings, RotateCcw, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-6 border-b border-crypto-border">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-crypto-green to-crypto-green/80 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-background" />
        </div>
        <h1 className="text-xl font-bold text-crypto-text-primary">Crypto AI Agent</h1>
      </div>
      
      <nav className="flex items-center gap-8">
        <a href="#" className="text-crypto-green font-medium hover:text-crypto-green/80 transition-colors">
          Dashboard
        </a>
        <a href="#" className="text-crypto-text-secondary hover:text-crypto-text-primary transition-colors">
          History
        </a>
        <a href="#" className="text-crypto-text-secondary hover:text-crypto-text-primary transition-colors">
          How It Works
        </a>
      </nav>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-crypto-text-secondary hover:text-crypto-text-primary">
          <Settings className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-crypto-text-secondary hover:text-crypto-text-primary">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-crypto-text-secondary hover:text-crypto-text-primary">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="w-8 h-8 bg-crypto-card rounded-full flex items-center justify-center border border-crypto-border">
          <span className="text-sm font-medium text-crypto-text-primary">O</span>
        </div>
      </div>
    </header>
  );
};

export default Header;