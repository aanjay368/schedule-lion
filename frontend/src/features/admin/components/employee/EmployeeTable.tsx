/** @format */
import { memo } from 'react';

import {
	Eye,
	Pencil,
	Trash2,
	MoreHorizontal,
	ChevronLeft,
	ChevronRight,
} from 'lucide-react';
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
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { EmployeeResponse } from '@/model/employee.model';
import EmployeeTableSkeleton from './EmployeeTableSkeleton';

const initials = (name: string) =>
	name
		.split(' ')
		.slice(0, 2)
		.map((n) => n[0])
		.join('')
		.toUpperCase();

type EmployeeTableProps = {
	employees: EmployeeResponse[];
	page: number;
	totalPages: number;
	isLoading: boolean;
	error?: string | null;
	onPageChange: (page: number) => void;
	onDetail: (employee: EmployeeResponse) => void;
	onEdit: (employee: EmployeeResponse) => void;
	onDelete: (employee: EmployeeResponse) => void;
};

const EmployeeTable = ({
	employees,
	page,
	totalPages,
	isLoading,
	error,
	onPageChange,
	onDetail,
	onEdit,
	onDelete,
}: EmployeeTableProps) => {

	if (isLoading) {
		return <EmployeeTableSkeleton />;
	}

	return (
		<>
			<Table>
				<colgroup>
					<col style={{ width: 'auto' }} />
					<col style={{ width: '200px' }} />
					<col style={{ width: '160px' }} />
					<col style={{ width: '160px' }} />
					<col style={{ width: '48px' }} />
				</colgroup>
				<TableHeader>
					<TableRow>
						<TableHead>Nama lengkap</TableHead>
						<TableHead>Nama panggilan</TableHead>
						<TableHead>Divisi</TableHead>
						<TableHead>Posisi</TableHead>
						<TableHead className='w-12' />
					</TableRow>
				</TableHeader>
				<TableBody>
					{employees.length === 0 ?
						<TableRow>
							<TableCell
								colSpan={5}
								className='text-center py-16 text-muted-foreground text-sm'>
								{error}
							</TableCell>
						</TableRow>
					:	employees.map((employee) => (
							<TableRow key={employee.id} className={employee.is_deleted ? 'italic text-muted-foreground' : ''}>
								<TableCell>
									<div className='flex items-center gap-3'>
										<div className='w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-medium shrink-0'>
											{initials(employee.fullname)}
										</div>
										<span className='font-medium text-sm'>
											{employee.fullname}
										</span>
									</div>
								</TableCell>
								<TableCell className='text-sm'>
									{employee.nickname}
								</TableCell>
								<TableCell>
									<span className='inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10'>
										{employee.division.name}
									</span>
								</TableCell>
								<TableCell className='text-sm'>
									{employee.position.name}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant='ghost'
												size='icon'
												className='w-8 h-8 text-muted-foreground'>
												<MoreHorizontal size={15} />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align='end' className='w-40'>
											<DropdownMenuItem
												className='gap-2 cursor-pointer'
												onClick={() => onDetail(employee)}>
												<Eye size={14} /> Lihat detail
											</DropdownMenuItem>
											<DropdownMenuItem
												className='gap-2 cursor-pointer'
												onClick={() => onEdit(employee)}>
												<Pencil size={14} /> Edit
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<DropdownMenuItem
												className='gap-2 cursor-pointer text-destructive focus:text-destructive'
												onClick={() => onDelete(employee)}>
												<Trash2 size={14} /> Hapus
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					}
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
							disabled={page === 1}>
							<ChevronLeft size={14} />
						</Button>
						<Button
							variant='outline'
							size='icon'
							className='w-8 h-8'
							onClick={() => onPageChange(Math.min(totalPages, page + 1))}
							disabled={page === totalPages}>
							<ChevronRight size={14} />
						</Button>
					</div>
				</div>
			)}
		</>
	);
};

export default memo(EmployeeTable);
