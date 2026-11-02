export function Loader({ done }: { done: boolean }) {
  return (
    <div className="loader" data-done={done} aria-hidden={done} role="status" aria-label="Loading the sky">
      <div className="loader-orbit"><i /></div>
      <span className="label">Computing the sky</span>
    </div>
  );
}
