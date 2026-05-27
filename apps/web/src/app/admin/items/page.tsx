'use client';

import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Edit, Loader2, Plus, Trash2, X } from 'lucide-react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Input, Label, Select, Textarea } from '@/components/ui/input';
import { apiFetch, type ApiError } from '@/lib/client-api';
import { cn, formatRwf } from '@/lib/utils';
import type { Category, RentalItem } from '@/lib/server-api';

interface FormState {
  id?: string;
  categoryId: string;
  name: string;
  description: string;
  pricePerEvent: number;
  quantity: number;
  imagesRaw: string;
  isFeatured: boolean;
  isActive: boolean;
}

const emptyForm: FormState = {
  categoryId: '',
  name: '',
  description: '',
  pricePerEvent: 0,
  quantity: 1,
  imagesRaw: '',
  isFeatured: false,
  isActive: true,
};

export default function AdminItemsPage() {
  const [items, setItems] = useState<RentalItem[] | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    setItems(null);
    apiFetch<RentalItem[]>('/items').then(setItems).catch(() => setItems([]));
  };

  useEffect(() => {
    load();
    apiFetch<Category[]>('/categories').then(setCategories).catch(() => {});
  }, []);

  const openNew = () => {
    setError(null);
    setEditing({
      ...emptyForm,
      categoryId: categories[0]?.id ?? '',
    });
  };

  const openEdit = (item: RentalItem) => {
    setError(null);
    setEditing({
      id: item.id,
      categoryId: item.category.id,
      name: item.name,
      description: item.description ?? '',
      pricePerEvent: item.pricePerEvent,
      quantity: item.quantity,
      imagesRaw: item.images.join('\n'),
      isFeatured: item.isFeatured,
      isActive: item.isActive,
    });
  };

  const save = async () => {
    if (!editing) return;
    setError(null);
    setSubmitting(true);
    const payload = {
      categoryId: editing.categoryId,
      name: editing.name,
      description: editing.description || undefined,
      pricePerEvent: Number(editing.pricePerEvent),
      quantity: Number(editing.quantity),
      images: editing.imagesRaw
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      isFeatured: editing.isFeatured,
      isActive: editing.isActive,
    };
    try {
      if (editing.id) {
        await apiFetch(`/items/${editing.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/items', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }
      setEditing(null);
      load();
    } catch (err) {
      setError((err as ApiError).message ?? 'Save failed');
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id: string) => {
    await apiFetch(`/items/${id}`, { method: 'DELETE' });
    setDeleteId(null);
    load();
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-4xl text-emerald_deep-700">Items</h1>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" /> New item
        </Button>
      </div>

      {items === null ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-emerald_deep-700/50" />
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-emerald_deep-700/10 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ivory-100 text-emerald_deep-700/60 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-right px-4 py-3">Price</th>
                <th className="text-right px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald_deep-700/5">
              {items.map((i) => (
                <tr key={i.id} className={cn(!i.isActive && 'opacity-50')}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-emerald_deep-700">
                      {i.name}
                    </div>
                    {i.isFeatured && (
                      <span className="text-xs text-gold-600">★ Featured</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-emerald_deep-700/70">
                    {i.category.name}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-emerald_deep-700">
                    {formatRwf(i.pricePerEvent)}
                  </td>
                  <td className="px-4 py-3 text-right text-emerald_deep-700/70">
                    {i.quantity}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2 py-0.5 text-xs',
                        i.isActive
                          ? 'bg-emerald_deep-50 text-emerald_deep-700'
                          : 'bg-ivory-200 text-emerald_deep-700/50',
                      )}
                    >
                      {i.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(i)}
                      className="inline-flex items-center gap-1 text-emerald_deep-700/70 hover:text-emerald_deep-700 mr-3"
                      aria-label="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteId(i.id)}
                      className="inline-flex items-center gap-1 text-emerald_deep-700/50 hover:text-terracotta-500"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog.Root open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-emerald_deep-700/60 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-ivory-50 shadow-xl flex flex-col data-[state=open]:animate-in data-[state=open]:slide-in-from-right data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald_deep-700/10">
              <Dialog.Title className="font-display text-2xl text-emerald_deep-700">
                {editing?.id ? 'Edit item' : 'New item'}
              </Dialog.Title>
              <Dialog.Close
                className="p-2 -mr-2 rounded-md text-emerald_deep-700/60 hover:text-emerald_deep-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
            {editing && (
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                <div>
                  <Label htmlFor="i-name">Name</Label>
                  <Input
                    id="i-name"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="i-cat">Category</Label>
                  <Select
                    id="i-cat"
                    value={editing.categoryId}
                    onChange={(e) =>
                      setEditing({ ...editing, categoryId: e.target.value })
                    }
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label htmlFor="i-desc">Description</Label>
                  <Textarea
                    id="i-desc"
                    value={editing.description}
                    onChange={(e) =>
                      setEditing({ ...editing, description: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="i-price">Price (RWF)</Label>
                    <Input
                      id="i-price"
                      type="number"
                      min={0}
                      value={editing.pricePerEvent}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          pricePerEvent: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="i-qty">Quantity in stock</Label>
                    <Input
                      id="i-qty"
                      type="number"
                      min={1}
                      value={editing.quantity}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          quantity: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="i-imgs">Image URLs (one per line)</Label>
                  <Textarea
                    id="i-imgs"
                    placeholder="/legacy-assets/something.jpg&#10;https://example.com/photo.jpg"
                    value={editing.imagesRaw}
                    onChange={(e) =>
                      setEditing({ ...editing, imagesRaw: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="inline-flex items-center gap-2 text-sm text-emerald_deep-700">
                    <input
                      type="checkbox"
                      checked={editing.isFeatured}
                      onChange={(e) =>
                        setEditing({ ...editing, isFeatured: e.target.checked })
                      }
                    />
                    Featured on home
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-emerald_deep-700">
                    <input
                      type="checkbox"
                      checked={editing.isActive}
                      onChange={(e) =>
                        setEditing({ ...editing, isActive: e.target.checked })
                      }
                    />
                    Active (visible to customers)
                  </label>
                </div>
                {error && (
                  <p className="text-sm text-terracotta-500 bg-terracotta-50 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}
              </div>
            )}
            <div className="border-t border-emerald_deep-700/10 px-6 py-4 flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setEditing(null)}>
                Cancel
              </Button>
              <Button onClick={save} disabled={submitting}>
                {submitting ? 'Saving…' : 'Save'}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <ConfirmDialog
        open={deleteId !== null}
        title="Hide this item?"
        description="This item will be marked as inactive and hidden from customers. You can re-enable it at any time by editing it."
        confirmLabel="Hide item"
        destructive
        onConfirm={() => deleteId && remove(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </AdminShell>
  );
}
