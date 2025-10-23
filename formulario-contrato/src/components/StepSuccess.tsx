interface StepSuccessProps {
  contractId?: string;
}

export function StepSuccess({ contractId }: StepSuccessProps) {
  return (
    <div className="success-container">
      <div className="success-icon">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="40" cy="40" r="40" fill="#10b981" />
          <path
            d="M25 40L35 50L55 30"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h2 className="success-title">¡Formulario Enviado Exitosamente!</h2>
      
      <p className="success-description">
        Hemos recibido tu información para la generación del contrato. En breve
        nos contactaremos contigo para continuar con el proceso.
      </p>

      {contractId && (
        <div className="success-info">
          <div className="info-label">Número de Solicitud:</div>
          <div className="info-value">{contractId}</div>
          <p className="info-help">
            Guarda este número para futuras referencias
          </p>
        </div>
      )}

      <div className="success-steps">
        <h3>Próximos Pasos:</h3>
        <ol>
          <li>
            <strong>Verificación de Información</strong>
            <p>Revisaremos los datos proporcionados en un plazo de 24-48 horas.</p>
          </li>
          <li>
            <strong>Generación del Contrato</strong>
            <p>Prepararemos el documento según la información entregada.</p>
          </li>
          <li>
            <strong>Envío para Revisión</strong>
            <p>Te enviaremos el contrato por email para tu revisión y firma.</p>
          </li>
          <li>
            <strong>Firma y Activación</strong>
            <p>Una vez firmado, el contrato entrará en vigencia.</p>
          </li>
        </ol>
      </div>

      <div className="success-actions">
        <a href="https://procure-x.cl" className="btn btn-primary">
          Volver al Inicio
        </a>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => window.print()}
        >
          Imprimir Confirmación
        </button>
      </div>

      <div className="success-contact">
        <p>
          <strong>¿Necesitas ayuda?</strong>
        </p>
        <p>
          Contáctanos en{" "}
          <a href="mailto:contratos@procure-x.cl">contratos@procure-x.cl</a>
          {" "}o al{" "}
          <a href="tel:+56223456789">+56 2 2345 6789</a>
        </p>
      </div>
    </div>
  );

}
