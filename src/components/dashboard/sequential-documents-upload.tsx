"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { cn } from "@/lib/utils";

export type RequiredDocument<T extends string = string> = {
  id: T;
  label: string;
  fieldName: string;
};

export type DocumentUploadsMap<T extends string> = Record<T, File | null>;

const MAX_DOCUMENT_BYTES = 10 * 1024 * 1024;

export function createEmptyDocumentUploads<T extends string>(
  documents: readonly { id: T }[],
): DocumentUploadsMap<T> {
  return Object.fromEntries(documents.map((d) => [d.id, null])) as DocumentUploadsMap<T>;
}

export function allDocumentsUploaded<T extends string>(
  documents: readonly { id: T }[],
  uploads: DocumentUploadsMap<T>,
): boolean {
  return documents.every((doc) => uploads[doc.id] !== null);
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export type SequentialDocumentsUploadProps<T extends string> = {
  documents: readonly RequiredDocument<T>[];
  uploads: DocumentUploadsMap<T>;
  onUploadsChange: (uploads: DocumentUploadsMap<T>) => void;
  showError: boolean;
  fileInputId: string;
  completeMessage?: string;
};

export function SequentialDocumentsUpload<T extends string>({
  documents,
  uploads,
  onUploadsChange,
  showError,
  fileInputId,
  completeMessage = "You can submit now.",
}: SequentialDocumentsUploadProps<T>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const currentDoc = documents.find((doc) => uploads[doc.id] === null);
  const allComplete = currentDoc === undefined;
  const uploadedCount = documents.filter((doc) => uploads[doc.id] !== null).length;
  const nextAfterCurrent = currentDoc
    ? documents.find((doc) => uploads[doc.id] === null && doc.id !== currentDoc.id)
    : undefined;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !currentDoc) return;

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["pdf", "jpg", "jpeg", "png"].includes(ext)) {
      setFileError("Use PDF, JPG, or PNG only.");
      return;
    }
    if (file.size > MAX_DOCUMENT_BYTES) {
      setFileError("Each file must be 10MB or less.");
      return;
    }

    setFileError(null);
    onUploadsChange({ ...uploads, [currentDoc.id]: file });
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex min-w-0 flex-col">
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-xl border border-dashed px-4 py-8 text-center",
            showError && !allComplete
              ? "border-destructive/50 bg-destructive/5"
              : "border-input-border bg-muted/40",
          )}
        >
          <UploadIcon className="mb-3 text-onboarding-blue" />
          <p className="text-sm font-semibold text-foreground">
            {allComplete ? "All medical documents uploaded" : `Upload: ${currentDoc.label}`}
          </p>
          {allComplete ? (
            <p className="mt-1 text-xs text-muted-foreground">{completeMessage}</p>
          ) : (
            <>
              <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB each</p>
              {uploadedCount > 0 && nextAfterCurrent ? (
                <p className="mt-2 text-xs font-medium text-onboarding-blue">Next: {nextAfterCurrent.label}</p>
              ) : null}
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            className="sr-only"
            id={fileInputId}
            disabled={allComplete}
            onChange={handleFileChange}
          />
          {!allComplete ? (
            <label htmlFor={fileInputId} className="mt-4 inline-block">
              <span className="inline-flex cursor-pointer rounded-xl bg-onboarding-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-onboarding-blue-hover">
                Choose file
              </span>
            </label>
          ) : null}
        </div>

        {uploadedCount > 0 ? (
          <ul className="mt-3 space-y-2" aria-label="Uploaded files">
            {documents.map((doc) => {
              const file = uploads[doc.id];
              if (!file) return null;
              return (
                <li
                  key={doc.id}
                  className="flex items-start gap-2 rounded-lg border border-input-border bg-white px-3 py-2 text-left text-sm"
                >
                  <DocumentCheckIcon done />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{doc.label}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {file.name} · {formatFileSize(file.size)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}

        {fileError ? <p className="mt-2 text-xs text-destructive">{fileError}</p> : null}
        {showError && !allComplete ? (
          <p className="mt-2 text-xs text-destructive">Upload all three documents before submitting.</p>
        ) : null}
      </div>

      <DocumentChecklist documents={documents} uploads={uploads} currentDocId={currentDoc?.id} />
    </div>
  );
}

function DocumentChecklist<T extends string>({
  documents,
  uploads,
  currentDocId,
}: {
  documents: readonly RequiredDocument<T>[];
  uploads: DocumentUploadsMap<T>;
  currentDocId?: T;
}) {
  return (
    <ul className="space-y-3 rounded-xl border border-input-border bg-white p-4">
      {documents.map((doc) => {
        const done = uploads[doc.id] !== null;
        const isCurrent = doc.id === currentDocId;
        return (
          <li key={doc.id} className="flex items-center gap-3 text-sm text-foreground">
            <DocumentCheckIcon done={done} />
            <span
              className={cn(
                done && "text-muted-foreground",
                isCurrent && !done && "font-semibold text-onboarding-blue",
              )}
            >
              {doc.label}
              {isCurrent && !done ? <span className="sr-only"> (current)</span> : null}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function DocumentCheckIcon({ done }: { done: boolean }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
        done ? "border-emerald-500 bg-emerald-500 text-white" : "border-[#e8ecf1] bg-white text-muted-foreground/35",
      )}
      aria-hidden
    >
      ✓
    </span>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 4v12m0 0 3.5-3.5M12 16 8.5 12.5M4 17h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DocumentsDetailsChevron() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}
