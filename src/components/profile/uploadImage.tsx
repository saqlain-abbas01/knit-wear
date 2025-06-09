"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ImagePlus, Trash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImageUploadProps {
  image?: string; // single image URL
  onChange: (value: string) => void;
  onRemove?: () => void;
}

export function ImageUpload({ image, onChange, onRemove }: ImageUploadProps) {
  const [isMounted, setIsMounted] = useState(false);

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("uploading image");
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error(`Invalid image type. Use JPEG, PNG, GIF, or WebP.`);
      return;
    }

    if (file.size > maxSize) {
      toast.error(`Image exceeds 5MB limit.`);
      return;
    }
    console.log("body file", file);
    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await fetch("http://localhost:4000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }
      const result = await response.json();
      const urls = result.data;
      console.log("url", urls);
      onChange(urls[0]);
    } catch (error) {
      console.error("Upload error:", error);
      toast("failed to upload");
    }
  };

  console.log("image", image);

  return (
    <div className="mb-4 space-y-4">
      {image ? (
        <div className="relative aspect-square rounded-md overflow-hidden border w-40 h-40">
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={onRemove}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          <img className="object-cover" src={image} alt="profile" />
        </div>
      ) : (
        <label
          htmlFor="imageUpload"
          className="flex flex-col items-center justify-center w-40 h-40 aspect-square rounded-md border border-dashed cursor-pointer bg-muted/25 hover:bg-muted/50 transition"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">
              Click to upload profile picture
            </p>
          </div>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onUpload}
          />
        </label>
      )}
    </div>
  );
}
