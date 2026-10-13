export default function Loading() {
  return (
    <div className="container section" aria-label="Loading page">
      <div className="skeleton" />
      <div className="tool-grid" style={{ marginTop: 30 }}>
        {[1, 2, 3].map((n) => (
          <div className="skeleton" key={n} />
        ))}
      </div>
    </div>
  );
}
