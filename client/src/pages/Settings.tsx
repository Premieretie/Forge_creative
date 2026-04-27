import { Twitch, Loader2, Check, MessageSquare } from 'lucide-react';
import { useEffect, useState } from 'react';
import { user, twitch, discord } from '@/lib/api';
import { useLocation } from 'react-router-dom';

interface UserProfile {
  id: number;
  email: string;
  display_name: string | null;
  twitch_user_id: string | null;
  twitch_display_name?: string | null;
}

export function Settings() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [discordId, setDiscordId] = useState('');
  const [communities, setCommunities] = useState<any[]>([]);
  const [newGuildId, setNewGuildId] = useState('');
  const [newChannelId, setNewChannelId] = useState('');
  const [newGameName, setNewGameName] = useState('');
  const [isCommunitySaving, setIsCommunitySaving] = useState(false);
  const location = useLocation();

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('twitch') === 'linked') {
      loadProfile();
      setMessage('Twitch account connected');
    }
  }, [location.search]);

  const loadProfile = async () => {
    try {
      const data = await user.getProfile();
      setProfile(data);
      // Load existing Discord link if present
      try {
        const link = await discord.getLink();
        if (link && typeof link.discord_user_id === 'string') setDiscordId(link.discord_user_id);
      } catch {}
      try {
        const res = await discord.getCommunities();
        setCommunities(Array.isArray(res?.communities) ? res.communities : []);
      } catch {}
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const display_name = formData.get('display-name') as string;

    try {
      const updated = await user.updateProfile({ display_name });
      setProfile(updated);
      setMessage('Profile updated successfully');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLinkTwitch = async () => {
    try {
      const { url } = await twitch.getOauthUrl();
      window.location.href = url;
    } catch (error) {
      console.error(error);
    }
  };

  const refreshCommunities = async () => {
    try {
      const res = await discord.getCommunities();
      setCommunities(Array.isArray(res?.communities) ? res.communities : []);
    } catch {}
  };

  const handleAddCommunity = async () => {
    setIsCommunitySaving(true);
    try {
      await discord.upsertCommunity({
        guild_id: newGuildId.trim(),
        channel_id: newChannelId.trim() || undefined,
        game_name: newGameName.trim() || undefined,
      });
      setNewGuildId('');
      setNewChannelId('');
      setNewGameName('');
      await refreshCommunities();
    } catch (e) {
      // optional: surface error to user later
    } finally {
      setIsCommunitySaving(false);
    }
  };

  const handleDeleteCommunity = async (gid: string) => {
    try {
      await discord.deleteCommunity(gid);
      await refreshCommunities();
    } catch {}
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <section className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Integrations</h2>
        
        <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/10 mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#9146FF]/10 text-[#9146FF] rounded-lg">
              <Twitch className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Twitch</h3>
              <p className="text-sm text-muted-foreground">
                {profile?.twitch_user_id 
                  ? `Connected${profile?.twitch_display_name ? ` as ${profile.twitch_display_name}` : ''}`
                  : 'Connect your Twitch account to auto-import stream data.'}
              </p>
            </div>
          </div>
          {profile?.twitch_user_id ? (
             <div className="flex items-center gap-2 text-green-500 font-medium text-sm">
               <Check className="h-4 w-4" /> Connected
             </div>
          ) : (
            <button 
              onClick={handleLinkTwitch}
              className="bg-[#9146FF] text-white hover:bg-[#9146FF]/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Connect
            </button>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-secondary/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#5865F2]/10 text-[#5865F2] rounded-lg">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">Discord</h3>
              <p className="text-sm text-muted-foreground">
                {discordId
                  ? `Connected (ID: ${discordId})`
                  : 'Connect your Discord account to sync roles and rewards.'}
              </p>
            </div>
          </div>
          {discordId ? (
             <div className="flex items-center gap-2 text-green-500 font-medium text-sm">
               <Check className="h-4 w-4" /> Connected
             </div>
          ) : (
            <button 
              onClick={() => {
                const clientId = '1329244829716779134'; 
                const redirectUri = encodeURIComponent(window.location.origin + '/auth/discord/callback');
                const scope = encodeURIComponent('identify email');
                window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
              }}
              className="bg-[#5865F2] text-white hover:bg-[#5865F2]/90 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Connect
            </button>
          )}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Communities</h2>
        
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              value={newGuildId}
              onChange={(e) => setNewGuildId(e.target.value)}
              placeholder="Discord Server ID (guild_id)"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              value={newChannelId}
              onChange={(e) => setNewChannelId(e.target.value)}
              placeholder="Go Live Channel ID (optional)"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <input
              type="text"
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              placeholder="Game Name (optional, e.g. RedM)"
              className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleAddCommunity}
            disabled={isCommunitySaving || !newGuildId.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isCommunitySaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Community
          </button>
        </div>

        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Your communities</div>
          {communities.length === 0 ? (
            <div className="text-sm text-muted-foreground">No communities added yet.</div>
          ) : (
            <div className="space-y-2">
              {communities.map((c) => (
                <div key={c.guild_id} className="flex items-center justify-between p-3 border border-border rounded-md">
                  <div className="text-sm">
                    <div className="font-medium">{c.guild_name || c.guild_id}</div>
                    <div className="text-muted-foreground text-xs">Channel: {c.go_live_channel_id || '—'}{c.game_name ? ` • Game: ${c.game_name}` : ''}</div>
                  </div>
                  <button
                    onClick={() => handleDeleteCommunity(c.guild_id)}
                    className="text-destructive text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        {message && (
          <div className="bg-green-500/10 text-green-500 text-sm p-3 rounded-md mb-4">
            {message}
          </div>
        )}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="display-name">Display Name</label>
            <input 
              id="display-name"
              name="display-name"
              type="text" 
              className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              defaultValue={profile?.display_name || ''}
              placeholder="Your streamer name"
            />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Email</label>
             <div className="text-sm text-muted-foreground">{profile?.email}</div>
          </div>
           <button 
            disabled={isSaving}
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </section>
    </div>
  );
}
