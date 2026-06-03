/** @format */

import { Navigate, type RouteObject } from 'react-router-dom';

import AdminLayout from '@/features/admin/AdminLayout';
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import AdminEmployeePage from '@/features/admin/pages/AdminEmployeePage';
import { useRequireAdmin } from '@/features/admin/guards/useRequireAdmin';
import { Suspense } from 'react';

function RequireAdminWrapper({ children }: { children: React.ReactNode }) {
	useRequireAdmin({ redirectTo: '/' });
	return <>{children}</>;
}

export const adminRoutes: RouteObject = {
    path: '/admin',
    element: (
        <Suspense fallback={<div>Loading ...</div>}><RequireAdminWrapper>
            <AdminLayout />
        </RequireAdminWrapper></Suspense>
    ),
    children: [
        {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
        },
        {
            path: 'dashboard',
            element: <AdminDashboardPage />,
        },
        {
            path: 'employees',
            element: <AdminEmployeePage />,
        },        
    ],
};