
export type Status = 'draft' | 'pending' | 'reject' | 'approved';

export interface Manpower {
  id: string;
  name: string;
  hours: number;
  isCustom: boolean;
}

export interface WorkSet {
  id: string;
  member: string;
  process: string;
  type: string;
  location: {
    block: string;
    dong: string;
    floor: string;
  };
  customMember?: string;
  customProcess?: string;
  customType?: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  receipt?: string; // base64 or url
}

export interface Photo {
  id: string;
  url: string;
  status: 'before' | 'after';
  desc?: string;
  timestamp: string;
}

export interface Drawing {
  id: string;
  url: string;
  status: 'progress' | 'complete';
  desc?: string;
  timestamp: string;
  drawObjects?: any[]; // For canvas saving
}

export interface Worklog {
  id: string;
  siteId: string;
  date: string; // YYYY-MM-DD
  manpower: Manpower[];
  workSets: WorkSet[];
  materials: Material[];
  photos: Photo[];
  drawings: Drawing[];
  status: Status;
  rejectReason?: string;
  updatedAt: string;
  version: number;
}

export interface Site {
  id: string;
  name: string;
  dept: string;
  contractor: string;
  address?: string;
  status: 'ing' | 'wait' | 'done';
  pinned?: boolean;
}
