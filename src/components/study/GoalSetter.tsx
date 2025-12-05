import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GoalSetterProps {
  currentGoal: number;
  onUpdateGoal: (hours: number) => void;
}

export function GoalSetter({ currentGoal, onUpdateGoal }: GoalSetterProps) {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(currentGoal.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const hoursNum = parseFloat(hours);
    if (isNaN(hoursNum) || hoursNum <= 0 || hoursNum > 24) {
      toast({
        title: 'Invalid goal',
        description: 'Please enter a valid number of hours (1-24).',
        variant: 'destructive',
      });
      return;
    }

    onUpdateGoal(hoursNum);
    toast({
      title: 'Goal updated!',
      description: `Your daily goal is now ${hoursNum} hours.`,
    });
    setOpen(false);
  };

  const presetGoals = [4, 6, 8, 10];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
          <Settings2 className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Set Daily Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="goal-hours">Hours per day</Label>
            <Input
              id="goal-hours"
              type="number"
              step="0.5"
              min="1"
              max="24"
              placeholder="6"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="text-center text-xl font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Quick select</Label>
            <div className="grid grid-cols-4 gap-2">
              {presetGoals.map((goal) => (
                <Button
                  key={goal}
                  type="button"
                  variant={hours === goal.toString() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setHours(goal.toString())}
                >
                  {goal}h
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
