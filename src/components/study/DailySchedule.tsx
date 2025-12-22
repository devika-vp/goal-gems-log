import { useState } from 'react';
import { ScheduleItem } from '@/types/study';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyScheduleProps {
  schedule: ScheduleItem[];
  onAddItem: (time: string, task: string) => void;
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export function DailySchedule({ 
  schedule, 
  onAddItem, 
  onToggleItem, 
  onDeleteItem 
}: DailyScheduleProps) {
  const [newTime, setNewTime] = useState('09:00');
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      onAddItem(newTime, newTask.trim());
      setNewTask('');
    }
  };

  const sortedSchedule = [...schedule].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="space-y-4">
      {/* Add new item form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="w-28 bg-muted/50"
        />
        <Input
          type="text"
          placeholder="Add a task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="flex-1 bg-muted/50"
        />
        <Button type="submit" size="icon" variant="secondary">
          <Plus className="w-4 h-4" />
        </Button>
      </form>

      {/* Schedule list */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
        {sortedSchedule.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            No tasks scheduled for today. Add your first task above!
          </p>
        ) : (
          sortedSchedule.map((item) => (
            <div 
              key={item.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50 transition-all',
                item.completed && 'opacity-60'
              )}
            >
              <Checkbox
                checked={item.completed}
                onCheckedChange={() => onToggleItem(item.id)}
                className="border-primary data-[state=checked]:bg-success data-[state=checked]:border-success"
              />
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span className="font-mono">{item.time}</span>
              </div>
              <span className={cn(
                'flex-1 text-sm',
                item.completed && 'line-through text-muted-foreground'
              )}>
                {item.task}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-danger"
                onClick={() => onDeleteItem(item.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>

      {/* Progress indicator */}
      {sortedSchedule.length > 0 && (
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            {sortedSchedule.filter(s => s.completed).length} of {sortedSchedule.length} tasks completed
          </p>
        </div>
      )}
    </div>
  );
}
