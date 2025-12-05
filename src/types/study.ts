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
