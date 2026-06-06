import { Button } from "@/components/ui/Button";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useContactSubmit } from "../hooks/useContactSubmit";

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(255),
  email: z.string().email("Introduce un email válido"),
  subject: z.string().min(1, "El asunto es obligatorio").max(255),
  message: z
    .string()
    .min(1, "El mensaje es obligatorio")
    .max(5000, "El mensaje no puede superar los 5000 caracteres"),
});
type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const {
    mutateAsync,
    isPending,
    isSuccess,
    error,
    reset: resetMutation,
  } = useContactSubmit();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    await mutateAsync(values);
    reset();
  };

  if (isSuccess) {
    return (
      <div className="text-center space-y-3 py-8">
        <p className="font-medium text-foreground text-lg">
          ¡Mensaje enviado! 🌿
        </p>
        <p className="text-foreground/60">
          Me pondré en contacto contigo pronto.
        </p>
        <button
          type="button"
          className="text-sm text-foreground/40 underline"
          onClick={() => resetMutation()}
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {error && (
        <ErrorBanner message="Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo." />
      )}
      <div className="grid sm:grid-cols-2 gap-5">
        <Input
          label="Nombre *"
          {...register("name")}
          error={errors.name?.message}
          placeholder="Tu nombre"
        />
        <Input
          label="Email *"
          type="email"
          {...register("email")}
          error={errors.email?.message}
          placeholder="tu@email.com"
        />
      </div>
      <Input
        label="Asunto *"
        {...register("subject")}
        error={errors.subject?.message}
        placeholder="¿En qué puedo ayudarte?"
      />
      <Textarea
        label="Mensaje *"
        rows={5}
        {...register("message")}
        error={errors.message?.message}
        placeholder="Cuéntame tu situación..."
      />
      <Button
        type="submit"
        isLoading={isPending}
        size="lg"
        className="w-full sm:w-auto"
      >
        Enviar mensaje
      </Button>
    </form>
  );
}
