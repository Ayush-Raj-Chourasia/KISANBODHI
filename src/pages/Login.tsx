import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Sprout, AlertCircle, Phone, Mail, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const ODISHA_DISTRICTS = [
  "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh",
  "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur",
  "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar",
  "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh",
  "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"
];

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  // Login mode
  const [mode, setMode] = useState<'phone' | 'email'>('phone');

  // Phone OTP flow
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Kendrapara');

  // Email flow
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch {
      // Fallback for demo
      setOtpSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name, district })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch {
      // Fallback mock auth
      const mockUser = { id:'farmer-demo', name: name || `Farmer ${phone.slice(-4)}`, phone, email:'', district, language:'en',cropType:'paddy',farmSize:2 };
      localStorage.setItem('token', btoa(JSON.stringify({ userId: mockUser.id, iat: Date.now() })));
      localStorage.setItem('user', JSON.stringify(mockUser));
      window.location.href = '/dashboard';
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-xl backdrop-blur-sm bg-background/80">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-3xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Sprout className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-1">{t('app_name')}</h1>
          <p className="text-center text-muted-foreground mb-6">Farmer Login — किसान लॉगिन</p>

          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg">
            <button
              onClick={() => { setMode('phone'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${
                mode === 'phone' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Phone className="w-4 h-4" /> Mobile OTP
            </button>
            <button
              onClick={() => { setMode('email'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-all ${
                mode === 'email' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Mail className="w-4 h-4" /> Email
            </button>
          </div>

          {/* Error */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-2">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}

          {/* ─── PHONE OTP FLOW ─── */}
          {mode === 'phone' && (
            <>
              {!otpSent ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Mobile Number (मोबाइल नंबर)</Label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 bg-muted rounded-md text-sm font-semibold border">+91</span>
                      <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        className="h-11 text-lg tracking-widest"
                        maxLength={10}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Your Name (आपका नाम)</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rajesh Kumar" className="h-11" />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> District (जिला)</Label>
                    <select value={district} onChange={(e) => setDistrict(e.target.value)}
                      className="w-full h-11 border border-border rounded-md px-3 bg-background text-foreground">
                      {ODISHA_DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <Button onClick={handleSendOTP} disabled={isLoading} className="w-full h-11 text-base font-semibold gap-2">
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <>Send OTP <ArrowRight className="w-4 h-4" /></>}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="text-center mb-2">
                    <p className="text-sm text-muted-foreground">OTP sent to <span className="font-bold text-foreground">+91 {phone}</span></p>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-primary hover:underline">Change number</button>
                  </div>

                  <div className="space-y-2">
                    <Label>Enter OTP (6-digit code)</Label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      className="h-12 text-2xl tracking-[0.5em] text-center font-bold"
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  <Button type="submit" disabled={isLoading || otp.length < 6} className="w-full h-11 text-base font-semibold">
                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : 'Verify & Login'}
                  </Button>
                </form>
              )}

              {/* Demo hint */}
              <div className="mt-6 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Demo login:</p>
                <p className="text-xs font-mono">Phone: 9876543210 · OTP: 123456</p>
              </div>
            </>
          )}

          {/* ─── EMAIL FLOW ─── */}
          {mode === 'email' && (
            <>
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="farmer@example.com" required className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required className="h-11" />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-11 text-base font-semibold">
                  {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</> : 'Login'}
                </Button>
              </form>
              <div className="mt-6 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Demo credentials:</p>
                <p className="text-xs font-mono">farmer@example.com / password</p>
              </div>
            </>
          )}

          {/* Signup link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {t('auth.signup_prompt')}{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">{t('auth.signup')}</Link>
          </p>
        </Card>
      </motion.div>
    </div>
  );
}
