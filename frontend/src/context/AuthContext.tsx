/** @format */

import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/features/auth/services/auth.service';
import type { UserResponse } from '@/model/user.model';

type AuthContextValue = {
	user: UserResponse | null;
	isLoading: boolean;
	isInitializing: boolean;
	login: (username: string, password: string) => Promise<UserResponse>;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [user, setUser] = useState<UserResponse | null>(null);
	const [isLoading, setLoading] = useState(false);
	const [isInitializing, setInitializing] = useState(true);

	useEffect(() => {		

		authService
			.getCurrentUser()
			.then((currentUser) => {
				setUser(currentUser);				
			})
			.catch(() => setUser(null))
			.finally(() => setInitializing((initializing) => !initializing));
	}, [isInitializing]);

	const login = async (
		username: string,
		password: string,
	): Promise<UserResponse> => {
		setLoading(true);
		try {
			const loggedInUser = await authService.login(username, password);
			setUser(loggedInUser);
			return loggedInUser;
		} finally {
			setLoading(false);
		}
	};

	const logout = async () => {
		await authService.logout();
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, isLoading, isInitializing, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth harus digunakan di dalam AuthProvider');
	return ctx;
};
