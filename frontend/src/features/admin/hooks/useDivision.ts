import { useEffect, useState, useMemo, useCallback } from 'react';
import { divisionService } from '@/features/admin/services/division.service';
import type { DivisionResponse } from '@/model/division.model';
import type { PositionResponse } from '@/model/position.model';

type UseDivisionsReturn = {
    divisions:  DivisionResponse[];
    // posisi yang sudah diflat dari semua divisi — untuk keperluan lookup
    allPositions: PositionResponse[];
    // posisi berdasarkan division_id — untuk filter di form
    getPositionsByDivision: (divisionId: number) => PositionResponse[];
    isLoading:  boolean;
    error:      string | null;
};

export const useDivisions = (): UseDivisionsReturn => {
    const [divisions, setDivisions] = useState<DivisionResponse[]>([]);
    const [isLoading, setLoading]   = useState(true);
    const [error, setError]         = useState<string | null>(null);

    useEffect(() => {
        divisionService.getAll()
            .then(setDivisions)
            .catch(() => setError('Gagal memuat data divisi.'))
            .finally(() => setLoading(false));
    }, []);

    const allPositions = useMemo(() => divisions.flatMap((d) => d.positions ?? []), [divisions]);

    const getPositionsByDivision = useCallback((divisionId: number): PositionResponse[] => {
        const division = divisions.find((d) => d.id === divisionId);
        return division?.positions ?? [];
    }, [divisions]);

    return { divisions, allPositions, getPositionsByDivision, isLoading, error };
};