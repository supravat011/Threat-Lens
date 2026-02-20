const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = (): string | null => {
    return localStorage.getItem('token');
};

// Set token in localStorage
export const setToken = (token: string): void => {
    localStorage.setItem('token', token);
};

// Remove token from localStorage
export const removeToken = (): void => {
    localStorage.removeItem('token');
};

// Base fetch with auth headers
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
};

// Auth APIs
export const authAPI = {
    register: async (username: string, email: string, password: string) => {
        return apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ username, email, password }),
        });
    },

    login: async (email: string, password: string) => {
        return apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
    },

    getProfile: async () => {
        return apiFetch('/auth/profile');
    },

    updateProfile: async (data: { username?: string; email?: string }) => {
        return apiFetch('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    logout: async () => {
        return apiFetch('/auth/logout', { method: 'POST' });
    },
};

// Scan APIs
export const scanAPI = {
    scanUrl: async (url: string) => {
        return apiFetch('/scan/url', {
            method: 'POST',
            body: JSON.stringify({ url }),
        });
    },

    scanFile: async (file: File) => {
        const token = getToken();
        const formData = new FormData();
        formData.append('file', file);

        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/scan/file`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'File scan failed' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    },

    analyzeLog: async (file: File) => {
        const token = getToken();
        const formData = new FormData();
        formData.append('file', file);

        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/scan/log`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Log analysis failed' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        return response.json();
    },
};

// History API
export const historyAPI = {
    getHistory: async (params?: { type?: string; risk_level?: string; limit?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.type) queryParams.append('type', params.type);
        if (params?.risk_level) queryParams.append('risk_level', params.risk_level);
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const query = queryParams.toString();
        return apiFetch(`/history${query ? `?${query}` : ''}`);
    },
};

// Alerts API
export const alertsAPI = {
    getAlerts: async (params?: { unread?: boolean; severity?: string; limit?: number }) => {
        const queryParams = new URLSearchParams();
        if (params?.unread !== undefined) queryParams.append('unread', params.unread.toString());
        if (params?.severity) queryParams.append('severity', params.severity);
        if (params?.limit) queryParams.append('limit', params.limit.toString());

        const query = queryParams.toString();
        return apiFetch(`/alerts${query ? `?${query}` : ''}`);
    },

    markAsRead: async (alertId: number) => {
        return apiFetch(`/alerts/${alertId}/read`, { method: 'PUT' });
    },

    deleteAlert: async (alertId: number) => {
        return apiFetch(`/alerts/${alertId}`, { method: 'DELETE' });
    },

    markAllAsRead: async () => {
        return apiFetch('/alerts/mark-all-read', { method: 'PUT' });
    },
};

// Reports API
export const reportsAPI = {
    getReports: async (limit?: number) => {
        const query = limit ? `?limit=${limit}` : '';
        return apiFetch(`/reports${query}`);
    },

    generateReport: async (reportType: 'summary' | 'detailed', days: number = 7) => {
        return apiFetch('/reports/generate', {
            method: 'POST',
            body: JSON.stringify({ report_type: reportType, days }),
        });
    },

    downloadReport: async (reportId: number) => {
        const token = getToken();
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download`, {
            headers,
        });

        if (!response.ok) {
            throw new Error('Download failed');
        }

        return response.blob();
    },
};

export default {
    auth: authAPI,
    scan: scanAPI,
    history: historyAPI,
    alerts: alertsAPI,
    reports: reportsAPI,
};
