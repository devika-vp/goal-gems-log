import { Subject } from '@/types/study';

interface SubjectWithHours extends Subject {
  hours: number;
}

interface SubjectBreakdownProps {
  subjects: SubjectWithHours[];
}

export function SubjectBreakdown({ subjects }: SubjectBreakdownProps) {
  const totalHours = subjects.reduce((sum, s) => sum + s.hours, 0);

  if (subjects.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No study sessions recorded this month.</p>
        <p className="text-xs mt-1">Add a session to see your subject breakdown.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subjects.map((subject, index) => {
        const percentage = totalHours > 0 ? (subject.hours / totalHours) * 100 : 0;
        
        return (
          <div 
            key={subject.id} 
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: subject.color }}
                />
                <span className="text-sm font-medium">{subject.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {subject.hours.toFixed(1)}h
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out animate-progress"
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: subject.color 
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
