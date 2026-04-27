import { useEffect, useRef, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Battery, 
  Moon, 
  TrendingUp, 
  Calendar,
  LayoutDashboard,
  Menu,
  X,
  Settings,
  Gamepad2,
  Users,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { user as userApi, discord as discordApi, staff as staffApi } from '@/lib/api';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const [displayName, setDisplayName] = useState<string>('Streamer');
  const [avatarInitial, setAvatarInitial] = useState<string>('S');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [guilds, setGuilds] = useState<any[]>([]);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const profile = await userApi.getProfile();
        const name: string =
          profile?.twitch_display_name ||
          profile?.display_name ||
          (profile?.email ? String(profile.email).split('@')[0] : '') ||
          'Streamer';
        if (mounted) {
          setDisplayName(name);
          setAvatarInitial(name.charAt(0).toUpperCase());
        }
      } catch {
        // stay with defaults on error/unauthorized
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [dData, sData] = await Promise.all([
            discordApi.getConnections().catch(() => ({ guilds: [] })),
            staffApi.getCommunities().catch(() => ({ communities: [] }))
        ]);
        
        if (mounted) {
            setGuilds(Array.isArray(dData?.guilds) ? dData.guilds : []);
            setIsStaff(Array.isArray(sData?.communities) && sData.communities.length > 0);
        }
      } catch {
        if (mounted) {
            setGuilds([]);
            setIsStaff(false);
        }
      }
    })();
    return () => { mounted = false; };
  }, [location.pathname]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!userMenuRef.current) return;
      if (!userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Calendar, label: 'Schedule', path: '/dashboard/schedule' },
    { icon: TrendingUp, label: 'Insights', path: '/dashboard/insights' },
  ];

  const healthItems = [
    { icon: Moon, label: 'Sleep Log', path: '/dashboard/sleep' },
    { icon: Battery, label: 'Mood Journal', path: '/dashboard/mood' },
  ];

  const gameItems = guilds.map((g) => ({ 
    icon: Gamepad2, 
    label: g.game_name || g.name, 
    path: `/dashboard/games/${g.id}` 
  }));

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 flex items-center px-6 font-bold text-xl text-primary border-b border-border">
          <Activity className="h-6 w-6 mr-2" />
          StreamPulse
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
          
          <div className="pt-8 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
            Health
          </div>
          
          {healthItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}

          <div className="pt-8 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
            Communities Connected
          </div>
          {gameItems.length === 0 && (
            <div className="px-4 py-2 text-xs text-muted-foreground">No communities connected</div>
          )}
          {gameItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors",
                location.pathname === item.path 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}

          <div className="pt-8 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">
            Settings
          </div>
          <Link 
            to="/dashboard/settings" 
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors",
              location.pathname === '/dashboard/settings'
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Settings className="h-5 w-5" />
            Integrations
          </Link>
          <Link 
            to="/dashboard/owner" 
            className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors",
              location.pathname.startsWith('/dashboard/owner')
                ? "bg-primary/10 text-primary" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Users className="h-5 w-5" />
            Owner Portal
          </Link>
          {isStaff && (
            <Link 
                to="/dashboard/staff" 
                className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-md font-medium transition-colors",
                location.pathname.startsWith('/dashboard/staff')
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
            >
                <Shield className="h-5 w-5" />
                Staff Portal
            </Link>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 md:px-8">
          <button 
            className="md:hidden p-2 -ml-2 text-muted-foreground"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>
          <div className="font-medium">Welcome back, {displayName}</div>
          <div className="relative" ref={userMenuRef}>
            <button
              className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold focus:outline-none focus:ring-2 focus:ring-primary/40"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
            >
              {avatarInitial}
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-md shadow-lg py-1 z-50">
                <Link
                  to="/dashboard/settings"
                  className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Account
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setUserMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
