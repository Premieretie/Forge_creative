import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export function DiscordCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get('code');
    if (!code) {
      setError('No authorization code received from Discord.');
      return;
    }

    const handleCallback = async () => {
      try {
        const redirectUri = window.location.origin + '/auth/discord/callback';
        const data = await auth.discordLogin(code, redirectUri);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ 
            id: data.id, 
            email: data.email,
            display_name: data.display_name 
        }));
        
        navigate('/dashboard');
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to login with Discord.');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md max-w-md text-center border border-destructive/20">
          <h3 className="font-bold mb-2">Login Failed</h3>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-4 bg-background border border-input px-4 py-2 rounded hover:bg-accent transition-colors text-foreground"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-muted-foreground">Authenticating with Discord...</p>
    </div>
  );
}
