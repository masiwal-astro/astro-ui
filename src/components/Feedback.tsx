import { useEffect, useId, useRef, useState } from 'react';

interface ToastItem {
  id: number;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
  ms: number;
}

let nextId = 1;
const listeners = new Set<(items: ToastItem[]) => void>();
let items: ToastItem[] = [];

function publish(next: ToastItem[]) {
  items = next;
  listeners.forEach((listener) => listener(items));
}

export function pushToast(text: string, options?: { actionLabel?: string; onAction?: () => void; ms?: number }) {
  const id = nextId;
  nextId += 1;
  const item: ToastItem = { id, text, actionLabel: options?.actionLabel, onAction: options?.onAction, ms: options?.ms ?? 5000 };
  publish([...items, item]);
  window.setTimeout(() => publish(items.filter((entry) => entry.id !== id)), item.ms);
  return id;
}

export function ToastRegion() {
  const [current, setCurrent] = useState<ToastItem[]>(items);
  useEffect(() => {
    listeners.add(setCurrent);
    return () => { listeners.delete(setCurrent); };
  }, []);
  if (!current.length) return null;
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {current.map((toast) => (
        <p key={toast.id} className="toast">
          <span>{toast.text}</span>
          {toast.actionLabel && toast.onAction && (
            <button type="button" onClick={() => { toast.onAction?.(); publish(items.filter((entry) => entry.id !== toast.id)); }}>{toast.actionLabel}</button>
          )}
        </p>
      ))}
    </div>
  );
}

export function ConfirmDialog({
  title,
  body,
  confirmLabel,
  danger = false,
  onCancel,
  onConfirm,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const titleId = useId();
  const cancelRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    cancelRef.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onCancel]);
  return (
    <div className="confirm-backdrop" role="presentation" onClick={(event) => { if (event.target === event.currentTarget) onCancel(); }}>
      <div className="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId}>{title}</h2>
        <p>{body}</p>
        <div className="row-actions">
          <button ref={cancelRef} type="button" className="btn btn--ghost" onClick={onCancel}>Cancel</button>
          <button type="button" className={danger ? 'btn btn--danger' : 'btn btn--primary'} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
