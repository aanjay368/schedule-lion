import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import EmployeeForm from './EmployeeForm';
import type { EmployeeResponse } from '@/model/employee.model';
import type { UseFormReturn } from 'react-hook-form';
import type { EmployeeFormValues } from '../../schemas/employee.schema';

type DialogMode = 'add' | 'edit' | 'detail' | null;

type EmployeeDialogsProps = {
    mode:            DialogMode;
    rhf:             UseFormReturn<EmployeeFormValues>;
    saveError:       string | null;
    deleteTarget:    EmployeeResponse | null;
    selected:        EmployeeResponse | null;    
    onSave:          () => void;
    onClose:         () => void;
    onDeleteConfirm: () => void;
    onDeleteCancel:  () => void;
};

const DIALOG_TITLE: Record<NonNullable<DialogMode>, string> = {
    add:    'Tambah karyawan',
    edit:   'Edit karyawan',
    detail: 'Detail karyawan',
};

const EmployeeDialogs = ({
    mode, rhf, saveError, deleteTarget, selected,    
    onSave, onClose,
    onDeleteConfirm, onDeleteCancel,
}: EmployeeDialogsProps) => {    
    return (
        <>
            {/* Add / Edit / Detail */}
            <Dialog open={mode !== null} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{mode ? DIALOG_TITLE[mode] : ''}</DialogTitle>
                        {mode === 'add' && (
                            <DialogDescription>
                                Isi data karyawan baru. Username dan password awal akan dibuat otomatis.
                            </DialogDescription>
                        )}
                        {mode === 'edit' && (
                            <DialogDescription>Ubah data karyawan yang dipilih.</DialogDescription>
                        )}
                    </DialogHeader>

                    <EmployeeForm
                        rhf={rhf}                        
                        readOnly={mode === 'detail'}
                        divisionName={selected?.division.name}
                        positionName={selected?.position.name}
                    />

                    {saveError && (
                        <p className="text-xs text-destructive">{saveError}</p>
                    )}

                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={onClose}>
                            {mode === 'detail' ? 'Tutup' : 'Batal'}
                        </Button>
                        {mode !== 'detail' && (
                            <Button onClick={onSave}>
                                {mode === 'add' ? 'Simpan' : 'Perbarui'}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation */}
            <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && onDeleteCancel()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus karyawan?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Data{' '}
                            <span className="font-medium text-foreground">
                                {deleteTarget?.fullname}
                            </span>{' '}
                            akan dihapus secara permanen dan tidak bisa dikembalikan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={onDeleteCancel}>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDeleteConfirm}
                            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                        >
                            Ya, hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default EmployeeDialogs;
export type { DialogMode, EmployeeFormValues };