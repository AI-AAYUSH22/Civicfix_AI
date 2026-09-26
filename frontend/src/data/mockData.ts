import type { Ward, PotholeCase } from '@/types';

export const wards: Ward[] = [
  { id: 'A', name: 'Ward A - Churchgate, Colaba, Fort', city: 'Mumbai', pendingCount: 12 },
  { id: 'B', name: 'Ward B - Masjid Bunder, Dongri', city: 'Mumbai', pendingCount: 12 },
  { id: 'C', name: 'Ward C - Pydhonie, Bhuleshwar', city: 'Mumbai', pendingCount: 12 },
  { id: 'D', name: 'Ward D - Malabar Hill, Grant Road', city: 'Mumbai', pendingCount: 12 },
  { id: 'E', name: 'Ward E - Byculla, Nagpada', city: 'Mumbai', pendingCount: 12 },
  { id: 'F/N', name: 'Ward F/North - Matunga, Sion', city: 'Mumbai', pendingCount: 12 },
  { id: 'F/S', name: 'Ward F/South - Parel, Sewri', city: 'Mumbai', pendingCount: 12 },
  { id: 'G/N', name: 'Ward G/North - Dadar, Dharavi', city: 'Mumbai', pendingCount: 12 },
  { id: 'G/S', name: 'Ward G/South - Worli, Lower Parel', city: 'Mumbai', pendingCount: 12 },
  { id: 'H/E', name: 'Ward H/East - Santacruz East, Kalina', city: 'Mumbai', pendingCount: 12 },
  { id: 'H/W', name: 'Ward H/West - Bandra West', city: 'Mumbai', pendingCount: 12 },
  { id: 'K/E', name: 'Ward K/East - Andheri East', city: 'Mumbai', pendingCount: 12 },
  { id: 'K/W', name: 'Ward K/West - Andheri West', city: 'Mumbai', pendingCount: 12 },
  { id: 'P/N', name: 'Ward P/North - Malad', city: 'Mumbai', pendingCount: 12 },
  { id: 'P/S', name: 'Ward P/South - Goregaon', city: 'Mumbai', pendingCount: 12 },
  { id: 'R/C', name: 'Ward R/Central - Borivali', city: 'Mumbai', pendingCount: 12 },
  { id: 'R/N', name: 'Ward R/North - Dahisar', city: 'Mumbai', pendingCount: 12 },
  { id: 'R/S', name: 'Ward R/South - Kandivali', city: 'Mumbai', pendingCount: 12 },
  { id: 'L', name: 'Ward L - Kurla, Sakinaka', city: 'Mumbai', pendingCount: 12 },
  { id: 'M/E', name: 'Ward M/East - Govandi, Mankhurd', city: 'Mumbai', pendingCount: 12 },
  { id: 'M/W', name: 'Ward M/West - Chembur', city: 'Mumbai', pendingCount: 12 },
  { id: 'N', name: 'Ward N - Ghatkopar', city: 'Mumbai', pendingCount: 12 },
  { id: 'S', name: 'Ward S - Bhandup, Vikhroli', city: 'Mumbai', pendingCount: 12 },
  { id: 'T', name: 'Ward T - Mulund', city: 'Mumbai', pendingCount: 12 },
  { id: 'K/E-2', name: 'Ward K/E-2 - Jogeshwari East', city: 'Mumbai', pendingCount: 12 },
  { id: 'L-2', name: 'Ward L-2 - Chandivali', city: 'Mumbai', pendingCount: 12 },
  { id: 'P/N-2', name: 'Ward P/N-2 - Dindoshi', city: 'Mumbai', pendingCount: 12 },
  { id: 'TMC-1', name: 'Naupada - Kopri', city: 'Thane', pendingCount: 4 },
  { id: 'TMC-2', name: 'Uthalsar', city: 'Thane', pendingCount: 4 },
  { id: 'TMC-3', name: 'Majiwada - Manpada', city: 'Thane', pendingCount: 4 },
  { id: 'TMC-4', name: 'Vartak Nagar', city: 'Thane', pendingCount: 4 },
  { id: 'TMC-5', name: 'Wagle Estate', city: 'Thane', pendingCount: 4 },
  { id: 'TMC-6', name: 'Lokmanya Nagar - Savarkar Nagar', city: 'Thane', pendingCount: 4 },
  { id: 'TMC-7', name: 'Kalwa', city: 'Thane', pendingCount: 4 },
  { id: 'TMC-8', name: 'Mumbra', city: 'Thane', pendingCount: 4 },
  { id: 'TMC-9', name: 'Diva', city: 'Thane', pendingCount: 4 },
  { id: 'NMMC-1', name: 'Belapur', city: 'Navi Mumbai', pendingCount: 12 },
  { id: 'NMMC-2', name: 'Nerul', city: 'Navi Mumbai', pendingCount: 12 },
  { id: 'NMMC-3', name: 'Turbhe', city: 'Navi Mumbai', pendingCount: 12 },
  { id: 'NMMC-4', name: 'Vashi', city: 'Navi Mumbai', pendingCount: 12 },
  { id: 'NMMC-5', name: 'Kopar Khairane', city: 'Navi Mumbai', pendingCount: 12 },
  { id: 'NMMC-6', name: 'Ghansoli', city: 'Navi Mumbai', pendingCount: 12 },
  { id: 'NMMC-7', name: 'Airoli', city: 'Navi Mumbai', pendingCount: 12 },
  { id: 'NMMC-8', name: 'Digha', city: 'Navi Mumbai', pendingCount: 12 },
  { id: 'KDMC-1', name: 'Kalyan West - Khadakpada', city: 'Kalyan-Dombivli', pendingCount: 2 },
  { id: 'KDMC-2', name: 'Kalyan East - Vitawa', city: 'Kalyan-Dombivli', pendingCount: 2 },
  { id: 'KDMC-3', name: 'Dombivli West - Manpada', city: 'Kalyan-Dombivli', pendingCount: 2 },
  { id: 'KDMC-4', name: 'Dombivli East - Lodha', city: 'Kalyan-Dombivli', pendingCount: 2 },
];

