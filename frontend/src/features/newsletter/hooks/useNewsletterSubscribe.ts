import { useMutation } from "@tanstack/react-query";
import { subscribeToNewsletter } from "../api/newsletterApi";

export function useNewsletterSubscribe() {
  return useMutation({ mutationFn: subscribeToNewsletter });
}
