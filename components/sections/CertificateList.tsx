"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Award,
  Download,
  ExternalLink,
  ImageOff,
  Loader2,
  RotateCcw,
  RotateCw,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export type Certification = {
  name: string;
  certificate?: string | null;
};

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.2;

export default function CertificateList({
  certifications,
}: {
  certifications: Certification[];
}) {
  const [selected, setSelected] = useState<Certification | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selected) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeViewer();
        return;
      }

      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        setZoom((current) =>
          Math.min(Number((current + ZOOM_STEP).toFixed(2)), MAX_ZOOM)
        );
      }

      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        setZoom((current) =>
          Math.max(Number((current - ZOOM_STEP).toFixed(2)), MIN_ZOOM)
        );
      }

      if (event.key.toLowerCase() === "r") {
        setRotation((current) => current + 90);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const resetViewer = () => {
    setZoom(1);
    setRotation(0);
  };

  const openViewer = (certification: Certification) => {
    setSelected(certification);
    setZoom(1);
    setRotation(0);
    setImageError(false);
    setImageLoading(Boolean(certification.certificate?.trim()));
  };

  const closeViewer = () => {
    setSelected(null);
    setZoom(1);
    setRotation(0);
    setImageError(false);
    setImageLoading(false);
  };

  const zoomOut = () => {
    setZoom((current) =>
      Math.max(Number((current - ZOOM_STEP).toFixed(2)), MIN_ZOOM)
    );
  };

  const zoomIn = () => {
    setZoom((current) =>
      Math.min(Number((current + ZOOM_STEP).toFixed(2)), MAX_ZOOM)
    );
  };

  const hasCertificateImage = Boolean(selected?.certificate?.trim());
  const previewUnavailable = !hasCertificateImage || imageError;

  const modal =
    mounted && selected
      ? createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-xl"
            >
              {/* Header */}
              <div className="relative z-20 flex min-h-[72px] shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/55 px-4 py-3 backdrop-blur-xl md:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal/25 bg-teal/10 text-teal shadow-[0_0_30px_rgba(45,212,191,0.08)]">
                    <Award size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal">
                      Certificate viewer
                    </p>
                    <h3 className="max-w-[48vw] truncate font-display text-sm font-semibold text-white md:text-base">
                      {selected.name}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  {!previewUnavailable && (
                    <>
                      <ViewerButton
                        title="Zoom out"
                        onClick={zoomOut}
                        disabled={zoom <= MIN_ZOOM}
                      >
                        <ZoomOut size={17} />
                      </ViewerButton>

                      <span className="hidden min-w-[62px] rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-center font-mono text-[10px] text-white/65 sm:block">
                        {Math.round(zoom * 100)}%
                      </span>

                      <ViewerButton
                        title="Zoom in"
                        onClick={zoomIn}
                        disabled={zoom >= MAX_ZOOM}
                      >
                        <ZoomIn size={17} />
                      </ViewerButton>

                      <ViewerButton
                        title="Rotate 90° clockwise"
                        onClick={() => setRotation((current) => current + 90)}
                      >
                        <RotateCw size={17} />
                      </ViewerButton>

                      <ViewerButton title="Reset view" onClick={resetViewer}>
                        <RotateCcw size={17} />
                      </ViewerButton>

                      <a
                        href={selected.certificate ?? undefined}
                        download
                        title="Download certificate"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-teal/30 bg-teal/10 px-3 text-sm font-medium text-teal transition hover:border-teal hover:bg-teal/15"
                      >
                        <Download size={16} />
                        <span className="hidden sm:inline">Download</span>
                      </a>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={closeViewer}
                    aria-label="Close certificate viewer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>

              {/* Viewer */}
              <div
                className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-5 md:p-10"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) closeViewer();
                }}
              >
                {/* ambient glow */}
                <div className="pointer-events-none fixed left-1/2 top-1/2 h-[55vh] w-[65vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/[0.05] blur-[100px]" />

                {previewUnavailable ? (
                  <MissingPreview
                    certificateName={selected.name}
                    onClose={closeViewer}
                  />
                ) : (
                  <motion.div
                    key={selected.certificate}
                    initial={{ opacity: 0, scale: 0.96, y: 18 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative flex min-h-full min-w-full items-center justify-center py-8"
                  >
                    {imageLoading && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-4 py-2.5 text-xs text-white/60 backdrop-blur-md">
                          <Loader2 size={15} className="animate-spin text-teal" />
                          Loading certificate…
                        </div>
                      </div>
                    )}

                    {/*
                      IMPORTANT:
                      Entrance animation is on the parent motion.div.
                      Zoom/rotation live on this normal img, so Framer Motion
                      no longer overwrites its transform.
                    */}
                    <img
                      src={selected.certificate ?? ""}
                      alt={selected.name}
                      draggable={false}
                      onLoad={() => {
                        setImageLoading(false);
                        setImageError(false);
                      }}
                      onError={() => {
                        setImageLoading(false);
                        setImageError(true);
                      }}
                      className={`
                        relative
                        max-h-[72vh]
                        max-w-[86vw]
                        origin-center
                        select-none
                        rounded-xl
                        object-contain
                        shadow-[0_30px_100px_rgba(0,0,0,0.65)]
                        transition-transform
                        duration-300
                        ease-out
                        ${zoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"}
                      `}
                      style={{
                        transform: `scale(${zoom}) rotate(${rotation}deg) translateZ(0)`,
                        opacity: imageLoading ? 0 : 1,
                      }}
                      onDoubleClick={() => {
                        setZoom((current) => (current > 1 ? 1 : 1.8));
                      }}
                    />
                  </motion.div>
                )}
              </div>

              {!previewUnavailable && (
                <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 backdrop-blur-md md:block">
                  + / − zoom · R rotate · double-click zoom · ESC close
                </div>
              )}
            </motion.div>
          </AnimatePresence>,
          document.body
        )
      : null;

  return (
    <>
      <div className="pointer-events-auto overflow-hidden rounded-2xl border border-border bg-base/55 backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-teal/20 bg-teal/10 text-teal">
            <Award size={17} />
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-teal">
              Certifications
            </h3>
            <p className="mt-0.5 text-[10px] text-muted">
              {certifications.length > 0
                ? "Click a certificate to preview"
                : "Credentials will appear here"}
            </p>
          </div>
        </div>

        {certifications.length > 0 ? (
          <div className="divide-y divide-border/70">
            {certifications.map((certification, index) => (
              <button
                key={`${certification.name}-${index}`}
                type="button"
                onClick={() => openViewer(certification)}
                className="group flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-teal/[0.06]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-base/60 font-mono text-[9px] text-muted transition group-hover:border-teal/25 group-hover:text-teal">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="min-w-0 flex-1 text-xs leading-relaxed text-ink/70 transition-colors group-hover:text-ink">
                  {certification.name}
                </span>

                <ExternalLink
                  size={13}
                  className="shrink-0 text-muted/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-teal"
                />
              </button>
            ))}
          </div>
        ) : (
          <EmptyCertificates />
        )}
      </div>

      {modal}
    </>
  );
}

