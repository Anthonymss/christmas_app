import { api } from './api';
import type { Drawing, DrawingCategory } from '../types/drawing';

export const getDrawings = async (category: DrawingCategory) => {
    const res = await api.get(`/drawings?category=${category}`);
    if (Array.isArray(res.data)) return res.data as Drawing[];
    if (Array.isArray(res.data?.data)) return res.data.data as Drawing[];
    return [];
};

export const createDrawing = async (file: File, category: DrawingCategory) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const { data } = await api.post('/drawings', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data;
};
