import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, setToken as saveToken, removeToken } from '@/services/api';

interface User {
    id: number;
    username: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is logged in on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            authAPI.getProfile()
                .then((response) => {
                    setUser(response.user);
                })
                .catch(() => {
                    removeToken();
                })
                .finally(() => {
                    setIsLoading(false);
                });
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authAPI.login(email, password);
        saveToken(response.token);
        setUser(response.user);
    };

    const register = async (username: string, email: string, password: string) => {
        const response = await authAPI.register(username, email, password);
        // Auto-login after registration
        await login(email, password);
    };

    const logout = () => {
        authAPI.logout().catch(() => { });
        removeToken();
        setUser(null);
    };

    const updateUser = async (data: Partial<User>) => {
        const response = await authAPI.updateProfile(data);
        setUser(response.user);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
                updateUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
