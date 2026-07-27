import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../client';

export function useLogin() {
  return useMutation({
    mutationFn: (data: { identifier: string; password: string }) =>
      apiClient.post('/auth/login', data).then((res) => res.data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: { name: string; email?: string; phone?: string; password: string }) =>
      apiClient.post('/auth/register', data).then((res) => res.data),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => apiClient.post('/auth/logout').then((res) => res.data),
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      apiClient.post('/auth/forgot-password', data).then((res) => res.data),
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      apiClient.post('/auth/change-password', data).then((res) => res.data),
  });
}
