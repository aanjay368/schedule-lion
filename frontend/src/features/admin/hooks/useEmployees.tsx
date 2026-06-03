import { useEffect, useState, useCallback } from "react";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { employeeService } from "../services/employee.service";
import { useDebounce } from "@/hooks/useDebounce";
import {
  employeeSchema,
  type EmployeeFormValues,
} from "../schemas/employee.schema";
import type {
  EmployeeResponse,  
  EmployeeParams,
} from "@/model/employee.model";
import type { UseFormReturn } from "react-hook-form";

const LIMIT = 10;

type UseEmployeesReturn = {
  employees: EmployeeResponse[];
  isLoading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  search: string;
  divisionId: number | undefined;
  positionId: number | undefined;
  showDeleted: boolean;
  setShowDeleted: (v: boolean | undefined) => void;
  setSearch: (v: string) => void;
  setPage: (v: number) => void;
  setDivisionId: (v: number | undefined) => void;
  setPositionId: (v: number | undefined) => void;
  form: UseFormReturn<EmployeeFormValues>;
  create: (payload: EmployeeFormValues) => Promise<void>;
  update: (id: string, payload: EmployeeFormValues) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

export const useEmployees = (): UseEmployeesReturn => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearchState] = useState("");
  const [divisionId, setDivisionIdState] = useState<number | undefined>(
    undefined,
  );
  const [positionId, setPositionIdState] = useState<number | undefined>(
    undefined,
  );
  const [showDeleted, setShowDeletedState] = useState<boolean>(false);
  const debouncedSearch = useDebounce(search, 700);

  const form = useForm<EmployeeFormValues>({
    resolver: yupResolver(employeeSchema),
    defaultValues: {
      fullname: "",
      nickname: "",
      division_id: 0,
      position_id: 0,
    },
  });

  const fetchAll = useCallback(async (params: EmployeeParams) => {
    try {
      setLoading(true);
      setError(null);

      const result = await employeeService.search(params);

      setEmployees(result.data ?? []);
      setTotalPages(result.pagination?.total_pages ?? 1);
      setTotal(result.pagination?.total ?? 0);
    } catch (err) {
      if (isAxiosError(err)) {
        const apiError = err.response?.data?.error;
        setError(apiError ?? "Gagal memuat data karyawan.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll({
      search: debouncedSearch || undefined,
      division_id: divisionId,
      position_id: positionId,
      show_deleted: showDeleted,
      page,
      limit: LIMIT,
    });
  }, [debouncedSearch, divisionId, positionId, showDeleted, page, fetchAll]);  
  const setSearch = (v: string) => {
    setSearchState(v);
    setPage(1);
  };

  const setDivisionId = (v: number | undefined) => {
    setDivisionIdState(v);
    setPositionIdState(undefined); // reset posisi ketika divisi berubah
    setPage(1);
  };

  const setPositionId = (v: number | undefined) => {
    setPositionIdState(v);
    setPage(1);
  };

  const setShowDeleted = (v: boolean | undefined) => {
    setShowDeletedState(v);
    setPage(1);
  };

  const create = async (payload: EmployeeFormValues) => {
    try {
      await employeeService.create(payload);
      await fetchAll({
        search: debouncedSearch || undefined,
        division_id: divisionId,
        position_id: positionId,
        page,
        limit: LIMIT,
      });
    } catch (err) {
      if (isAxiosError(err)) {
        const apiError = err.response?.data?.error;
        throw apiError ?? err;
      }
      throw err;
    }
  };

  const update = async (id: string, payload: EmployeeFormValues) => {
    try {
      await employeeService.update(id, payload);
      await fetchAll({
        search: debouncedSearch || undefined,
        division_id: divisionId,
        position_id: positionId,
        page,
        limit: LIMIT,
      });
    } catch (err) {
      if (isAxiosError(err)) {
        const apiError = err.response?.data?.error;
        throw apiError ?? err;
      }
      throw err;
    }
  };

  const remove = async (id: string) => {
    await employeeService.remove(id);
    const newPage = employees.length === 1 && page > 1 ? page - 1 : page;
    setPage(newPage);
    await fetchAll({
      search: debouncedSearch || undefined,
      division_id: divisionId,
      position_id: positionId,
      page: newPage,
      limit: LIMIT,
    });
  };

  return {
    employees,
    isLoading,
    error,
    page,
    totalPages,
    total,
    search,
    divisionId,
    positionId,
    showDeleted,
    setSearch,
    setPage,
    setDivisionId,
    setPositionId,
    setShowDeleted,
    form,
    create,
    update,
    remove,
  };
};
