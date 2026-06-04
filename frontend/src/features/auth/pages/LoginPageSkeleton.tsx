import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPageSkeleton() {
  return (
    <main className="relative min-h-screen flex items-center justify-center bg-background p-4 antialiased">
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <Skeleton className="hidden sm:block w-full h-full rounded-none" />
      </div>

      <Card className="relative z-10 w-full max-w-95 border-border bg-card shadow-lg rounded-xl">
        <CardHeader className="pt-8 pb-4 px-7 text-center space-y-1">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-56" />
          </div>
        </CardHeader>

        <CardContent className="px-7 pb-8 space-y-5">
          <div className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            {/* Remember me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
