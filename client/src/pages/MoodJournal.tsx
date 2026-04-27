import { useState, useEffect } from 'react';
import { Smile, History, Loader2, Send } from 'lucide-react';
import { health } from '@/lib/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface MoodLog {
  id: number;
  value: number;
  notes: string;
  logged_at: string;
}

const MOODS = [
  { emoji: '😡', value: 20, label: 'Angry' },
  { emoji: '😞', value: 40, label: 'Sad' },
  { emoji: '😐', value: 60, label: 'Neutral' },
  { emoji: '🙂', value: 80, label: 'Good' },
  { emoji: '😄', value: 100, label: 'Happy' },
];

export function MoodJournal() {
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await health.getLogs('mood');
      setLogs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) return;

    setIsSubmitting(true);
    try {
      await health.log({
        type: 'mood',
        value: selectedMood,
        notes
      });
      
      setSelectedMood(null);
      setNotes('');
      loadLogs();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEmoji = (value: number) => {
    const mood = MOODS.find(m => m.value >= value);
    return mood ? mood.emoji : '😐';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
        <Smile className="h-8 w-8 text-primary" />
        Mood Journal
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Send className="h-5 w-5" />
            Log Mood
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">How are you feeling?</label>
              <div className="grid grid-cols-5 gap-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={cn(
                      "aspect-square flex flex-col items-center justify-center gap-1 rounded-xl border-2 transition-all hover:bg-accent",
                      selectedMood === mood.value 
                        ? "border-primary bg-primary/5" 
                        : "border-transparent bg-secondary/50"
                    )}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-secondary/50 border border-input rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                rows={3}
                placeholder="What's on your mind?"
              />
            </div>

            <button 
              disabled={isSubmitting || !selectedMood}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <p className="text-muted-foreground text-center py-8">No mood logs yet.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="p-4 rounded-lg bg-secondary/20 border border-border flex gap-4 items-start">
                  <div className="text-4xl bg-background rounded-full p-2 shadow-sm">
                    {getEmoji(log.value)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-lg">
                        {MOODS.find(m => m.value >= log.value)?.label || 'Mood'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(log.logged_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    {log.notes && (
                      <p className="text-sm text-muted-foreground">{log.notes}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
