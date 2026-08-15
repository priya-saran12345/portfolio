"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import {
  Award,
  Download,
  ExternalLink,
  RotateCcw,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

export type Certification = {
  name: string;
  certificate: string;
};

export default function CertificateList({
  certifications,
}: {
  certifications: Certification[];
}) {
  const [selected, setSelected] = useState<Certification | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!selected) return;

    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeViewer();
      if (event.key === "+") setZoom((z) => Math.min(z + 0.2, 3));
      if (event.key === "-") setZoom((z) => Math.max(z - 0.2, 0.5));
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  const openViewer = (certification: Certification) => {
    setSelected(certification);
    setZoom(1);
    setRotation(0);
  };

  const closeViewer = () => {
    setSelected(null);
    setZoom(1);
    setRotation(0);
  };

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
              <div className="flex min-h-[72px] shrink-0 flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/50 px-4 py-3 md:px-7">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal/25 bg-teal/10 text-teal">
                    <Award size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-teal">
                      Certificate
                    </p>
                    <h3 className="max-w-[52vw] truncate font-display text-sm font-semibold text-white md:text-base">
                      {selected.name}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <ViewerButton
                    title="Zoom out"
                    onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut size={17} />
                  </ViewerButton>

                  <span className="hidden min-w-[62px] rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-center font-mono text-[10px] text-white/65 sm:block">
                    {Math.round(zoom * 100)}%
                  </span>

                  <ViewerButton
                    title="Zoom in"
                    onClick={() => setZoom((z) => Math.min(z + 0.2, 3))}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn size={17} />
                  </ViewerButton>

                  <ViewerButton
                    title="Rotate"
                    onClick={() => setRotation((r) => r + 90)}
                  >
                    <RotateCw size={17} />
                  </ViewerButton>

                  <ViewerButton
                    title="Reset"
                    onClick={() => {
                      setZoom(1);
                      setRotation(0);
                    }}
                  >
                    <RotateCcw size={17} />
                  </ViewerButton>

                  <a
                    href={selected.certificate}
                    download
                    title="Download certificate"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-teal/30 bg-teal/10 px-3 text-sm font-medium text-teal transition hover:border-teal hover:bg-teal/15"
                  >
                    <Download size={16} />
                    <span className="hidden sm:inline">Download</span>
                  </a>

                  <button
                    type="button"
                    onClick={closeViewer}
                    aria-label="Close certificate viewer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    <X size={19} />
                  </button>
                </div>
              </div>

              <div
                className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto p-5 md:p-10"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) closeViewer();
                }}
              >
                <div className="pointer-events-none fixed left-1/2 top-1/2 h-[55vh] w-[65vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal/[0.05] blur-[100px]" />

                <motion.img
                  key={selected.certificate}
                  initial={{ opacity: 0, scale: 0.96, y: 18 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  src={selected.certificate}
                  alt={selected.name}
                  draggable={false}
                  className="relative max-h-[74vh] max-w-[88vw] select-none rounded-lg object-contain shadow-[0_30px_100px_rgba(0,0,0,0.65)] transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  }}
                />
              </div>

              <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 rounded-full border border-white/10 bg-black/55 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.15em] text-white/40 backdrop-blur-md md:block">
                + / - zoom · ESC close
              </div>
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
              Click a certificate to preview
            </p>
          </div>
        </div>

        <div className="divide-y divide-border/70">
          {certifications.map((certification, index) => (
            <button
              key={certification.name}
              type="button"
              onClick={() => openViewer(certification)}
              className="group flex w-full items-center gap-3 px-5 py-2 text-left transition hover:bg-teal/[0.06]"
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
      </div>

      {modal}
    </>
  );
}

function ViewerButton({
  children,
  title,
  onClick,
  disabled = false,
}: {
  children: React.ReactNode;
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
