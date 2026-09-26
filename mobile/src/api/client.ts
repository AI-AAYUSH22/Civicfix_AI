import { Platform } from 'react-native';
import { PotholeCase, WorkOrder, ExpenseMemoItem } from '../types';

// Default target:
// Physical phone uses your PC Wi-Fi IP (http://192.168.1.5:8000/api/v1)
// Android emulator uses 10.0.2.2
// Web / iOS simulator uses localhost
export let API_BASE_URL = 'http://192.168.1.5:8000/api/v1';
export let SERVER_HOST = 'http://192.168.1.5:8000';

export function setCustomApiBaseUrl(hostOrUrl: string) {
  const clean = hostOrUrl.trim().replace(/\/+$/, '');
  if (clean.endsWith('/api/v1')) {
    API_BASE_URL = clean;
    SERVER_HOST = clean.replace('/api/v1', '');
  } else {
    SERVER_HOST = clean;
    API_BASE_URL = `${clean}/api/v1`;
  }
}

export function resolveMediaUrl(path?: string): string | undefined {
  if (!path) return undefined;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('file://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${SERVER_HOST}/${cleanPath}`;
}

/**
 * Fetch wrapper with configurable abort timeout to prevent hanging on slow/unreachable networks
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 4500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL.replace('/api/v1', '')}/docs`, {
      method: 'GET',
    }, 2500);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Robust multipart upload using XMLHttpRequest for seamless React Native / Android file uploads
 */
function uploadFileViaXHR<T = any>(
  url: string,
  fileField: string,
  fileUri: string,
  extraFields: Record<string, string> = {},
  timeoutMs = 9000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.timeout = timeoutMs;

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve(xhr.responseText as any);
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.detail || `Server error (${xhr.status})`));
        } catch {
          reject(new Error(`Server error (${xhr.status})`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network connection error'));
    xhr.ontimeout = () => reject(new Error('Request timed out'));

    const formData = new FormData();
    Object.entries(extraFields).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        formData.append(k, v);
      }
    });

    if (fileUri) {
      const filename = fileUri.split('/').pop() || 'photo.jpg';
      const type = filename.endsWith('.png') ? 'image/png' : 'image/jpeg';
      formData.append(fileField, {
        uri: fileUri,
        name: filename,
        type,
      } as any);
    }

    xhr.send(formData);
  });
}

// ----------------- AI PHOTO ANALYSIS -----------------

export async function analyzePotholePhoto(imageUri: string): Promise<{
  is_pothole: boolean;
  confidence: number;
  estimated_size_sqm: number;
  message: string;
}> {
  try {
    const data = await uploadFileViaXHR<{
      is_pothole: boolean;
      confidence: number;
      estimated_size_sqm: number;
      message: string;
    }>(`${API_BASE_URL}/cases/analyze-photo`, 'photo', imageUri);
    return data;
  } catch (err) {
    console.warn('Backend analyze-photo error:', err);
  }

  // Strict rejection if backend unreachable or image analysis fails
  return {
    is_pothole: false,
    confidence: 0.0,
    estimated_size_sqm: 0.0,
    message: 'AI Vision could not verify road pothole. Please capture a clear photo of the damaged road.',
  };
}

export async function analyzeRepairPhoto(imageUri: string): Promise<{
  is_repaired: boolean;
  homography_score: number;
  lighting_normalized: boolean;
  status: 'VERIFIED' | 'NEEDS_REVIEW' | 'FLAGGED_ANOMALY';
  message: string;
}> {
  try {
    const data = await uploadFileViaXHR<{
      is_repaired: boolean;
      homography_score: number;
      lighting_normalized: boolean;
      status: 'VERIFIED' | 'NEEDS_REVIEW' | 'FLAGGED_ANOMALY';
      message: string;
    }>(`${API_BASE_URL}/cases/analyze-repair-photo`, 'photo', imageUri);
    return data;
  } catch (err) {
    console.warn('Backend analyze-repair-photo error:', err);
  }

  // Strict rejection on failure: non-road photos must never be accepted with fake high scores
  return {
    is_repaired: false,
    homography_score: 0.0,
    lighting_normalized: false,
    status: 'FLAGGED_ANOMALY',
    message: 'AI Anti-Spoofing Vision: Surface does not match verified repaired asphalt road.',
  };
}

export function sendFormDataViaXHR<T = any>(url: string, formData: FormData, timeoutMs = 12000): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.timeout = timeoutMs;

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          resolve(xhr.responseText as any);
        }
      } else {
        try {
          const err = JSON.parse(xhr.responseText);
          reject(new Error(err.detail || `Server error (${xhr.status})`));
        } catch {
          reject(new Error(`Server error (${xhr.status})`));
        }
      }
    };

    xhr.onerror = () => reject(new Error('Network connection error'));
    xhr.ontimeout = () => reject(new Error('Request timed out'));
    xhr.send(formData);
  });
}

// ----------------- CITIZEN CASE ENDPOINTS -----------------

export async function submitMobileComplaint(formData: FormData): Promise<any> {
  return sendFormDataViaXHR(`${API_BASE_URL}/cases`, formData, 15000);
}

