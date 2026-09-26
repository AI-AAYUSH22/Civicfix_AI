import { WardInfo } from '../types';

export const WARDS_DATA: WardInfo[] = [
  // BMC Mumbai Wards (27)
  { id: 'A', code: 'A', name: 'Ward A — Churchgate / Colaba / Fort', city: 'Mumbai', center_lat: 18.9220, center_lng: 72.8347, dbFile: 'contractor_ward_a.db' },
  { id: 'B', code: 'B', name: 'Ward B — Masjid Bunder / Dongri', city: 'Mumbai', center_lat: 18.9515, center_lng: 72.8375, dbFile: 'contractor_ward_a.db' },
  { id: 'C', code: 'C', name: 'Ward C — Pydhonie / Bhuleshwar', city: 'Mumbai', center_lat: 18.9525, center_lng: 72.8273, dbFile: 'contractor_ward_a.db' },
  { id: 'D', code: 'D', name: 'Ward D — Malabar Hill / Grant Road', city: 'Mumbai', center_lat: 18.9667, center_lng: 72.8167, dbFile: 'contractor_ward_a.db' },
  { id: 'E', code: 'E', name: 'Ward E — Byculla / Nagpada', city: 'Mumbai', center_lat: 18.9772, center_lng: 72.8335, dbFile: 'contractor_ward_a.db' },
  { id: 'F/N', code: 'F/N', name: 'Ward F/North — Matunga / Sion', city: 'Mumbai', center_lat: 19.0268, center_lng: 72.8553, dbFile: 'contractor_ward_a.db' },
  { id: 'F/S', code: 'F/S', name: 'Ward F/South — Parel / Sewri', city: 'Mumbai', center_lat: 18.9954, center_lng: 72.8396, dbFile: 'contractor_ward_a.db' },
  { id: 'G/N', code: 'G/N', name: 'Ward G/North — Dadar / Mahim / Dharavi', city: 'Mumbai', center_lat: 19.0178, center_lng: 72.8478, dbFile: 'contractor_ward_a.db' },
  { id: 'G/S', code: 'G/S', name: 'Ward G/South — Worli / Lower Parel', city: 'Mumbai', center_lat: 19.0068, center_lng: 72.8156, dbFile: 'contractor_ward_a.db' },
  { id: 'H/E', code: 'H/E', name: 'Ward H/East — Santacruz East / Kalina', city: 'Mumbai', center_lat: 19.0805, center_lng: 72.8530, dbFile: 'contractor_ward_b.db' },
  { id: 'H/W', code: 'H/W', name: 'Ward H/West — Bandra West / Khar West', city: 'Mumbai', center_lat: 19.0596, center_lng: 72.8295, dbFile: 'contractor_ward_b.db' },
  { id: 'K/E', code: 'K/E', name: 'Ward K/East — Andheri East / Marol', city: 'Mumbai', center_lat: 19.1136, center_lng: 72.8697, dbFile: 'contractor_ward_c.db' },
  { id: 'K/W', code: 'K/W', name: 'Ward K/West — Andheri West / Juhu', city: 'Mumbai', center_lat: 19.1363, center_lng: 72.8277, dbFile: 'contractor_ward_c.db' },
  { id: 'P/N', code: 'P/N', name: 'Ward P/North — Malad', city: 'Mumbai', center_lat: 19.1866, center_lng: 72.8486, dbFile: 'contractor_ward_c.db' },
  { id: 'P/S', code: 'P/S', name: 'Ward P/South — Goregaon', city: 'Mumbai', center_lat: 19.1645, center_lng: 72.8499, dbFile: 'contractor_ward_c.db' },
  { id: 'R/C', code: 'R/C', name: 'Ward R/Central — Borivali', city: 'Mumbai', center_lat: 19.2307, center_lng: 72.8567, dbFile: 'contractor_default.db' },
  { id: 'R/N', code: 'R/N', name: 'Ward R/North — Dahisar', city: 'Mumbai', center_lat: 19.2501, center_lng: 72.8593, dbFile: 'contractor_default.db' },
  { id: 'R/S', code: 'R/S', name: 'Ward R/South — Kandivali', city: 'Mumbai', center_lat: 19.2045, center_lng: 72.8360, dbFile: 'contractor_default.db' },
  { id: 'L', code: 'L', name: 'Ward L — Kurla West / Sakinaka', city: 'Mumbai', center_lat: 19.0726, center_lng: 72.8845, dbFile: 'contractor_default.db' },
  { id: 'M/E', code: 'M/E', name: 'Ward M/East — Govandi / Mankhurd', city: 'Mumbai', center_lat: 19.0560, center_lng: 72.9126, dbFile: 'contractor_default.db' },
  { id: 'M/W', code: 'M/W', name: 'Ward M/West — Chembur', city: 'Mumbai', center_lat: 19.0345, center_lng: 72.8953, dbFile: 'contractor_default.db' },
  { id: 'N', code: 'N', name: 'Ward N — Ghatkopar', city: 'Mumbai', center_lat: 19.0864, center_lng: 72.9082, dbFile: 'contractor_default.db' },
  { id: 'S', code: 'S', name: 'Ward S — Bhandup / Vikhroli', city: 'Mumbai', center_lat: 19.1438, center_lng: 72.9304, dbFile: 'contractor_default.db' },
  { id: 'T', code: 'T', name: 'Ward T — Mulund', city: 'Mumbai', center_lat: 19.1723, center_lng: 72.9565, dbFile: 'contractor_default.db' },
  { id: 'K/E-2', code: 'K/E-2', name: 'Ward K/E-2 — Jogeshwari East', city: 'Mumbai', center_lat: 19.1350, center_lng: 72.8600, dbFile: 'contractor_ward_c.db' },
  { id: 'L-2', code: 'L-2', name: 'Ward L-2 — Chandivali', city: 'Mumbai', center_lat: 19.1100, center_lng: 72.8900, dbFile: 'contractor_default.db' },
  { id: 'P/N-2', code: 'P/N-2', name: 'Ward P/N-2 — Dindoshi', city: 'Mumbai', center_lat: 19.1750, center_lng: 72.8700, dbFile: 'contractor_ward_c.db' },

  // Thane TMC Wards (9)
  { id: 'TMC-1', code: 'TMC-1', name: 'Naupada - Kopri', city: 'Thane', center_lat: 19.1824, center_lng: 72.9696, dbFile: 'contractor_default.db' },
  { id: 'TMC-2', code: 'TMC-2', name: 'Uthalsar', city: 'Thane', center_lat: 19.1979, center_lng: 72.9774, dbFile: 'contractor_default.db' },
  { id: 'TMC-3', code: 'TMC-3', name: 'Majiwada - Manpada', city: 'Thane', center_lat: 19.2301, center_lng: 72.9712, dbFile: 'contractor_default.db' },
  { id: 'TMC-4', code: 'TMC-4', name: 'Vartak Nagar', city: 'Thane', center_lat: 19.2066, center_lng: 72.9529, dbFile: 'contractor_default.db' },
  { id: 'TMC-5', code: 'TMC-5', name: 'Wagle Estate', city: 'Thane', center_lat: 19.1915, center_lng: 72.9463, dbFile: 'contractor_default.db' },
  { id: 'TMC-6', code: 'TMC-6', name: 'Lokmanya Nagar - Savarkar Nagar', city: 'Thane', center_lat: 19.2132, center_lng: 72.9427, dbFile: 'contractor_default.db' },
  { id: 'TMC-7', code: 'TMC-7', name: 'Kalwa', city: 'Thane', center_lat: 19.1994, center_lng: 72.9972, dbFile: 'contractor_default.db' },
  { id: 'TMC-8', code: 'TMC-8', name: 'Mumbra', city: 'Thane', center_lat: 19.1760, center_lng: 73.0233, dbFile: 'contractor_default.db' },
  { id: 'TMC-9', code: 'TMC-9', name: 'Diva', city: 'Thane', center_lat: 19.1852, center_lng: 73.0401, dbFile: 'contractor_default.db' },

  // Navi Mumbai NMMC Wards (8)
  { id: 'NMMC-1', code: 'NMMC-1', name: 'Belapur', city: 'Navi Mumbai', center_lat: 19.0163, center_lng: 73.0374, dbFile: 'contractor_default.db' },
  { id: 'NMMC-2', code: 'NMMC-2', name: 'Nerul', city: 'Navi Mumbai', center_lat: 19.0330, center_lng: 73.0180, dbFile: 'contractor_default.db' },
  { id: 'NMMC-3', code: 'NMMC-3', name: 'Turbhe', city: 'Navi Mumbai', center_lat: 19.0725, center_lng: 73.0157, dbFile: 'contractor_default.db' },
  { id: 'NMMC-4', code: 'NMMC-4', name: 'Vashi', city: 'Navi Mumbai', center_lat: 19.0700, center_lng: 72.9980, dbFile: 'contractor_default.db' },
  { id: 'NMMC-5', code: 'NMMC-5', name: 'Kopar Khairane', city: 'Navi Mumbai', center_lat: 19.1026, center_lng: 73.0035, dbFile: 'contractor_default.db' },
  { id: 'NMMC-6', code: 'NMMC-6', name: 'Ghansoli', city: 'Navi Mumbai', center_lat: 19.1254, center_lng: 72.9992, dbFile: 'contractor_default.db' },
  { id: 'NMMC-7', code: 'NMMC-7', name: 'Airoli', city: 'Navi Mumbai', center_lat: 19.1517, center_lng: 72.9934, dbFile: 'contractor_default.db' },
  { id: 'NMMC-8', code: 'NMMC-8', name: 'Digha', city: 'Navi Mumbai', center_lat: 19.1678, center_lng: 73.9930, dbFile: 'contractor_default.db' },

  // Kalyan-Dombivli KDMC Wards (4)
  { id: 'KDMC-1', code: 'KDMC-1', name: 'Kalyan West - Khadakpada', city: 'Kalyan-Dombivli', center_lat: 19.2437, center_lng: 73.1355, dbFile: 'contractor_default.db' },
  { id: 'KDMC-2', code: 'KDMC-2', name: 'Kalyan East - Vitawa', city: 'Kalyan-Dombivli', center_lat: 19.2350, center_lng: 73.1420, dbFile: 'contractor_default.db' },
  { id: 'KDMC-3', code: 'KDMC-3', name: 'Dombivli West - Manpada', city: 'Kalyan-Dombivli', center_lat: 19.2184, center_lng: 73.0867, dbFile: 'contractor_default.db' },
  { id: 'KDMC-4', code: 'KDMC-4', name: 'Dombivli East - Lodha', city: 'Kalyan-Dombivli', center_lat: 19.2090, center_lng: 73.0950, dbFile: 'contractor_default.db' },
];

export const WARD_DB_MAP: Record<string, { dbFile: string; code: string; name: string; city: string; lat: number; lng: number }> =
  WARDS_DATA.reduce((acc, w) => {
    acc[w.id] = {
      dbFile: w.dbFile || 'contractor_default.db',
      code: w.code,
      name: w.name,
      city: w.city,
      lat: w.center_lat || 19.0178,
      lng: w.center_lng || 72.8478,
    };
    return acc;
  }, {} as any);
