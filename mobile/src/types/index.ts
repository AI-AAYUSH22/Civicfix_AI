export type Severity = 'Low' | 'Medium' | 'High';

export type CivicStatus =
  | 'REPORTED'
  | 'VALIDATED'
  | 'ASSIGNED'
  | 'GROUND_LOCKED'
  | 'REPAIRING'
  | 'VERIFICATION'
  | 'REPAIRED_PENDING_VAL'
  | 'FLAGGED_ANOMALY'
  | 'VERIFIED_CLOSED'
  | 'VERIFIED'
  | 'NEEDS_REVIEW'
  | 'NOT_VERIFIED'
  | 'REJECTED'
  | 'CLOSED'
  // Title-case mappings
  | 'Reported'
  | 'Validated'
  | 'Assigned'
  | 'Ground Locked'
  | 'In Progress'
  | 'Under Repair'
  | 'AI Verification'
  | 'Evidence Submitted'
  | 'Needs Review'
  | 'Not Verified'
  | 'Verified'
  | 'Resolved'
  | 'Closed';

export type CaseStatus = CivicStatus;

export interface WardInfo {
  id: string;
  name: string;
  city: string;
  code: string;
  center_lat?: number;
  center_lng?: number;
  dbFile?: string;
}

export interface VerificationCheck {
  label: string;
  passed: boolean;
  detail: string;
}

export interface RepairVerification {
  status: 'Verified' | 'Needs Review' | 'Not Verified' | 'VERIFIED_CLOSED' | 'FLAGGED_ANOMALY';
  score?: number; // 0-100
  checks: VerificationCheck[];
  summary?: string;
  verifiedAt?: string;
}

export interface ExpenseMemoItem {
  id: string;
  case_id: string;
  work_order_id: string;
  ward_id: string;
  material_cost: number;
  labor_cost: number;
  machinery_cost: number;
  total_amount: number;
  asphalt_tonnage?: number;
  patch_area_sqm?: number;
  memo_hash: string;
  payment_status: 'APPROVED' | 'HOLD_PENDING_CV' | 'DISBURSED' | 'SUBMITTED';
  ai_verified: boolean;
  submitted_at?: string;
  approved_at?: string;
}

export interface PotholeCase {
  id: string;
  wardId: string;
  wardName?: string;
  wardCode?: string;
  location: string;
  landmark?: string;
  roadName?: string;
  city: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  severity: Severity;
  status: CaseStatus;
  description: string;
  reportedDate: string;
  assignedDate?: string;
  deadline?: string;
  contractor?: string;
  beforeImage?: string;
  afterImage?: string;
  verification?: RepairVerification;
  citizenName?: string;
  citizenPhone?: string;
  reportedBy?: string;
  channel?: 'APP' | 'WHATSAPP' | 'REDDIT' | 'PORTAL' | 'TELEGRAM';
  sourceUsername?: string;
  sourceUrl?: string;
  locationStatus?: string;
  expenseMemo?: ExpenseMemoItem;
}

export interface WorkOrder {
  id: string;
  caseId: string;
  title: string;
  location: string;
  landmark?: string;
  roadName?: string;
  ward: string;
  wardId?: string;
  wardCode?: string;
  wardDbName?: string;
  city?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  assignedDate?: string;
  dueDate: string;
  deadline?: string;
  completedDate?: string;
  contractorId?: string;
  contractorName?: string;
  beforePhotoCaptured?: boolean;
  beforePhotoUrl?: string;
  afterPhotoCaptured?: boolean;
  afterPhotoUrl?: string;
  citizenPhotoUrl?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  verification?: RepairVerification;
  expenseMemo?: ExpenseMemoItem;
}
