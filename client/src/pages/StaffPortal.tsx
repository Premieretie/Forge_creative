
import { useEffect, useState } from 'react';
import { staff } from '@/lib/api';
import { Shield, Ticket, CheckCircle, Clock, Plus, Loader2, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StaffPortal() {
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState<any[]>([]);
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [perks, setPerks] = useState<any[]>([]);
  const [nextGoal, setNextGoal] = useState<any>(null);
  
  // Log form
  const [logging, setLogging] = useState(false);
  const [ticketForm, setTicketForm] = useState({ ticket_ref: '', notes: '' });
  const [showLogModal, setShowLogModal] = useState(false);

  useEffect(() => {
    loadCommunities();
  }, []);

  useEffect(() => {
    if (selectedGuild) {
      loadGuildData(selectedGuild);
    }
  }, [selectedGuild]);

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const res = await staff.getCommunities();
      const list = res.communities || [];
      setCommunities(list);
      if (list.length > 0 && !selectedGuild) {
        setSelectedGuild(list[0].guild_id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadGuildData = async (guildId: string) => {
    try {
      const res = await staff.getStats(guildId);
      setStats(res.stats);
      setRecentLogs(res.recent || []);
      setPerks(res.perks || []);
      setNextGoal(res.next_goal);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuild) return;
    setLogging(true);
    try {
      await staff.logTicket({
        guild_id: selectedGuild,
        ticket_ref: ticketForm.ticket_ref,
        notes: ticketForm.notes
      });
      setTicketForm({ ticket_ref: '', notes: '' });
      setShowLogModal(false);
      loadGuildData(selectedGuild); // refresh
    } catch (e) {
      console.error(e);
      alert('Failed to log ticket');
    } finally {
      setLogging(false);
    }
  };

  if (loading) return <div className="p-8">Loading staff portal...</div>;

  if (communities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <div className="bg-secondary/30 p-6 rounded-full mb-6">
          <Shield className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Staff Portal</h2>
        <p className="text-muted-foreground max-w-md">
          You don't have staff access to any connected communities yet. 
          Ask your community owner to add your Discord role to the Staff configuration.
        </p>
      </div>
    );
  }

  const activeCommunity = communities.find(c => c.guild_id === selectedGuild);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Staff Portal
          </h1>
          <p className="text-muted-foreground">Track your contributions and earn rewards.</p>
        </div>
        
        {communities.length > 1 && (
          <select 
            value={selectedGuild || ''} 
            onChange={(e) => setSelectedGuild(e.target.value)}
            className="bg-background border border-input rounded-md px-3 py-2 text-sm min-w-[200px]"
          >
            {communities.map(c => (
              <option key={c.guild_id} value={c.guild_id}>{c.name}</option>
            ))}
          </select>
        )}
        {communities.length === 1 && (
            <div className="text-lg font-medium bg-secondary/20 px-4 py-2 rounded-md">
                {activeCommunity?.name}
            </div>
        )}
      </div>

      {stats && (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
              <Ticket className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Logged</p>
              <h3 className="text-2xl font-bold">{stats.total}</h3>
            </div>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-green-500/10 text-green-500 rounded-lg">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Approved</p>
              <h3 className="text-2xl font-bold">{stats.approved}</h3>
            </div>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl flex items-center gap-4">
            <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-lg">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Pending Review</p>
              <h3 className="text-2xl font-bold">{stats.pending}</h3>
            </div>
          </div>
        </div>
      )}

      {nextGoal && (
        <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 p-6 rounded-xl">
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-primary" />
                        Next Reward: {nextGoal.description}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {Math.max(0, nextGoal.tickets_required - (stats?.approved || 0))} more approved tickets needed
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{stats?.approved || 0}</span>
                    <span className="text-muted-foreground text-sm"> / {nextGoal.tickets_required}</span>
                </div>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mt-4">
                <div 
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${Math.min(100, ((stats?.approved || 0) / nextGoal.tickets_required) * 100)}%` }}
                />
            </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Log Ticket Section */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Recent Logs</h3>
                <button 
                    onClick={() => setShowLogModal(true)}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Log Ticket
                </button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="divide-y divide-border">
                    {recentLogs.map((log) => (
                        <div key={log.id} className="p-4 hover:bg-secondary/10 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-mono text-sm bg-secondary px-2 py-0.5 rounded text-foreground">
                                    {log.ticket_ref}
                                </span>
                                <span className={cn(
                                    "text-xs font-medium uppercase px-2 py-0.5 rounded-full",
                                    log.status === 'approved' ? "bg-green-500/10 text-green-500" :
                                    log.status === 'rejected' ? "bg-red-500/10 text-red-500" :
                                    "bg-yellow-500/10 text-yellow-500"
                                )}>
                                    {log.status}
                                </span>
                            </div>
                            {log.notes && (
                                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{log.notes}</p>
                            )}
                            <div className="text-xs text-muted-foreground">
                                {new Date(log.created_at).toLocaleString()}
                            </div>
                        </div>
                    ))}
                    {recentLogs.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No tickets logged recently.
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Available Perks */}
        <div className="space-y-4">
            <h3 className="text-xl font-semibold">Available Rewards</h3>
            <div className="space-y-3">
                {perks.map((perk) => {
                    const unlocked = (stats?.approved || 0) >= perk.tickets_required;
                    return (
                        <div 
                            key={perk.reward_key} 
                            className={cn(
                                "flex items-center gap-4 p-4 rounded-xl border transition-all",
                                unlocked 
                                    ? "bg-primary/5 border-primary/20" 
                                    : "bg-card border-border opacity-70"
                            )}
                        >
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm",
                                unlocked ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                            )}>
                                {perk.tickets_required}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium">{perk.description}</h4>
                                <p className="text-xs text-muted-foreground">
                                    {unlocked ? 'Unlocked!' : `${perk.tickets_required} approved tickets required`}
                                </p>
                            </div>
                            {unlocked && <CheckCircle className="h-5 w-5 text-primary" />}
                        </div>
                    );
                })}
                {perks.length === 0 && (
                    <div className="p-6 bg-card border border-border rounded-xl text-center text-muted-foreground">
                        No rewards configured for this community.
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl w-full max-w-md p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <h3 className="text-xl font-bold mb-4">Log Ticket</h3>
                <form onSubmit={handleLogTicket} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Ticket Reference / ID</label>
                        <input 
                            type="text" 
                            required
                            placeholder="#1234 or Ticket-789"
                            value={ticketForm.ticket_ref}
                            onChange={e => setTicketForm({...ticketForm, ticket_ref: e.target.value})}
                            className="w-full bg-background border border-input rounded-md px-3 py-2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
                        <textarea 
                            rows={3}
                            placeholder="Brief description of the ticket..."
                            value={ticketForm.notes}
                            onChange={e => setTicketForm({...ticketForm, notes: e.target.value})}
                            className="w-full bg-background border border-input rounded-md px-3 py-2 resize-none"
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button"
                            onClick={() => setShowLogModal(false)}
                            className="flex-1 bg-secondary hover:bg-secondary/80 px-4 py-2 rounded-md font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            disabled={logging}
                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center justify-center gap-2"
                        >
                            {logging && <Loader2 className="h-4 w-4 animate-spin" />}
                            Submit Log
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
