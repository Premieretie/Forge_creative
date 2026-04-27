import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { streams, health, live, discord } from '@/lib/api';

const riskScoreInitial: number | null = null;

export function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [quickNote, setQuickNote] = useState('');
  const [goLiveTitle, setGoLiveTitle] = useState('');
  const [goLiveMsg, setGoLiveMsg] = useState('');
  const [goLiveLoading, setGoLiveLoading] = useState(false);
  const [goLiveStatus, setGoLiveStatus] = useState<string | null>(null);
  const [riskScore, setRiskScore] = useState<number | null>(riskScoreInitial);
  const [avgSleep, setAvgSleep] = useState<number | null>(null);
  const [avgMood, setAvgMood] = useState<number | null>(null);
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [communities, setCommunities] = useState<any[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<string>('');

  const handleQuickLog = async (value: number) => {
    try {
      await health.log({
        type: 'mood',
        value,
        notes: quickNote
      });
      alert('Mood logged successfully!');
      setQuickNote('');
    } catch (error) {
      console.error(error);
      alert('Failed to log mood');
    }
  };

  const loadCommunities = async () => {
    try {
      const res = await discord.getCommunities();
      setCommunities(Array.isArray(res?.communities) ? res.communities : []);
    } catch (e) {
      setCommunities([]);
    }
  };

  const handleStartTestStream = async () => {
    setTestLoading(true);
    setTestStatus(null);
    try {
      await streams.mockStart({ category: 'RedM Diablo County RP', title: 'Testing Stream - RedM Diablo County RP' });
      setTestStatus('Started test stream as RedM Diablo County RP.');
      await loadData();
    } catch (e: any) {
      setTestStatus(e?.message || 'Failed to start test stream');
    } finally {
      setTestLoading(false);
    }
  };

  const handleStopTestStream = async () => {
    setTestLoading(true);
    setTestStatus(null);
    try {
      await streams.mockStop();
      setTestStatus('Stopped test stream.');
      await loadData();
    } catch (e: any) {
      setTestStatus(e?.message || 'Failed to stop test stream');
    } finally {
      setTestLoading(false);
    }
  };

  const handleGoLive = async () => {
    setGoLiveLoading(true);
    setGoLiveStatus(null);
    try {
      await live.start({ title: goLiveTitle || undefined, message: goLiveMsg || undefined, guild_id: selectedGuild || undefined });
      setGoLiveStatus('Announcement sent. We\'ll start tracking when Twitch goes live.');
      setGoLiveTitle('');
      setGoLiveMsg('');
    } catch (e: any) {
      setGoLiveStatus(e?.message || 'Failed to start Go Live');
    } finally {
      setGoLiveLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadCommunities();
  }, []);

  const loadData = async () => {
    try {
      const data = await streams.getAll();
      if (data.length > 0) {
        // Calculate total hours
        const hours = data.reduce((acc: number, curr: any) => acc + (curr.duration_minutes / 60), 0);
        setTotalHours(Math.round(hours * 10) / 10);
        setRiskScore(Math.min(100, Math.max(0, Math.round((hours / 20) * 100))));
        // Determine live status and current game
        const active = data.find((s: any) => !s.ended_at);
        if (active) {
          setIsLive(true);
          setCurrentGame(active.category || null);
        } else {
          setIsLive(false);
          setCurrentGame(null);
        }
      } else {
        setTotalHours(0);
        setRiskScore(null);
        setIsLive(false);
        setCurrentGame(null);
      }

      // Health logs: compute averages only from actual user logs
      const [sleepLogs, moodLogs] = await Promise.all([
        health.getLogs('sleep'),
        health.getLogs('mood')
      ]);

      if (Array.isArray(sleepLogs) && sleepLogs.length > 0) {
        const avg = sleepLogs.reduce((acc: number, it: any) => acc + Number(it.value || 0), 0) / sleepLogs.length;
        setAvgSleep(Math.round(avg * 10) / 10);
      } else {
        setAvgSleep(null);
      }

      if (Array.isArray(moodLogs) && moodLogs.length > 0) {
        const avg = moodLogs.reduce((acc: number, it: any) => acc + Number(it.value || 0), 0) / moodLogs.length;
        setAvgMood(Math.round(avg * 10) / 10);
      } else {
        setAvgMood(null);
      }

      // Generate daily stats for the last 7 days
      const now = new Date();
      const dailyStats = [];

      const toLocalYMD = (dateInput: any) => {
        if (!dateInput) return '';
        const d = new Date(dateInput);
        if (isNaN(d.getTime())) return '';
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().split('T')[0];
      };

      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = toLocalYMD(d);

        // Filter streams for this day
        const dayStreams = data.filter((s: any) => toLocalYMD(s.started_at) === dateStr);
        const dayLoadMinutes = dayStreams.reduce((acc: number, s: any) => acc + (s.duration_minutes || 0), 0);
        const dayLoadHours = Math.round((dayLoadMinutes / 60) * 10) / 10;

        // Filter mood for this day
        const dayMoods = (Array.isArray(moodLogs) ? moodLogs : []).filter((m: any) => toLocalYMD(m.logged_at) === dateStr);
        
        let dayMoodAvg = 0;
        if (dayMoods.length > 0) {
            dayMoodAvg = dayMoods.reduce((acc: number, m: any) => acc + Number(m.value || 0), 0) / dayMoods.length;
        }

        // Calculate simple fatigue (e.g. 1 hour = 5% fatigue, capping at 100?)
        const dayFatigue = Math.min(100, dayLoadHours * 10); 

        dailyStats.push({
            day: dayStr,
            load: dayLoadHours,
            fatigue: dayFatigue,
            mood: dayMoodAvg
        });
      }
      setStats(dailyStats);

    } catch (error) {
      console.error(error);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await streams.sync();
      await loadData();
    } catch (error) {
      console.error(error);
      alert('Failed to sync. Make sure Twitch is linked in Settings.');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
          Sync Data
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Burnout Risk Card */
        }
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm col-span-1 md:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Burnout Risk</h3>
            <AlertTriangle className={cn("h-5 w-5", (riskScore ?? 0) > 50 ? "text-red-500" : "text-green-500")} />
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className={cn("text-4xl font-bold", (riskScore ?? 0) > 50 ? "text-red-500" : "text-green-500")}>
              {riskScore == null ? '—' : `${riskScore}%`}
            </span>
            <span className="text-muted-foreground mb-1">{riskScore == null ? 'No Data' : (riskScore > 50 ? 'High Risk' : 'Low Risk')}</span>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mb-4">
            <div 
              className={cn("h-full transition-all", (riskScore ?? 0) > 50 ? "bg-red-500" : "bg-green-500")}
              style={{ width: `${riskScore ?? 0}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {riskScore == null ? 'No recent data. Track streams and mood to see your risk.' : 'Declining mood and high stream load detected. Consider a rest day.'}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm col-span-1">
          <h3 className="font-semibold text-lg mb-4">Weekly Load</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Stream Hours</span>
              <span className="font-bold">{totalHours}h</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Current Game</span>
              <span className={cn("font-bold", isLive ? 'text-green-600' : 'text-muted-foreground')}>{isLive && currentGame ? currentGame : '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Sleep</span>
              <span className="font-bold text-yellow-500">{avgSleep != null ? `${avgSleep}h` : '—'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Avg Mood</span>
              <span className="font-bold">{avgMood != null ? `${avgMood}/100` : '—'}</span>
            </div>
          </div>
        </div>

        {/* Go Live */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm col-span-1">
          <h3 className="font-semibold text-lg mb-4">Go Live</h3>
          <div className="space-y-3">
            {communities.length > 0 && (
              <select
                value={selectedGuild}
                onChange={(e) => setSelectedGuild(e.target.value)}
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select community (optional)</option>
                {communities.map((c) => (
                  <option key={c.guild_id} value={c.guild_id}>
                    {c.guild_name || c.guild_id}{c.game_name ? ` • ${c.game_name}` : ''}
                  </option>
                ))}
              </select>
            )}
            <input
              type="text"
              value={goLiveTitle}
              onChange={(e) => setGoLiveTitle(e.target.value)}
              placeholder="Heading (optional)"
              className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <textarea
              value={goLiveMsg}
              onChange={(e) => setGoLiveMsg(e.target.value)}
              placeholder="Message (optional)"
              className="w-full bg-secondary/50 border border-input rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              rows={3}
            />
            <button
              onClick={handleGoLive}
              disabled={goLiveLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {goLiveLoading ? 'Posting…' : 'Go Live'}
            </button>
            {goLiveStatus && (
              <div className="text-xs text-muted-foreground">{goLiveStatus}</div>
            )}
          </div>
        </div>

        {/* Test Streaming */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm col-span-1">
          <h3 className="font-semibold text-lg mb-4">Test Streaming (Local)</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={handleStartTestStream}
              disabled={testLoading}
              className="bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-md text-sm"
            >
              {testLoading ? 'Working…' : 'Start Test Stream (RedM)'}
            </button>
            <button
              onClick={handleStopTestStream}
              disabled={testLoading}
              className="bg-secondary hover:bg-secondary/80 px-3 py-2 rounded-md text-sm"
            >
              {testLoading ? 'Working…' : 'Stop Test Stream'}
            </button>
          </div>
          {testStatus && (
            <div className="text-xs text-muted-foreground mt-2">{testStatus}</div>
          )}
          <div className="text-[11px] text-muted-foreground mt-2">Creates a local test session in your streams table without contacting Twitch. Use for UI testing.</div>
        </div>

        {/* Mood Input */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm col-span-1">
          <h3 className="font-semibold text-lg mb-4">Log Today's Mood</h3>
          <div className="grid grid-cols-5 gap-2">
            {['😡', '😞', '😐', '🙂', '😄'].map((emoji, i) => (
              <button 
                key={i} 
                onClick={() => handleQuickLog([20, 40, 60, 80, 100][i])}
                className="aspect-square flex items-center justify-center text-2xl hover:bg-accent rounded-lg transition-colors border border-transparent hover:border-border"
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <textarea 
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder="Optional note..."
              className="w-full bg-secondary/50 border border-input rounded-md p-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              rows={2}
            />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Load vs. Fatigue</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Line type="monotone" dataKey="load" stroke="hsl(var(--primary))" strokeWidth={2} name="Stream Load" />
                <Line type="monotone" dataKey="fatigue" stroke="hsl(var(--destructive))" strokeWidth={2} name="Fatigue %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-6">Weekly Mood Trend</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="mood" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Mood Score" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
