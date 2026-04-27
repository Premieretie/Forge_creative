import { useEffect, useState } from 'react';
import { owner } from '@/lib/api';
import { Link } from 'react-router-dom';
import { Plus, Users, Loader2 } from 'lucide-react';

export function OwnerDashboard() {
  const [communities, setCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  
  // Register form
  const [guildId, setGuildId] = useState('');
  const [name, setName] = useState('');
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      const res = await owner.getList();
      setCommunities(res.communities || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegistering(true);
    setError('');
    
    try {
      const res = await owner.register(guildId, name);
      if (res.ok) {
        setShowRegister(false);
        setGuildId('');
        setName('');
        loadCommunities();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Community Owner Portal</h1>
          <p className="text-muted-foreground mt-1">Manage your communities, track member stats, and configure perks.</p>
        </div>
        <button 
          onClick={() => setShowRegister(!showRegister)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {showRegister ? 'Cancel' : 'Register New Community'}
        </button>
      </div>

      {showRegister && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8 animate-in fade-in slide-in-from-top-4">
          <h2 className="text-xl font-semibold mb-4">Register Community</h2>
          <form onSubmit={handleRegister} className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">Discord Guild ID</label>
              <input
                type="text"
                value={guildId}
                onChange={e => setGuildId(e.target.value)}
                placeholder="e.g. 123456789012345678"
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Right-click your server icon in Discord and select "Copy ID" (Dev Mode required).
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Community Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Diablo County RP"
                className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm"
                required
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button 
              type="submit" 
              disabled={registering}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md font-medium flex items-center gap-2"
            >
              {registering && <Loader2 className="h-4 w-4 animate-spin" />}
              Register
            </button>
          </form>
        </div>
      )}

      {communities.length === 0 && !showRegister ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl">
          <div className="mx-auto w-12 h-12 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Communities Found</h3>
          <p className="text-muted-foreground mb-6">You haven't registered any communities yet.</p>
          <button 
            onClick={() => setShowRegister(true)}
            className="text-primary hover:underline font-medium"
          >
            Register your first community
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map(c => (
            <Link 
              key={c.id} 
              to={`/dashboard/owner/${c.guild_id}`}
              className="group block bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg">
                  {c.name.charAt(0)}
                </div>
                <div className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded font-medium">
                  ID: {c.guild_id}
                </div>
              </div>
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{c.name}</h3>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div>
                  <div className="text-muted-foreground text-xs uppercase font-semibold">Members</div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {c.member_count}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground text-xs uppercase font-semibold">Streamed</div>
                  <div className="text-2xl font-bold flex items-center gap-1">
                    {c.total_hours}<span className="text-sm font-normal text-muted-foreground">h</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
