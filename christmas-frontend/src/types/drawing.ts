export type DrawingCategory = 'CONCURSO' | 'NAVIDAD_FEA';

export interface Drawing {
    id: number;
    imageUrl: string;
    category: DrawingCategory;
    userId: number;
    userName: string;
    votesCount: number;
    createdAt: string;
}
