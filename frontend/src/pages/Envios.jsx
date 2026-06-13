import { useState, useEffect } from 'react';
import { API_BASE } from '../services/api';
import '../styles/valkira-help.css';

export default function Envios() {
  const [envios, setEnvios] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnvios = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/help/envios`);
        if (!response.ok) throw new Error('Error fetching envios');
        const data = await response.json();
        setEnvios(data);
      } catch (error) {
        console.error('Error:', error);
        // Fallback data
        setEnvios({
          title: 'Información de Envíos',
          introduction: 'Conoce nuestras opciones y políticas de envío.',
          sections: [
            {
              title: 'Tiempos de Entrega',
              content: 'Los pedidos se procesan en 1-2 días hábiles. El envío toma entre 3-7 días hábiles según tu ubicación.'
            },
            {
              title: 'Opciones de Envío',
              content: 'Ofrecemos envío estándar gratuito para compras mayores a $150.000 COP. También disponible envío express con costo adicional.'
            },
            {
              title: 'Rastreo',
              content: 'Recibirás un número de seguimiento por correo. Puedes rastrear tu paquete en el sitio del transportista.'
            },
            {
              title: 'Cobertura',
              content: 'Realizamos envíos a todo Colombia. Para envíos internacionales, contáctanos directamente.'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEnvios();
  }, []);

  if (loading) {
    return <div className="vk-help-page"><p>Cargando información de envíos...</p></div>;
  }

  return (
    <div className="vk-help-page">
      <section className="vk-help-hero">
        <h1>{envios?.title || 'Envíos'}</h1>
        <p>{envios?.introduction}</p>
      </section>

      <section className="vk-help-content">
        <div className="help-sections">
          {envios?.sections.map((section, idx) => (
            <article key={idx} className="help-card">
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
