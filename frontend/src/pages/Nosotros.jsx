import '../styles/valkira-nosotros.css';

export default function Nosotros() {
  return (
    <div className="vk-nosotros-page">
      <section className="vk-nosotros-hero">
        <div className="vk-nosotros-hero-inner">
          <span className="vk-eyebrow">Nosotros</span>
          <h1>Moda inteligente con propósito.</h1>
          <p className="vk-subtitle">
            Conoce nuestra visión, misión y compromiso con la experiencia de compra personalizada.
          </p>
        </div>
      </section>

      <section className="vk-nosotros-grid">
        <article className="vk-nosotros-card">
          <h2>Misión</h2>
          <p>
            Nuestra misión es ofrecer una plataforma de comercio electrónico innovadora que facilite la compra de ropa mediante recomendaciones personalizadas basadas en inteligencia artificial.
            Buscamos brindar a los usuarios una experiencia de compra cómoda, segura y adaptada a sus gustos, preferencias y características personales, permitiéndoles encontrar prendas que reflejen su estilo de manera rápida y eficiente.
          </p>
        </article>

        <article className="vk-nosotros-card">
          <h2>Visión</h2>
          <p>
            Ser una plataforma líder en el sector de la moda digital, reconocida por el uso de tecnologías inteligentes que mejoran la experiencia de compra online.
            Aspiramos a convertirnos en una referencia en personalización dentro del comercio electrónico, ofreciendo soluciones innovadoras que fortalezcan la relación entre los usuarios y las tendencias de moda, tanto a nivel nacional como internacional.
          </p>
        </article>

        <article className="vk-nosotros-card">
          <h2>¿Quiénes Somos?</h2>
          <p>
            Somos un equipo de estudiantes de Ingeniería de Sistemas comprometidos con el desarrollo de soluciones tecnológicas innovadoras que respondan a las necesidades actuales de los consumidores digitales.
            Nuestro proyecto consiste en una plataforma de comercio electrónico enfocada en la venta de ropa, la cual integra herramientas de inteligencia artificial para ofrecer recomendaciones personalizadas basadas en los gustos, preferencias y características de cada usuario.
          </p>
          <p>
            Buscamos transformar la experiencia tradicional de compra online, facilitando la selección de prendas y ayudando a los usuarios a encontrar opciones que se ajusten mejor a su estilo personal.
            A través de la innovación, la tecnología y la orientación al cliente, pretendemos crear una plataforma moderna, eficiente y centrada en las necesidades de sus usuarios.
          </p>
        </article>

        <article className="vk-nosotros-card">
          <h2>Política de Protección de Datos</h2>
          <p>
            La plataforma se compromete a proteger la privacidad y seguridad de la información personal proporcionada por los usuarios.
            Los datos recopilados, tales como nombre, correo electrónico, preferencias de estilo, gustos personales y características físicas, serán utilizados exclusivamente para mejorar la experiencia de compra y ofrecer recomendaciones personalizadas dentro de la plataforma.
          </p>
          <p>
            La información almacenada será tratada de manera confidencial y no será compartida, vendida ni transferida a terceros sin la autorización previa del usuario, salvo en los casos exigidos por la ley.
            Asimismo, se implementarán medidas de seguridad que permitan proteger los datos contra accesos no autorizados, pérdida de información o uso indebido.
          </p>
          <p>
            Los usuarios tendrán derecho a consultar, actualizar o solicitar la eliminación de sus datos personales en cualquier momento, de acuerdo con las disposiciones legales vigentes sobre protección de datos personales.
            Mediante el uso de la plataforma, el usuario acepta el tratamiento de sus datos conforme a las condiciones establecidas en esta política.
          </p>
        </article>
      </section>
    </div>
  );
}
