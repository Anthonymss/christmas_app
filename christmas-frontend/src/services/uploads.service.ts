import { api } from './api';

export type PresignResponse = { uploadUrl: string; fileUrl: string };

export const presign = async (filename: string) => {
    const { data } = await api.post<PresignResponse>('/uploads/presign', { filename });
    return data;
};
