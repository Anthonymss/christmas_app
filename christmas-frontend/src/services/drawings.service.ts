import { getPosts, uploadPost, type Post } from './posts.service';
import type { Drawing, DrawingCategory } from '../types/drawing';

const mapPostToDrawing = (post: Post): Drawing => ({
    id: post.id,
    userId: post.userId,
    imageUrl: post.url,
    votesCount: post.votesCount,
    category: post.category as DrawingCategory,
    createdAt: post.createdAt,
    userName: post.username,
    reacters: post.reacters,
    reactionsStats: post.reactionsStats
});

export const getDrawings = async (category: DrawingCategory) => {
    const posts = await getPosts(category);
    return posts.map(mapPostToDrawing);
};

export const createDrawing = async (file: File, category: DrawingCategory) => {
    const post = await uploadPost(file, category, 'IMAGE');
    return mapPostToDrawing(post as unknown as Post);
};
