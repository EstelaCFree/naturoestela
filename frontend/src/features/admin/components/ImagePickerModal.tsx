import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { useAdminImages } from "@/features/admin/hooks/useAdminImages";
import type { AdminImage } from "@/types/adminPost";

type ImagePickerModalProps = {
  onSelect: (image: AdminImage) => void;
  onClose: () => void;
};

export function ImagePickerModal({ onSelect, onClose }: ImagePickerModalProps) {
  const [page, setPage] = useState(1);
  const [allImages, setAllImages] = useState<AdminImage[]>([]);
  const { data, isLoading } = useAdminImages(page);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data?.data) {
      setAllImages((prev) =>
        page === 1 ? data.data : [...prev, ...data.data],
      );
    }
  }, [data, page]);

  const hasMore = data ? allImages.length < data.meta.total : false;

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  function handleSelect(image: AdminImage) {
    onSelect(image);
    onClose();
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={handleOverlayClick}
    >
      <div className="flex h-[80vh] w-full max-w-2xl flex-col rounded-xl bg-warm-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-foreground/10 px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            Select image
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-taupe hover:text-foreground transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && page === 1 ? (
            <div className="flex h-40 items-center justify-center">
              <Spinner className="h-8 w-8 text-forest-green" />
            </div>
          ) : allImages.length === 0 ? (
            <p className="py-10 text-center text-sm text-taupe">
              No images uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {allImages.map((img) => (
                <button
                  key={img.id}
                  type="button"
                  onClick={() => handleSelect(img)}
                  className="group aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-forest-green transition-all"
                >
                  <img
                    src={img.thumbnail_url}
                    alt={img.alt_text ?? ""}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </button>
              ))}
            </div>
          )}

          {hasMore && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="secondary"
                size="sm"
                isLoading={isLoading}
                onClick={() => setPage((p) => p + 1)}
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
