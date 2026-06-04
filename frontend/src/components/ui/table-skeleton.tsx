import { Skeleton } from '@/components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type TableSkeletonProps = {
    /** Jumlah kolom header yang ditampilkan */
    cols: string[];
    /** Jumlah baris skeleton (default: 8) */
    rows?: number;
    /** Lebar masing-masing kolom untuk menjaga presisi layout */
    colWidths?: string[];
};

/**
 * Skeleton untuk tabel data — digunakan sebagai fallback loading state.
 * Cocok untuk semua tabel yang punya struktur kolom serupa.
 */
export function TableSkeleton({ cols, rows = 8, colWidths }: TableSkeletonProps) {
    return (
        <Table>
            {colWidths && (
                <colgroup>
                    {colWidths.map((width, idx) => (
                        <col key={idx} style={{ width }} />
                    ))}
                    {/* Kolom aksi terakhir */}
                    <col style={{ width: '48px' }} />
                </colgroup>
            )}
            <TableHeader>
                <TableRow>
                    {cols.map((col) => (
                        <TableHead key={col}>{col}</TableHead>
                    ))}
                    {/* kolom aksi */}
                    <TableHead className="w-12" />
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: rows }).map((_, i) => (
                    <TableRow key={i}>
                        {/* Kolom pertama: avatar + nama */}
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </TableCell>
                        {/* Kolom-kolom sisa */}
                        {cols.slice(1).map((_, j) => (
                            <TableCell key={j}>
                                <Skeleton className="h-4 w-24" />
                            </TableCell>
                        ))}
                        {/* Kolom aksi */}
                        <TableCell>
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
