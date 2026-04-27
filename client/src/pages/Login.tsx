import { Activity, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { auth } from '@/lib/api';

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const data = await auth.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ id: data.id, email: data.email }));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 font-bold text-2xl text-primary mb-8">
        <Activity className="h-8 w-8" />
        StreamPulse
      </Link>
      
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome back</h1>
        <p className="text-muted-foreground text-center mb-6">Enter your credentials to access your dashboard.</p>
        
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">Email</label>
            <input 
              id="email"
              name="email"
              type="email" 
              required
              className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium" htmlFor="password">Password</label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <input 
              id="password"
              name="password"
              type="password" 
              required
              className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>
          
          <button 
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium transition-colors mt-2 flex items-center justify-center"
          >
             {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <button
          onClick={() => {
            const clientId = '1329244829716779134'; // Should ideally be in env
            const redirectUri = encodeURIComponent(window.location.origin + '/auth/discord/callback');
            const scope = encodeURIComponent('identify email');
            window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
          }}
          className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037 13.46 13.46 0 0 0-1.025 2.106 18.067 18.067 0 0 0-4.664 0 13.456 13.456 0 0 0-1.025-2.106.074.074 0 0 0-.079-.037A19.742 19.742 0 0 0 3.677 4.37a.072.072 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.074.074 0 0 0-.032-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.086 2.157 2.419 0 1.334-.946 2.419-2.157 2.419z"/>
          </svg>
          Login with Discord
        </button>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
