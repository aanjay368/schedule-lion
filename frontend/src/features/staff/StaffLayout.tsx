import { Outlet } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const staffNavItems = [
    { icon: LayoutDashboard, label: 'Beranda',    path: '/staff/dashboard' },    
];

const StaffLayout = () => {
    return (
        <AppLayout navItems={staffNavItems}>
            <Outlet />
        </AppLayout>
    );
};

export default StaffLayout;