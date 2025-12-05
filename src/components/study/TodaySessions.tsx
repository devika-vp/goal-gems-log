import { StudySession, Subject } from '@/types/study';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TodaySessionsProps {
  sessions: StudySession[];
  subjects: Subject[];
  onDeleteSession: (id: string) => void;
}

export function TodaySessions({ sessions, subjects, onDeleteSession }: TodaySessionsProps) {
  const getSubjectColor = (subjectName: string) => {
    const subject = subjects.find(s => s.name === subjectName);
    return subject?.color || 'hsl(var(--muted))';
  };

  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="w-10 h-10 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No sessions logged today.</p>
        <p className="text-xs mt-1">Start studying and add your first session!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sessions.map((session, index) => (
        <div 
          key={session.id}
          className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border border-border/50 animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-2 h-10 rounded-full"
              style={{ backgroundColor: getSubjectColor(session.subject) }}
            />
            <div>
              <p className="font-medium text-sm">{session.subject}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(session.date), 'h:mm a')}
                {session.notes && ` • ${session.notes}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold text-foreground">
              {session.hours}h
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-danger"
              onClick={() => onDeleteSession(session.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
