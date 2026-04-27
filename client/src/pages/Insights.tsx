import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Target, Calendar } from 'lucide-react';
import { streams } from '@/lib/api';
import { format } from 'date-fns';

export function Insights() {
  const [streamData, setStreamData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalHours: 0,
    avgDuration: 0,
    streamCount: 0,
    topCategory: '-'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await streams.getAll();
      setStreamData(data);

      // Process stats
      const totalMinutes = data.reduce((acc: number, curr: any) => acc + curr.duration_minutes, 0);
      const totalHours = Math.round(totalMinutes / 60 * 10) / 10;
      const avgDuration = data.length ? Math.round(totalMinutes / data.length) : 0;
      
      // Process category distribution
      const categories: {[key: string]: number} = {};
      data.forEach((stream: any) => {
        categories[stream.category] = (categories[stream.category] || 0) + 1;
      });
      
      const pieData = Object.keys(categories).map(key => ({
        name: key,
        value: categories[key]
      }));
      setCategoryData(pieData);

      const topCat = pieData.sort((a, b) => b.value - a.value)[0]?.name || '-';

      setStats({
        totalHours,
        avgDuration,
        streamCount: data.length,
        topCategory: topCat
      });

    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const COLORS = ['#9146FF', '#FF4691', '#4691FF', '#46FF91', '#FF9146'];

  const chartData = streamData.slice(0, 7).map((s: any) => ({
    date: format(new Date(s.started_at), 'MM/dd'),
    hours: Math.round(s.duration_minutes / 60 * 10) / 10,
    category: s.category
  })).reverse();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Insights</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Stream Time</p>
              <h3 className="text-2xl font-bold">{stats.totalHours}h</h3>
            </div>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-muted-foreground">Avg Duration</p>
              <h3 className="text-2xl font-bold">{Math.floor(stats.avgDuration / 60)}h {stats.avgDuration % 60}m</h3>
            </div>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-muted-foreground">Total Streams</p>
              <h3 className="text-2xl font-bold">{stats.streamCount}</h3>
            </div>
            <div className="p-2 bg-green-500/10 text-green-500 rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm text-muted-foreground">Top Category</p>
              <h3 className="text-2xl font-bold truncate max-w-[150px]" title={stats.topCategory}>{stats.topCategory}</h3>
            </div>
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
              <Target className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Stream Duration Trend */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Recent Stream Duration</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Hours" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-6">Category Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                  itemStyle={{ color: 'hsl(var(--foreground))' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {categoryData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
