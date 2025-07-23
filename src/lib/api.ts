// API utility for backend integration
import { getAuth } from 'firebase/auth';

// Environment-aware BASE_URL configuration
const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

// Log the BASE_URL for debugging (remove in production)
console.log('Environment:', import.meta.env.MODE);
console.log('BASE_URL:', BASE_URL);
console.log('VITE_BACKEND_URL from env:', import.meta.env.VITE_BACKEND_URL);

async function getIdToken() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  return await user.getIdToken();
}

async function apiFetch(path: string, options: RequestInit = {}) {
  const token = await getIdToken();
  const headers = {
    ...(options.headers || {}),
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  console.log('Fetching from', `${BASE_URL}${path}`, 'with headers', headers);
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getCurrentSignals() {
  console.log('Getting current signals');
  return apiFetch('/signals/current');
}

export async function getSignalHistory() {
  console.log('Getting signal history');
  return apiFetch('/signals/history');
}

export async function triggerSignal(coin: string) {
  return apiFetch('/signals/trigger', {
    method: 'POST',
    body: JSON.stringify({ coin }),
  });
}

export async function askAIChat(message: string, context?: any) {
  return apiFetch('/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
} 