import { ImagePlus, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { uploadEventPoster } from "@/lib/admin.functions";
import { errorMessage } from "./ui";

const TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

/** Uploads an image to the site's public media storage and hands back its link. */
export function ImageUpload({
  onUploaded,
  label = "Upload image",
}: {
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  async function upload(file: File) {
    if (!(TYPES as readonly string[]).includes(file.type))
      return void toast.error("Use a JPG, PNG or WebP image.");
    if (file.size > 6 * 1024 * 1024) return void toast.error("Images must be 6 MB or smaller.");
    setBusy(true);
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error("Unable to read the image."));
        reader.readAsDataURL(file);
      });
      const result = await uploadEventPoster({
        data: { fileName: file.name, contentType: file.type as (typeof TYPES)[number], data },
      });
      onUploaded(result.url);
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(errorMessage(error, "Unable to upload the image."));
    } finally {
      setBusy(false);
    }
  }
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-input px-3 py-2 text-sm hover:bg-accent">
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
      {busy ? "Uploading…" : label}
      <input
        type="file"
        accept={TYPES.join(",")}
        className="sr-only"
        disabled={busy}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
          e.currentTarget.value = "";
        }}
      />
    </label>
  );
}