export const cases: PotholeCase[] = [
  {
    id: 'CF-1019',
    wardId: 'G/N',
    location: 'Gokhale Road North, Dadar West',
    city: 'Mumbai',
    coordinates: { x: 50, y: 50, lat: 19.0178, lng: 72.8478 },
    severity: 'High',
    status: 'Verified',
    description: 'Deep road cavity near Portuguese Church junction causing traffic slowdown. Compacted asphalt repair completed and AI verified.',
    reportedDate: '2026-09-08',
    assignedDate: '2026-09-10',
    deadline: '2026-09-20',
    contractor: 'RoadWorks Unit A',
  },
  {
    id: 'CF-1025',
    wardId: 'G/N',
    location: 'Ranade Road, Dadar West',
    city: 'Mumbai',
    coordinates: { x: 52, y: 48, lat: 19.0210, lng: 72.8430 },
    severity: 'Medium',
    status: 'Needs Review',
    description: 'Surface crater near Dadar flower market. Contractor submitted after-repair evidence awaiting municipal engineer approval.',
    reportedDate: '2026-09-12',
    assignedDate: '2026-09-14',
    deadline: '2026-09-24',
    contractor: 'RoadWorks Unit A',
  },
  {
    id: 'CF-1023',
    wardId: 'G/N',
    location: 'NC Kelkar Road, Dadar West',
    city: 'Mumbai',
    coordinates: { x: 48, y: 52, lat: 19.0195, lng: 72.8445 },
    severity: 'High',
    status: 'Under Repair',
    description: 'Large pothole on Kelkar Road causing severe congestion during peak hours. Contractor crew actively paving on site.',
    reportedDate: '2026-09-15',
    assignedDate: '2026-09-16',
    deadline: '2026-09-25',
    contractor: 'Apex Civil Works',
  },
  {
    id: 'CF-1024',
    wardId: 'G/N',
    location: 'Senapati Bapat Marg, Dadar West',
    city: 'Mumbai',
    coordinates: { x: 54, y: 46, lat: 19.0145, lng: 72.8415 },
    severity: 'Medium',
    status: 'AI Verification',
    description: 'Pothole patch near Elphinstone flyover descent. Repaired by contractor, currently under vision model verification.',
    reportedDate: '2026-09-16',
    assignedDate: '2026-09-17',
    deadline: '2026-09-27',
    contractor: 'Mumbai Urban Infra',
  },
  {
    id: 'CF-1031',
    wardId: 'G/N',
    location: 'Lady Jamshedji Road, Mahim West',
    city: 'Mumbai',
    coordinates: { x: 46, y: 54, lat: 19.0350, lng: 72.8420 },
    severity: 'Low',
    status: 'Reported',
    description: 'Minor road depression reported by citizen via mobile app. Assigned to Ward G/N engineer inspection queue.',
    reportedDate: '2026-09-18',
  },
  {
    id: 'CF-1032',
    wardId: 'G/N',
    location: 'Bhavani Shankar Road, Dadar West',
    city: 'Mumbai',
    coordinates: { x: 50, y: 49, lat: 19.0230, lng: 72.8400 },
    severity: 'High',
    status: 'Validated',
    description: 'Pothole cluster confirmed by ward field inspector. Ready for contractor work order assignment.',
    reportedDate: '2026-09-19',
  },
];

