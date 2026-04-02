import type { Enquiry, Lead, TestDriveBooking } from "@/data/mockData";

const STORAGE_KEYS = {
  leads: "vf_leads",
  testDrives: "vf_test_drive_bookings",
  enquiries: "vf_enquiries",
} as const;

function isBrowser() {
  return globalThis.window?.localStorage !== undefined;
}

function loadJson<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  const raw = globalThis.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveJson<T>(key: string, value: T) {
  if (!isBrowser()) return;
  globalThis.localStorage.setItem(key, JSON.stringify(value));
}

export function getStoredState<T>(key: string, fallback: T): T {
  return loadJson<T>(key, fallback);
}

export function setStoredState<T>(key: string, value: T) {
  saveJson<T>(key, value);
}

export function getLeads(): Lead[] {
  return loadJson<Lead[]>(STORAGE_KEYS.leads, []);
}

export function setLeads(leads: Lead[]) {
  saveJson(STORAGE_KEYS.leads, leads);
}

export function addLead(lead: Lead) {
  const leads = getLeads();
  setLeads([...leads, lead]);
}

export function getTestDriveBookings(): TestDriveBooking[] {
  return loadJson<TestDriveBooking[]>(STORAGE_KEYS.testDrives, []);
}

export function setTestDriveBookings(bookings: TestDriveBooking[]) {
  saveJson(STORAGE_KEYS.testDrives, bookings);
}

export function addTestDriveBooking(booking: TestDriveBooking) {
  const bookings = getTestDriveBookings();
  setTestDriveBookings([...bookings, booking]);
}

export function getEnquiries(): Enquiry[] {
  return loadJson<Enquiry[]>(STORAGE_KEYS.enquiries, []);
}

export function setEnquiries(enquiries: Enquiry[]) {
  saveJson(STORAGE_KEYS.enquiries, enquiries);
}

export function addEnquiry(enquiry: Enquiry) {
  const enquiries = getEnquiries();
  setEnquiries([...enquiries, enquiry]);
}

