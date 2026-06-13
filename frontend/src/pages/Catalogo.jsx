import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import { PRODUCTOS as LOCAL_PRODUCTOS } from '../data/valkira-products';
import '../styles/valkira-catalogo.css';
import ProductCard from '../components/ProductCard';

function formatPrecio(n){
  if (n == null) return '—';
  return `$${Number(n).toLocaleString()}`;
}

export default function Catalogo(){
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('cat') || '';

  const [productos, setProductos] = useState(LOCAL_PRODUCTOS);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [categorias, setCategorias] = useState(initialCat ? [initialCat] : []);
  const [tallas, setTallas] = useState([]);
  const [precioMax, setPrecioMax] = useState(500000);
  const [status, setStatus] = useState([]);
  const [orden, setOrden] = useState('default');
  const [pagina, setPagina] = useState(1);
  const porPagina = 9;

  const allCategories = useMemo(
    () => Array.from(new Set(productos.map((p) => p.categoria).filter(Boolean))),
    [productos],
  );

  const allSizes = useMemo(
    () => Array.from(new Set(productos.flatMap((p) => p.tallas || []))),
    [productos],
  );

  const filtered = useMemo(() => {
    let lista = [...productos];
    if (busqueda) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(
        (p) =>
          (p.nombre || '').toLowerCase().includes(q) ||
          (p.categoria || '').toLowerCase().includes(q),
      );
    }
    if (categorias.length) lista = lista.filter((p) => categorias.includes(p.categoria));
    if (tallas.length) lista = lista.filter((p) => (p.tallas || []).some((t) => tallas.includes(t)));
    lista = lista.filter((p) => (p.precio || 0) <= precioMax);
    if (status.length) lista = lista.filter((p) => status.includes(p.status));

    if (orden === 'price-asc') lista.sort((a, b) => (a.precio || 0) - (b.precio || 0));
    if (orden === 'price-desc') lista.sort((a, b) => (b.precio || 0) - (a.precio || 0));
    if (orden === 'newest') lista.sort((a, b) => ((b.status === 'nuevo') ? 1 : 0) - ((a.status === 'nuevo') ? 1 : 0));
    if (orden === 'name') lista.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));

    return lista;
  }, [productos, busqueda, categorias, tallas, precioMax, status, orden]);

  useEffect(() => {
    setPagina(1);
  }, [busqueda, categorias, tallas, precioMax, status, orden]);

  const total = filtered.length;
  const totalPaginas = Math.max(1, Math.ceil(total / porPagina));
  const paginaItems = filtered.slice((pagina - 1) * porPagina, (pagina - 1) * porPagina + porPagina);

  const toggleArray = (arr, setArr, val) => {
    setArr((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
  };

  const hasActiveFilters = categorias.length || tallas.length || status.length || precioMax < 500000;

  return (
    <div className="vk-catalog-page">
      <div className="page-header">
        <div className="header-row">
          <div>
            <h1>Catálogo</h1>
            <p>Explora nuestra selección</p>
          </div>
          <div className="search-wrap">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar prendas..."
              autoComplete="off"
            />
            <span className="search-icon">&#9906;</span>
          </div>
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="sidebar">
          <div className="filter-group">
            <div className="filter-title">Categoría</div>
            <div className="filter-options">
              {allCategories.map((categoria) => (
                <label key={categoria} className="filter-option">
                  <input
                    type="checkbox"
                    checked={categorias.includes(categoria)}
                    onChange={() => toggleArray(categorias, setCategorias, categoria)}
                  />
                  <span>{categoria}</span>
                  <span className="filter-count">
                    {productos.filter((p) => p.categoria === categoria).length}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-title">Talla</div>
            <div className="filter-options">
              {allSizes.map((size) => (
                <label key={size} className="filter-option">
                  <input
                    type="checkbox"
                    checked={tallas.includes(size)}
                    onChange={() => toggleArray(tallas, setTallas, size)}
                  />
                  <span>{size}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-title">Precio</div>
            <div className="price-range">
              <input
                type="range"
                id="price-range"
                min="0"
                max="500000"
                step="10000"
                value={precioMax}
                onChange={(e) => setPrecioMax(Number(e.target.value))}
              />
              <div className="price-labels">
                <span>$0</span>
                <span id="price-max-label">Hasta {formatPrecio(precioMax)}</span>
              </div>
            </div>
          </div>

          <div className="filter-group">
            <div className="filter-title">Estado</div>
            <div className="filter-options">
              {['nuevo', 'oferta', 'limitado'].map((statusKey) => (
                <label key={statusKey} className="filter-option">
                  <input
                    type="checkbox"
                    checked={status.includes(statusKey)}
                    onChange={() => toggleArray(status, setStatus, statusKey)}
                  />
                  <span>{statusKey}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="btn-clear" type="button" onClick={() => {
            setBusqueda('');
            setCategorias(initialCat ? [initialCat] : []);
            setTallas([]);
            setPrecioMax(500000);
            setStatus([]);
            setOrden('default');
          }}>
            Limpiar filtros
          </button>
        </aside>

        <main className="products-area">
          <div className="toolbar">
            <p className="results-count"><strong id="count-display">{total}</strong> productos encontrados</p>
            <div className="sort-wrap">
              <label htmlFor="sort-select">Ordenar por</label>
              <select id="sort-select" value={orden} onChange={(e) => setOrden(e.target.value)}>
                <option value="default">Destacados</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="newest">Más nuevos</option>
                <option value="name">Nombre A–Z</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="active-filters" id="active-filters">
              {categorias.map((cat) => (
                <span key={cat} className="filter-tag">{cat}</span>
              ))}
              {tallas.map((size) => (
                <span key={size} className="filter-tag">Talla {size}</span>
              ))}
              {status.map((flag) => (
                <span key={flag} className="filter-tag">{flag}</span>
              ))}
              {precioMax < 500000 && <span className="filter-tag">Hasta {formatPrecio(precioMax)}</span>}
            </div>
          )}

          <div className="products-grid">
            {paginaItems.length === 0 ? (
              <div className="no-results">
                <h3>No hay productos que coincidan</h3>
                <p>Prueba eliminando filtros o ajustando tu búsqueda.</p>
              </div>
            ) : (
              paginaItems.map((prod) => (
                <ProductCard key={prod.id} prod={prod} />
              ))
            )}
          </div>

          <div className="pagination" id="pagination">
            <button className="page-btn arrow" disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
            <span className="page-label">Página {pagina} de {totalPaginas}</span>
            <button className="page-btn arrow" disabled={pagina >= totalPaginas} onClick={() => setPagina(pagina + 1)}>Siguiente</button>
          </div>
        </main>
      </div>
    </div>
  );
}
