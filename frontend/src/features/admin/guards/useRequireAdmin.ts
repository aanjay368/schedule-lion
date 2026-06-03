/** @format */

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export const useRequireAdmin = (opts?: { redirectTo?: string }) => {
	const { redirectTo = '/' } = opts ?? {};
	const { user, isInitializing } = useAuth();
	const navigate = useNavigate();
    const location = useLocation();    
    
    useEffect(() => {
		if (isInitializing) return;
		if (!user || user.role !== 'admin') {
			navigate(redirectTo, {
				replace: true,
				state: { from: location.pathname },
			});
		}
	}, [isInitializing, user, navigate, redirectTo, location.pathname]);

	return user?.role === 'admin';
};
