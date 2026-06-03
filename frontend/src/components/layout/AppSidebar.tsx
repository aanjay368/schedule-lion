import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LogOut, ChevronDown, ChevronRight } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export type NavSubItem = {
  icon?: any;
  label: string;
  path: string;
};

export type NavItem = {
  icon: any;
  label: string;
  path?: string;
  items?: NavSubItem[];
};

type AppSidebarProps = {
  navItems: NavItem[];
};

const AppSidebar = ({ navItems }: AppSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const employee = user?.employee;

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    navItems.forEach((item) => {
      if (item.items) {
        const hasActiveChild = item.items.some(
          (sub) => location.pathname === sub.path,
        );
        if (hasActiveChild) {
          initial[item.label] = true;
        }
      }
    });
    return initial;
  });

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">
            L
          </div>
          <span className="text-sm font-medium text-foreground">
            Schedule
            <span className="text-muted-foreground font-normal">Lion</span>
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel>Menu utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (item.items && item.items.length > 0) {
                  const isOpen = !!openMenus[item.label];
                  const hasActiveChild = item.items.some(
                    (sub) => location.pathname === sub.path,
                  );
                  const Icon = item.icon;

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        onClick={() => toggleMenu(item.label)}
                        isActive={hasActiveChild}
                        className="gap-3 cursor-pointer w-full justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={16} />
                          <span>{item.label}</span>
                        </div>
                        {isOpen ? (
                          <ChevronDown
                            size={14}
                            className="text-muted-foreground shrink-0"
                          />
                        ) : (
                          <ChevronRight
                            size={14}
                            className="text-muted-foreground shrink-0"
                          />
                        )}
                      </SidebarMenuButton>

                      {isOpen && (
                        <SidebarMenuSub>
                          {item.items.map((subItem) => {
                            const active = location.pathname === subItem.path;
                            const SubIcon = subItem.icon;
                            return (
                              <SidebarMenuSubItem key={subItem.path}>
                                <SidebarMenuSubButton
                                  onClick={() => navigate(subItem.path)}
                                  isActive={active}
                                  className="cursor-pointer flex items-center gap-2"
                                >
                                  {SubIcon && (
                                    <SubIcon
                                      size={14}
                                      className="shrink-0 text-muted-foreground"
                                    />
                                  )}
                                  <span>{subItem.label}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }

                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => item.path && navigate(item.path)}
                      isActive={active}
                      className="gap-3 cursor-pointer"
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-accent-foreground shrink-0">
            {employee?.nickname?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {employee?.fullname}
            </p>
            <p className="text-xs text-muted-foreground">{user?.role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/login")}
            className="w-7 h-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Keluar"
          >
            <LogOut size={14} />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
