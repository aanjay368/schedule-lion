import { memo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDivisions } from "../../hooks/useDivision";

type ShiftFilterBarProps = {
  search: string;
  divisionId: number | undefined;
  positionId: number | undefined;  
  total: number;
  onSearch: (val: string) => void;
  onDivision: (val: number | undefined) => void;
  onPosition: (val: number | undefined) => void;
};

const ShiftFilterBar = ({
  search,
  divisionId,
  positionId,
  total,
  onSearch,
  onDivision,
  onPosition,
}: ShiftFilterBarProps) => {
  
  const {divisions, getPositionsByDivision} = useDivisions()  
  const availablePositions = getPositionsByDivision(divisionId || undefined);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
      {/* Search */}
      <div className="relative w-full sm:w-64">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          placeholder="Cari nama shift atau kode..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
        {search && (
          <button
            onClick={() => onSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Filter divisi */}
      <Select
        value={divisionId ? String(divisionId) : "all"}
        onValueChange={(v) => onDivision(v === "all" ? undefined : Number(v))}
      >
        <SelectTrigger className="h-9 w-full sm:w-44 text-sm">
          <SelectValue placeholder="Semua divisi" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">Semua divisi</SelectItem>
          {divisions.map((d) => (
            <SelectItem key={d.id} value={String(d.id)}>
              {d.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Filter posisi — muncul setelah pilih divisi */}
      <Select
        value={positionId ? String(positionId) : "all"}
        onValueChange={(v) => onPosition(v === "all" ? undefined : Number(v))}
        disabled={!divisionId}
      >
        <SelectTrigger className="h-9 w-full sm:w-40 text-sm">
          <SelectValue
            placeholder={divisionId ? "Semua posisi" : "Pilih divisi dulu"}
          />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">Semua posisi</SelectItem>
          {availablePositions.map((p) => (
            <SelectItem key={p.id} value={String(p.id)}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-xs text-muted-foreground sm:ml-auto select-none">
        {total} shift ditemukan
      </span>
    </div>
  );
};

export default memo(ShiftFilterBar);
