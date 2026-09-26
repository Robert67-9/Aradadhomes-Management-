/**
 * HavenStay Python Backend API Client
 * Provides seamless connection to the Python backend (/api/*)
 * with robust client-side offline and encrypted cache fallback.
 */

import { Apartment, Booking, Review, UserProfile } from '../types';
import {
  getStoredApartments,
  saveApartments,
  getStoredBookings,
  saveBooking,
  getStoredProfile,
  saveProfile,
} from './storage';

const API_BASE = '/api';

// Check if Python Backend is online
export async function checkBackendStatus(): Promise<{ online: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      return { online: true, message: data.service || 'Python Backend Online' };
    }
    return { online: false, message: 'Backend unreachable' };
  } catch {
    return { online: false, message: 'Running in resilient client-first mode' };
  }
}

// Fetch all residences
export async function apiGetApartments(): Promise<Apartment[]> {
  try {
    const res = await fetch(`${API_BASE}/apartments`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveApartments(data); // Sync local cache
        return data;
      }
    }
  } catch {
    // Backend offline or running in preview
  }
  return getStoredApartments();
}

// Create or update residence
export async function apiSaveApartment(apartment: Apartment): Promise<Apartment> {
  // Always update local cache first
  const existing = getStoredApartments();
  const index = existing.findIndex(a => a.id === apartment.id);
  let updatedList: Apartment[];
  if (index >= 0) {
    updatedList = [...existing];
    updatedList[index] = apartment;
  } else {
    updatedList = [apartment, ...existing];
  }
  saveApartments(updatedList);

  // Attempt backend persistence
  try {
    const endpoint = `${API_BASE}/apartments${index >= 0 ? `/${apartment.id}` : ''}`;
    const method = index >= 0 ? 'PUT' : 'POST';
    await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apartment),
    });
  } catch {
    // Offline queue handled by storage.ts
  }

  return apartment;
}

// Delete residence
export async function apiDeleteApartment(apartmentId: string): Promise<boolean> {
  const existing = getStoredApartments();
  const filtered = existing.filter(a => a.id !== apartmentId);
  saveApartments(filtered);

  try {
    await fetch(`${API_BASE}/apartments/${apartmentId}`, {
      method: 'DELETE',
    });
    return true;
  } catch {
    return true;
  }
}

// Toggle calendar date block
export async function apiToggleBlockDate(apartmentId: string, date: string): Promise<string[]> {
  const apartments = getStoredApartments();
  const apt = apartments.find(a => a.id === apartmentId);
  let updatedDates: string[] = [];

  if (apt) {
    const isCurrentlyBlocked = apt.blockedDates.includes(date);
    if (isCurrentlyBlocked) {
      apt.blockedDates = apt.blockedDates.filter(d => d !== date);
    } else {
      apt.blockedDates = [...apt.blockedDates, date].sort();
    }
    updatedDates = apt.blockedDates;
    saveApartments(apartments);

    try {
      await fetch(`${API_BASE}/apartments/${apartmentId}/block-dates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, block: !isCurrentlyBlocked }),
      });
    } catch {
      // Handled locally
    }
  }

  return updatedDates;
}

// Fetch bookings
export async function apiGetBookings(): Promise<Booking[]> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch {
    // Local fallback
  }
  return getStoredBookings();
}

// Create booking
export async function apiCreateBooking(booking: Booking): Promise<Booking> {
  saveBooking(booking);

  try {
    await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
  } catch {
    // Saved in offline queue
  }

  return booking;
}

// User Profile
export async function apiGetProfile(): Promise<UserProfile> {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      const data = await res.json();
      saveProfile(data);
      return data;
    }
  } catch {
    // Local fallback
  }
  return getStoredProfile();
}

export async function apiSaveProfile(profile: UserProfile): Promise<UserProfile> {
  saveProfile(profile);
  try {
    await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
  } catch {
    // Handled
  }
  return profile;
}
