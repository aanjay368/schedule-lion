/** @format */

import { lazy, Suspense } from 'react';
import { Navigate, type RouteObject } from 'react-router-dom';
import { AppLayoutSkeleton, PageContentSkeleton } from '@/components/layout/AppLayoutSkeleton';

const LeaderLayout    = lazy(() => import('@/features/leader/LeaderLayout'));
const LeaderDashboard = lazy(() => import('@/features/leader/pages/LeaderDashboardPage'));

export const leaderRoutes: RouteObject = {
    path: '/leader',
    element: (
        <Suspense fallback={<AppLayoutSkeleton />}>
            <LeaderLayout />
        </Suspense>
    ),
    children: [
        {
            index: true,
            element: <Navigate to="/leader/dashboard" replace />,
        },
        {
            path: 'dashboard',
            element: (
                <Suspense fallback={<PageContentSkeleton />}>
                    <LeaderDashboard />
                </Suspense>
            ),
        },
    ],
};