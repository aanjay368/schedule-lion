import { ArrowRight, Lock, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useLoginForm } from "@/features/auth/hooks/useLoginForm";
import { Controller } from "react-hook-form";

const LoginPage = () => {
  const { form, onSubmit, isLoading, serverError } = useLoginForm();

  const { control } = form;

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background p-4 antialiased">
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <img
          src="/src/assets/background.webp"
          alt="Background"
          className="hidden sm:block w-full h-full object-cover object-center"
        />
      </div>

      <Card className="relative z-10 w-full max-w-95 border-border bg-card shadow-lg rounded-xl">
        <CardHeader className="pt-8 pb-4 px-7 text-center space-y-1">
          <h1 className="text-xl font-semibold text-foreground tracking-tight">
            Schedule Lion
          </h1>
          <p className="text-sm text-muted-foreground">
            Silakan masuk untuk melihat jadwal kerja Anda
          </p>
        </CardHeader>

        <CardContent className="px-7 pb-8">
          {serverError && (
            <Alert variant="destructive" className="mb-5 border-0">
              <AlertDescription className="text-xs font-medium">
                {serverError}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={onSubmit}>
            <FieldGroup>
              {/* Username */}
              <Controller
                name="username"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                      className="pl-9"
                        id={field.name}
                        placeholder="jamaludin_siregar"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        {...field}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Nama lengkap */}
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <Input
                        className="pl-9"
                        id={field.name}
                        placeholder="********"
                        aria-invalid={fieldState.invalid}
                        autoComplete="off"
                        type="password"
                        {...field}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Ingat saya & lupa password */}
              <Field orientation="horizontal" className="justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox id="rememberMe" disabled={isLoading} />
                  <FieldLabel
                    htmlFor="rememberMe"
                    className="text-xs text-muted-foreground font-normal hover:text-foreground transition-colors cursor-pointer"
                  >
                    Ingat saya
                  </FieldLabel>
                </div>

                <a
                  href="#"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Lupa password?
                </a>
              </Field>

              {/* Submit */}
              <Field>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-primary-foreground"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Masuk <ArrowRight className="h-4 w-4" />
                    </span>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default LoginPage;
