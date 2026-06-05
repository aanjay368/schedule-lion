import { Outlet } from "react-router-dom";
import { Calendar1, LayoutDashboard, Users } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";

const adminNavItems = [
  { icon: LayoutDashboard, label: "Beranda", path: "/admin/dashboard" },
  { icon: Users, label: "Karyawan", path: "/admin/employees" },
  { icon: Calendar1, label: "Jadwal", path: "/admin/schedules" },
];

const AdminLayout = () => {
  return (
    <AppLayout navItems={adminNavItems}>
      <Outlet />
    </AppLayout>
  );
};

export default AdminLayout;
