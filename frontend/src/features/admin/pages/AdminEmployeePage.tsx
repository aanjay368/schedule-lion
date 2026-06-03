import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEmployees } from '../hooks/useEmployees';
import { useDivisions } from '../hooks/useDivision';
import EmployeeFilterBar from '../components/employee/EmployeeFilterBar';
import EmployeeTable from '../components/employee/EmployeeTable';
import EmployeeDialogs, { type DialogMode } from '../components/employee/EmployeeDialogs';
import type { EmployeeResponse } from '@/model/employee.model';
import type { EmployeeFormValues } from '../schemas/employee.schema';
import { isAxiosError } from 'axios';

const EMPTY_FORM: EmployeeFormValues = {
    fullname: '', nickname: '', division_id: 0, position_id: 0,
};

const AdminEmployeePage = () => {
    const {
        employees, isLoading, error,
        page, totalPages, total,
        search, divisionId, positionId, showDeleted,
        setSearch, setPage, setDivisionId, setPositionId, setShowDeleted,
        form,
        create, update, remove,
    } = useEmployees();

    const { divisions } = useDivisions();

    const [dialogMode, setDialogMode]     = useState<DialogMode>(null);
    const [selected, setSelected]         = useState<EmployeeResponse | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<EmployeeResponse | null>(null);
    const [saveError, setSaveError]       = useState<string | null>(null);

    // ── Dialog handlers ────────────────────────────────────────────────

    const openAdd = () => {
        form.reset(EMPTY_FORM);
        setSaveError(null);
        setDialogMode('add');
    };

    const openEdit = (employee: EmployeeResponse) => {
        setSelected(employee);
        form.reset({
            fullname:    employee.fullname,
            nickname:    employee.nickname,
            division_id: employee.division.id,
            position_id: employee.position.id,
        });
        setSaveError(null);
        setDialogMode('edit');
    };

    const openDetail = (employee: EmployeeResponse) => {
        setSelected(employee);
        form.reset({
            fullname:    employee.fullname,
            nickname:    employee.nickname,
            division_id: employee.division.id,
            position_id: employee.position.id,
        });
        setDialogMode('detail');
    };

    const closeDialog = () => {
        setDialogMode(null);
        setSelected(null);
        form.reset(EMPTY_FORM);
        setSaveError(null);
    };

    // ── Save — dijalankan setelah RHF memvalidasi semua field ──────────
    const handleSave = form.handleSubmit(async (data: EmployeeFormValues) => {
        setSaveError(null);
        try {
            if (dialogMode === 'add') {
                await create(data);
            } else if (dialogMode === 'edit' && selected) {
                await update(selected.id, data);
            }
            closeDialog();
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const apiError = err.response?.data?.error;
                if (apiError && typeof apiError === 'object') {                    
                    (Object.entries(apiError) as [keyof EmployeeFormValues, string][]).forEach(
                        ([field, msg]) => form.setError(field, { type: 'server', message: msg }),
                    );
                } else {
                    setSaveError(typeof apiError === 'string' ? apiError : 'Tidak dapat terhubung dengan server.');
                }
            } else if (err && typeof err === 'object') {
                (Object.entries(err) as [keyof EmployeeFormValues, string][]).forEach(
                    ([field, msg]) => form.setError(field, { type: 'server', message: msg }),
                );
            } else {
                setSaveError('Gagal menyimpan data karyawan.');
            }
        }
    });

    const handleDelete = async () => {
        if (!deleteTarget) return;
        await remove(deleteTarget.id);
        setDeleteTarget(null);
    };

    // ── Render ─────────────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold text-foreground">Data karyawan</h1>
                    <p className="text-sm text-muted-foreground">
                        Kelola seluruh data karyawan perusahaan
                    </p>
                </div>
                <Button size="sm" className="gap-2" onClick={openAdd}>
                    <Plus size={15} /> Tambah karyawan
                </Button>
            </div>

            <Card>
                <CardHeader className="px-5 py-4 border-b border-border space-y-0">
                    <EmployeeFilterBar
                        search={search}
                        divisionId={divisionId}
                        positionId={positionId}
                        divisions={divisions}
                        showDeleted={showDeleted}
                        total={total}
                        onSearch={setSearch}
                        onDivision={setDivisionId}
                        onPosition={setPositionId}
                        onShowDeleted={setShowDeleted}
                    />
                </CardHeader>
                <CardContent className="p-0">
                    {isLoading ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">
                            Memuat data...
                        </div>
                    ) : (
                        <EmployeeTable
                            employees={employees}
                            page={page}
                            totalPages={totalPages}
                            error={error}
                            onPageChange={setPage}
                            onDetail={openDetail}
                            onEdit={openEdit}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardContent>
            </Card>

            <EmployeeDialogs
                mode={dialogMode}
                rhf={form}
                saveError={saveError}
                deleteTarget={deleteTarget}
                selected={selected}
                onSave={handleSave}
                onClose={closeDialog}
                onDeleteConfirm={handleDelete}
                onDeleteCancel={() => setDeleteTarget(null)}
            />
        </div>
    );
};

export default AdminEmployeePage;