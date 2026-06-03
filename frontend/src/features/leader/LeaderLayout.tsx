import { Outlet } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const leaderNavItems = [
    { icon: LayoutDashboard, label: 'Beranda',    path: '/leader/dashboard' },    
];

const LeaderLayout = () => {
    return (
        <AppLayout navItems={leaderNavItems}>
            <Outlet />
        </AppLayout>
    );
};

export default LeaderLayout;