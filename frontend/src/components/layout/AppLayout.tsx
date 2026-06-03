import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar, { type NavItem } from './AppSidebar';

type AppLayoutProps = {
    navItems: NavItem[];
    children: React.ReactNode;
};

const AppLayout = ({ navItems, children }: AppLayoutProps) => {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                <AppSidebar navItems={navItems} />

                <div className="flex flex-col flex-1 min-w-0">

                    {/* Mobile topbar */}
                    <header className="h-12 flex items-center gap-3 px-4 border-b border-border md:hidden">
                        <SidebarTrigger />
                        <span className="text-sm font-medium text-foreground">Schedule Lion</span>
                    </header>

                    {/* Page content */}
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default AppLayout;