export function getCasesByWard(wardId: string | 'all'): PotholeCase[] {
  if (wardId === 'all') return cases;
  return cases.filter((c) => c.wardId === wardId);
}

export function getWardById(wardId: string): Ward | undefined {
  return wards.find((w) => w.id === wardId);
}

export const mockWorkOrders = [
  {
    id: 'WO-8801',
    caseId: 'CF-1019',
    title: 'Pothole Repair at Gokhale Road North',
    location: 'Gokhale Road North, Dadar West',
    roadName: 'Gokhale Road North',
    ward: 'Ward G/North - Dadar, Dharavi',
    wardId: 'w12',
    wardCode: 'G/N',
    wardDbName: 'contractor_ward_a.db',
    city: 'Mumbai',
    priority: 'High',
    status: 'In Progress',
    assignedDate: '2026-09-20',
    dueDate: '2026-09-25',
    assignedContractor: 'RoadWorks Infrastructure Unit A',
    contractorId: 'c1',
    beforePhotoCaptured: true,
    afterPhotoCaptured: false,
    beforePhotoUrl: '/uploads/demo/pothole_before_demo.jpg',
    coordinates: { lat: 19.0178, lng: 72.8478 },
  },
  {
    id: 'WO-8802',
    caseId: 'CF-1025',
    title: 'Surface Patching near Dadar Flower Market',
    location: 'Ranade Road, Dadar West',
    roadName: 'Ranade Road',
    ward: 'Ward G/North - Dadar, Dharavi',
    wardId: 'w12',
    wardCode: 'G/N',
    wardDbName: 'contractor_ward_a.db',
    city: 'Mumbai',
    priority: 'Medium',
    status: 'Needs Review',
    assignedDate: '2026-09-18',
    dueDate: '2026-09-24',
    assignedContractor: 'RoadWorks Infrastructure Unit A',
    contractorId: 'c1',
    beforePhotoCaptured: true,
    afterPhotoCaptured: true,
    beforePhotoUrl: '/uploads/demo/pothole_before_demo.jpg',
    afterPhotoUrl: '/uploads/demo/pothole_after_verified_demo.jpg',
    coordinates: { lat: 19.0210, lng: 72.8430 },
  },
  {
    id: 'WO-8803',
    caseId: 'CF-1026',
    title: 'Crater Repair on Hill Road',
    location: 'Hill Road, Bandra West',
    roadName: 'Hill Road',
    ward: 'Ward H/West - Bandra West',
    wardId: 'w07',
    wardCode: 'H/W',
    wardDbName: 'contractor_ward_b.db',
    city: 'Mumbai',
    priority: 'High',
    status: 'Assigned',
    assignedDate: '2026-09-21',
    dueDate: '2026-09-26',
    assignedContractor: 'Apex Civil Works',
    contractorId: 'c2',
    beforePhotoCaptured: false,
    afterPhotoCaptured: false,
    coordinates: { lat: 19.0596, lng: 72.8295 },
  },
  {
    id: 'WO-8804',
    caseId: 'CF-1027',
    title: 'Asphalt Resurfacing near Sahar Road',
    location: 'Sahar Road, Andheri East',
    roadName: 'Sahar Road',
    ward: 'Ward K/East - Andheri East',
    wardId: 'w18',
    wardCode: 'K/E',
    wardDbName: 'contractor_ward_c.db',
    city: 'Mumbai',
    priority: 'High',
    status: 'In Progress',
    assignedDate: '2026-09-22',
    dueDate: '2026-09-27',
    assignedContractor: 'Mumbai Urban Infra',
    contractorId: 'c3',
    beforePhotoCaptured: true,
    afterPhotoCaptured: false,
    beforePhotoUrl: '/uploads/demo/pothole_before_demo.jpg',
    coordinates: { lat: 19.1136, lng: 72.8697 },
  },
];

import { actualContractors } from './actualContractors';

export interface ContractorAccount {
  id: string;
  contractorId: string;
  password: string;
  name: string;
  registrationNo?: string;
  wardId: string;
  wardName: string;
  zone?: string;
  city: string;
  phone: string;
  email: string;
  performanceScore?: number;
  lateRepairs?: number;
  verifiedRepairs?: number;
  aiRejections?: number;
}

export const mockContractors: ContractorAccount[] = actualContractors;

