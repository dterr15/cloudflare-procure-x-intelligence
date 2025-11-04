export function PrivacyPolicyContent() {
  return (
    <div className="terms-modal-content">
      <div className="terms-header-notice">
        <strong>POLÍTICA DE PRIVACIDAD DE DATOS</strong>
        <p className="legal-reference">(Ley N° 19.628)</p>
        <p>Compro Chile SpA (SYGNODE)</p>
      </div>

      <h3>1. Identificación del Responsable del Banco de Datos</h3>
      <p>
        <strong>Compro Chile SpA</strong>, Rol Único Tributario (RUT) 77.758.232-1, 
        con domicilio legal en Jorge Montt 934, comuna de Santiago (en adelante, 
        "El Responsable" o "SYGNODE"), es la persona jurídica responsable de 
        administrar y decidir sobre el tratamiento de los datos personales contenidos 
        en sus bancos o registros de datos, de conformidad con la Ley N° 19.628 
        sobre Protección de la Vida Privada.
      </p>

      <h3>2. Ámbito de Aplicación y Datos Recolectados</h3>
      <p>
        Esta política rige el tratamiento de datos personales de las Personas Naturales 
        (ej. representantes legales, administradores de cuenta, usuarios) que actúan 
        en nombre y representación de la persona jurídica (el "Cliente") que contrata 
        el Servicio de Inteligencia de Adquisiciones.
      </p>

      <h4>Datos Recolectados</h4>
      <p>SYGNODE recolectará los siguientes datos de carácter personal y corporativo:</p>
      <ul>
        <li>
          <strong>Datos de Identificación y Contacto (Persona Natural):</strong> 
          Nombre completo, Cargo, correo electrónico, teléfono y Rol Único Tributario 
          (RUT) del representante legal o usuario de la plataforma.
        </li>
        <li>
          <strong>Datos de la Empresa Cliente (Persona Jurídica):</strong> 
          Razón social y RUT de la empresa.
        </li>
      </ul>

      <div className="important-notice">
        <strong>Aclaración Legal (Ley N° 19.628):</strong>
        <p>
          Se deja expresa constancia que, de conformidad con la Ley N° 19.628, 
          el RUT de la Persona Jurídica y su Razón Social no son considerados 
          legalmente "datos personales". No obstante, SYGNODE les aplicará de 
          manera voluntaria las mismas medidas de seguridad y confidencialidad 
          de grado bancario que a los datos personales, debido al carácter sensible 
          de la información comercial asociada.
        </p>
      </div>

      <h3>3. Principio de Finalidad y Bases de Legitimidad (Art. 4° y 5° LPP)</h3>
      <p>
        El tratamiento de los datos se realiza en base a las siguientes finalidades, 
        que son explícitas, legítimas y se rigen por el Principio de Finalidad.
      </p>

      <div className="table-container">
        <table className="legal-table">
          <thead>
            <tr>
              <th>Finalidad del Tratamiento</th>
              <th>Base Legal y Justificación</th>
              <th>Requisito de Consentimiento</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>3.1. Gestión Contractual Esencial</strong>
              </td>
              <td>
                Ejecución del Contrato Marco y T&C (Art. 4° Inc. 1 LPP). 
                Incluye facturación, cobro, gestión de cuenta y comunicaciones esenciales.
              </td>
              <td>
                Aceptación General de T&C.
              </td>
            </tr>
            <tr>
              <td>
                <strong>3.2. Solicitud de Cotizaciones a Terceros</strong>
              </td>
              <td>
                Función esencial del servicio: Obtención de precios y gestión de 
                inteligencia de adquisiciones (Art. 5° LPP).
              </td>
              <td>
                <strong>Autorización Expresa y Específica del Cliente</strong> 
                (Mediante Checkbox Separado).
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="authorization-notice">
        <h4>Blindaje del RUT: Autorización Expresa y Disociada</h4>
        <p>
          El Cliente, mediante la aceptación de los T&C y el marcado de la casilla 
          específica en el proceso de contratación, otorga su <strong>Autorización 
          Expresa y Específica</strong> para que SYGNODE utilice el RUT de la Empresa 
          y el nombre del contacto exclusivamente para solicitar, gestionar y obtener 
          cotizaciones de terceros proveedores en el mercado.
        </p>
      </div>

      <h3>4. Uso de Datos para Inteligencia de Adquisiciones (Big Data)</h3>
      <p>
        SYGNODE declara que, con la finalidad de realizar análisis estadísticos, 
        inteligencia de mercado y optimización de su servicio, se utilizarán los 
        datos de las compras/adquisiciones gestionadas. SYGNODE garantiza que el 
        proceso de análisis se realiza mediante la <strong>disociación o anonimización 
        de la información sensible</strong>, asegurando que el tratamiento es meramente 
        estadístico y agregado, y no permite la identificación directa de la Persona 
        Natural o Jurídica en los resultados de inteligencia de mercado.
      </p>

      <h3>5. Transferencia y Cesión de Datos (Art. 9° y 11° LPP)</h3>
      <p>
        SYGNODE transferirá o comunicará los datos personales a los siguientes 
        terceros para el cumplimiento de las finalidades descritas, bajo el estricto 
        control y limitación de uso:
      </p>

      <div className="table-container">
        <table className="legal-table">
          <thead>
            <tr>
              <th>Categoría de Tercero</th>
              <th>Finalidad de la Cesión</th>
              <th>Resguardo Legal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong>Proveedores de Adquisición</strong>
              </td>
              <td>
                Solicitud y obtención de cotizaciones.
              </td>
              <td>
                Su uso está limitado por el Aviso de Privacidad (ver más abajo).
              </td>
            </tr>
            <tr>
              <td>
                <strong>Plataformas de Hosting / TI</strong>
              </td>
              <td>
                Alojamiento y operatividad de la plataforma.
              </td>
              <td>
                SYGNODE exige el cumplimiento de medidas de seguridad de grado bancario.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Procesadores de Pago</strong>
              </td>
              <td>
                Facturación y cobro del servicio.
              </td>
              <td>
                Solo se ceden los datos necesarios para procesar el pago.
              </td>
            </tr>
            <tr>
              <td>
                <strong>Plataformas de Email Marketing</strong>
              </td>
              <td>
                Envío de comunicaciones esenciales relativas al servicio 
                (facturación, avisos de interrupción, confirmación de OC).
              </td>
              <td>
                El uso para fines comerciales no esenciales requiere un 
                consentimiento específico.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="critical-clause">
        <h4>Obligación de Terceros (Art. 9°)</h4>
        <p>
          SYGNODE se compromete a incorporar en toda comunicación con los Proveedores 
          de Adquisición (terceros cotizados) un <strong>Aviso de Privacidad</strong> que 
          los obliga a no utilizar, almacenar ni procesar el RUT u otros datos de la 
          empresa para ninguna finalidad distinta a la elaboración y envío de la 
          cotización solicitada.
        </p>
      </div>

      <div className="important-notice">
        <strong>Cumplimiento LPDC (Art. 28 B):</strong>
        <p>
          Las comunicaciones de Email Marketing se limitarán a las comunicaciones 
          esenciales de la prestación del servicio. Para el envío de ofertas, 
          promociones o newsletters (comunicaciones comerciales no esenciales), 
          se solicitará un consentimiento expreso y Opt-in separado al Cliente.
        </p>
      </div>

      <h3>6. Deber de Secreto y Medidas de Seguridad (Art. 7° LPP)</h3>
      
      <h4>Medidas Técnicas</h4>
      <p>
        SYGNODE implementa medidas de seguridad técnicas de grado bancario, incluyendo:
      </p>
      <ul>
        <li>Encriptación de datos sensibles</li>
        <li>Certificados SSL/TLS</li>
        <li>Firewalls avanzados</li>
        <li>Riguroso control de acceso a la base de datos</li>
      </ul>

      <h4>Deber de Secreto del Personal</h4>
      <p>
        SYGNODE formaliza el Deber de Secreto (Art. 7° LPP), obligando a su personal 
        con acceso a los datos del Cliente mediante:
      </p>
      <ul>
        <li>
          Una <strong>Cláusula Expresa en los Contratos de Trabajo</strong>.
        </li>
        <li>
          La firma de un <strong>Acta de Compromiso de Confidencialidad (NDA)</strong> que 
          establece las sanciones por incumplimiento y mantiene la obligación de 
          secreto incluso después de finalizada la relación laboral.
        </li>
      </ul>

      <h3>7. Ejercicio de los Derechos ARCO (Art. 12° LPP)</h3>
      <p>
        El Cliente o el titular de los datos personales tiene el derecho a solicitar 
        <strong>Acceso, Rectificación, Cancelación u Oposición (Derechos ARCO)</strong> al 
        tratamiento de sus datos.
      </p>

      <div className="authorization-notice">
        <h4>Mecanismo Expedito</h4>
        <p>
          El ejercicio de los Derechos ARCO deberá realizarse mediante el envío 
          de un correo electrónico a la casilla:
        </p>
        <p className="contact-highlight">
          <a href="mailto:operaciones@procure-x.cl">operaciones@procure-x.cl</a>
        </p>
        <p>
          <strong>Plazo de Respuesta:</strong> SYGNODE se compromete a responder 
          y gestionar la solicitud en un plazo máximo de <strong>10 días hábiles</strong> desde 
          la recepción de la misma, o en el plazo máximo que establezca la 
          legislación chilena vigente.
        </p>
      </div>

      <h3>8. Modificaciones</h3>
      <p>
        SYGNODE se reserva el derecho de modificar esta Política de Privacidad, 
        debiendo notificar al Cliente por correo electrónico con al menos 
        <strong> treinta (30) días de anticipación</strong> a la entrada en vigencia 
        de las nuevas condiciones. Si el Cliente considera que la modificación le 
        es perjudicial, podrá poner término al Contrato Marco sin penalización, 
        conforme a los T&C.
      </p>

      <div className="terms-footer">
        <p>
          <strong>Información de Contacto:</strong>
        </p>
        <ul>
          <li>
            <strong>Email para ejercicio de Derechos ARCO:</strong>{" "}
            <a href="mailto:operaciones@procure-x.cl">operaciones@procure-x.cl</a>
          </li>
          <li>
            <strong>Email general:</strong>{" "}
            <a href="mailto:px@procure-x.cl">px@procure-x.cl</a>
          </li>
          <li><strong>RUT:</strong> 77.758.232-1</li>
          <li><strong>Dirección:</strong> Jorge Montt 934, Santiago</li>
          <li><strong>Plazo de respuesta ARCO:</strong> 10 días hábiles</li>
        </ul>
      </div>

      <p className="terms-last-updated">
        <strong>Fecha de Publicación:</strong> {new Date().toLocaleDateString("es-CL")}
        <br />
        <strong>Marco Legal:</strong> Ley N° 19.628 sobre Protección de la Vida 
        Privada (Protección de Datos Personales)
        <br />
        <strong>Responsable:</strong> Compro Chile SpA (SYGNODE)
      </p>
    </div>
  );
}
