export type PlanType = 'Free' | 'Pro' | 'Business';

export interface Workspace {
  id: string;
  name: string;
  plan: PlanType;
  ownerId: string;
  members: WorkspaceMember[];
}

export interface WorkspaceMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Manager' | 'Member';
  avatar?: string;
  status: 'Active' | 'Pending';
}

export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Negotiation' | 'Won' | 'Lost';

export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'lead_created' | 'lead_updated' | 'deal_updated' | 'meeting_scheduled' | 'email_sent' | 'task_completed' | 'note_added';
  description: string;
  timestamp: string;
  user: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  industry: string;
  address: string;
  status: LeadStatus;
  tags: string[];
  value: number;
  score: number; // 0-100
  summary: string;
  notes: Note[];
  activities: Activity[];
  createdAt: string;
  workspaceId: string;
  assignedTo: string; // Member Name/ID
  avatar?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  industry: string;
  tags: string[];
  createdAt: string;
  workspaceId: string;
  avatar?: string;
}

export type DealStage = 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number; // percentage (0-100)
  closingDate: string;
  workspaceId: string;
  leadId?: string;
  assignedTo: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
export type TaskType = 'Call' | 'Meeting' | 'Proposal' | 'Follow-up';

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  type: TaskType;
  assignedTo: string;
  workspaceId: string;
  associatedWith?: {
    type: 'lead' | 'deal' | 'contact';
    id: string;
    name: string;
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  timestamp: string;
  read: boolean;
}
