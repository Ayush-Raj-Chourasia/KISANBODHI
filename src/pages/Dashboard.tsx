import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Cloud, AlertTriangle, TrendingDown, CheckCircle, Send, Loader2 } from 'lucide-react';
import { AgentResponse } from '@/types';

export default function Dashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<AgentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/agent/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ query, context: { district: user?.district } })
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

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            {t('dashboard.welcome')}, {user?.name}!
          </h1>
          <p className="text-muted-foreground text-lg">{t('app_tagline')}</p>
        </motion.div>

        {/* Query Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <form onSubmit={handleQuerySubmit} className="flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('dashboard.query_placeholder')}
              className="h-12 text-base"
              disabled={isLoading}
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-8 gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t('dashboard.loading')}
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t('dashboard.send')}
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Response Grid */}
        {response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 gap-6 mb-8"
          >
            {/* Sentinel Alert */}
            <Card className="p-6 border-l-4 border-l-orange-500">
              <div className="flex items-start gap-4">
                <Cloud className="w-8 h-8 text-orange-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{t('agent.sentinel')}</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Alert:</strong> {response.agents_output.sentinel.weather_alert}</p>
                    <p><strong>Level:</strong> {response.agents_output.sentinel.hazard_signal}</p>
                    <p><strong>Probability:</strong> {(response.agents_output.sentinel.probability * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Risk Analysis */}
            <Card className="p-6 border-l-4 border-l-red-500">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{t('agent.analyst')}</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Risk Score:</strong> {response.agents_output.analyst.risk_score}/10</p>
                    <p><strong>Loss Probability:</strong> {(response.agents_output.analyst.crop_loss_probability * 100).toFixed(0)}%</p>
                    <p><strong>Est. Impact:</strong> {response.agents_output.analyst.income_impact}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 border-l-4 border-l-blue-500 md:col-span-2">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-8 h-8 text-blue-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-3">{t('dashboard.recommendations')}</h3>
                  <ul className="space-y-2">
                    {response.agents_output.advisor.recommendations.map((rec, idx) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="text-primary">✓</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Schemes & SDG */}
            <Card className="p-6 border-l-4 border-l-green-500 md:col-span-2">
              <div className="flex items-start gap-4">
                <TrendingDown className="w-8 h-8 text-green-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-3">{t('dashboard.applicable_schemes')}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {response.agents_output.policy.applicable_schemes.map((scheme, idx) => (
                      <div key={idx} className="text-sm bg-green-50 dark:bg-green-950 p-2 rounded">
                        {scheme}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* SDG Alignment */}
        {response && (
          <Card className="p-6 bg-gradient-to-r from-primary/5 to-primary/10">
            <h3 className="font-semibold mb-4">UN Sustainable Development Goals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {response.agents_output.policy.sdg_alignment.map((sdg, idx) => (
                <div key={idx} className="text-sm bg-background p-3 rounded-lg border">
                  {sdg}
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
