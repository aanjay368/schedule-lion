/** @format */

import { lazy, Suspense } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { RequireAdmin } from '@/features/admin/guards/RequireAdmin';
import { AppLayoutSkeleton, PageContentSkeleton } from '@/components/layout/AppLayoutSkeleton';

// Lazy-load layout dan semua halaman admin
const AdminLayout       = lazy(() => import('@/features/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('@/features/admin/pages/AdminDashboardPage'));
const AdminEmployeePage  = lazy(() => import('@/features/admin/pages/AdminEmployeePage'));
const AdminSchedulePage  = lazy(() => import('@/features/admin/pages/AdminSchedulePage'));

export const adminRoutes: RouteObject = {
    path: '/admin',
    element: (
        <Suspense fallback={<AppLayoutSkeleton />}>
            <RequireAdmin>
                <AdminLayout />
            </RequireAdmin>
        </Suspense>
    ),
    children: [
        {
            index: true,
            element: <Navigate to="/admin/dashboard" replace />,
        },
        {
            path: 'dashboard',
            element: (
                <Suspense fallback={<PageContentSkeleton />}>
                    <AdminDashboardPage />
                </Suspense>
            ),
        },
        {
            path: 'employees',
            element: (
                <Suspense fallback={<PageContentSkeleton />}>
                    <AdminEmployeePage />
                </Suspense>
            ),
        },
        {
            path: 'schedules',
            element: (
                <Suspense fallback={<PageContentSkeleton />}>
                    <AdminSchedulePage />
                </Suspense>
            ),
        },
    ],
};