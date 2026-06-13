package com.modaai.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.modaai.backend.dto.LegalResponse;
import com.modaai.backend.dto.LegalSection;

@RestController
@RequestMapping("/api/legal")
public class LegalController {

    @GetMapping("/{topic}")
    public LegalResponse getLegalContent(@PathVariable String topic) {
        LegalResponse response = new LegalResponse();

        return switch (topic) {
            case "terminos" -> {
                response.setTitle("Términos de Uso");
                response.setSections(List.of(
                        new LegalSection("introduccion", "Introducción", List.of(
                                "Los presentes Términos de Uso regulan el acceso y utilización de la plataforma de comercio electrónico especializada en la venta de ropa y recomendaciones personalizadas mediante inteligencia artificial.",
                                "Al registrarse y utilizar la plataforma, el usuario acepta cumplir con las condiciones aquí establecidas."
                        )),
                        new LegalSection("alcance", "Alcance de la plataforma", List.of(
                                "La plataforma tiene como finalidad ofrecer una experiencia de compra personalizada mediante la visualización de productos, recomendaciones inteligentes, gestión de pedidos y acceso a diferentes servicios relacionados con la moda.",
                                "El usuario se compromete a proporcionar información veraz, actualizada y completa durante el proceso de registro y uso del sistema."
                        )),
                        new LegalSection("credenciales", "Confidencialidad de credenciales", List.of(
                                "Cada usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.",
                                "La plataforma no se hace responsable por actividades realizadas desde una cuenta cuando el usuario haya compartido voluntariamente sus datos de acceso con terceros."
                        )),
                        new LegalSection("uso-responsable", "Uso responsable", List.of(
                                "Los usuarios se comprometen a utilizar la plataforma de manera legal, ética y respetuosa, absteniéndose de realizar actividades que puedan afectar el funcionamiento del sistema, comprometer la seguridad de la información o perjudicar a otros usuarios.",
                                "Queda prohibido el uso de herramientas automatizadas, la manipulación de información, la creación de cuentas falsas o cualquier acción destinada a alterar el funcionamiento normal de la plataforma."
                        )),
                        new LegalSection("disponibilidad", "Disponibilidad y modificaciones", List.of(
                                "La disponibilidad de productos, precios, promociones y servicios podrá modificarse en cualquier momento sin previo aviso.",
                                "Asimismo, la plataforma se reserva el derecho de suspender o cancelar cuentas que incumplan las disposiciones establecidas en estos términos."
                        )),
                        new LegalSection("actualizaciones", "Actualizaciones de los términos", List.of(
                                "La plataforma podrá actualizar periódicamente estos términos para adaptarse a cambios tecnológicos, normativos o funcionales.",
                                "El uso continuo del sistema después de dichas modificaciones implicará la aceptación de las nuevas condiciones."
                        ))
                ));
                yield response;
            }
            case "privacidad" -> {
                response.setTitle("Política de Privacidad");
                response.setSections(List.of(
                        new LegalSection("introduccion", "Introducción", List.of(
                                "La privacidad de nuestros usuarios es una prioridad.",
                                "Esta Política de Privacidad describe cómo recopilamos, utilizamos, almacenamos y protegemos la información proporcionada por quienes utilizan nuestra plataforma."
                        )),
                        new LegalSection("informacion", "Información recopilada", List.of(
                                "Durante el proceso de registro y uso del sistema, podremos recopilar información personal como nombre, dirección de correo electrónico, preferencias de estilo, historial de compras, productos favoritos, medidas corporales y demás datos necesarios para mejorar la experiencia de compra y el funcionamiento de las recomendaciones inteligentes."
                        )),
                        new LegalSection("uso", "Uso de la información", List.of(
                                "La información recopilada será utilizada para personalizar la experiencia del usuario, generar recomendaciones de productos más precisas, procesar pedidos, brindar soporte técnico, mejorar nuestros servicios y realizar análisis estadísticos internos que permitan optimizar el rendimiento de la plataforma."
                        )),
                        new LegalSection("proteccion", "Protección de la información", List.of(
                                "La plataforma implementará medidas técnicas y organizativas destinadas a proteger la información contra accesos no autorizados, pérdida, alteración, divulgación o destrucción.",
                                "Sin embargo, aunque se adoptan altos estándares de seguridad, ningún sistema informático puede garantizar una protección absoluta frente a todos los riesgos existentes en internet."
                        )),
                        new LegalSection("no-venta", "No venta de datos", List.of(
                                "La información personal no será vendida ni comercializada con terceros.",
                                "Únicamente podrá ser compartida cuando sea necesario para procesar pagos, realizar entregas, cumplir obligaciones legales o cuando exista autorización expresa por parte del usuario."
                        )),
                        new LegalSection("derechos", "Derechos del usuario", List.of(
                                "Los usuarios podrán solicitar en cualquier momento el acceso, actualización, corrección o eliminación de sus datos personales mediante los canales de atención establecidos por la plataforma.",
                                "Asimismo, podrán retirar su consentimiento para el tratamiento de información personal cuando así lo consideren pertinente, siempre que ello no afecte obligaciones legales o contractuales previamente adquiridas."
                        )),
                        new LegalSection("aceptacion", "Aceptación", List.of(
                                "El uso de la plataforma implica la aceptación de esta Política de Privacidad y de las prácticas aquí descritas."
                        ))
                ));
                yield response;
            }
            case "datos-personales" -> {
                response.setTitle("Política de Tratamiento de Datos Personales");
                response.setSections(List.of(
                        new LegalSection("introduccion", "Introducción", List.of(
                                "La presente Política de Tratamiento de Datos Personales tiene como finalidad informar a los usuarios sobre la forma en que se recopilan, almacenan, utilizan y protegen sus datos dentro de la plataforma."
                        )),
                        new LegalSection("datos-recolectados", "Datos recolectados", List.of(
                                "Los datos personales recolectados incluyen información de identificación, datos de contacto, preferencias de compra, historial de navegación dentro de la plataforma, productos consultados, historial de pedidos y características físicas proporcionadas voluntariamente por el usuario para mejorar la precisión de las recomendaciones personalizadas."
                        )),
                        new LegalSection("finalidad", "Finalidad", List.of(
                                "La recolección de esta información tiene como propósito principal ofrecer una experiencia de compra más eficiente y personalizada, permitiendo que los algoritmos de inteligencia artificial identifiquen productos acordes con los gustos, necesidades y características de cada cliente."
                        )),
                        new LegalSection("seguridad", "Seguridad y almacenamiento", List.of(
                                "Los datos serán almacenados en sistemas protegidos mediante mecanismos de seguridad informática que buscan preservar su confidencialidad, integridad y disponibilidad.",
                                "El acceso a la información estará restringido únicamente al personal autorizado y a los servicios tecnológicos necesarios para el correcto funcionamiento de la plataforma."
                        )),
                        new LegalSection("derechos", "Derechos de los titulares", List.of(
                                "Los titulares de los datos personales tendrán derecho a conocer, actualizar, rectificar y solicitar la eliminación de su información.",
                                "También podrán solicitar información sobre el uso dado a sus datos y presentar consultas o reclamaciones relacionadas con su tratamiento."
                        )),
                        new LegalSection("conservacion", "Conservación de datos", List.of(
                                "La plataforma conservará los datos únicamente durante el tiempo necesario para cumplir las finalidades para las cuales fueron recopilados o mientras exista una relación activa con el usuario.",
                                "Una vez finalizada dicha relación y cumplidas las obligaciones legales correspondientes, la información podrá ser eliminada o anonimizada."
                        )),
                        new LegalSection("consentimiento", "Consentimiento", List.of(
                                "Mediante el registro y uso de la plataforma, el usuario manifiesta su consentimiento libre, previo, expreso e informado para el tratamiento de sus datos personales de acuerdo con las condiciones establecidas en esta política."
                        )),
                        new LegalSection("normativa", "Normativa vigente", List.of(
                                "Finalmente, la plataforma se compromete a cumplir con la normativa vigente en materia de protección de datos personales, garantizando transparencia, responsabilidad y respeto por los derechos de los usuarios en todo momento."
                        ))
                ));
                yield response;
            }
            default ->
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Página legal no encontrada");
        };
    }
}
