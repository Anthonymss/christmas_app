import { api } from './api';

export const spin = async () => {
    const { data } = await api.post('/roulette/spin');
    return data;
};

export const me = async () => {
    const { data } = await api.get('/roulette/me');
    return data;
};
export const prizes = async () => {
    const { data } = await api.get('/roulette/prizes');
    return data;
};
