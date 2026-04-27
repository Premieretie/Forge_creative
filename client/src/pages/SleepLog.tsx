import { useState, useEffect } from 'react';
import { Moon, Clock, History, Loader2 } from 'lucide-react';
import { health } from '@/lib/api';
import { format } from 'date-fns';

interface SleepLog {
  id: number;
  value: number;
  notes: string;
  logged_at: string;
}

export function SleepLog() {
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [hours, setHours] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await health.getLogs('sleep');
      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await health.log({
        type: 'sleep',
        value: parseFloat(hours),
        notes
      });
      
      setHours('');
      setNotes('');
      loadLogs();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Moon className="h-8 w-8 text-primary" />
        Sleep Log
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Log Sleep
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Duration (Hours)</label>
              <input 
                type="number" 
                step="0.5"
                min="0"
                max="24"
                required
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g. 7.5"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                rows={3}
                placeholder="How did you sleep?"
              />
            </div>

            <button 
              disabled={isSubmitting}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Log'}
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <History className="h-5 w-5" />
            Recent History
          </h2>

          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No sleep logs yet.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="p-4 rounded-lg bg-secondary/20 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-lg">{log.value} hrs</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(log.logged_at), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  {log.notes && (
                    <p className="text-sm text-muted-foreground">{log.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
