"use client";

import { useState, useRef, useCallback } from "react";

const ACCEPT = ".pdf,.jpg,.jpeg,.png";
const MAX_SIZE_MB = 5;
const MAX_SIZE = MAX_SIZE_MB * 1024 * 1024;

export interface UploadedFile {
  file: File;
  preview?: string;
  name: string;
  size: number;
}

interface FileUploadZoneProps {
  onFileSelect: (file: UploadedFile | null) => void;
  value: UploadedFile | null;
  label: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

export function FileUploadZone({
  onFileSelect,
  value,
  label,
  hint,
  error,
  disabled,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback((file: File): string | null => {
    const validTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      return `Please upload a PDF, JPG, or PNG file.`;
    }
    if (file.size > MAX_SIZE) {
      return `File must be under ${MAX_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      setLocalError(null);
      if (!file) {
        onFileSelect(null);
        return;
      }
      const err = validate(file);
      if (err) {
        setLocalError(err);
        onFileSelect(null);
        return;
      }
      const preview =
        file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined;
      onFileSelect({
        file,
        preview,
        name: file.name,
        size: file.size,
      });
    },
    [onFileSelect, validate]
  );

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    if (value?.preview) URL.revokeObjectURL(value.preview);
    handleFile(null);
    inputRef.current?.focus();
  };

  const displayError = error || localError;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-[var(--charcoal)]">
        {label}
      </label>
      {hint && (
        <p className="text-xs text-[var(--muted)]">{hint}</p>
      )}
      {value ? (
        <div className="flex items-center gap-4 rounded-xl border-2 border-[var(--accent)]/30 bg-[var(--accent-light)]/20 p-4">
          {value.preview ? (
            <img
              src={value.preview}
              alt="Preview"
              className="h-16 w-20 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10">
              <span className="text-2xl">📄</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-[var(--charcoal)]">
              {value.name}
            </p>
            <p className="text-xs text-[var(--muted)]">
              {(value.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--accent)] hover:bg-[var(--accent-light)]/40 disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`
            relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all
            ${isDragging ? "border-[var(--accent)] bg-[var(--accent-light)]/30" : "border-[var(--accent)]/20 hover:border-[var(--accent)]/40 hover:bg-[var(--accent-light)]/10"}
            ${disabled ? "cursor-not-allowed opacity-60" : ""}
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            onChange={handleChange}
            disabled={disabled}
            className="sr-only"
          />
          <span className="text-4xl">📤</span>
          <p className="mt-2 font-medium text-[var(--charcoal)]">
            Drop your file here or click to browse
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            PDF, JPG, or PNG up to {MAX_SIZE_MB}MB
          </p>
        </div>
      )}
      {displayError && (
        <p className="text-sm text-red-600">{displayError}</p>
      )}
    </div>
  );
}
