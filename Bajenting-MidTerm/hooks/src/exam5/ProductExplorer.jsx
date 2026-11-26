import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const CATEGORIES = ['Electronics', 'Books', 'Home', 'Toys', 'Sports', 'Garden'];
const NOUNS = ['Lamp', 'Backpack', 'Notebook', 'Headset', 'Chair', 'Bottle', 'Keyboard', 'Puzzle', 'Racket', 'Planter'];
const ADJECTIVES = ['Compact', 'Classic', 'Smart', 'Rugged', 'Eco', 'Deluxe', 'Mini', 'Pro'];
const DISPLAY_LIMIT = 100;

// Deterministic pseudo-random generator so the data is identical on every load.
function createRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function generateProducts(count) {
  const rand = createRng(42);
  return Array.from({ length: count }, (_, i) => {
    const adj = ADJECTIVES[Math.floor(rand() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(rand() * NOUNS.length)];
    return {
      id: i + 1,
      name: `${adj} ${noun} ${i + 1}`,
      category: CATEGORIES[Math.floor(rand() * CATEGORIES.length)],
      price: Math.round((5 + rand() * 495) * 100) / 100,
    };
  });
}

const PRODUCTS = generateProducts(600);

// Wrapped in React.memo: re-renders only when its props change by reference/value.
const ProductList = memo(function ProductList({ products, selectedId, onSelect }) {
  const renderBadgeRef = useRef(null);
  const renderCountRef = useRef(0);

  // Runs after every ProductList render; updates the DOM directly so the badge
  // itself does not cause another render.
  useEffect(() => {
    renderCountRef.current += 1;
    if (renderBadgeRef.current) renderBadgeRef.current.textContent = String(renderCountRef.current);
    console.log(`[ProductList] render #${renderCountRef.current}`);
  });

  const shown = products.slice(0, DISPLAY_LIMIT);

  return (
    <div>
      <p className="muted">
        ProductList renders: <strong ref={renderBadgeRef}>0</strong> · showing {shown.length} of {products.length}
      </p>
      <table className="product-table">
        <thead>
          <tr><th>Name</th><th>Category</th><th>Price</th></tr>
        </thead>
        <tbody>
          {shown.map((p) => (
            <tr key={p.id} className={p.id === selectedId ? 'selected' : undefined}>
              <td>
                <button onClick={() => onSelect(p.id)} aria-pressed={p.id === selectedId}>{p.name}</button>
              </td>
              <td>{p.category}</td>
              <td>${p.price.toFixed(2)}</td>
            </tr>
          ))}
          {shown.length === 0 && <tr><td colSpan={3}>No products match.</td></tr>}
        </tbody>
      </table>
    </div>
  );
});

export default function ProductExplorer() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedId, setSelectedId] = useState(null);
  const [unrelatedCount, setUnrelatedCount] = useState(0);
  const filterRunsBadgeRef = useRef(null);
  const filterRunsRef = useRef(0);

  // Expensive calculation, memoized. Every true input is in the dependency array.
  const visibleProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = PRODUCTS.filter(
      (p) => (category === 'All' || p.category === category) && p.name.toLowerCase().includes(needle)
    );
    return filtered.sort((a, b) => (sortOrder === 'asc' ? a.price - b.price : b.price - a.price));
  }, [query, category, sortOrder]);

  // Side effects do not belong in useMemo: analytics lives in an effect.
  useEffect(() => {
    console.info('[analytics] results', { query, category, sortOrder, count: visibleProducts.length });
  }, [query, category, sortOrder, visibleProducts.length]);

  // Counts how often the memoized calculation actually produced a new array.
  useEffect(() => {
    filterRunsRef.current += 1;
    if (filterRunsBadgeRef.current) filterRunsBadgeRef.current.textContent = String(filterRunsRef.current);
  }, [visibleProducts]);

  // Stable identity: uses the functional form, so it needs no outside dependency.
  const handleSelect = useCallback((id) => {
    setSelectedId((current) => (current === id ? null : id));
  }, []);

  const selectedProduct = useMemo(() => PRODUCTS.find((p) => p.id === selectedId) ?? null, [selectedId]);

  return (
    <section aria-labelledby="exam5-title">
      <h2 id="exam5-title">Product Explorer Performance Repair</h2>
      <p className="lede">600 generated products. Click the unrelated counter and watch the render badges.</p>

      <div className="row">
        <div className="field" style={{ flex: '2 1 180px' }}>
          <label htmlFor="product-query">Search</label>
          <input id="product-query" type="search" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <div className="field" style={{ flex: '1 1 140px' }}>
          <label htmlFor="product-category">Category</label>
          <select id="product-category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>All</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="field" style={{ flex: '1 1 140px' }}>
          <label htmlFor="product-sort">Price sort</label>
          <select id="product-sort" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Low to high</option>
            <option value="desc">High to low</option>
          </select>
        </div>
      </div>

      <div className="badges">
        <span className="badge">Filter recomputations: <strong ref={filterRunsBadgeRef}>0</strong></span>
        <span className="badge">Unrelated counter: <strong>{unrelatedCount}</strong></span>
        <button className="btn secondary" onClick={() => setUnrelatedCount((c) => c + 1)}>
          Increment unrelated counter
        </button>
      </div>

      <p className="muted" role="status">
        {selectedProduct ? `Selected: ${selectedProduct.name} ($${selectedProduct.price.toFixed(2)})` : 'No product selected.'}
      </p>

      <ProductList products={visibleProducts} selectedId={selectedId} onSelect={handleSelect} />

      <details>
        <summary>Debugging and memoization notes</summary>
        <ul className="muted">
          <li>Stale results: a <code>useMemo</code> that reads <code>query</code> must list it, otherwise the cached list never updates.</li>
          <li>Outdated callback: a <code>useCallback</code> that reads <code>selectedId</code> or a project value must list it. Here the functional updater removes the need.</li>
          <li>Analytics call: moved out of <code>useMemo</code> into <code>useEffect</code>, since memo callbacks must be pure.</li>
          <li>Unnecessary memoization: a cheap calculation, such as formatting one price, or a callback passed to a non-memoized child, gains nothing from memoizing.</li>
        </ul>
      </details>
    </section>
  );
}
