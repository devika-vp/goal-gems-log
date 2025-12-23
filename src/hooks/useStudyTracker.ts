import { useState, useEffect, useMemo } from 'react';
import { StudySession, Subject, DailyGoal, StudyStats, StatusType, ScheduleItem, AcademicEvent, EventType, TextbookReference } from '@/types/study';
import { 
  startOfDay, 
  startOfWeek, 
  startOfMonth, 
  endOfDay, 
  endOfWeek, 
  endOfMonth,
  isWithinInterval,
  parseISO,
  format
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
  schedule: 'study-tracker-schedule',
  events: 'study-tracker-events',
  references: 'study-tracker-references',
};

export function useStudyTracker() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({ hours: 6 });
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [references, setReferences] = useState<TextbookReference[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const storedSessions = localStorage.getItem(STORAGE_KEYS.sessions);
    const storedSubjects = localStorage.getItem(STORAGE_KEYS.subjects);
    const storedGoal = localStorage.getItem(STORAGE_KEYS.dailyGoal);
    const storedSchedule = localStorage.getItem(STORAGE_KEYS.schedule);
    const storedEvents = localStorage.getItem(STORAGE_KEYS.events);
    const storedReferences = localStorage.getItem(STORAGE_KEYS.references);

    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
    if (storedGoal) {
      setDailyGoal(JSON.parse(storedGoal));
    }
    if (storedSchedule) {
      setSchedule(JSON.parse(storedSchedule));
    }
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    if (storedReferences) {
      setReferences(JSON.parse(storedReferences));
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

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(schedule));
    }
  }, [schedule, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
    }
  }, [events, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEYS.references, JSON.stringify(references));
    }
  }, [references, isLoaded]);

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

  // Today's schedule
  const todaySchedule = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return schedule.filter(s => s.date === today);
  }, [schedule]);

  // Schedule functions
  const addScheduleItem = (time: string, task: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      time,
      task,
      completed: false,
      date: today,
    };
    setSchedule(prev => [...prev, newItem]);
  };

  const toggleScheduleItem = (id: string) => {
    setSchedule(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const deleteScheduleItem = (id: string) => {
    setSchedule(prev => prev.filter(s => s.id !== id));
  };

  // Academic events functions
  const addEvent = (title: string, subject: string, date: string, type: EventType) => {
    const newEvent: AcademicEvent = {
      id: Date.now().toString(),
      title,
      subject,
      date,
      type,
      completed: false,
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const toggleEvent = (id: string) => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, completed: !event.completed } : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  // Textbook references functions
  const addReference = (subject: string, title: string, author: string, pages: string, notes: string, pdfUrl?: string, pdfName?: string) => {
    const newReference: TextbookReference = {
      id: Date.now().toString(),
      subject,
      title,
      author: author || undefined,
      pages: pages || undefined,
      notes,
      pdf_url: pdfUrl,
      pdf_name: pdfName,
      created_at: new Date().toISOString(),
    };
    setReferences(prev => [newReference, ...prev]);
  };

  const deleteReference = (id: string) => {
    setReferences(prev => prev.filter(r => r.id !== id));
  };

  return {
    sessions,
    subjects,
    dailyGoal,
    stats,
    subjectHours,
    todaySessions,
    todaySchedule,
    events,
    references,
    addSession,
    deleteSession,
    updateDailyGoal,
    addSubject,
    addScheduleItem,
    toggleScheduleItem,
    deleteScheduleItem,
    addEvent,
    toggleEvent,
    deleteEvent,
    addReference,
    deleteReference,
    isLoaded,
  };
}
