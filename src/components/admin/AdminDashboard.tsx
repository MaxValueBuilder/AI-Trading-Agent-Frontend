import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminApiService, type SystemMetrics, type SignalAnalytics } from "@/services/adminApi";
import { Activity, TrendingUp, Users, Signal, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [analytics, setAnalytics] = useState<SignalAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metricsRes, analyticsRes] = await Promise.all([
        adminApiService.getSystemMetrics(),
        adminApiService.getSignalAnalytics()
      ]);
      setMetrics(metricsRes.metrics);
      setAnalytics(analyticsRes.analytics);
    } catch (error) {
      console.error("Error loading admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-crypto-text-secondary">Loading dashboard...</div>;
  }

  if (!metrics) {
    return <div className="text-crypto-text-secondary">No data available</div>;
  }

  const statCards = [
    {
      title: "Total Signals",
      value: metrics.total_signals,
      subtitle: `${metrics.signals_today} today`,
      icon: Signal,
      color: "text-blue-500"
    },
    {
      title: "Pending Enrichment",
      value: metrics.signals_pending_enrichment,
      subtitle: "awaiting processing",
      icon: Activity,
      color: "text-yellow-500"
    },
    {
      title: "AI Complete",
      value: metrics.signals_with_ai_complete,
      subtitle: "enriched signals",
      icon: CheckCircle,
      color: "text-green-500"
    },
    {
      title: "Failed Signals",
      value: metrics.failed_signals_count,
      subtitle: "need attention",
      icon: AlertCircle,
      color: "text-red-500"
    },
    {
      title: "Total Users",
      value: metrics.total_users,
      subtitle: `${metrics.active_users} active`,
      icon: Users,
      color: "text-purple-500"
    },
    {
      title: "FCM Subscribed",
      value: metrics.users_with_fcm_tokens,
      subtitle: "push enabled",
      icon: TrendingUp,
      color: "text-cyan-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-crypto-card border-crypto-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-crypto-text-secondary">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-crypto-text-primary">{stat.value}</div>
                <p className="text-xs text-crypto-text-secondary">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Signals by Pair */}
          <Card className="bg-crypto-card border-crypto-border">
            <CardHeader>
              <CardTitle className="text-lg">Signals by Pair</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 border-t border-crypto-border">
              <div className="space-y-2">
                {Object.entries(analytics.signals_by_pair).slice(0, 5).map(([pair, count]) => (
                  <div key={pair} className="flex justify-between items-center">
                    <span className="text-crypto-text-secondary">{pair}</span>
                    <span className="font-semibold text-crypto-text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Signals by Direction */}
          <Card className="bg-crypto-card border-crypto-border">
            <CardHeader>
              <CardTitle className="text-lg">Signals by Direction</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 border-t border-crypto-border">
              <div className="space-y-2">
                {Object.entries(analytics.signals_by_direction).map(([direction, count]) => (
                  <div key={direction} className="flex justify-between items-center">
                    <span className={`text-${direction === 'LONG' ? 'green' : 'red'}-500 font-medium`}>
                      {direction}
                    </span>
                    <span className="font-semibold text-crypto-text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Signals by Status */}
          <Card className="bg-crypto-card border-crypto-border">
            <CardHeader>
              <CardTitle className="text-lg">Signals by Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 border-t border-crypto-border">
              <div className="space-y-2">
                {Object.entries(analytics.signals_by_status).map(([status, count]) => (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-crypto-text-secondary">{status}</span>
                    <span className="font-semibold text-crypto-text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Score Distribution */}
          <Card className="bg-crypto-card border-crypto-border">
            <CardHeader>
              <CardTitle className="text-lg">Quality Scores</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 border-t border-crypto-border">
              <div className="space-y-2">
                {Object.entries(analytics.quality_score_distribution).slice(0, 5).map(([score, count]) => (
                  <div key={score} className="flex justify-between items-center">
                    <span className="text-crypto-text-secondary">{score}</span>
                    <span className="font-semibold text-crypto-text-primary">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

