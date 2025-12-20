import { api } from './api';
import type { DrawingCategory } from '../types/drawing';

// Now wraps to the new POST /votes/:id endpoint
export const voteDrawing = async (drawingId: number, type: string = 'HEART') => {
    // drawingId is postId in the new system
    const { data } = await api.post(`/votes/${drawingId}`, { type });
    return data;
};

export type RankingRow = { drawingId: number; votes: number; imageUrl: string; userId: number; username: string };

export const getRanking = async (category: DrawingCategory) => {
    const { data } = await api.get(`/votes/ranking?category=${category}`);
    // Backend returns { drawingId, postId, imageUrl, votes, username }
    return Array.isArray(data) ? (data as RankingRow[]) : [];
};
