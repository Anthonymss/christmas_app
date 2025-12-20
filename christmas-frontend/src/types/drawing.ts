export type DrawingCategory = 'CONCURSO' | 'NAVIDAD_FEA' | 'VILLANCICOS';

export interface Drawing {
    id: number;
    imageUrl: string;
    category: DrawingCategory;
    userId: number;
    userName: string;
    votesCount: number;
    createdAt: string;
    reacters?: string[];
    reactionsStats?: Record<string, number>;
}
