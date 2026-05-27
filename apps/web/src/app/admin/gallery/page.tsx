'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as Dialog from '@radix-ui/react-dialog';
import { ImagePlus, Loader2, Trash2, X } from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { apiFetch, apiUpload, assetBase, type ApiError } from '@/lib/client-api';
import { EVENT_TYPE_LABEL, type EventType } from '@/lib/booking-types';

interface GalleryPhoto {
  id: string;
  imageUrl: string;
  caption: string | null;
  clientName: string | null;
  eventType: EventType | null;
  isPublished: boolean;
  sortOrder: number;
}

interface FormState {
  caption: string;
  clientName: string;
  eventType: '' | EventType;
  isPublished: boolean;
  sortOrder: number;
}

const emptyForm: FormState = {
  caption: '',
  clientName: '',
  eventType: '',
  isPublished: true,
  sortOrder: 0,
};

export default function AdminGalleryPage() {
  const [photos, setPhotos] = useState<GalleryPhoto[] | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setPhotos(null);
    apiFetch<GalleryPhoto[]>('/gallery/all').then(setPhotos).catch(() => setPhotos([]));
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setPreview(null);
    setFile(null);
    setError(null);
    setOpen(true);
  };

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const save = async () => {
    if (!file) {
      setError('Please choose an image to upload.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      if (form.caption) fd.append('caption', form.caption);
      if (form.clientName) fd.append('clientName', form.clientName);
      if (form.eventType) fd.append('eventType', form.eventType);
      fd.append('isPublished', String(form.isPublished));
      fd.append('sortOrder', String(form.sortOrder));
      await apiUpload('/gallery', fd);
      setOpen(false);
      load();
    } catch (err) {
      setError((err as ApiError).message ?? 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    await apiFetch(`/gallery/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    load();
  };

  const togglePublished = async (photo: GalleryPhoto) => {
    await apiFetch(`/gallery/${photo.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isPublished: !photo.isPublished }),
    });
    load();
  };

  function resolveUrl(url: string) {
    if (url.startsWith('http')) return url;
    return `${assetBase}${url}`;
  }

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-emerald_deep-700">Gallery</h1>
        <Button onClick={openNew}>
          <ImagePlus className="h-4 w-4" /> Add photo
        </Button>
      </div>

      {photos === null ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-emerald_deep-700/50" />
        </div>
      ) : photos.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-emerald_deep-700/10 bg-white p-12 text-center">
          <p className="font-display text-2xl text-emerald_deep-700/60">No photos yet</p>
          <p className="mt-2 text-sm text-emerald_deep-700/40">
            Add happy client photos to showcase your work.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative rounded-2xl overflow-hidden bg-ivory-100 aspect-[3/4]">
              <Image
                src={resolveUrl(p.imageUrl)}
                alt={p.caption ?? p.clientName ?? 'Gallery photo'}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-emerald_deep-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => togglePublished(p)}
                    className={[
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      p.isPublished
                        ? 'bg-emerald_deep-500 text-white'
                        : 'bg-ivory-200 text-emerald_deep-700',
                    ].join(' ')}
                  >
                    {p.isPublished ? 'Published' : 'Hidden'}
                  </button>
                  <button
                    onClick={() => setDeleteId(p.id)}
                    className="rounded-full bg-terracotta-500/80 p-1 text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div>
                  {p.clientName && (
                    <p className="text-ivory-50 font-display text-base leading-tight">{p.clientName}</p>
                  )}
                  {p.eventType && (
                    <p className="text-gold-300 text-xs">{EVENT_TYPE_LABEL[p.eventType]}</p>
                  )}
                  {p.caption && (
                    <p className="text-ivory-50/80 text-xs mt-0.5 line-clamp-2">{p.caption}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload dialog */}
      <Dialog.Root open={open} onOpenChange={(o) => !o && setOpen(false)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-emerald_deep-700/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-ivory-50 shadow-xl flex flex-col data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald_deep-700/10">
              <Dialog.Title className="font-display text-2xl text-emerald_deep-700">
                Add photo
              </Dialog.Title>
              <Dialog.Close className="p-2 -mr-2 rounded-md text-emerald_deep-700/60 hover:text-emerald_deep-700">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {/* File picker */}
              <div>
                <Label>Photo</Label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={pickFile}
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full mt-1 rounded-xl border-2 border-dashed border-emerald_deep-700/20 hover:border-emerald_deep-700/40 transition-colors overflow-hidden"
                >
                  {preview ? (
                    <div className="relative h-56 w-full">
                      <Image src={preview} alt="Preview" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-emerald_deep-700/40">
                      <ImagePlus className="h-8 w-8 mb-2" />
                      <span className="text-sm">Click to choose a photo</span>
                      <span className="text-xs mt-1">JPG, PNG, WEBP — max 10 MB</span>
                    </div>
                  )}
                </button>
              </div>

              <div>
                <Label htmlFor="g-client">Client name</Label>
                <Input
                  id="g-client"
                  placeholder="e.g. Aline & Eric"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="g-caption">Caption (optional)</Label>
                <Textarea
                  id="g-caption"
                  placeholder="A short description of this moment…"
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="g-event">Ceremony type</Label>
                <Select
                  id="g-event"
                  value={form.eventType}
                  onChange={(e) => setForm({ ...form, eventType: e.target.value as EventType | '' })}
                >
                  <option value="">— None —</option>
                  {(Object.entries(EVENT_TYPE_LABEL) as [EventType, string][]).map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 text-sm text-emerald_deep-700">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  />
                  Publish immediately
                </label>
              </div>

              {error && (
                <p className="text-sm text-terracotta-500 bg-terracotta-50 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}
            </div>

            <div className="border-t border-emerald_deep-700/10 px-6 py-4 flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} disabled={submitting}>
                {submitting ? 'Uploading…' : 'Upload photo'}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete photo?"
        description="This photo will be permanently removed from the gallery. This cannot be undone."
        confirmLabel="Delete photo"
        destructive
        onConfirm={() => deleteId && remove(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </AdminShell>
  );
}
