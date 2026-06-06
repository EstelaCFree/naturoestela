import { useMutation } from "@tanstack/react-query";
import { submitContact } from "../api/contactApi";

export function useContactSubmit() {
  return useMutation({ mutationFn: submitContact });
}
