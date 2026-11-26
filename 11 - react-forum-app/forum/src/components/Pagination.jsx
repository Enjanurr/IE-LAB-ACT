export default function Pagination({ page, firstPage, hasNext, disabled, onPrev, onNext }) {
  return (
    <nav className="pagination" aria-label="Pagination">
      <button type="button" className="btn secondary" onClick={onPrev} disabled={disabled || page <= firstPage}>
        &larr; Previous
      </button>
      <span aria-current="page">Page {page}</span>
      <button type="button" className="btn secondary" onClick={onNext} disabled={disabled || !hasNext}>
        Next &rarr;
      </button>
    </nav>
  );
}
