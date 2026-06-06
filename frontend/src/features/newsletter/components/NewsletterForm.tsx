import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNewsletterSubscribe } from "../hooks/useNewsletterSubscribe";

const schema = z.object({
  email: z.string().email("Introduce un email válido"),
  privacy: z.literal(true, {
    errorMap: () => ({
      message: "Debes aceptar la política de privacidad para suscribirte",
    }),
  }),
});
type FormValues = z.infer<typeof schema>;

export function NewsletterForm() {
  const {
    mutateAsync,
    isPending,
    data,
    reset: resetMutation,
  } = useNewsletterSubscribe();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { privacy: undefined },
  });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync(values.email);
    reset();
  };

  if (data) {
    return (
      <div className="text-center space-y-3">
        <p className="font-medium text-foreground">
          {data.created
            ? "¡Te has suscrito con éxito! 🌿"
            : "Ya estás suscrita/o a nuestra newsletter."}
        </p>
        <button
          type="button"
          className="text-sm text-foreground/50 underline"
          onClick={() => resetMutation()}
        >
          Suscribir otro email
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 max-w-md mx-auto"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            {...register("email")}
            type="email"
            placeholder="tu@email.com"
            aria-label="Tu dirección de email"
            error={errors.email?.message}
            className="bg-white border-white/60"
          />
        </div>
        <Button
          type="submit"
          isLoading={isPending}
          className="whitespace-nowrap bg-forest-green hover:bg-forest-green/90 text-white border-0"
        >
          Suscribirme
        </Button>
      </div>

      <div className="flex flex-col items-center gap-1">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            {...register("privacy")}
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-forest-green cursor-pointer"
          />
          <span className="text-xs text-foreground/70 leading-relaxed">
            He leído y acepto la{" "}
            <a
              href="/politica-de-privacidad"
              className="underline hover:text-foreground transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              política de privacidad
            </a>
          </span>
        </label>
        {errors.privacy && (
          <p className="text-xs text-red-600" role="alert">
            {errors.privacy.message}
          </p>
        )}
      </div>
    </form>
  );
}
