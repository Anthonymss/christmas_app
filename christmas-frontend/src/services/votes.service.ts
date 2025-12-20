import { api } from './api';
import type { DrawingCategory } from '../types/drawing';

export const voteDrawing = async (drawingId: number) => {
    const { data } = await api.post('/votes', { drawingId });
    return data;
};

export type RankingRow = { drawingId: number; votes: number; imageUrl: string; userId: number; username: string };

export const getRanking = async (category: DrawingCategory) => {
    const { data } = await api.get(`/votes/ranking?category=${category}`);
    return Array.isArray(data) ? (data as RankingRow[]) : (Array.isArray(data?.data) ? data.data : []);
};
