import { useState } from 'react';
import { AcademicEvent, EventType, Subject } from '@/types/study';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, FileText, GraduationCap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, parseISO, differenceInDays, isToday, isPast } from 'date-fns';

interface AcademicEventsProps {
  events: AcademicEvent[];
  subjects: Subject[];
  onAddEvent: (title: string, subject: string, date: string, type: EventType) => void;
  onToggleEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

export function AcademicEvents({ 
  events, 
  subjects,
  onAddEvent, 
  onToggleEvent, 
  onDeleteEvent 
}: AcademicEventsProps) {
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState<EventType>('assignment');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newSubject && newDate) {
      onAddEvent(newTitle.trim(), newSubject, newDate, newType);
      setNewTitle('');
      setNewSubject('');
      setNewDate('');
    }
  };

  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));
  const upcomingEvents = sortedEvents.filter(e => !e.completed);
  const completedEvents = sortedEvents.filter(e => e.completed);

  const getEventStatus = (date: string, completed: boolean) => {
    if (completed) return 'completed';
    const eventDate = parseISO(date);
    if (isPast(eventDate) && !isToday(eventDate)) return 'overdue';
    const daysLeft = differenceInDays(eventDate, new Date());
    if (daysLeft <= 2) return 'urgent';
    if (daysLeft <= 7) return 'upcoming';
    return 'normal';
  };

  const statusColors = {
    completed: 'border-success/50 bg-success/5',
    overdue: 'border-danger bg-danger/10',
    urgent: 'border-warning bg-warning/10',
    upcoming: 'border-primary/50 bg-primary/5',
    normal: 'border-border/50 bg-muted/30',
  };

  const statusBadge = {
    overdue: { text: 'Overdue', class: 'bg-danger text-danger-foreground' },
    urgent: { text: 'Due Soon', class: 'bg-warning text-warning-foreground' },
  };

  return (
    <div className="space-y-4">
      {/* Add new event form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Assignment or exam title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-muted/50"
          />
          <Select value={newType} onValueChange={(v: EventType) => setNewType(v)}>
            <SelectTrigger className="w-32 bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="assignment">
                <span className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Assignment
                </span>
              </SelectItem>
              <SelectItem value="exam">
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5" /> Exam
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Select value={newSubject} onValueChange={setNewSubject}>
            <SelectTrigger className="flex-1 bg-muted/50">
              <SelectValue placeholder="Select subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map(subject => (
                <SelectItem key={subject.id} value={subject.name}>
                  <span className="flex items-center gap-2">
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: subject.color }}
                    />
                    {subject.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-40 bg-muted/50"
          />
          <Button type="submit" size="icon" variant="secondary">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </form>

      {/* Events list */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {upcomingEvents.length === 0 && completedEvents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No assignments or exams tracked. Add your first one above!
          </p>
        ) : (
          <>
            {upcomingEvents.map((event) => {
              const status = getEventStatus(event.date, event.completed);
              const subject = subjects.find(s => s.name === event.subject);
              const daysLeft = differenceInDays(parseISO(event.date), new Date());

              return (
                <div 
                  key={event.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-all',
                    statusColors[status]
                  )}
                >
                  <Checkbox
                    checked={event.completed}
                    onCheckedChange={() => onToggleEvent(event.id)}
                    className="border-primary data-[state=checked]:bg-success data-[state=checked]:border-success"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">{event.title}</span>
                      {event.type === 'exam' ? (
                        <GraduationCap className="w-3.5 h-3.5 text-primary" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                      {(status === 'overdue' || status === 'urgent') && (
                        <span className={cn(
                          'text-[10px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-1',
                          statusBadge[status].class
                        )}>
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {statusBadge[status].text}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      {subject && (
                        <span className="flex items-center gap-1">
                          <span 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: subject.color }}
                          />
                          {subject.name}
                        </span>
                      )}
                      <span>•</span>
                      <span>
                        {format(parseISO(event.date), 'MMM d, yyyy')}
                        {daysLeft >= 0 && !isToday(parseISO(event.date)) && (
                          <span className="ml-1">({daysLeft} day{daysLeft !== 1 ? 's' : ''} left)</span>
                        )}
                        {isToday(parseISO(event.date)) && (
                          <span className="ml-1 text-warning">(Today!)</span>
                        )}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-danger"
                    onClick={() => onDeleteEvent(event.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              );
            })}

            {completedEvents.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-2">Completed</p>
                {completedEvents.slice(0, 3).map((event) => {
                  const subject = subjects.find(s => s.name === event.subject);
                  return (
                    <div 
                      key={event.id}
                      className={cn(
                        'flex items-center gap-3 p-2 rounded-lg border opacity-60 mb-1',
                        statusColors.completed
                      )}
                    >
                      <Checkbox
                        checked={event.completed}
                        onCheckedChange={() => onToggleEvent(event.id)}
                        className="border-success data-[state=checked]:bg-success data-[state=checked]:border-success"
                      />
                      <span className="flex-1 text-sm line-through text-muted-foreground truncate">
                        {event.title}
                      </span>
                      {subject && (
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: subject.color }}
                        />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-danger"
                        onClick={() => onDeleteEvent(event.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
