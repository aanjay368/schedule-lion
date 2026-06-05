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
import { Checkbox } from "@/components/ui/checkbox";
import { useDivisions } from "../../hooks/useDivision";
import type { UseFormReturn } from "react-hook-form";
import { Controller, useWatch } from "react-hook-form";
import type { ShiftFormValues } from "../../schemas/shift.schema";

type ShiftFormProps = {
  rhf: UseFormReturn<ShiftFormValues>;
};

const ShiftForm = ({ rhf }: ShiftFormProps) => {
  const { divisions, getPositionsByDivision } = useDivisions();
  const { control } = rhf;
  const watchIsLastFlight = useWatch({
    control,
    name: "is_last_flight",
    defaultValue: false,
  });  

  const watchDivisionId = useWatch({
    control,
    name: "division_id",
    defaultValue: 0,
  });

  const availablePositions = getPositionsByDivision(Number(watchDivisionId));

  return (
    <FieldGroup>
      {/* Nama shift */}
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Nama shift</FieldLabel>
            <Input
              id={field.name}
              placeholder="Contoh: Pagi, Siang, Malam"
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Kode/Label */}
      <Controller
        name="code"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Kode / Label</FieldLabel>
            <Input
              id={field.name}
              placeholder="Contoh: P, S, M"
              aria-invalid={fieldState.invalid}
              autoComplete="off"
              {...field}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Jam Mulai & Jam Selesai — dua kolom */}
      <div className="grid grid-cols-2 gap-4">
        {/* Jam Mulai */}
        <Controller
          name="start_time"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Jam mulai</FieldLabel>
              <Input
                id={field.name}
                type="time"
                aria-invalid={fieldState.invalid}
                {...field}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Jam Selesai */}
        <div className="flex flex-col gap-1">
          <Controller
            name="end_time"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Jam selesai</FieldLabel>
                <Input
                  id={field.name}
                  type="time"
                  aria-invalid={fieldState.invalid}
                  disabled={watchIsLastFlight}
                  {...field}
                  value={watchIsLastFlight ? "" : (field.value ?? "")}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="is_last_flight"
            control={control}
            render={({ field }) => (
              <div className="flex items-center gap-2 mt-2 select-none">
                <Checkbox
                  id={field.name}
                  checked={field.value ?? false}
                  onCheckedChange={(checked) => {
                    const isChecked = checked === true;
                    field.onChange(isChecked);
                    if (isChecked) {
                      rhf.setValue("end_time", "");
                    }
                  }}
                />
                <FieldLabel
                  htmlFor={field.name}
                  className="cursor-pointer text-xs font-medium text-muted-foreground m-0"
                >
                  Last Flight
                </FieldLabel>
              </div>
            )}
          />
        </div>
      </div>

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
                onValueChange={(val) => {
                  field.onChange(Number(val));
                  // Reset position selection when division changes
                  rhf.setValue("position_id", 0);
                }}
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
                onValueChange={(val) => field.onChange(Number(val))}
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

export default ShiftForm;
