"use client";

import * as React from "react";
import { Camera, X, Loader2 } from "lucide-react";
import imageCompression from "browser-image-compression";
import { toast } from "sonner";

export interface UploadedPhotoItem {
  id: string;
  name: string;
  previewUrl: string;
  storagePath?: string;
  file?: Blob;
  uploading: boolean;
}

export interface PhotoUploaderProps {
  photos: UploadedPhotoItem[];
  maxPhotos?: number;
  onChange: (photos: UploadedPhotoItem[]) => void;
}

export function PhotoUploader({ photos, maxPhotos = 5, onChange }: PhotoUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      toast.error(`You can add up to ${maxPhotos} photos.`);
      return;
    }

    const selectedFiles = Array.from(fileList).slice(0, remainingSlots);
    const newItems: UploadedPhotoItem[] = [];

    for (const file of selectedFiles) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error(`${file.name}: Only JPEG, PNG, or WebP images are allowed.`);
        continue;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name}: File must be 10 MB or smaller.`);
        continue;
      }

      const id = `photo_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const previewUrl = URL.createObjectURL(file);

      let compressedBlob: Blob = file;
      try {
        // BUILD_PLAN Section 17: Client-side compression to max 1600px / ~0.8 quality JPEG
        compressedBlob = await imageCompression(file, {
          maxWidthOrHeight: 1600,
          initialQuality: 0.8,
          useWebWorker: false,
          fileType: "image/jpeg",
        });
      } catch {
        compressedBlob = file;
      }

      newItems.push({
        id,
        name: file.name,
        previewUrl,
        file: compressedBlob,
        uploading: false,
      });
    }

    onChange([...photos, ...newItems]);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function handleRemove(id: string) {
    const item = photos.find((p) => p.id === id);
    if (item?.previewUrl && item.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(item.previewUrl);
    }
    onChange(photos.filter((p) => p.id !== id));
  }

  // Cleanup object URLs when component unmounts
  React.useEffect(() => {
    return () => {
      photos.forEach((p) => {
        if (p.previewUrl && p.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(p.previewUrl);
        }
      });
    };
  }, [photos]);

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center rounded-card border-2 border-dashed border-slate-200 bg-slate-50 text-navy-900 hover:border-orange-500 hover:bg-orange-50/40 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-orange-500 min-h-[88px]"
            aria-label="Add photo"
          >
            <Camera className="h-6 w-6 text-navy-700 mb-1" aria-hidden="true" />
            <span className="text-xs font-semibold">Add photo</span>
          </button>
        )}

        {photos.map((photo, index) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-card border border-slate-200 bg-slate-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.previewUrl}
              alt={`Issue photo ${index + 1} of ${photos.length}`}
              className="h-full w-full object-cover"
            />
            {photo.uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-navy-900/50">
                <Loader2 className="h-6 w-6 animate-spin text-white" aria-hidden="true" />
              </div>
            )}
            <button
              type="button"
              onClick={() => handleRemove(photo.id)}
              aria-label={`Remove photo ${index + 1}`}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-navy-900/80 text-white hover:bg-navy-900 focus-visible:outline focus-visible:outline-[2px] focus-visible:outline-orange-500"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="sr-only"
        aria-label="Upload issue photos"
      />
    </div>
  );
}
