import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function EmployeeTableSkeleton() {
    return (
        <TableSkeleton
            cols={['Nama lengkap', 'Nama panggilan', 'Divisi', 'Posisi']}
            colWidths={['auto', '200px', '160px', '160px']}
            rows={10}
        />
    );
}
