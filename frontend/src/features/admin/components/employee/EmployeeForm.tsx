import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { useDivisions } from "../../hooks/useDivision";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import type { EmployeeFormValues } from "../../schemas/employee.schema";

type EmployeeFormProps = {
  rhf: UseFormReturn<EmployeeFormValues>;
  readOnly?: boolean;
  divisionName?: string;
  positionName?: string;
};

const EmployeeForm = ({
  rhf,
  readOnly = false,
  divisionName,
  positionName,
}: EmployeeFormProps) => {
  const { divisions, getPositionsByDivision } = useDivisions();
  const { control } = rhf;
  const watchDivisionId = useWatch({
    control,
    name: "division_id",
    defaultValue: 0,
  });

  if (readOnly) {
    const values = rhf.getValues();
    return (
      <div className="space-y-4">
        {(
          [
            ["Nama lengkap", values.fullname],
            ["Nama panggilan", values.nickname],
            ["Divisi", divisionName ?? "—"],
            ["Posisi", positionName ?? "—"],
          ] as [string, string][]
        ).map(([label, value]) => (
          <div key={label} className="space-y-1">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-sm font-medium text-foreground">
              {value || "—"}
            </p>
            <Separator />
          </div>
        ))}
      </div>
    );
  }

  const availablePositions = getPositionsByDivision(Number(watchDivisionId));

  return (
    <FieldGroup>
      {/* Nama panggilan */}
      <Controller
        name="nickname"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Nama panggilan</FieldLabel>
            <Input
              id={field.name}
              placeholder="Jamal S"
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Nama lengkap */}
      <Controller
        name="fullname"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Nama lengkap</FieldLabel>
            <Input
              id={field.name}
              placeholder="Muhammad Jamaludin Siregar"
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Divisi & Posisi — dua kolom */}
      <div className="grid grid-cols-2 gap-4">
        {/* Divisi */}
        <Controller
          name="division_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Divisi</FieldLabel>
              <Select
                name={field.name}
                value={field.value ? String(field.value) : undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Pilih Divisi" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {divisions.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Posisi */}
        <Controller
          name="position_id"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Posisi</FieldLabel>
              <Select
                name={field.name}
                value={field.value ? String(field.value) : undefined}
                onValueChange={field.onChange}
                disabled={watchDivisionId === 0}
              >
                <SelectTrigger
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue
                    placeholder={
                      watchDivisionId === 0
                        ? "Pilih Divisi Dulu"
                        : "Pilih Posisi"
                    }
                  />
                </SelectTrigger>
                <SelectContent position="popper">
                  {availablePositions?.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </FieldGroup>
  );
};

export default EmployeeForm;
