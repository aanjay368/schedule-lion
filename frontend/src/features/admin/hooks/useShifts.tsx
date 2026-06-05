import { useEffect, useState, useCallback } from "react";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { shiftService } from "../services/shift.service";
import { useDebounce } from "@/hooks/useDebounce";
import { useDivisions } from "./useDivision";
import {
  shiftSchema,
  type ShiftFormValues,
} from "../schemas/shift.schema";
import type {
  ShiftResponse,
  ShiftParams,
} from "@/model/shift.model";
import type { UseFormReturn } from "react-hook-form";

const LIMIT = 10;

type UseShiftsReturn = {
  shifts: ShiftResponse[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  search: string;
  divisionId: number | undefined;
  positionId: number | undefined;
  setSearch: (v: string) => void;
  setPage: (v: number) => void;
  setDivisionId: (v: number | undefined) => void;
  setPositionId: (v: number | undefined) => void;
  form: UseFormReturn<ShiftFormValues>;
  create: (payload: ShiftFormValues) => Promise<void>;
  update: (id: number, payload: ShiftFormValues) => Promise<void>;
  remove: (id: number) => Promise<void>;
};

export const useShifts = (): UseShiftsReturn => {
  const { divisions, allPositions } = useDivisions();
  
  const [rawShifts, setRawShifts] = useState<ShiftResponse[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>("Silakan pilih divisi dan posisi terlebih dahulu.");
  const [page, setPage] = useState(1);
  const [search, setSearchState] = useState("");
  const [divisionId, setDivisionIdState] = useState<number | undefined>(undefined);
  const [positionId, setPositionIdState] = useState<number | undefined>(undefined);
  const debouncedSearch = useDebounce(search, 700);

  const form = useForm<ShiftFormValues>({
    resolver: yupResolver(shiftSchema),
    defaultValues: {
      name: "",
      code: "",
      start_time: "",
      end_time: "",
      is_last_flight: false,
      division_id: 0,
      position_id: 0,
    },
  });

  const fetchAll = useCallback(async (params: ShiftParams) => {
    if (!params.division_id || !params.position_id) {
      setRawShifts([]);
      setError("Silakan pilih divisi dan posisi terlebih dahulu.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await shiftService.getAll(params);            

      setRawShifts(result.data);
    } catch (err) {
      if (isAxiosError(err)) {
        const apiError = err.response?.data?.error;
        setError(apiError ?? "Gagal memuat data shift.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
      setRawShifts([]);
    } finally {
      setLoading(false);
    }
  }, [divisions, allPositions]);

  useEffect(() => {
    fetchAll({
      division_id: divisionId,
      position_id: positionId,
    });
  }, [divisionId, positionId, fetchAll]);

  const setSearch = useCallback((v: string) => {
    setSearchState(v);
    setPage(1);
  }, []);

  const setDivisionId = useCallback((v: number | undefined) => {
    setDivisionIdState(v);
    setPositionIdState(undefined); // Reset posisi ketika divisi berubah
    setPage(1);
  }, []);

  const setPositionId = useCallback((v: number | undefined) => {
    setPositionIdState(v);
    setPage(1);
  }, []);

  const create = useCallback(async (payload: ShiftFormValues) => {
    try {
      await shiftService.create(payload);
      await fetchAll({
        division_id: divisionId,
        position_id: positionId,
      });
    } catch (err) {
      if (isAxiosError(err)) {
        const apiError = err.response?.data?.error;
        throw apiError ?? err;
      }
      throw err;
    }
  }, [divisionId, positionId, fetchAll]);

  const update = useCallback(async (id: number, payload: ShiftFormValues) => {
    try {
      await shiftService.update(id, payload);
      await fetchAll({
        division_id: divisionId,
        position_id: positionId,
      });
    } catch (err) {
      if (isAxiosError(err)) {
        const apiError = err.response?.data?.error;
        throw apiError ?? err;
      }
      throw err;
    }
  }, [divisionId, positionId, fetchAll]);

  const remove = useCallback(async (id: number) => {
    try {
      await shiftService.remove(id);
      await fetchAll({
        division_id: divisionId,
        position_id: positionId,
      });
      
      // Adjust page client-side if needed after deletion
      const remainingFiltered = rawShifts.filter((s) => s.id !== id).filter((s) => {
        if (!debouncedSearch) return true;
        const query = debouncedSearch.toLowerCase();
        return s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query);
      });
      const newTotalPages = Math.ceil(remainingFiltered.length / LIMIT) || 1;
      if (page > newTotalPages) {
        setPage(newTotalPages);
      }
    } catch (err) {
      if (isAxiosError(err)) {
        const apiError = err.response?.data?.error;
        throw apiError ?? err;
      }
      throw err;
    }
  }, [divisionId, positionId, fetchAll, rawShifts, debouncedSearch, page]);

  // Client-side search and pagination calculations
  const filteredShifts = rawShifts.filter((s) => {
    if (!debouncedSearch) return true;
    const query = debouncedSearch.toLowerCase();
    return s.name.toLowerCase().includes(query) || s.code.toLowerCase().includes(query);
  });

  const total = filteredShifts.length;
  const totalPages = Math.ceil(total / LIMIT) || 1;
  const currentPage = Math.min(page, totalPages);
  
  const startIndex = (currentPage - 1) * LIMIT;
  const paginatedShifts = filteredShifts.slice(startIndex, startIndex + LIMIT);

  return {
    shifts: paginatedShifts,
    isLoading,
    error,
    page: currentPage,
    totalPages,
    total,
    search,
    divisionId,
    positionId,
    setSearch,
    setPage,
    setDivisionId,
    setPositionId,
    form,
    create,
    update,
    remove,
  };
};
