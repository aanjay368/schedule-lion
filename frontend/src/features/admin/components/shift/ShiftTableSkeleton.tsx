import { TableSkeleton } from '@/components/ui/table-skeleton';

export default function ShiftTableSkeleton() {
    return (
        <TableSkeleton
            cols={['Nama shift', 'Kode', 'Jam kerja', 'Divisi', 'Posisi']}
            colWidths={['auto', '120px', '200px', '160px', '160px']}
            rows={10}
        />
    );
}
