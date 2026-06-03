/** @format */

import { Navigate, type RouteObject } from 'react-router-dom';

import LeaderLayout from '@/features/leader/LeaderLayout';
import { Suspense } from 'react';
import LeaderDashboardPage from './pages/LeaderDashboardPage';

export const leaderRoutes: RouteObject = {
    path: '/leader',
    element: (
        <Suspense fallback={<div>Loading ...</div>}>
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
            element: <LeaderDashboardPage />,
        },            
    ],
};