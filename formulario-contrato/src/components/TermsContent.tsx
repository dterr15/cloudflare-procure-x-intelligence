export function TermsContent() {
  return (
    <div className="terms-modal-content">
      <h3>1. Aceptación de los Términos</h3>
      <p>
        Al acceder y utilizar este servicio, usted acepta estar sujeto a estos
        términos y condiciones de uso, todas las leyes y regulaciones aplicables,
        y acepta que es responsable del cumplimiento de las leyes locales aplicables.
      </p>

      <h3>2. Uso del Servicio</h3>
      <p>
        Este servicio está destinado únicamente para uso comercial legítimo. Usted
        se compromete a no utilizar el servicio para:
      </p>
      <ul>
        <li>Actividades ilegales o fraudulentas</li>
        <li>Violación de derechos de propiedad intelectual</li>
        <li>Transmisión de contenido malicioso o dañino</li>
        <li>Intentos de acceso no autorizado a sistemas</li>
      </ul>

      <h3>3. Información del Usuario</h3>
      <p>
        Usted es responsable de mantener la confidencialidad de su información
        de cuenta y contraseña. Debe notificarnos inmediatamente sobre cualquier
        uso no autorizado de su cuenta.
      </p>

      <h3>4. Obligaciones del Cliente</h3>
      <ul>
        <li>Proporcionar información veraz y actualizada</li>
        <li>Cumplir con los plazos de pago establecidos</li>
        <li>Mantener la confidencialidad de credenciales de acceso</li>
        <li>Notificar cualquier cambio en la información proporcionada</li>
      </ul>

      <h3>5. Propiedad Intelectual</h3>
      <p>
        Todo el contenido, marcas comerciales, y otros materiales en este servicio
        son propiedad de Procure-X o sus licenciantes. No se otorga ningún derecho
        de propiedad intelectual excepto el derecho limitado de usar el servicio.
      </p>

      <h3>6. Limitación de Responsabilidad</h3>
      <p>
        En ningún caso Procure-X será responsable por daños indirectos,
        incidentales, especiales, consecuentes o punitivos, incluyendo sin
        limitación, pérdida de beneficios, datos, uso, fondo de comercio, u otras
        pérdidas intangibles.
      </p>

      <h3>7. Modificaciones</h3>
      <p>
        Nos reservamos el derecho de modificar estos términos en cualquier momento.
        Las modificaciones entrarán en vigencia inmediatamente después de su
        publicación en el sitio web. Su uso continuado del servicio después de
        dichos cambios constituirá su aceptación de las nuevas condiciones.
      </p>

      <h3>8. Terminación del Servicio</h3>
      <p>
        Nos reservamos el derecho de terminar o suspender su acceso al servicio
        inmediatamente, sin previo aviso o responsabilidad, por cualquier motivo,
        incluyendo sin limitación si usted incumple estos Términos.
      </p>

      <h3>9. Ley Aplicable</h3>
      <p>
        Estos términos se regirán e interpretarán de acuerdo con las leyes de Chile.
        Cualquier disputa relacionada con estos términos estará sujeta a la
        jurisdicción exclusiva de los tribunales de Santiago, Chile.
      </p>

      <h3>10. Divisibilidad</h3>
      <p>
        Si cualquier disposición de estos términos se considera inválida o
        inaplicable por un tribunal competente, las disposiciones restantes
        continuarán en pleno vigor y efecto.
      </p>

      <h3>11. Contacto</h3>
      <p>
        Para preguntas sobre estos términos, contáctenos en:{" "}
        <a href="mailto:legal@procure-x.cl">legal@procure-x.cl</a>
      </p>

      <p className="terms-last-updated">
        <strong>Última actualización:</strong> {new Date().toLocaleDateString("es-CL")}
      </p>
    </div>
  );
}
