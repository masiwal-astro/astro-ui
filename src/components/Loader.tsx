export function Loader({ done }: { done: boolean }) {
  return (
    <div className="loader" data-done={done} aria-hidden={done} role="status" aria-label="Loading">
      <div className="loader-orbit"><i /></div>
    </div>
  );
}
