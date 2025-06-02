export type Task = {
  id: string;
  name: string;
  time: Date;
  duration: number; // in minutes
  recurrence: "none" | "daily" | "weekly" | "biweekly";
  assignee?: string;
  allDay?: boolean;
};