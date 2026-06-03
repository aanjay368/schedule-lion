/** @format */

import { Navigate, type RouteObject } from 'react-router-dom';

import { Suspense } from 'react';
import StaffLayout from './StaffLayout';

export const staffRoutes: RouteObject = {
    path: '/staff',
    element: (
        <Suspense fallback={<div>Loading ...</div>}>
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
            element: <StaffLayout />,
        },            
    ],
};