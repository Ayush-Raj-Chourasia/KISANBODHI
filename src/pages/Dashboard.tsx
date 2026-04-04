import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import {
  Cloud, AlertTriangle, TrendingDown, CheckCircle, Send, Loader2,
  Shield, Sprout, MapPin, Thermometer, Droplets, Wind, Eye,
  Megaphone, Zap, Users, BarChart3, FileText, Activity, Brain,
  Search, Bug, ShieldCheck, CloudRain, Star
} from 'lucide-react';
import { AgentResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Quick action prompts for low-literacy farmers
const QUICK_PROMPTS = [
  { icon: CloudRain, label: "Today's Weather Risk", query: "What is the weather risk for my paddy crop today in my district?" },
  { icon: ShieldCheck, label: "Check Insurance", query: "Check my PMFBY insurance status and eligible claims" },
  { icon: Bug, label: "Report Pest Attack", query: "Pest attack detected on paddy crop, what should I do?" },
  { icon: BarChart3, label: "Market Prices", query: "What are current paddy and rice market prices on eNAM?" },
];

// Agent status indicators
const AGENTS = [
  { name: "Sentinel", icon: Search, color: "bg-blue-500", desc: "Weather & Market" },
  { name: "Analyst", icon: BarChart3, color: "bg-amber-500", desc: "Risk Assessment" },
  { name: "Advisor", icon: Users, color: "bg-green-500", desc: "Farmer Guidance" },
  { name: "Policy", icon: FileText, color: "bg-emerald-600", desc: "SDG Mapping" },
  { name: "Orchestrator", icon: Brain, color: "bg-indigo-500", desc: "Coordination" },
];

interface WeatherSnapshot {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  condition: string;
}

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [alertLevel, setAlertLevel] = useState<'clear' | 'warning' | 'critical'>('clear');
  const [alertMessage, setAlertMessage] = useState('');
  const [agentStatuses, setAgentStatuses] = useState<Record<string, boolean>>({});
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Fetch live data on mount
  useEffect(() => {
    fetchLiveStatus();
  }, []);

  const fetchLiveStatus = async () => {
    try {
      // Fetch health to confirm agents are online
      const healthRes = await fetch(`${API_URL}/api/health`);
      if (healthRes.ok) {
        const health = await healthRes.json();
        const statuses: Record<string, boolean> = {};
        (health.agents || []).forEach((a: string) => {
          const name = a.split(' - ')[0];
          statuses[name] = true;
        });
        setAgentStatuses(statuses);
      }

      // Run a quick background advisory to get weather + alerts
      const district = user?.district || 'Kendrapara';
      const advisoryRes = await fetch(`${API_URL}/api/advisory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user?.id || 'farmer-001',
          name: user?.name || 'Farmer',
          email: user?.email || '',
          phone: '9876543210',
          district,
          state: 'Odisha',
          cropType: 'paddy',
          farmSize: 5,
          latitude: 20.5,
          longitude: 86.7,
          language: user?.language || 'en'
        })
      });

      if (advisoryRes.ok) {
        const advisory = await advisoryRes.json();
        const sentinelData = advisory?.data?.sentinelReport;
        const wd = sentinelData?.weatherData;
        const alerts = sentinelData?.alerts || [];

        if (wd) {
          setWeather({
            temperature: wd.temperature,
            humidity: wd.humidity,
            windSpeed: wd.windSpeed,
            rainfall: wd.rainfall,
            condition: wd.rainfall > 10 ? 'Rainy' : wd.temperature > 35 ? 'Hot' : 'Clear'
          });
        }

        // Set alert banner based on live data
        const criticalAlert = alerts.find((a: any) => a.severity === 'critical' || a.severity === 'high');
        if (criticalAlert) {
          setAlertLevel(criticalAlert.severity === 'critical' ? 'critical' : 'warning');
          setAlertMessage(criticalAlert.title || criticalAlert.description || 'Weather advisory active for your district');
        } else if (wd && (wd.rainfall > 50 || wd.windSpeed > 40)) {
          setAlertLevel('warning');
          setAlertMessage(`Heavy conditions detected: ${wd.rainfall}mm rainfall, ${wd.windSpeed} km/h winds`);
        } else {
          setAlertLevel('clear');
          setAlertMessage(`Systems nominal. Weather is ${wd?.temperature ? `${Math.round(wd.temperature)}°C` : 'clear'} for your Paddy crop today.`);
        }

        // Set broadcast from news
        const newsEvents = sentinelData?.newsEvents || [];
        if (newsEvents.length > 0) {
          setBroadcastMessage(newsEvents[0].title + ' — ' + (newsEvents[0].content || '').slice(0, 120));
        } else {
          setBroadcastMessage('State agriculture department: Monitor weather advisories regularly. PMFBY enrollment window open for Kharif 2026.');
        }
      }
    } catch (error) {
      console.error('Live status fetch error:', error);
      setAlertLevel('clear');
      setAlertMessage('Backend connecting... Weather data loading.');
      setBroadcastMessage('State agriculture department: PMFBY enrollment window open for Kharif 2026. Visit your nearest CSC.');
    }
  };

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await executeQuery(query);
  };

  const executeQuery = async (q: string) => {
    setIsLoading(true);
    setQuery(q);
    try {
      const res = await fetch(`${API_URL}/api/agent/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ query: q, context: { district: user?.district || 'Kendrapara', state: 'Odisha' } })
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data);
      }
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* ─── HERO ───────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">
            {t('dashboard.welcome')}, {user?.name}!
          </h1>
          <p className="text-muted-foreground">{t('app_tagline')}</p>
        </motion.div>

        {/* ─── 1. PROACTIVE ALERT BANNER ───────────────── */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className={`rounded-2xl px-5 py-3.5 mb-6 flex items-center gap-3 border-2 transition-all ${
            alertLevel === 'critical'
              ? 'bg-red-50 border-red-300 text-red-800 dark:bg-red-950/50 dark:border-red-700 dark:text-red-200'
              : alertLevel === 'warning'
              ? 'bg-amber-50 border-amber-300 text-amber-800 dark:bg-amber-950/50 dark:border-amber-700 dark:text-amber-200'
              : 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-700 dark:text-emerald-200'
          }`}>
            {alertLevel === 'critical' ? (
              <AlertTriangle className="w-6 h-6 flex-shrink-0 animate-pulse" />
            ) : alertLevel === 'warning' ? (
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
            ) : (
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
            )}
            <div className="flex-1">
              <span className="font-bold text-sm uppercase tracking-wide">
                {alertLevel === 'critical' ? '⚠️ ACTIVE ALERT' : alertLevel === 'warning' ? '⚠️ ADVISORY' : '✅ ALL CLEAR'}
              </span>
              <span className="mx-2 text-sm">—</span>
              <span className="text-sm">{alertMessage}</span>
            </div>
            {alertLevel !== 'clear' && (
              <button onClick={() => executeQuery('Give me emergency advisory for my district')}
                className="text-xs font-bold underline hover:no-underline flex-shrink-0">
                Get Advisory →
              </button>
            )}
          </div>
        </motion.div>

        {/* ─── TOP ROW: Farm Profile + Weather + Agent Status ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          {/* Farm at a Glance */}
          <Card className="p-5 border-l-4 border-l-primary">
            <div className="flex items-center gap-2 mb-3">
              <Sprout className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-sm">Your Farm</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Crop</span><span className="font-semibold">Paddy (Kharif)</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">District</span>
                <span className="font-semibold flex items-center gap-1"><MapPin className="w-3 h-3" />{user?.district || 'Kendrapara'}</span>
              </div>
              <div className="flex justify-between"><span className="text-muted-foreground">Farm Size</span><span className="font-semibold">5 hectares</span></div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">PMFBY Insurance</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active
                </span>
              </div>
            </div>
          </Card>

          {/* Live Weather */}
          <Card className="p-5 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2 mb-3">
              <Cloud className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-sm">Live Weather</h3>
              <span className="ml-auto text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">LIVE</span>
            </div>
            {weather ? (
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-orange-500" />
                  <div><p className="text-muted-foreground text-xs">Temp</p><p className="font-bold">{Math.round(weather.temperature)}°C</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <div><p className="text-muted-foreground text-xs">Humidity</p><p className="font-bold">{weather.humidity}%</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-500" />
                  <div><p className="text-muted-foreground text-xs">Wind</p><p className="font-bold">{Math.round(weather.windSpeed)} km/h</p></div>
                </div>
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-indigo-500" />
                  <div><p className="text-muted-foreground text-xs">Rain</p><p className="font-bold">{weather.rainfall} mm</p></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-4 gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading weather...
              </div>
            )}
          </Card>

          {/* Agent Status */}
          <Card className="p-5 border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-sm">Agent Status</h3>
              <span className="ml-auto text-[10px] text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full font-bold">
                {Object.keys(agentStatuses).length}/5 Online
              </span>
            </div>
            <div className="space-y-2">
              {AGENTS.map(agent => (
                <div key={agent.name} className="flex items-center gap-2 text-sm">
                  <span className={`w-2 h-2 rounded-full ${agentStatuses[agent.name] ? 'bg-emerald-500' : 'bg-gray-300'}`} />
                  <agent.icon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-medium">{agent.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{agent.desc}</span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ─── 2. QUERY SECTION ────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4">
          <form onSubmit={handleQuerySubmit} className="flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('dashboard.query_placeholder')}
              className="h-12 text-base"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading} className="h-12 px-8 gap-2">
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {t('dashboard.loading')}</>
              ) : (
                <><Send className="w-5 h-5" /> {t('dashboard.send')}</>
              )}
            </Button>
          </form>
        </motion.div>

        {/* ─── 3. QUICK ACTION CHIPS ───────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-8">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt.label}
              onClick={() => executeQuery(prompt.query)}
              disabled={isLoading}
              className="group flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50"
            >
              <prompt.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
              {prompt.label}
            </button>
          ))}
        </motion.div>

        {/* ─── 4. AGENT RESPONSE GRID ──────────────────── */}
        {response && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-5 mb-6">
            {/* Sentinel Alert */}
            <Card className="p-5 border-l-4 border-l-orange-500">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950 flex items-center justify-center flex-shrink-0">
                  <Cloud className="w-5 h-5 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-2 flex items-center gap-2">
                    Weather Sentinel
                    <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-600 px-2 py-0.5 rounded-full">LIVE</span>
                  </h3>
                  <div className="space-y-1.5 text-sm">
                    <p><span className="text-muted-foreground">Alert:</span> <span className="font-medium">{response.agents_output.sentinel.weather_alert}</span></p>
                    <p><span className="text-muted-foreground">Level:</span> <span className={`font-bold uppercase text-xs px-2 py-0.5 rounded-full ${
                      response.agents_output.sentinel.hazard_signal === 'critical' ? 'bg-red-100 text-red-700' :
                      response.agents_output.sentinel.hazard_signal === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>{response.agents_output.sentinel.hazard_signal}</span></p>
                    <p><span className="text-muted-foreground">Probability:</span> <span className="font-bold">{(response.agents_output.sentinel.probability * 100).toFixed(0)}%</span></p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Risk Analysis */}
            <Card className="p-5 border-l-4 border-l-red-500">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-950 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-2">Loss Analyst</h3>
                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Risk Score:</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${
                          response.agents_output.analyst.risk_score > 7 ? 'bg-red-500' :
                          response.agents_output.analyst.risk_score > 4 ? 'bg-amber-500' : 'bg-green-500'
                        }`} style={{ width: `${response.agents_output.analyst.risk_score * 10}%` }} />
                      </div>
                      <span className="font-bold">{response.agents_output.analyst.risk_score}/10</span>
                    </div>
                    <p><span className="text-muted-foreground">Loss Probability:</span> <span className="font-bold">{(response.agents_output.analyst.crop_loss_probability * 100).toFixed(0)}%</span></p>
                    <p><span className="text-muted-foreground">Impact:</span> <span className="font-medium">{response.agents_output.analyst.income_impact}</span></p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-5 border-l-4 border-l-blue-500">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-2">{t('dashboard.recommendations')}</h3>
                  <ul className="space-y-1.5">
                    {response.agents_output.advisor.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="text-primary font-bold">{idx + 1}.</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Schemes & SDG */}
            <Card className="p-5 border-l-4 border-l-green-500">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm mb-2">{t('dashboard.applicable_schemes')}</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {response.agents_output.policy.applicable_schemes.map((scheme, idx) => (
                      <span key={idx} className="text-xs font-bold bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 px-3 py-1 rounded-full">
                        {scheme}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {response.agents_output.policy.sdg_alignment.slice(0, 3).map((sdg, idx) => (
                      <p key={idx} className="text-xs text-muted-foreground flex items-center gap-1">
                        <Star className="w-3 h-3 text-primary" /> {sdg}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ─── 5. OFFICIAL BROADCAST TICKER ─────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-4 bg-card border border-border rounded-xl px-5 py-3 flex items-center gap-3">
          <Megaphone className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="overflow-hidden flex-1">
            <p className="text-sm text-muted-foreground whitespace-nowrap animate-marquee">
              <span className="font-bold text-foreground">📢 Official Advisory:</span> {broadcastMessage}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
