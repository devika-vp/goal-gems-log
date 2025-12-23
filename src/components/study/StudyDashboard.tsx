import { useStudyTracker } from '@/hooks/useStudyTracker';
import { ProgressRing } from './ProgressRing';
import { StatCard } from './StatCard';
import { SubjectBreakdown } from './SubjectBreakdown';
import { AddSessionDialog } from './AddSessionDialog';
import { GoalSetter } from './GoalSetter';
import { TodaySessions } from './TodaySessions';
import { DailySchedule } from './DailySchedule';
import { AcademicEvents } from './AcademicEvents';
import { CalendarView } from './CalendarView';
import { TextbookNotes } from './TextbookNotes';
import { Target, TrendingUp, Calendar, BookOpen, ClipboardList, CalendarCheck, CalendarDays, BookText } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StudyDashboard() {
  const {
    sessions,
    subjects,
    stats,
    subjectHours,
    todaySessions,
    todaySchedule,
    events,
    references,
    addSession,
    deleteSession,
    updateDailyGoal,
    addScheduleItem,
    toggleScheduleItem,
    deleteScheduleItem,
    addEvent,
    toggleEvent,
    deleteEvent,
    addReference,
    deleteReference,
    isLoaded,
  } = useStudyTracker();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const statusMessages = {
    success: "Amazing work! You've crushed your goal today! 🎉",
    warning: "You're making progress! Keep going! 💪",
    danger: "Time to hit the books! You can do this! 📚",
  };

  const statusColors = {
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold">Study Tracker</h1>
              <p className="text-xs text-muted-foreground">Track your learning journey</p>
            </div>
          </div>
          <AddSessionDialog subjects={subjects} onAddSession={addSession} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section - Daily Progress */}
        <section className="animate-fade-in">
          <div className="bg-card rounded-2xl border border-border shadow-card p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Progress Ring */}
              <div className="flex-shrink-0">
                <ProgressRing 
                  percentage={stats.percentComplete} 
                  status={stats.status}
                  size={220}
                  strokeWidth={14}
                >
                  <div className="text-center">
                    <p className={cn(
                      'text-5xl font-bold font-display',
                      statusColors[stats.status]
                    )}>
                      {Math.round(stats.percentComplete)}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">completed</p>
                  </div>
                </ProgressRing>
              </div>

              {/* Daily Stats */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                    <h2 className="text-2xl font-display font-bold">Today's Progress</h2>
                    <GoalSetter currentGoal={stats.dailyGoal} onUpdateGoal={updateDailyGoal} />
                  </div>
                  <p className={cn('text-sm font-medium', statusColors[stats.status])}>
                    {statusMessages[stats.status]}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Studied</p>
                    <p className="text-3xl font-bold font-display">{stats.dailyActual.toFixed(1)}h</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Goal</p>
                    <p className="text-3xl font-bold font-display">{stats.dailyGoal}h</p>
                  </div>
                </div>

                {/* Linear Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0h</span>
                    <span>{stats.dailyGoal}h</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full transition-all duration-1000 ease-out',
                        stats.status === 'success' && 'bg-success shadow-glow-success',
                        stats.status === 'warning' && 'bg-warning shadow-glow-warning',
                        stats.status === 'danger' && 'bg-danger shadow-glow-danger',
                      )}
                      style={{ width: `${Math.min(stats.percentComplete, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Daily Goal"
            value={`${stats.dailyGoal}h`}
            subtitle="Target hours per day"
            icon={Target}
            variant={stats.percentComplete >= 100 ? 'success' : 'default'}
            delay={100}
          />
          <StatCard
            title="Weekly Total"
            value={`${stats.weeklyTotal.toFixed(1)}h`}
            subtitle="This week's study time"
            icon={TrendingUp}
            delay={200}
          />
          <StatCard
            title="Monthly Total"
            value={`${stats.monthlyTotal.toFixed(1)}h`}
            subtitle="This month's progress"
            icon={Calendar}
            delay={300}
          />
        </section>

        {/* Daily Schedule & Academic Events */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Schedule */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 animate-fade-in" style={{ animationDelay: '350ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Daily Schedule</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Plan your study tasks for today</p>
            <DailySchedule 
              schedule={todaySchedule}
              onAddItem={addScheduleItem}
              onToggleItem={toggleScheduleItem}
              onDeleteItem={deleteScheduleItem}
            />
          </div>

          {/* Assignments & Exams */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex items-center gap-2 mb-4">
              <CalendarCheck className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Assignments & Exams</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Track upcoming deadlines</p>
            <AcademicEvents 
              events={events}
              subjects={subjects}
              onAddEvent={addEvent}
              onToggleEvent={toggleEvent}
              onDeleteEvent={deleteEvent}
            />
          </div>
        </section>

        {/* Calendar View */}
        <section className="animate-fade-in" style={{ animationDelay: '450ms' }}>
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Monthly Calendar</h3>
            </div>
            <CalendarView 
              sessions={sessions}
              events={events}
              subjects={subjects}
            />
          </div>
        </section>

        {/* Textbook References & Notes */}
        <section className="animate-fade-in" style={{ animationDelay: '500ms' }}>
          <div className="bg-card rounded-2xl border border-border shadow-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <BookText className="w-5 h-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Textbook References & Notes</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Store important references and study notes</p>
            <TextbookNotes 
              references={references}
              subjects={subjects}
              onAddReference={addReference}
              onDeleteReference={deleteReference}
            />
          </div>
        </section>

        {/* Two Column Layout - Subject & Sessions */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subject Breakdown */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 animate-fade-in" style={{ animationDelay: '550ms' }}>
            <h3 className="font-display text-lg font-semibold mb-4">Subject Breakdown</h3>
            <p className="text-xs text-muted-foreground mb-4">Monthly hours by subject</p>
            <SubjectBreakdown subjects={subjectHours} />
          </div>

          {/* Today's Sessions */}
          <div className="bg-card rounded-2xl border border-border shadow-card p-6 animate-fade-in" style={{ animationDelay: '600ms' }}>
            <h3 className="font-display text-lg font-semibold mb-4">Today's Sessions</h3>
            <p className="text-xs text-muted-foreground mb-4">{todaySessions.length} session{todaySessions.length !== 1 ? 's' : ''} logged</p>
            <TodaySessions 
              sessions={todaySessions} 
              subjects={subjects}
              onDeleteSession={deleteSession}
            />
          </div>
        </section>
      </main>
    </div>
  );
}
