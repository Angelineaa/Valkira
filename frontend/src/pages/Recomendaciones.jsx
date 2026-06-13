import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPreferences, getRecommendations } from '../services/api';
import { PRODUCTOS } from '../data/valkira-products';
import '../styles/valkira-home.css';

function sampleByColor(color) {
  if (!color) return [];
  color = color.toLowerCase();
  if (color.includes('negro')) return PRODUCTOS.filter(p => /black|negro/i.test(p.nombre) || /negro|black/i.test(p.descripcion));
  if (color.includes('blanco')) return PRODUCTOS.filter(p => /blanc|blanco|white/i.test(p.nombre) || /blanc|blanco|white/i.test(p.descripcion));
  if (color.includes('rojo')) return PRODUCTOS.filter(p => /rojo|red/i.test(p.nombre) || /rojo|red/i.test(p.descripcion));
  return PRODUCTOS.slice(0, 6);
}

export default function Recomendaciones() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const p = await getPreferences();
        setPrefs(p || {});
      } catch (e) {
        setPrefs(null);
      }
      try {
        const r = await getRecommendations();
        // normalizar la forma del producto que viene del API para usarlo igual que el frontend
        const mapped = (r || []).map((product) => {
          if (!product) return null;
          return {
            id: product.id,
            nombre: product.name || product.nombre || 'Producto',
            precio: product.price || product.precio || null,
            imagen: product.imageUrl || product.imagen || null,
            categoria: product.category || product.categoria || 'Sin categoría',
            descripcion: product.description || product.descripcion || 'Descripción no disponible.',
            status: product.status || product.estado || null,
            recommendationReason: product.recommendationReason || product.reason || '',
          };
        }).filter(Boolean);
        setRecs(mapped);
      } catch (e) {
        setRecs([]);
      }
      setLoading(false);
    }
    load();
  }, []);

  const formatRecommendationReason = (reason) => {
    if (!reason) return '';
    const parts = String(reason).split('·').map((p) => p.trim()).filter(Boolean);
    if (parts.length === 0) return reason;
    const sentences = parts.map((p) => {
      const t = p.charAt(0).toUpperCase() + p.slice(1).replace(/\s*\.$/, '');
      return t.endsWith('.') ? t : `${t}.`;
    });
    return sentences.join(' ');
  };

  const favoriteColor = prefs?.favoriteColors?.[0] || null;
  const favoriteStyles = prefs?.favoriteStyles || [];

  const colorSamples = sampleByColor(favoriteColor);

  return (
    <div className="recommendations-page container">
      <div className="section-header">
        <h1 className="section-title">Recomendaciones personalizadas</h1>
        <div className="section-actions">
          <button className="section-link" onClick={() => navigate('/catalogo')}>Ver catálogo</button>
        </div>
      </div>

      {loading ? (
        <p className="recommendation-loading">Cargando recomendaciones...</p>
      ) : (
        <div className="recommendations-content">
          <section className="preference-block">
            <h3 className="preference-title">Según tu color favorito</h3>
            <p className="preference-desc">
              {favoriteColor
                ? `Basado en tu preferencia por ${favoriteColor}, te mostramos prendas que incluyen o combinan bien con ese color.`
                : 'No definiste un color favorito. Aquí algunas sugerencias versátiles.'}
            </p>
            <div className="products-grid">
              {colorSamples.slice(0, 6).map((p) => (
                <div key={p.id} className="product-card" onClick={() => navigate(`/producto/${p.id}`)}>
                  <div className="product-img">{p.imagen ? <img src={p.imagen} alt={p.nombre} /> : <div className="product-img-placeholder">Sin imagen</div>}</div>
                  <div className="product-info">
                    <p className="product-name">{p.nombre}</p>
                    <p className="product-price">{p.precio ? `$${p.precio.toLocaleString()}` : 'Precio no disponible'}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="hint">Sugerencia: combina estas prendas con accesorios neutros para equilibrar el conjunto.</p>
          </section>

          <section className="preference-block">
            <h3 className="preference-title">Según tu estilo</h3>
            <p className="preference-desc">
              {favoriteStyles.length > 0
                ? `Tus estilos: ${favoriteStyles.join(', ')}. Aquí algunas ideas prácticas adaptadas a esos estilos.`
                : 'No hay estilos guardados. ¿Prefieres looks casuales, elegantes o urbanos?'}
            </p>
            <ul className="preference-list">
              <li><strong>Casual:</strong> camisetas de algodón, jeans cómodos y zapatillas.</li>
              <li><strong>Elegante:</strong> vestidos midi, blazers entallados y zapatos de carácter.</li>
              <li><strong>Urbano / Streetwear:</strong> cortes oversize, sudaderas y calzado moderno.</li>
              <li><strong>Deportivo:</strong> prendas técnicas, leggings y zapatillas funcionales.</li>
            </ul>
          </section>

          <section className="preference-block">
            <h3 className="preference-title">Según ocasión y clima</h3>
            <p className="preference-desc">Recomendaciones prácticas según contexto y temperatura.</p>
            <ul className="preference-list">
              <li><strong>Día caluroso:</strong> tejidos ligeros y paleta clara.</li>
              <li><strong>Día frío:</strong> capas, chaquetas y tejidos que retienen el calor.</li>
              <li><strong>Evento / Fiesta:</strong> piezas con presencia y cortes cuidados.</li>
              <li><strong>Universidad / Trabajo:</strong> looks cómodos y presentables.</li>
            </ul>
          </section>

          <section className="preference-block">
            <h3 className="preference-title">Reglas y recomendaciones</h3>
            <ul className="preference-list">
              <li>Personalizamos según tus datos: color, estilo, tallas y medidas.</li>
              <li>No repetimos las mismas prendas en exceso.</li>
              <li>Lenguaje claro y sugerencias prácticas, sin propuestas irreales.</li>
              <li>Si faltan datos asumimos preferencias neutras; actualiza tus preferencias para mejorar los resultados.</li>
            </ul>
          </section>

          <section className="preference-block">
            <h3 className="preference-title">Productos sugeridos</h3>
            <div className="products-grid">
              {(recs.length ? recs : PRODUCTOS.slice(0, 8).map((p) => ({
                id: p.id,
                nombre: p.nombre,
                precio: p.precio || null,
                imagen: p.imagen || null,
                recommendationReason: p.recommendationReason || '',
              })) ).map((p) => (
                <div key={p.id} className="product-card" onClick={() => navigate(`/producto/${p.id}`)}>
                  <div className="product-img">{p.imagen ? <img src={p.imagen} alt={p.nombre} /> : <div className="product-img-placeholder">Sin imagen</div>}</div>
                  <div className="product-info">
                    <p className="product-name">{p.nombre}</p>
                    <p className="product-price">{p.precio ? `$${p.precio.toLocaleString()}` : 'Precio no disponible'}</p>
                    {p.recommendationReason ? (
                      <p className="recommendation-reason">{formatRecommendationReason(p.recommendationReason)}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
