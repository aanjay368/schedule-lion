import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { adminRoutes } from '@/features/admin/admin.routes';
import { staffRoutes } from '@/features/staff/staff.routes';
import { leaderRoutes } from '@/features/leader/leader.routes';
import { Spinner } from './components/ui/spinner';

const LoginPage = lazy(() => import('@/features/auth/pages/LoginPage'));
import LoginPageSkeleton from '@/features/auth/pages/LoginPageSkeleton';

const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <Suspense fallback={<LoginPageSkeleton />}>
                <LoginPage />
            </Suspense>
        ),
    },
    adminRoutes,
    leaderRoutes,
    staffRoutes,
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },
]);

export const AppRouter = () => {
    return <RouterProvider router={router} />;
};