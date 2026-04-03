const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function fetchAPI(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`);
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export async function postAPI(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export async function putAPI(endpoint, data) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export async function deleteAPI(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export function formatTime(timestamp) {
  if (!timestamp) return '--';
  const d = new Date(timestamp);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatTimeAgo(timestamp) {
  if (!timestamp) return '--';
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function formatDate(timestamp) {
  if (!timestamp) return '--';
  return new Date(timestamp).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}
