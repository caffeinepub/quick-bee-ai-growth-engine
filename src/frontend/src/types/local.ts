// Local type definitions for types not exported from backend
export interface Deal {
  id: string;
  leadId: string;
  agency: string;
  status: string;
  value: number;
  createdAt: number;
  closeDate?: number;
}

export interface OutreachActivity {
  leadId: string;
  platform: string;
  message: string;
  sent: boolean;
  replied: boolean;
  followUpDate: number;
  createdAt: number;
}
