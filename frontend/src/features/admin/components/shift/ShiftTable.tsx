import { memo } from 'react';
import { Pencil, Trash2, MoreHorizontal, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ShiftResponse } from '@/model/shift.model';

type ShiftTableProps = {
	shifts: ShiftResponse[];
	page: number;
	totalPages: number;
	isLoading: boolean;
	error?: string | null;
	onPageChange: (page: number) => void;
	onEdit: (shift: ShiftResponse) => void;
	onDelete: (shift: ShiftResponse) => void;
};

const ShiftTable = ({
	shifts,
	page,
	totalPages,
	isLoading,
	error,
	onPageChange,
	onEdit,
	onDelete,
}: ShiftTableProps) => {	

	return (
		<>
			<Table>
				<colgroup>
					<col style={{ width: 'auto' }} />
					<col style={{ width: '120px' }} />
					<col style={{ width: '200px' }} />
					<col style={{ width: '160px' }} />
					<col style={{ width: '160px' }} />
					<col style={{ width: '48px' }} />
				</colgroup>
				<TableHeader>
					<TableRow>
						<TableHead>Nama shift</TableHead>
						<TableHead>Kode</TableHead>
						<TableHead>Jam kerja</TableHead>
						<TableHead>Divisi</TableHead>
						<TableHead>Posisi</TableHead>
						<TableHead className='w-12' />
					</TableRow>
				</TableHeader>
				<TableBody>
					{shifts.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={6}
								className='text-center py-16 text-muted-foreground text-sm'
							>
								{error || 'Tidak ada data shift ditemukan.'}
							</TableCell>
						</TableRow>
					) : (
						shifts.map((shift) => (
							<TableRow key={shift.id}>
								<TableCell className='font-medium text-sm'>
									{shift.name}
								</TableCell>
								<TableCell>
									<span className='inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded bg-muted border border-border text-foreground'>
										{shift.code}
									</span>
								</TableCell>
								<TableCell className='text-sm'>
									<div className='flex items-center gap-1.5 text-muted-foreground'>
										<Clock size={14} className='shrink-0' />
										{!shift.start_time && !shift.end_time ? (
											<span className="italic text-muted-foreground/60">-</span>
										) : (
											<span>
												{shift.start_time ?? '-'}
												{' - '}
												{shift.end_time ?? 'Last Flight'}
											</span>
										)}
									</div>
								</TableCell>
								<TableCell>
									<span className='inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary'>
										{shift.division?.name}
									</span>
								</TableCell>
								<TableCell className='text-sm'>
									{shift.position?.name}
								</TableCell>
								<TableCell className='text-right pr-4'>
									{!shift.is_read_only && (
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant='ghost'
													size='icon'
													className='w-8 h-8 text-muted-foreground'
												>
													<MoreHorizontal size={15} />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align='end' className='w-40'>
												<DropdownMenuItem
													className='gap-2 cursor-pointer'
													onClick={() => onEdit(shift)}
												>
													<Pencil size={14} /> Edit
												</DropdownMenuItem>
												<DropdownMenuItem
													className='gap-2 cursor-pointer text-destructive focus:text-destructive'
													onClick={() => onDelete(shift)}
												>
													<Trash2 size={14} /> Hapus
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{totalPages > 1 && (
				<div className='px-5 py-3 border-t border-border flex items-center justify-between'>
					<p className='text-xs text-muted-foreground'>
						Halaman {page} dari {totalPages}
					</p>
					<div className='flex items-center gap-1'>
						<Button
							variant='outline'
							size='icon'
							className='w-8 h-8'
							onClick={() => onPageChange(Math.max(1, page - 1))}
							disabled={page === 1}
						>
							<ChevronLeft size={14} />
						</Button>
						<Button
							variant='outline'
							size='icon'
							className='w-8 h-8'
							onClick={() => onPageChange(Math.min(totalPages, page + 1))}
							disabled={page === totalPages}
						>
							<ChevronRight size={14} />
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(ShiftTable);
