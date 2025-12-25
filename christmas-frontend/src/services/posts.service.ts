import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL + '/posts';
const VOTE_API_URL = import.meta.env.VITE_API_URL + '/votes';

export interface Post {
    id: number;
    category: 'CONCURSO' | 'NAVIDAD_FEA' | 'VILLANCICOS';
    type: 'IMAGE' | 'VIDEO';
    url: string;
    description: string;
    userId: number;
    username: string;
    votesCount: number;
    createdAt: string;
    reacters?: string[];
    reactionsStats?: Record<string, number>;
    comments: {
        id: number;
        content: string;
        user: { username: string };
        createdAt: string;
    }[];
}

export const getPosts = async (category: string) => {
    const response = await axios.get<Post[]>(API_URL, { params: { category } });
    return response.data;
};

export const uploadPost = async (file: File, category: string, type: 'IMAGE' | 'VIDEO', description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    formData.append('type', type);
    if (description) formData.append('description', description);

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No estás autenticado (Token no encontrado)');
    }

    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const votePost = async (id: number, type: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${VOTE_API_URL}/${id}`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const commentPost = async (id: number, content: string) => {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/${id}/comments`, { content }, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getRanking = async (category: string) => {
    const response = await axios.get(`${VOTE_API_URL}/ranking`, { params: { category } });
    return response.data;
};

export const getMyPosts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get<Post[]>(`${API_URL}/mine`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const replacePost = async (id: number, file: File, description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (description) formData.append('description', description);

    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/${id}/replace`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};
