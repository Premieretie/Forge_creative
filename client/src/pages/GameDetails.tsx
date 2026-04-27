import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { discord as discordApi } from '@/lib/api';
import { cn } from '@/lib/utils';

export function GameDetails() {
  const { guildId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await discordApi.getConnections();
        if (!mounted) return;
        const guild = Array.isArray(resp?.guilds) ? resp.guilds.find((g: any) => String(g.id) === String(guildId)) : null;
        if (!guild) {
          setError('Not connected to this server');
          setData(null);
        } else {
          setData(guild);
        }
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || 'Failed to load');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [guildId]);

  const nextGoalText = useMemo(() => {
    if (!data) return '';
    if (!data.next_goal) return 'All goals completed';
    return `${data.hours_until_next_goal}h until ${data.next_goal.description || data.next_goal.reward_key}`;
  }, [data]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-7 w-40 bg-accent/40 rounded animate-pulse" />
        <div className="h-24 w-full bg-accent/40 rounded animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="text-destructive text-sm">{error}</div>
        <Link to="/dashboard" className="text-sm text-primary hover:underline">Go back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        {data?.icon_url && (
          <img src={data.icon_url} alt={data.name} className="h-10 w-10 rounded" />
        )}
        <div>
          <h2 className="text-xl font-semibold">{data?.name}</h2>
          <div className="text-xs text-muted-foreground">Games connected</div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Hours streamed towards perks</div>
            <div className="text-2xl font-bold">{data?.hours_so_far ?? 0}h</div>
          </div>
          <div className="text-sm font-medium">{nextGoalText}</div>
        </div>
        <div className="w-full h-2 bg-secondary rounded mt-3 overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${Math.min(100, Math.floor(((data?.hours_so_far || 0) / Math.max(1, data?.next_goal?.hours_required || 1)) * 100))}%` }}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="font-semibold mb-4">Perks</h3>
        <ul className="space-y-3">
          {(data?.perks || []).map((p: any) => (
            <li key={p.reward_key} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{p.description || p.reward_key}</div>
                <div className="text-xs text-muted-foreground">{p.hours_required}h required</div>
              </div>
              <div className={cn("text-xs px-2 py-1 rounded", (data?.hours_so_far || 0) >= Number(p.hours_required) ? 'bg-green-500/10 text-green-600' : 'bg-secondary text-muted-foreground')}>
                {(data?.hours_so_far || 0) >= Number(p.hours_required) ? 'Unlocked' : 'Locked'}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
