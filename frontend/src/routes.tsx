import { createBrowserRouter, Navigate } from "react-router-dom";
import { adminRoutes } from "@/features/admin/admin.routes";
import LoginPage from "@/features/auth/pages/LoginPage";
import { Suspense } from "react";
import { staffRoutes } from "./features/staff/staff.routes";
import { leaderRoutes } from "./features/leader/leader.routes";

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Suspense fallback={<div>Loading</div>}><LoginPage /></Suspense>,
    },
    adminRoutes,
    leaderRoutes,
    staffRoutes,
    {        
        path: '/',
        element: <Navigate to="/login" replace />,
    },
]);