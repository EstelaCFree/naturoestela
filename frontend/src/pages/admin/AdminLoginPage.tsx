import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAdminAuth } from "@/features/admin/hooks/useAdminAuth";

const schema = z.object({
  token: z.string().min(1, "Token is required"),
});

type FormValues = z.infer<typeof schema>;

export function AdminLoginPage() {
  const { login, isAuthenticated, isProbing } = useAdminAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  if (isAuthenticated) {
    return <Navigate to="/admin/posts" replace />;
  }

  async function onSubmit(values: FormValues) {
    setServerError(null);
    const result = await login(values.token);
    if (result.success) {
      navigate("/admin/posts", { replace: true });
    } else {
      setServerError(result.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-cream px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Naturo Estela
          </h1>
          <p className="mt-1 text-sm text-taupe">Admin panel</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 rounded-xl border border-foreground/10 bg-white p-6 shadow-sm"
        >
          <Input
            label="Admin token"
            type="password"
            placeholder="Enter your admin token"
            error={errors.token?.message}
            {...register("token")}
          />

          {serverError && (
            <p className="text-sm text-red-600" role="alert">
              {serverError}
            </p>
          )}

          <Button
            type="submit"
            isLoading={isProbing}
            disabled={isProbing}
            className="w-full"
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
