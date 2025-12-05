import { useState, useEffect, useMemo } from 'react';
import { StudySession, Subject, DailyGoal, StudyStats, StatusType } from '@/types/study';
import { 
  startOfDay, 
  startOfWeek, 
  startOfMonth, 
  endOfDay, 
  endOfWeek, 
  endOfMonth,
  isWithinInterval,
  parseISO
} from 'date-fns';

const DEFAULT_SUBJECTS: Subject[] = [
  { id: '1', name: 'Mathematics', color: 'hsl(222 47% 40%)' },
  { id: '2', name: 'Science', color: 'hsl(160 60% 45%)' },
  { id: '3', name: 'History', color: 'hsl(38 92% 50%)' },
  { id: '4', name: 'Language', color: 'hsl(280 65% 60%)' },
  { id: '5', name: 'Programming', color: 'hsl(200 80% 50%)' },
];

const STORAGE_KEYS = {
  sessions: 'study-tracker-sessions',
  subjects: 'study-tracker-subjects',
  dailyGoal: 'study-tracker-daily-goal',
};

export function useStudyTracker() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({ hours: 6 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedSessions = localStorage.getItem(STORAGE_KEYS.sessions);
    const storedSubjects = localStorage.getItem(STORAGE_KEYS.subjects);
    const storedGoal = localStorage.getItem(STORAGE_KEYS.dailyGoal);

    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
    if (storedGoal) {
      setDailyGoal(JSON.parse(storedGoal));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(sessions));
    }
  }, [sessions, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.subjects, JSON.stringify(subjects));
    }
  }, [subjects, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.dailyGoal, JSON.stringify(dailyGoal));
    }
  }, [dailyGoal, isLoaded]);

  // Calculate stats
  const stats: StudyStats = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);
    const weekStart = startOfWeek(now, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const dailyActual = sessions
      .filter(s => {
        const sessionDate = parseISO(s.date);
        return isWithinInterval(sessionDate, { start: todayStart, end: todayEnd });
      })
      .reduce((sum, s) => sum + s.hours, 0);

    const weeklyTotal = sessions
      .filter(s => {
        const sessionDate = parseISO(s.date);
        return isWithinInterval(sessionDate, { start: weekStart, end: weekEnd });
      })
      .reduce((sum, s) => sum + s.hours, 0);

    const monthlyTotal = sessions
      .filter(s => {
        const sessionDate = parseISO(s.date);
        return isWithinInterval(sessionDate, { start: monthStart, end: monthEnd });
      })
      .reduce((sum, s) => sum + s.hours, 0);

    const percentComplete = dailyGoal.hours > 0 
      ? Math.min((dailyActual / dailyGoal.hours) * 100, 100) 
      : 0;

    let status: StatusType = 'danger';
    if (percentComplete >= 100) {
      status = 'success';
    } else if (percentComplete >= 50) {
      status = 'warning';
    }

    return {
      dailyActual,
      dailyGoal: dailyGoal.hours,
      weeklyTotal,
      monthlyTotal,
      percentComplete,
      status,
    };
  }, [sessions, dailyGoal]);

  // Subject-wise hours (monthly)
  const subjectHours = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlySessions = sessions.filter(s => {
      const sessionDate = parseISO(s.date);
      return isWithinInterval(sessionDate, { start: monthStart, end: monthEnd });
    });

    return subjects.map(subject => {
      const hours = monthlySessions
        .filter(s => s.subject === subject.name)
        .reduce((sum, s) => sum + s.hours, 0);
      return { ...subject, hours };
    }).filter(s => s.hours > 0);
  }, [sessions, subjects]);

  // Add session
  const addSession = (session: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      ...session,
      id: Date.now().toString(),
    };
    setSessions(prev => [...prev, newSession]);
  };

  // Delete session
  const deleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  // Update daily goal
  const updateDailyGoal = (hours: number) => {
    setDailyGoal({ hours });
  };

  // Add subject
  const addSubject = (name: string, color: string) => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name,
      color,
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  // Get today's sessions
  const todaySessions = useMemo(() => {
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    return sessions.filter(s => {
      const sessionDate = parseISO(s.date);
      return isWithinInterval(sessionDate, { start: todayStart, end: todayEnd });
    });
  }, [sessions]);

  return {
    sessions,
    subjects,
    dailyGoal,
    stats,
    subjectHours,
    todaySessions,
    addSession,
    deleteSession,
    updateDailyGoal,
    addSubject,
    isLoaded,
  };
}
