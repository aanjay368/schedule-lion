/** @format */

import { AppLayoutSkeleton, PageContentSkeleton } from '@/components/layout/AppLayoutSkeleton';
import { lazy, Suspense } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';

const StaffLayout      = lazy(() => import('./StaffLayout'));
const StaffDashboard   = lazy(() => import('./pages/StaffDashboardPage'));

export const staffRoutes: RouteObject = {
    path: '/staff',
    element: (
        <Suspense fallback={<AppLayoutSkeleton />}>
            <StaffLayout />
        </Suspense>
    ),
    children: [
        {
            index: true,
            element: <Navigate to="/staff/dashboard" replace />,
        },
        {
            path: 'dashboard',
            element: (
                <Suspense fallback={<PageContentSkeleton />}>
                    <StaffDashboard />
                </Suspense>
            ),
        },
    ],
};