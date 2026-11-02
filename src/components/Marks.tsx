import type { ReactNode } from 'react';

export function ExampleMark() {
  return <span className="mark">Example data</span>;
}

export function PlaceholderNote({ children }: { children: ReactNode }) {
  return <p className="mark-note"><span className="mark">Placeholder</span><span>{children}</span></p>;
}
