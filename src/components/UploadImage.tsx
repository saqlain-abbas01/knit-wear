"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";
import { url } from "@/lib/api/axios";

interface ImageUploadProps {
  value: string[];
  onChange: (value: string[]) => void;
  onRemove?: (url: string) => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.error("No files selected");
      return;
    }

    // Validation constants for e-commerce
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    const validFiles: File[] = [];
    for (const file of Array.from(files)) {
      // Validate image type
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `"${file.name}" is not a valid image type. Use JPEG, PNG, GIF, or WebP.`
        );
        continue;
      }

      // Validate file size
      if (file.size > maxSize) {
        toast.error(`"${file.name}" exceeds 5MB limit.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      toast.error("No valid images to upload");
      return;
    }

    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(`${url}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const result = await response.json();
      const urls = result.data;
      onChange([...value, ...urls]);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("failed to upload");
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className=" space-y-4">
      <div>
        <label
          htmlFor="imageUpload"
          className="w-10 h-10 flex flex-col items-center justify-center  aspect-square rounded-md border border-dashed cursor-pointer bg-muted/25 hover:bg-muted/50 transition"
        >
          <div className="flex flex-col items-center justify-center">
            <ImagePlus className="h-6 w-6 text-muted-foreground mb-2" />
          </div>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onUpload}
          />
        </label>
      </div>
    </div>
  );
}
