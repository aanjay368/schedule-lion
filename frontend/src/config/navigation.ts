import { LayoutDashboard, Users, Calendar, Settings, ClipboardList } from 'lucide-react';

export const adminNavigation = [
  { icon: LayoutDashboard, label: 'Overview', path: '/admin/dashboard' },
  { icon: Users, label: 'Employees', path: '/admin/employees' },
  { icon: Calendar, label: 'Schedules', path: '/admin/schedules' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export const leaderNavigation = [
  { icon: LayoutDashboard, label: 'Overview', path: '/leader/dashboard' },
  { icon: Users, label: 'Team', path: '/leader/team' },
  { icon: ClipboardList, label: 'Approvals', path: '/leader/approvals' },
];

export const staffNavigation = [
  { icon: LayoutDashboard, label: 'Overview', path: '/staff/dashboard' },
  { icon: Calendar, label: 'My Schedule', path: '/staff/schedule' },
];
