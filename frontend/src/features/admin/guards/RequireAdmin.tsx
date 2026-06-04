import { useRequireAdmin } from './useRequireAdmin';

type RequireAdminProps = {
    children: React.ReactNode;
};

export function RequireAdmin({ children }: { children: RequireAdminProps['children'] }) {
    useRequireAdmin({ redirectTo: '/' });
    return <>{children}</>;
}