function EmptyCertificates() {
  return (
    <div className="relative overflow-hidden px-5 py-10 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/[0.07] blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto flex max-w-[260px] flex-col items-center"
      >
        <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] text-teal">
          <Award size={22} />
          <Sparkles
            size={13}
            className="absolute -right-1 -top-1 text-teal/70"
          />
        </div>

        <p className="text-sm font-medium text-ink/90">
          Certificates coming soon
        </p>
        <p className="mt-1.5 text-xs leading-5 text-muted">
          Verified credentials are being prepared for display. Please check back
          again shortly.
        </p>
      </motion.div>
    </div>
  );
}

function MissingPreview({
  certificateName,
  onClose,
}: {
  certificateName: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-7 text-center shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-9"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-teal/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-44 rounded-full bg-white/[0.025] blur-3xl" />

      <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-teal/20 bg-teal/[0.08] text-teal shadow-[0_0_35px_rgba(45,212,191,0.08)]">
        <ImageOff size={25} />
      </div>

      <p className="relative font-mono text-[9px] uppercase tracking-[0.22em] text-teal/80">
        Preview unavailable
      </p>

      <h4 className="relative mt-2 font-display text-xl font-semibold text-white">
        Certificate image not found
      </h4>

      <p className="relative mx-auto mt-3 max-w-sm text-sm leading-6 text-white/55">
        The preview for <span className="text-white/80">{certificateName}</span>{" "}
        isn&apos;t available right now. The credential is still listed, but its
        image may be missing or temporarily unavailable.
      </p>

      <div className="relative mt-6 flex items-center justify-center">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-teal/25 bg-teal/10 px-5 text-xs font-medium text-teal transition hover:border-teal/45 hover:bg-teal/15"
        >
          Back to certificates
        </button>
      </div>
    </motion.div>
  );
}

function ViewerButton({
  children,
  title,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  title: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/65 transition hover:border-teal/25 hover:bg-teal/10 hover:text-teal disabled:cursor-not-allowed disabled:opacity-25"
    >
      {children}
    </button>
  );
}
