import { useState, useEffect } from 'react';
import { API_BASE } from '../services/api';
import '../styles/valkira-help.css';

export default function FAQs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/help/faqs`);
        if (!response.ok) throw new Error('Error fetching FAQs');
        const data = await response.json();
        setFaqs(data);
      } catch (error) {
        console.error('Error:', error);
        // Fallback data
        setFaqs([
          {
            id: 1,
            question: '¿Cómo hago una compra?',
            answer: 'Navega al catálogo, selecciona los productos que desees, agrégalos al carrito y procede al checkout. Deberás ingresar tu dirección de envío y método de pago.'
          },
          {
            id: 2,
            question: '¿Puedo cambiar mi pedido después de realizarlo?',
            answer: 'Si el pedido aún no ha sido procesado, puedes contactarnos dentro de 1 hora de haberlo realizado. Por favor, envía un correo a support@valkira.com con tu número de pedido.'
          },
          {
            id: 3,
            question: '¿Cuál es el tiempo de envío?',
            answer: 'Los tiempos de envío varían según tu ubicación. Generalmente, los pedidos se entregan entre 3 a 7 días hábiles después de realizado el pago.'
          },
          {
            id: 4,
            question: '¿Cómo sé si mi pedido fue confirmado?',
            answer: 'Recibirás un correo de confirmación inmediatamente después de completar tu compra. Puedes consultar el estado de tu pedido en tu perfil.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return <div className="vk-help-page"><p>Cargando preguntas frecuentes...</p></div>;
  }

  return (
    <div className="vk-help-page">
      <section className="vk-help-hero">
        <h1>Preguntas Frecuentes</h1>
        <p>Encuentra respuestas a las preguntas más comunes sobre nuestro servicio.</p>
      </section>

      <section className="vk-help-content">
        <div className="faq-list">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`faq-item ${expandedId === faq.id ? 'expanded' : ''}`}
              onClick={() => toggleExpanded(faq.id)}
            >
              <div className="faq-question">
                <h3>{faq.question}</h3>
                <span className="faq-toggle">{expandedId === faq.id ? '−' : '+'}</span>
              </div>
              {expandedId === faq.id && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
