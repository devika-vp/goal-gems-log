export interface StudySession {
  id: string;
  subject: string;
  hours: number;
  date: string; // ISO date string
  notes?: string;
}

export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface DailyGoal {
  hours: number;
}

export type StatusType = 'success' | 'warning' | 'danger';

export interface StudyStats {
  dailyActual: number;
  dailyGoal: number;
  weeklyTotal: number;
  monthlyTotal: number;
  percentComplete: number;
  status: StatusType;
}

export interface ScheduleItem {
  id: string;
  time: string;
  task: string;
  completed: boolean;
  date: string; // ISO date string
}

export type EventType = 'assignment' | 'exam';

export interface AcademicEvent {
  id: string;
  title: string;
  subject: string;
  date: string; // ISO date string
  type: EventType;
  completed: boolean;
}

export interface TextbookReference {
  id: string;
  subject: string;
  title: string;
  author?: string;
  pages?: string;
  notes: string;
  createdAt: string; // ISO date string
}
