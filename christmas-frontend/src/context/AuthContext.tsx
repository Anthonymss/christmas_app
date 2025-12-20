import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginSvc, register as registerSvc, getMe } from '../services/auth.service';
import type { User } from '../types/user';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (u: string, p: string) => Promise<void>;
    register: (u: string, p: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setReady(true);
            return;
        }

        getMe()
            .then(setUser)
            .catch(() => {
                localStorage.removeItem('token');
                setUser(null);
            })
            .finally(() => setReady(true));
    }, []);

    const login = async (username: string, password: string) => {
        const { access_token } = await loginSvc(username, password);
        localStorage.setItem('token', access_token);
        const me = await getMe();
        setUser(me);
    };

    const register = async (username: string, password: string) => {
        const res = await registerSvc(username, password);

        if (res.access_token) {
            localStorage.setItem('token', res.access_token);
            const me = await getMe();
            setUser(me);
        } else {
            await login(username, password);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    if (!ready) return null;

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
};
