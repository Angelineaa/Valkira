import { Link } from 'react-router-dom';
import '../styles/valkira-footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="vk-footer">
      <div className="footer-grid">
        <div>
          <p className="footer-brand">VALKI<span>R</span>A</p>
          <p className="footer-tagline">Moda femenina con identidad propia.<br />Cartagena, Colombia.</p>
        </div>
        <div className="footer-col">
          <h4>Tienda</h4>
          <ul>
            <li><a href="/catalogo">Catálogo</a></li>
            <li><a href="#">Descuentos</a></li>
            <li><a href="#">Colecciones</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Ayuda</h4>
          <ul>
            <li><a href="/help/faqs">Preguntas frecuentes</a></li>
            <li><a href="/help/envios">Envíos</a></li>
            <li><a href="/help/devoluciones">Devoluciones</a></li>
            <li><a href="/contact">Contacto</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/legal/terminos">Términos de uso</Link></li>
            <li><Link to="/legal/privacidad">Privacidad</Link></li>
            <li><Link to="/legal/datos-personales">Datos personales</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {currentYear} VALKIRA. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
