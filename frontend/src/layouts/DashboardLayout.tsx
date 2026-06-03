import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItem {
  icon: any;
  label: string;
  path: string;
}

interface UserProfile {
  name: string;
  role: string;
  avatar?: string;
}

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  user: UserProfile;
}

const DashboardLayout = ({ children, navItems, user }: DashboardLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 antialiased">
      
      {/* Sidebar - Menggunakan warna dasar Matte Slate yang senada dengan form login */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800/60 flex flex-col">
        
        {/* Header Sidebar */}
        <div className="h-16 flex items-center px-6 font-semibold text-slate-100 text-lg border-b border-slate-800/60 tracking-tight">
          Schedule Lion
        </div>
        
        {/* Menu Navigasi */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item, index) => {
            // Memeriksa apakah halaman ini sedang aktif/dibuka oleh user
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`}
              >
                <item.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Bagian Bawah: Profil User & Tombol Keluar */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-900">
          <div className="flex items-center space-x-3 mb-4 px-1">
            {/* Avatar dengan aksen biru lembut khas login page */}
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-semibold text-blue-400 text-sm">
              {user.avatar || user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
          </div>
          
          {/* Tombol Logout Kustom (Senada dengan gaya Alert error di login page) */}
          <Button 
            onClick={handleLogout}
            className="w-full h-9 bg-red-950/20 hover:bg-red-900/30 text-red-400 border border-red-900/30 rounded-lg text-xs font-medium transition-colors"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Keluar dari Akun
          </Button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-slate-900 border-b border-slate-800/60 flex items-center justify-between px-8">
          <div className="text-sm font-medium text-slate-300">
            Selamat datang kembali, <span className="text-slate-100 font-semibold">{user.name}</span>!
          </div>
        </header>
        
        {/* Isi Halaman / Children */}
        <div className="flex-1 overflow-auto bg-slate-950 p-6 sm:p-8">
          {children}
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;