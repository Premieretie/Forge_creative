import { useState, useEffect } from 'react';
import { 
  format, 
  startOfWeek, 
  addDays, 
  startOfMonth, 
  endOfMonth, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { streams } from '@/lib/api';

interface StreamEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  category: string;
}

export function Schedule() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStreams();
  }, []);

  const loadStreams = async () => {
    try {
      const data = await streams.getAll();
      const formattedEvents = data.map((stream: any) => ({
        id: stream.id,
        title: stream.title || 'Untitled Stream',
        start: new Date(stream.started_at),
        end: new Date(stream.ended_at),
        category: stream.category
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CalendarIcon className="h-8 w-8 text-primary" />
          Schedule
        </h1>
        <div className="flex items-center gap-4 bg-card border border-border rounded-lg p-1">
          <button onClick={prevMonth} className="p-2 hover:bg-accent rounded-md transition-colors">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-lg font-medium min-w-[150px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-accent rounded-md transition-colors">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center font-medium text-muted-foreground py-4">
          {format(addDays(startDate, i), 'EEE')}
        </div>
      );
    }

    return <div className="grid grid-cols-7 border-b border-border">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        
        const dayEvents = events.filter(event => isSameDay(event.start, cloneDay));
        // const hasEvents = dayEvents.length > 0; // Unused variable

        days.push(
          <div
            key={day.toString()}
            className={cn(
              "min-h-[120px] border-r border-b border-border p-2 transition-colors hover:bg-accent/50 cursor-pointer relative",
              !isSameMonth(day, monthStart) && "text-muted-foreground bg-secondary/20",
              isSameDay(day, selectedDate) && "bg-primary/5",
              i === 6 && "border-r-0" // Remove right border for last column
            )}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <div className={cn(
              "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full mb-1",
              isSameDay(day, new Date()) && "bg-primary text-primary-foreground"
            )}>
              {formattedDate}
            </div>
            
            <div className="space-y-1">
              {dayEvents.map(event => (
                <div key={event.id} className="text-xs bg-primary/10 text-primary p-1.5 rounded border border-primary/20 truncate">
                  <div className="font-semibold truncate">{event.category}</div>
                  <div className="flex items-center gap-1 opacity-75 text-[10px]">
                    <Clock className="h-3 w-3" />
                    {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">{rows}</div>;
  };

  return (
    <div className="h-full flex flex-col">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}
    </div>
  );
}