export async function fetchMobileCases(citizenPhone?: string): Promise<PotholeCase[]> {
  const url = citizenPhone
    ? `${API_BASE_URL}/cases?citizen_phone=${encodeURIComponent(citizenPhone)}`
    : `${API_BASE_URL}/cases`;
  const res = await fetchWithTimeout(url, { method: 'GET' }, 3500);
  if (!res.ok) throw new Error('Failed to fetch cases');
  const data = await res.json();

  return data.map((c: any) => {
    const beforeEv = c.evidence_files?.find((e: any) => e.capture_type === 'BEFORE' || e.capture_type === 'CITIZEN');
    const afterEv = c.evidence_files?.find((e: any) => e.capture_type === 'AFTER');

    return {
      id: c.id,
      wardId: c.ward_id || 'G/N',
      wardName: c.ward_name,
      location: c.location?.address || c.title || 'Street Location',
      landmark: c.location?.landmark,
      city: c.ward_name?.includes('Thane') ? 'Thane' : c.ward_name?.includes('Navi Mumbai') ? 'Navi Mumbai' : 'Mumbai',
      coordinates: {
        lat: c.location?.latitude || 19.0178,
        lng: c.location?.longitude || 72.8478,
      },
      severity: c.severity || 'Medium',
      status: c.status || 'REPORTED',
      description: c.description,
      reportedDate: c.created_at,
      assignedDate: c.work_order?.created_at,
      deadline: c.work_order?.deadline,
      contractor: c.work_order?.contractor_name,
      citizenName: c.citizen_name || c.source_username || 'Citizen',
      citizenPhone: c.citizen_phone,
      reportedBy: c.reported_by,
      channel: c.channel || 'PORTAL',
      sourceUsername: c.source_username,
      sourceUrl: c.source_url,
      locationStatus: c.location_status,
      beforeImage: resolveMediaUrl(beforeEv?.storage_path),
      afterImage: resolveMediaUrl(afterEv?.storage_path),
      verification: c.verification
        ? {
            status: c.verification.status === 'VERIFIED' ? 'Verified' : c.verification.status === 'NEEDS_REVIEW' ? 'Needs Review' : 'Not Verified',
            score: Math.round(c.verification.score || 95),
            summary: c.verification.summary,
            checks: (c.verification.checks || []).map((ch: any) => ({
              label: ch.check_type || 'Check',
              passed: ch.status === 'PASS',
              detail: ch.details?.message || `${ch.check_type} passed`,
            })),
          }
        : undefined,
    };
  });
}

// ----------------- CONTRACTOR WORK ORDER ENDPOINTS -----------------

export async function fetchMobileWorkOrders(contractorId?: string, wardId?: string): Promise<WorkOrder[]> {
  const params = new URLSearchParams();
  if (contractorId) params.append('contractor_id', contractorId);
  if (wardId && wardId !== 'all') params.append('ward_id', wardId);

  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await fetch(`${API_BASE_URL}/work-orders${query}`);
  if (!res.ok) throw new Error('Failed to fetch work orders');
  const data = await res.json();

  return data.map((item: any) => ({
    id: item.id,
    caseId: item.case_id,
    title: item.case_title || `Repair at ${item.case_location || 'Assigned Site'}`,
    location: item.case_location || item.road_name || 'Mumbai Road',
    landmark: item.landmark,
    roadName: item.road_name,
    ward: item.ward_name || item.ward_id || 'Ward G/N',
    wardId: item.ward_id || 'G/N',
    wardCode: item.ward_code || item.ward_id || 'G/N',
    wardDbName: item.ward_db || 'contractor_ward_a.db',
    city: item.city || 'Mumbai',
    priority: item.priority || 'High',
    status: item.status || 'Assigned',
    assignedDate: item.assigned_at,
    dueDate: item.deadline ? item.deadline.slice(0, 10) : 'In 48 Hours',
    deadline: item.deadline,
    completedDate: item.completed_at,
    contractorId: item.contractor_id,
    contractorName: item.contractor_name,
    beforePhotoCaptured: item.before_photo_captured || Boolean(item.before_photo_url),
    beforePhotoUrl: resolveMediaUrl(item.before_photo_url),
    afterPhotoCaptured: item.after_photo_captured || Boolean(item.after_photo_url),
    afterPhotoUrl: resolveMediaUrl(item.after_photo_url),
    citizenPhotoUrl: resolveMediaUrl(item.citizen_photo_url),
    coordinates: {
      lat: item.assigned_latitude || 19.0178,
      lng: item.assigned_longitude || 72.8478,
    },
  }));
}

export async function uploadMobileEvidence(formData: FormData): Promise<any> {
  return sendFormDataViaXHR(`${API_BASE_URL}/evidence/upload`, formData, 15000);
}

export async function submitMobileExpenseMemo(data: {
  work_order_id: string;
  material_cost: number;
  labor_cost: number;
  machinery_cost: number;
  asphalt_tonnage: number;
  patch_area_sqm: number;
}): Promise<ExpenseMemoItem> {
  const formData = new FormData();
  formData.append('work_order_id', data.work_order_id);
  formData.append('material_cost', data.material_cost.toString());
  formData.append('labor_cost', data.labor_cost.toString());
  formData.append('machinery_cost', data.machinery_cost.toString());
  formData.append('asphalt_tonnage', data.asphalt_tonnage.toString());
  formData.append('patch_area_sqm', data.patch_area_sqm.toString());

  const res = await fetch(`${API_BASE_URL}/memos`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.detail || `Expense memo submission failed (${res.status})`);
  }
  return res.json();
}
