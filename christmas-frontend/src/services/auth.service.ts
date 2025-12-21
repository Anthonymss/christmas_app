import { api } from './api';

interface AuthResponse {
    access_token: string;
}

export const login = async (username: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', {
        username,
        password,
    });
    return data;
};

export const updateUser = async (username: string) => {
    const { data } = await api.patch('/users/me', { username });
    return data;
};

export const register = async (username: string, password: string) => {
    const { data } = await api.post<AuthResponse & { message?: string }>('/auth/register', {
        username,
        password,
    });
    return data;
};

export const getMe = async () => {
    const { data } = await api.get('/users/me');
    return data;
};
