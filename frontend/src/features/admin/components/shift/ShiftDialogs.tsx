import { memo } from 'react';
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
import { Loader2 } from 'lucide-react';
import ShiftForm from './ShiftForm';
import type { ShiftResponse } from '@/model/shift.model';
import type { UseFormReturn } from 'react-hook-form';
import type { ShiftFormValues } from '../../schemas/shift.schema';

type DialogMode = 'add' | 'edit' | null;

type ShiftDialogsProps = {
    mode:            DialogMode;
    rhf:             UseFormReturn<ShiftFormValues>;
    saveError:       string | null;
    deleteTarget:    ShiftResponse | null;
    onSave:          () => void;
    onClose:         () => void;
    onDeleteConfirm: () => void;
    onDeleteCancel:  () => void;
};

const DIALOG_TITLE: Record<NonNullable<DialogMode>, string> = {
    add:    'Tambah shift',
    edit:   'Edit shift',
};

const ShiftDialogs = ({
    mode, rhf, saveError, deleteTarget,
    onSave, onClose,
    onDeleteConfirm, onDeleteCancel,
}: ShiftDialogsProps) => {
    return (
        <>
            {/* Add / Edit Dialog */}
            <Dialog open={mode !== null} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{mode ? DIALOG_TITLE[mode] : ''}</DialogTitle>
                        {mode === 'add' && (
                            <DialogDescription>
                                Masukkan konfigurasi jam kerja shift untuk kombinasi divisi dan posisi tertentu.
                            </DialogDescription>
                        )}
                        {mode === 'edit' && (
                            <DialogDescription>
                                Perbarui konfigurasi jam kerja shift yang dipilih.
                            </DialogDescription>
                        )}
                    </DialogHeader>

                    <ShiftForm rhf={rhf} />

                    {saveError && (
                        <p className="text-xs text-destructive mt-2">{saveError}</p>
                    )}

                    <DialogFooter className="gap-2 pt-2">
                        <Button variant="outline" onClick={onClose}>
                            Batal
                        </Button>
                        <Button onClick={onSave} disabled={rhf.formState.isSubmitting}>
                            {rhf.formState.isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : mode === 'add' ? (
                                'Simpan'
                            ) : (
                                'Perbarui'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete confirmation */}
            <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && onDeleteCancel()}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Hapus shift?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Shift{' '}
                            <span className="font-semibold text-foreground">
                                {deleteTarget?.name} ({deleteTarget?.code})
                            </span>{' '}
                            untuk divisi <span className="font-semibold text-foreground">{deleteTarget?.division?.name}</span> posisi <span className="font-semibold text-foreground">{deleteTarget?.position?.name}</span> akan dihapus secara permanen.
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

export default memo(ShiftDialogs);
export type { DialogMode };
