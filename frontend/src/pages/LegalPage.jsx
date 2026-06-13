import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE } from '../services/api';
import '../styles/valkira-legal.css';

const TOPIC_LABELS = {
  terminos: 'Términos de uso',
  privacidad: 'Privacidad',
  'datos-personales': 'Datos personales',
};

export default function LegalPage() {
  const { topic } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const legalFallback = {
      terminos: {
        title: 'Términos de uso',
        sections: [
          {
            id: 'introduccion',
            title: 'Introducción',
            paragraphs: [
              'Los presentes Términos de Uso regulan el acceso y utilización de la plataforma de comercio electrónico especializada en la venta de ropa y recomendaciones personalizadas mediante inteligencia artificial.',
              'Al registrarse y utilizar la plataforma, el usuario acepta cumplir con las condiciones aquí establecidas.'
            ]
          },
          {
            id: 'alcance',
            title: 'Alcance de la plataforma',
            paragraphs: [
              'La plataforma tiene como finalidad ofrecer una experiencia de compra personalizada mediante la visualización de productos, recomendaciones inteligentes, gestión de pedidos y acceso a diferentes servicios relacionados con la moda.',
              'El usuario se compromete a proporcionar información veraz, actualizada y completa durante el proceso de registro y uso del sistema.'
            ]
          },
          {
            id: 'uso-responsable',
            title: 'Uso responsable',
            paragraphs: [
              'Los usuarios se comprometen a utilizar la plataforma de manera legal, ética y respetuosa, absteniéndose de realizar actividades que puedan afectar el funcionamiento del sistema, comprometer la seguridad de la información o perjudicar a otros usuarios.',
              'Queda prohibido el uso de herramientas automatizadas, la manipulación de información, la creación de cuentas falsas o cualquier acción destinada a alterar el funcionamiento normal de la plataforma.'
            ]
          }
        ]
      },
      privacidad: {
        title: 'Política de privacidad',
        sections: [
          {
            id: 'introduccion',
            title: 'Introducción',
            paragraphs: [
              'La privacidad de nuestros usuarios es una prioridad.',
              'Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información proporcionada por quienes utilizan nuestra plataforma.'
            ]
          },
          {
            id: 'informacion',
            title: 'Información recopilada',
            paragraphs: [
              'Durante el proceso de registro y uso del sistema, podremos recopilar información personal como nombre, dirección de correo electrónico, preferencias de estilo, historial de compras, productos favoritos, medidas corporales y demás datos necesarios para mejorar la experiencia de compra y el funcionamiento de las recomendaciones inteligentes.'
            ]
          },
          {
            id: 'derechos',
            title: 'Derechos del usuario',
            paragraphs: [
              'Los usuarios podrán solicitar en cualquier momento el acceso, actualización, corrección o eliminación de sus datos personales mediante los canales de atención establecidos por la plataforma.',
              'Asimismo, podrán retirar su consentimiento para el tratamiento de información personal cuando así lo consideren pertinente, siempre que ello no afecte obligaciones legales o contractuales previamente adquiridas.'
            ]
          }
        ]
      },
      'datos-personales': {
        title: 'Datos personales',
        sections: [
          {
            id: 'introduccion',
            title: 'Introducción',
            paragraphs: [
              'La presente Política de Tratamiento de Datos Personales tiene como finalidad informar a los usuarios sobre la forma en que se recopilan, almacenan, utilizan y protegen sus datos dentro de la plataforma.'
            ]
          },
          {
            id: 'finalidad',
            title: 'Finalidad',
            paragraphs: [
              'La recolección de esta información tiene como propósito principal ofrecer una experiencia de compra más eficiente y personalizada, permitiendo que los algoritmos de inteligencia artificial identifiquen productos acordes con los gustos, necesidades y características de cada cliente.'
            ]
          },
          {
            id: 'derechos',
            title: 'Derechos de los titulares',
            paragraphs: [
              'Los titulares de los datos personales tendrán derecho a conocer, actualizar, rectificar y solicitar la eliminación de su información.',
              'También podrán solicitar información sobre el uso dado a sus datos y presentar consultas o reclamaciones relacionadas con su tratamiento.'
            ]
          }
        ]
      }
    };

    async function loadContent() {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${API_BASE}/api/legal/${topic}`);
        if (!response.ok) {
          throw new Error('No se pudo cargar el contenido legal.');
        }
        const data = await response.json();
        setContent(data);
      } catch (err) {
        const fallback = legalFallback[topic];
        if (fallback) {
          setContent(fallback);
          setError('');
        } else {
          setError(err.message || 'Error al cargar la página legal.');
          setContent(null);
        }
      } finally {
        setLoading(false);
      }
    }

    loadContent();
  }, [topic]);

  const title = TOPIC_LABELS[topic] || 'Legal';

  if (loading) {
    return (
      <div className="vk-legal-page">
        <div className="vk-legal-hero">
          <h1>{title}</h1>
          <p>Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vk-legal-page">
        <div className="vk-legal-hero">
          <h1>{title}</h1>
          <p className="vk-legal-error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="vk-legal-page">
      <section className="vk-legal-hero">
        <div className="vk-legal-hero-inner">
          <span className="vk-eyebrow">Legal</span>
          <h1>{content?.title || title}</h1>
          <p className="vk-subtitle">Consulta los documentos legales que regulan el uso de esta plataforma.</p>
        </div>
      </section>

      <section className="vk-legal-content">
        {content?.sections?.length > 0 && (
          <aside className="vk-legal-toc">
            <h2>Índice</h2>
            <ul>
              {content.sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`}>{section.title}</a>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {content?.sections?.length > 0 ? (
          content.sections.map((section) => (
            <article className="vk-legal-section" key={section.id} id={section.id}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>
          ))
        ) : (
          content?.paragraphs?.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))
        )}
      </section>
    </div>
  );
}
