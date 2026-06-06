import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ImagePickerModal } from "./ImagePickerModal";
import type { AdminImage, BodyImage } from "@/types/adminPost";

type BodyImagesManagerProps = {
  images: BodyImage[];
  onChange: (images: BodyImage[]) => void;
};

export function BodyImagesManager({
  images,
  onChange,
}: BodyImagesManagerProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function handleAdd(img: AdminImage) {
    onChange([
      ...images,
      {
        image_id: img.id,
        thumbnail_url: img.thumbnail_url,
        alignment: "center",
        size: "medium",
        sort_order: images.length,
      },
    ]);
  }

  function handleRemove(index: number) {
    onChange(
      images
        .filter((_, i) => i !== index)
        .map((img, i) => ({ ...img, sort_order: i })),
    );
  }

  function handleMove(index: number, direction: "up" | "down") {
    const next = [...images];
    const swap = direction === "up" ? index - 1 : index + 1;
    [next[index], next[swap]] = [next[swap], next[index]];
    onChange(next.map((img, i) => ({ ...img, sort_order: i })));
  }

  function handleField<K extends keyof BodyImage>(
    index: number,
    key: K,
    value: BodyImage[K],
  ) {
    onChange(
      images.map((img, i) => (i === index ? { ...img, [key]: value } : img)),
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-foreground">Body Images</p>
        <Button
          variant="secondary"
          size="sm"
          type="button"
          onClick={() => setPickerOpen(true)}
        >
          + Add image
        </Button>
      </div>

      {images.length === 0 && (
        <p className="text-xs text-taupe">No body images added.</p>
      )}

      <div className="space-y-2">
        {images.map((img, i) => (
          <div
            key={i}
            className="flex items-center gap-2 rounded-lg border border-foreground/10 p-2"
          >
            {img.thumbnail_url && (
              <img
                src={img.thumbnail_url}
                alt=""
                className="h-12 w-12 rounded object-cover shrink-0"
              />
            )}
            <div className="flex flex-1 flex-wrap gap-2">
              <select
                value={img.alignment}
                onChange={(e) =>
                  handleField(
                    i,
                    "alignment",
                    e.target.value as BodyImage["alignment"],
                  )
                }
                className="rounded border border-foreground/20 bg-warm-ivory px-2 py-1 text-xs"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
              <select
                value={img.size}
                onChange={(e) =>
                  handleField(i, "size", e.target.value as BodyImage["size"])
                }
                className="rounded border border-foreground/20 bg-warm-ivory px-2 py-1 text-xs"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="full">Full</option>
              </select>
            </div>
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                disabled={i === 0}
                onClick={() => handleMove(i, "up")}
                className="text-xs text-taupe hover:text-foreground disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                disabled={i === images.length - 1}
                onClick={() => handleMove(i, "down")}
                className="text-xs text-taupe hover:text-foreground disabled:opacity-30"
              >
                ↓
              </button>
            </div>
            <button
              type="button"
              onClick={() => handleRemove(i)}
              className="text-xs text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {pickerOpen && (
        <ImagePickerModal
          onSelect={handleAdd}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}
