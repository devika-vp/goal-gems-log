import { useState, useMemo } from 'react';
import { AcademicEvent, StudySession, Subject } from '@/types/study';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, FileText, GraduationCap, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  parseISO,
  isToday
} from 'date-fns';

interface CalendarViewProps {
  sessions: StudySession[];
  events: AcademicEvent[];
  subjects: Subject[];
}

interface DayData {
  sessions: StudySession[];
  events: AcademicEvent[];
  totalHours: number;
}

export function CalendarView({ sessions, events, subjects }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentMonth]);

  const getDayData = (day: Date): DayData => {
    const dayStr = format(day, 'yyyy-MM-dd');
    
    const daySessions = sessions.filter(s => {
      const sessionDate = parseISO(s.date);
      return isSameDay(sessionDate, day);
    });

    const dayEvents = events.filter(e => e.date === dayStr);

    const totalHours = daySessions.reduce((sum, s) => sum + s.hours, 0);

    return { sessions: daySessions, events: dayEvents, totalHours };
  };

  const getSubjectColor = (subjectName: string): string => {
    const subject = subjects.find(s => s.name === subjectName);
    return subject?.color || 'hsl(var(--muted))';
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-bold">
          {format(currentMonth, 'MMMM yyyy')}
        </h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigateMonth('prev')}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigateMonth('next')}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-primary" />
          <span className="text-muted-foreground">Study Session</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-warning" />
          <span className="text-muted-foreground">Assignment</span>
        </div>
        <div className="flex items-center gap-1.5">
          <GraduationCap className="w-3.5 h-3.5 text-danger" />
          <span className="text-muted-foreground">Exam</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="border border-border rounded-xl overflow-hidden">
        {/* Week days header */}
        <div className="grid grid-cols-7 bg-muted/50">
          {weekDays.map(day => (
            <div 
              key={day} 
              className="py-2 text-center text-xs font-medium text-muted-foreground border-b border-border"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayData = getDayData(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);
            const hasEvents = dayData.events.length > 0 || dayData.sessions.length > 0;

            return (
              <div
                key={idx}
                className={cn(
                  'min-h-24 p-1.5 border-b border-r border-border transition-colors',
                  !isCurrentMonth && 'bg-muted/30',
                  isCurrentDay && 'bg-primary/5',
                  idx % 7 === 6 && 'border-r-0'
                )}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    'text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
                    !isCurrentMonth && 'text-muted-foreground',
                    isCurrentDay && 'bg-primary text-primary-foreground'
                  )}>
                    {format(day, 'd')}
                  </span>
                  {dayData.totalHours > 0 && (
                    <span className="text-[10px] text-success font-medium">
                      {dayData.totalHours.toFixed(1)}h
                    </span>
                  )}
                </div>

                {/* Events */}
                {hasEvents && (
                  <div className="space-y-0.5 overflow-hidden">
                    {/* Study sessions summary */}
                    {dayData.sessions.length > 0 && (
                      <div className="flex flex-wrap gap-0.5">
                        {dayData.sessions.slice(0, 3).map((session, i) => (
                          <div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getSubjectColor(session.subject) }}
                            title={`${session.subject}: ${session.hours}h`}
                          />
                        ))}
                        {dayData.sessions.length > 3 && (
                          <span className="text-[9px] text-muted-foreground">
                            +{dayData.sessions.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Academic events */}
                    {dayData.events.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded truncate',
                          event.type === 'exam' 
                            ? 'bg-danger/20 text-danger' 
                            : 'bg-warning/20 text-warning',
                          event.completed && 'line-through opacity-60'
                        )}
                        title={event.title}
                      >
                        <span className="flex items-center gap-1">
                          {event.type === 'exam' ? (
                            <GraduationCap className="w-2.5 h-2.5 flex-shrink-0" />
                          ) : (
                            <FileText className="w-2.5 h-2.5 flex-shrink-0" />
                          )}
                          <span className="truncate">{event.title}</span>
                        </span>
                      </div>
                    ))}
                    {dayData.events.length > 2 && (
                      <div className="text-[9px] text-muted-foreground pl-1">
                        +{dayData.events.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <p className="text-2xl font-bold font-display text-primary">
            {sessions.filter(s => isSameMonth(parseISO(s.date), currentMonth)).reduce((sum, s) => sum + s.hours, 0).toFixed(1)}h
          </p>
          <p className="text-xs text-muted-foreground">Total Study Hours</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <p className="text-2xl font-bold font-display text-warning">
            {events.filter(e => e.type === 'assignment' && isSameMonth(parseISO(e.date), currentMonth)).length}
          </p>
          <p className="text-xs text-muted-foreground">Assignments</p>
        </div>
        <div className="p-3 rounded-lg bg-muted/30 text-center">
          <p className="text-2xl font-bold font-display text-danger">
            {events.filter(e => e.type === 'exam' && isSameMonth(parseISO(e.date), currentMonth)).length}
          </p>
          <p className="text-xs text-muted-foreground">Exams</p>
        </div>
      </div>
    </div>
  );
}
