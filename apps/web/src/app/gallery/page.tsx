'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageShell } from '@/components/site/page-shell';
import { apiFetch, assetBase } from '@/lib/client-api';
import { EVENT_TYPE_LABEL } from '@/lib/booking-types';
import type { EventType } from '@/lib/booking-types';

interface GalleryPhoto {
  id: string;
  imageUrl: string;
  caption: string | null;
  clientName: string | null;
  eventType: EventType | null;
}

const EVENT_FILTERS: Array<{ value: '' | EventType; label: string }> = [
  { value: '', label: 'All' },
  { value: 'GUSABA', label: 'Gusaba' },
  { value: 'GUKWA', label: 'Gukwa' },
  { value: 'CIVIL', label: 'Civil' },
  { value: 'RELIGIOUS', label: 'Religious' },
  { value: 'RECEPTION', label: 'Reception' },
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[] | null>(null);
  const [filter, setFilter] = useState<'' | EventType>('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    apiFetch<GalleryPhoto[]>('/gallery').then(setPhotos).catch(() => setPhotos([]));
  }, []);

  const visible = filter ? photos?.filter((p) => p.eventType === filter) : photos;
  const lightboxPhoto = lightboxIndex !== null ? visible?.[lightboxIndex] ?? null : null;

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const prev = useCallback(() =>
    setLightboxIndex((i) => (i !== null && visible ? (i - 1 + visible.length) % visible.length : null)),
    [visible],
  );

  const next = useCallback(() =>
    setLightboxIndex((i) => (i !== null && visible ? (i + 1) % visible.length : null)),
    [visible],
  );

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, closeLightbox, prev, next]);

  // Lock scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIndex]);

  function resolveUrl(url: string) {
    if (url.startsWith('http')) return url;
    return `${assetBase}${url}`;
  }

  return (
    <PageShell alwaysSolid>
      <section className="container py-14 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-gold-500">
            Happy Couples
          </span>
          <h1 className="mt-3 font-display text-5xl md:text-6xl text-emerald_deep-700">
            Our Gallery
          </h1>
          <p className="mt-4 text-emerald_deep-700/60 max-w-xl mx-auto">
            Every wedding tells a unique story. Here are some of the beautiful moments
            our clients have shared with us.
          </p>
        </motion.div>

        {/* Event type filters */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {EVENT_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={[
                'inline-flex items-center rounded-full border px-5 h-9 text-sm font-medium transition-colors',
                filter === f.value
                  ? 'bg-emerald_deep-700 border-emerald_deep-700 text-ivory-50'
                  : 'border-emerald_deep-700/15 text-emerald_deep-700 hover:bg-ivory-100',
              ].join(' ')}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {photos === null ? (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-ivory-100 animate-pulse"
              />
            ))}
          </div>
        ) : visible && visible.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="font-display text-2xl text-emerald_deep-700/50">
              No photos yet
            </p>
          </div>
        ) : (
          <div className="mt-10 columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {visible?.map((photo, i) => (
              <motion.button
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                onClick={() => setLightboxIndex(i)}
                className="group relative w-full text-left break-inside-avoid overflow-hidden rounded-2xl bg-ivory-100 cursor-zoom-in"
              >
                <Image
                  src={resolveUrl(photo.imageUrl)}
                  alt={photo.caption ?? photo.clientName ?? 'Wedding photo'}
                  width={600}
                  height={800}
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                {(photo.caption || photo.clientName || photo.eventType) && (
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald_deep-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    {photo.clientName && (
                      <p className="text-ivory-50 font-display text-lg leading-tight">
                        {photo.clientName}
                      </p>
                    )}
                    {photo.eventType && (
                      <p className="text-gold-300 text-xs uppercase tracking-wider mt-0.5">
                        {EVENT_TYPE_LABEL[photo.eventType]}
                      </p>
                    )}
                    {photo.caption && (
                      <p className="text-ivory-50/80 text-sm mt-1 line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </section>

      {/* ── Lightbox ── */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            onClick={closeLightbox}
          >
            {/* Image container — stop propagation so clicking the image doesn't close */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              className="relative max-h-[90vh] max-w-5xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full max-h-[78vh] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={resolveUrl(lightboxPhoto.imageUrl)}
                  alt={lightboxPhoto.caption ?? lightboxPhoto.clientName ?? 'Wedding photo'}
                  width={1200}
                  height={900}
                  className="w-full h-full object-contain bg-black"
                  sizes="90vw"
                  priority
                />
              </div>

              {/* Caption bar */}
              {(lightboxPhoto.clientName || lightboxPhoto.caption || lightboxPhoto.eventType) && (
                <div className="mt-4 text-center px-4">
                  {lightboxPhoto.clientName && (
                    <p className="font-display text-2xl text-ivory-50">{lightboxPhoto.clientName}</p>
                  )}
                  {lightboxPhoto.eventType && (
                    <p className="text-gold-400 text-xs uppercase tracking-widest mt-1">
                      {EVENT_TYPE_LABEL[lightboxPhoto.eventType]}
                    </p>
                  )}
                  {lightboxPhoto.caption && (
                    <p className="text-ivory-50/70 text-sm mt-2 max-w-xl mx-auto">{lightboxPhoto.caption}</p>
                  )}
                </div>
              )}

              {/* Counter */}
              {visible && visible.length > 1 && (
                <p className="mt-3 text-ivory-50/40 text-xs tabular-nums">
                  {(lightboxIndex ?? 0) + 1} / {visible.length}
                </p>
              )}
            </motion.div>

            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 rounded-full bg-white/10 hover:bg-white/20 p-2.5 text-white transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Prev / Next */}
            {visible && visible.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white transition-colors"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 hover:bg-white/20 p-3 text-white transition-colors"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
