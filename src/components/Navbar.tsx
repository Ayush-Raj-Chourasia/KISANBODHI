import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Sprout, LogOut, Language } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center">
            <Sprout className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl hidden sm:inline">KISANBODHI</span>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Language Selector */}
          <Select value={i18n.language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
              <SelectItem value="or">ଓଡିଆ</SelectItem>
            </SelectContent>
          </Select>

          {/* User Info */}
          <div className="text-sm text-muted-foreground hidden md:block">
            <p className="font-medium text-foreground">{user?.name}</p>
            <p className="text-xs">{user?.email}</p>
          </div>

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Exit</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
