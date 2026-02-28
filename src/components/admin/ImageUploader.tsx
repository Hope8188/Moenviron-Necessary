import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, X, Image, Loader2, Copy, Check } from "lucide-react";

interface ImageUploaderProps {
  onUpload?: (url: string) => void;
  currentUrl?: string;
  label?: string;
}

export function ImageUploader({ onUpload, currentUrl, label = "Image" }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl || null);
  const [copied, setCopied] = useState(false);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isDoc = file.type === "application/pdf" || file.type.includes("msword") || file.name.endsWith(".pdf") || file.name.endsWith(".doc") || file.name.endsWith(".docx");

    if (!isImage && !isDoc) {
      toast.error("Please select an image or document (PDF/DOC)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be less than 10MB");
      return;
    }

    setIsUploading(true);

    if (isImage) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview('document_placeholder');
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("site-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("site-assets")
        .getPublicUrl(filePath);

      setUploadedUrl(publicUrl);
      onUpload?.(publicUrl);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }, [onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const input = document.createElement("input");
      input.type = "file";
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      input.files = dataTransfer.files;
      handleFileChange({ target: input } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  }, [handleFileChange]);

  const copyUrl = () => {
    if (uploadedUrl) {
      navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("URL copied to clipboard");
    }
  };

  const clearImage = () => {
    setPreview(null);
    setUploadedUrl(null);
    onUpload?.("");
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`relative rounded-lg border-2 border-dashed transition-colors ${isUploading ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
      >
        {preview ? (
          <div className="relative flex flex-col items-center justify-center p-8 bg-zinc-50 rounded-lg">
            {preview === 'document_placeholder' || preview?.includes('.pdf') || preview?.includes('.doc') ? (
              <div className="flex flex-col items-center justify-center py-4">
                <div className="rounded-full bg-primary/10 p-4 mb-3">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">Document Uploaded Successfully</p>
                <p className="text-xs text-muted-foreground mt-1 text-center truncate max-w-[250px]">
                  {uploadedUrl ? uploadedUrl.split('/').pop() : 'Ready to submit'}
                </p>
              </div>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="h-40 w-full rounded-lg object-cover"
              />
            )}
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8"
              onClick={clearImage}
            >
              <X className="h-4 w-4" />
            </Button>
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-background/80">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center gap-2 p-8">
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground text-center">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground text-center px-4">
              Images (PNG, JPG, WebP) or Documents (PDF, DOC) up to 10MB
            </p>
            <Input
              type="file"
              accept="image/*,.pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {uploadedUrl && (
        <div className="flex items-center gap-2">
          <Input
            value={uploadedUrl}
            readOnly
            className="flex-1 text-xs"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={copyUrl}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
