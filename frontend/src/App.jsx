import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Preferences from './pages/Preferences';
import ForgotPassword from './pages/ForgotPassword';
import Catalogo from './pages/Catalogo';
import Producto from './pages/Producto';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Nosotros from './pages/Nosotros';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import FAQs from './pages/FAQs';
import Envios from './pages/Envios';
import Devoluciones from './pages/Devoluciones';
import Contact from './pages/Contact';
import LegalPage from './pages/LegalPage';
import './styles/global.css';
import './styles/valkira-global.css';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<Producto />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/help/faqs" element={<FAQs />} />
          <Route path="/help/envios" element={<Envios />} />
          <Route path="/help/devoluciones" element={<Devoluciones />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/legal/:topic" element={<LegalPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
