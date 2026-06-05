import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useShifts } from '../hooks/useShifts';
import { useScheduleUpload } from '../hooks/useScheduleUpload';
import ShiftFilterBar from '../components/shift/ShiftFilterBar';
import ShiftTable from '../components/shift/ShiftTable';
import ShiftDialogs, { type DialogMode } from '../components/shift/ShiftDialogs';
import ScheduleUploadForm from '../components/schedule/ScheduleUploadForm';
import SchedulePreviewTable from '../components/schedule/SchedulePreviewTable';
import type { ShiftResponse } from '@/model/shift.model';
import type { ShiftFormValues } from '../schemas/shift.schema';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

const EMPTY_FORM: ShiftFormValues = {
    name: '',
    code: '',
    start_time: '',
    end_time: '',
    is_last_flight: false,
    division_id: 0,
    position_id: 0,
};

const AdminSchedulePage = () => {
    const [activeTab, setActiveTab] = useState<string>('shift');
        
    const {
        shifts, isLoading: isShiftLoading, error: shiftError,
        page, totalPages, total: totalShifts,
        search, divisionId: shiftDivisionId, positionId: shiftPositionId,
        setSearch: setShiftSearch, setPage: setShiftPage, 
        setDivisionId: setShiftDivisionId, setPositionId: setShiftPositionId,
        form: shiftForm,
        create: createShift, update: updateShift, remove: removeShift,
    } = useShifts();    

    // Shift Dialog States
    const [dialogMode, setDialogMode]     = useState<DialogMode>(null);
    const [selectedShift, setSelectedShift] = useState<ShiftResponse | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ShiftResponse | null>(null);
    const [saveError, setSaveError]       = useState<string | null>(null);

    // Schedule Upload Hook
    const {
        divisionId: uploadDivId,
        positionId: uploadPosId,
        month: uploadMonth,
        year: uploadYear,
        file: uploadFile,
        previewData: uploadPreview,
        headers: uploadHeaders,
        isLoading: isUploadLoading,
        setDivisionId: setUploadDivId,
        setPositionId: setUploadPosId,
        setMonth: setUploadMonth,
        setYear: setUploadYear,
        handleFileChange: setUploadFile,
        submitUpload,
        resetForm: resetUploadForm,
    } = useScheduleUpload();

    const openAddShift = useCallback(() => {
        shiftForm.reset(EMPTY_FORM);
        setSaveError(null);
        setDialogMode('add');
    }, [shiftForm]);

    const openEditShift = useCallback((shift: ShiftResponse) => {
        setSelectedShift(shift);
        shiftForm.reset({
            name:        shift.name,
            code:        shift.code,
            start_time:  shift.start_time ?? '',
            end_time:    shift.end_time ?? '',
            is_last_flight: shift.start_time !== null && !shift.end_time,
            division_id: shift.division.id,
            position_id: shift.position.id,
        });
        setSaveError(null);
        setDialogMode('edit');
    }, [shiftForm]);

    const closeShiftDialog = useCallback(() => {
        setDialogMode(null);
        setSelectedShift(null);
        shiftForm.reset(EMPTY_FORM);
        setSaveError(null);
    }, [shiftForm]);

    const handleSaveShift = shiftForm.handleSubmit(async (data: ShiftFormValues) => {
        setSaveError(null);
        try {
            if (dialogMode === 'add') {
                await createShift(data);
                toast.success('Shift baru berhasil ditambahkan');
            } else if (dialogMode === 'edit' && selectedShift) {
                await updateShift(selectedShift.id, data);
                toast.success('Shift berhasil diperbarui');
            }
            closeShiftDialog();
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const apiError = err.response?.data?.error;
                if (apiError && typeof apiError === 'object') {
                    (Object.entries(apiError) as [keyof ShiftFormValues, string][]).forEach(
                        ([field, msg]) => shiftForm.setError(field, { type: 'server', message: msg }),
                    );
                } else {
                    setSaveError(typeof apiError === 'string' ? apiError : 'Tidak dapat terhubung dengan server.');
                }
            } else if (err && typeof err === 'object') {
                (Object.entries(err) as [keyof ShiftFormValues, string][]).forEach(
                    ([field, msg]) => shiftForm.setError(field, { type: 'server', message: msg }),
                );
            } else {
                setSaveError('Gagal menyimpan data shift.');
            }
        }
    });

    const handleDeleteShift = useCallback(async () => {
        if (!deleteTarget) return;
        try {
            await removeShift(deleteTarget.id);
            toast.success('Shift berhasil dihapus');
        } catch (err: unknown) {
            toast.error('Gagal menghapus data shift');
        } finally {
            setDeleteTarget(null);
        }
    }, [deleteTarget, removeShift]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold text-foreground">
                        {activeTab === 'shift' ? 'Data Shift Karyawan' : 'Kelola Jadwal Kerja'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {activeTab === 'shift' 
                            ? 'Kelola seluruh master data shift kerja perusahaan' 
                            : 'Unggah dan pratinjau jadwal kerja karyawan secara massal via CSV'}
                    </p>
                </div>
                {activeTab === 'shift' && (
                    <Button size="sm" className="gap-2 shrink-0 self-start sm:self-auto" onClick={openAddShift}>
                        <Plus size={15} /> Tambah shift
                    </Button>
                )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full sm:w-[400px] grid-cols-2 mb-4">
                    <TabsTrigger value="shift">Master Shift</TabsTrigger>
                    <TabsTrigger value="schedule">Jadwal Karyawan</TabsTrigger>
                </TabsList>

                {/* Tab: Master Shift */}
                <TabsContent value="shift" className="space-y-4 outline-none">
                    <Card>
                        <CardHeader className="px-5 py-4 border-b border-border space-y-0">
                            <ShiftFilterBar
                                search={search}
                                divisionId={shiftDivisionId}
                                positionId={shiftPositionId}                               
                                total={totalShifts}
                                onSearch={setShiftSearch}
                                onDivision={setShiftDivisionId}
                                onPosition={setShiftPositionId}
                            />
                        </CardHeader>
                        <CardContent className="p-0">
                            <ShiftTable
                                shifts={shifts}
                                page={page}
                                totalPages={totalPages}
                                isLoading={isShiftLoading}
                                error={shiftError}
                                onPageChange={setShiftPage}
                                onEdit={openEditShift}
                                onDelete={setDeleteTarget}
                            />
                        </CardContent>
                    </Card>

                    <ShiftDialogs
                        mode={dialogMode}
                        rhf={shiftForm}
                        saveError={saveError}
                        deleteTarget={deleteTarget}
                        onSave={handleSaveShift}
                        onClose={closeShiftDialog}
                        onDeleteConfirm={handleDeleteShift}
                        onDeleteCancel={() => setDeleteTarget(null)}
                    />
                </TabsContent>

                {/* Tab: Schedule Karyawan (CSV) */}
                <TabsContent value="schedule" className="space-y-6 outline-none">
                    <Card>
                        <CardHeader className="px-5 py-5 border-b border-border">
                            <h2 className="text-sm font-semibold text-foreground">Upload Jadwal Kerja (CSV)</h2>
                            <p className="text-xs text-muted-foreground mt-1">
                                Pilih divisi, posisi, bulan, tahun, dan unggah berkas CSV jadwal yang sesuai.
                            </p>
                        </CardHeader>
                        <CardContent className="p-5">
                            <ScheduleUploadForm
                                divisionId={uploadDivId}
                                positionId={uploadPosId}
                                month={uploadMonth}
                                year={uploadYear}
                                file={uploadFile}
                                isLoading={isUploadLoading}
                                hasPreview={uploadPreview.length > 0}
                                setDivisionId={setUploadDivId}
                                setPositionId={setUploadPosId}
                                setMonth={setUploadMonth}
                                setYear={setUploadYear}
                                onFileChange={setUploadFile}
                                onSubmit={submitUpload}
                                onReset={resetUploadForm}
                            />
                        </CardContent>
                    </Card>

                    {/* Preview Table */}
                    <SchedulePreviewTable
                        headers={uploadHeaders}
                        previewData={uploadPreview}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminSchedulePage;
