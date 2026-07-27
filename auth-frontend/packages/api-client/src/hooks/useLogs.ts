import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../client';

export function useLogs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: ['logs', params],
    queryFn: () => apiClient.get('/logs', { params }).then((res) => res.data),
  });
}

export function useLogEvent(eventId: string) {
  return useQuery({
    queryKey: ['logs', eventId],
    queryFn: () => apiClient.get(`/logs/${eventId}`).then((res) => res.data),
    enabled: !!eventId,
  });
}

export function useLogAnalytics(params?: { from?: string; to?: string; interval?: string }) {
  return useQuery({
    queryKey: ['logs/analytics', params],
    queryFn: () => apiClient.get('/logs/analytics', { params }).then((res) => res.data),
  });
}
