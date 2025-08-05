/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { LoginFormData, RegisterFormData, ForgotPasswordFormData, ResetPasswordFormData } from '@/types/auth';
import { toast } from 'sonner';
import { useAuthStore } from './useAuthStore';
import { authApi } from '@/lib/axios';

export const useAuth = () => {
    const { setAuth, clearAuth, setError, setLoading, ...authState } = useAuthStore();
    const queryClient = useQueryClient();

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onMutate: () => {
            setLoading(true);
            setError(null);
        },
        onSuccess: (data) => {
            setAuth(data.user, data.token, data.refreshToken);
            authApi.setAuthToken(data.token);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Login berhasil!');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Login gagal';
            setError(message);
            toast.error(message);
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    // Register mutation
    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onMutate: () => {
            setLoading(true);
            setError(null);
        },
        onSuccess: (data) => {
            setAuth(data.user, data.token, data.refreshToken);
            authApi.setAuthToken(data.token);
            queryClient.invalidateQueries({ queryKey: ['user'] });
            toast.success('Registrasi berhasil!');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Registrasi gagal';
            setError(message);
            toast.error(message);
        },
        onSettled: () => {
            setLoading(false);
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: authApi.logout,
        onSuccess: () => {
            clearAuth();
            authApi.clearAuthToken();
            queryClient.clear();
            toast.success('Logout berhasil!');
        },
        onError: () => {
            // Even if API call fails, logout locally
            clearAuth();
            authApi.clearAuthToken();
            queryClient.clear();
        },
    });

    // Forgot password mutation
    const forgotPasswordMutation = useMutation({
        mutationFn: authApi.forgotPassword,
        onSuccess: (data) => {
            toast.success(data.message || 'Email reset password telah dikirim!');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengirim email reset password';
            toast.error(message);
        },
    });

    // Reset password mutation
    const resetPasswordMutation = useMutation({
        mutationFn: authApi.resetPassword,
        onSuccess: (data) => {
            toast.success(data.message || 'Password berhasil direset!');
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mereset password';
            toast.error(message);
        },
    });

    // Get current user query - only fetch if authenticated
    const { data: currentUser, isLoading: isUserLoading } = useQuery({
        queryKey: ['user'],
        queryFn: authApi.getCurrentUser,
        enabled: authState.isAuthenticated && !!authState.token,
        retry: false,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Update profile mutation
    // const updateProfileMutation = useMutation({
    //     mutationFn: authApi.updateProfile,
    //     onSuccess: (data) => {
    //         queryClient.setQueryData(['user'], data);
    //         toast.success('Profile berhasil diupdate!');
    //         // Update user in store if needed
    //         if (data.user) {
    //             setAuth(data.user, authState.token!, authState.refreshToken!);
    //         }
    //     },
    //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    //     onError: (error: any) => {
    //         const message = error.response?.data?.message || 'Gagal mengupdate profile';
    //         toast.error(message);
    //     },
    // });

    // Change password mutation
    const changePasswordMutation = useMutation({
        mutationFn: authApi.changePassword,
        onSuccess: () => {
            toast.success('Password berhasil diubah!');
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || 'Gagal mengubah password';
            toast.error(message);
        },
    });

    // Refresh token function
    const refreshAuth = async () => {
        try {
            if (!authState.refreshToken) {
                throw new Error('No refresh token available');
            }

            setLoading(true);
            const response = await authApi.refreshToken(authState.refreshToken);
            setAuth(response.user, response.token, response.refreshToken);
            authApi.setAuthToken(response.token);
        } catch (error) {
            clearAuth();
            authApi.clearAuthToken();
            setError('Session expired, please login again');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        // Auth state
        ...authState,
        user: currentUser || authState.user, // Prefer fresh data from query
        isUserLoading,

        // Auth actions - these now only handle mutations, state is managed in store
        login: (data: LoginFormData) => loginMutation.mutateAsync(data),
        register: (data: RegisterFormData) => registerMutation.mutateAsync(data),
        logout: () => logoutMutation.mutate(),
        forgotPassword: (data: ForgotPasswordFormData) => forgotPasswordMutation.mutateAsync(data),
        resetPassword: (data: ResetPasswordFormData) => resetPasswordMutation.mutateAsync(data),
        // updateProfile: (data: any) => updateProfileMutation.mutateAsync(data),
        changePassword: (data: any) => changePasswordMutation.mutateAsync(data),
        refreshAuth,

        // Utility functions
        clearError: () => setError(null),

        // Mutation states
        isLoginLoading: loginMutation.isPending,
        isRegisterLoading: registerMutation.isPending,
        isLogoutLoading: logoutMutation.isPending,
        isForgotPasswordLoading: forgotPasswordMutation.isPending,
        isResetPasswordLoading: resetPasswordMutation.isPending,
        // isUpdateProfileLoading: updateProfileMutation.isPending,
        isChangePasswordLoading: changePasswordMutation.isPending,
    };
};