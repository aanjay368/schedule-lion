import { 
    SidebarProvider, 
    Sidebar, 
    SidebarHeader, 
    SidebarContent, 
    SidebarGroup, 
    SidebarGroupLabel, 
    SidebarGroupContent, 
    SidebarMenu, 
    SidebarMenuItem, 
    SidebarMenuButton, 
    SidebarFooter 
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export function AppLayoutSkeleton() {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-background">
                {/* Precise Sidebar Skeleton */}
                <Sidebar>
                    <SidebarHeader className="px-4 py-4 border-b border-border">
                        <div className="flex items-center gap-2.5">
                            <Skeleton className="w-7 h-7 rounded-lg shrink-0" />
                            <Skeleton className="h-4 w-28" />
                        </div>
                    </SidebarHeader>

                    <SidebarContent className="px-2 py-3">
                        <SidebarGroup>
                            <SidebarGroupLabel>
                                <Skeleton className="h-3 w-20" />
                            </SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <SidebarMenuItem key={i}>
                                            <SidebarMenuButton className="gap-3 cursor-default" disabled>
                                                <Skeleton className="h-4 w-4 shrink-0" />
                                                <Skeleton className="h-3.5 w-24" />
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>

                    <SidebarFooter className="border-t border-border p-3">
                        <div className="flex items-center gap-3 px-1">
                            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                            <div className="flex-1 space-y-1.5 min-w-0">
                                <Skeleton className="h-3.5 w-24" />
                                <Skeleton className="h-3 w-12" />
                            </div>
                            <Skeleton className="w-7 h-7 rounded-md shrink-0" />
                        </div>
                    </SidebarFooter>
                </Sidebar>

                {/* Main Content Area */}
                <div className="flex flex-col flex-1 min-w-0">
                    <header className="h-12 flex items-center gap-3 px-4 border-b border-border md:hidden">
                        <Skeleton className="w-8 h-8 rounded-md shrink-0" />
                        <Skeleton className="h-4 w-28" />
                    </header>

                    <main className="flex-1 p-6">
                        <PageContentSkeleton />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

export function PageContentSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="flex items-start justify-between">
                <div className="space-y-2.5">
                    <Skeleton className="h-6 w-36" />
                    <Skeleton className="h-4 w-56" />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-[120px] rounded-xl" />
                ))}
            </div>

            <Skeleton className="h-[300px] rounded-xl w-full" />
        </div>
    );
}
