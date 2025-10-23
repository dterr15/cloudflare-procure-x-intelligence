import React from "react";
import type { FullContractForm } from "@/types";
// ❌ La importación de 'formatCurrency' fue eliminada.

interface StepReviewProps {
  data: Partial<FullContractForm>;
  onEdit: (step: keyof FullContractForm) => void;
}

// ❌ Se eliminaron las funciones 'calculateEndDate' y 'formatAmount'

export function StepReview({ data, onEdit }: StepReviewProps) {
  const { personal, company, contract, terms } = data;

  return (
    <div className="form-step review-step">
      <h2 className="step-title">Revisión Final</h2>
      <p className="step-description">
        Por favor revisa toda la información antes de enviar. Puedes editar cualquier
        sección haciendo clic en el botón "Editar".
      </p>

      {/* Información Personal */}
      <div className="review-section">
        <div className="review-header">
          <h3>Información Personal</h3>
          <button
            type="button"
            className="btn-edit"
            onClick={() => onEdit("personal")}
          >
            Editar
          </button>
        </div>
        <div className="review-grid">
          <div className="review-item">
            <span className="review-label">Nombre completo:</span>
            <span className="review-value">
              {personal?.nombre} {personal?.apellido}
            </span>
          </div>
          <div className="review-item">
            <span className="review-label">RUT:</span>
            <span className="review-value">{personal?.rut}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Email:</span>
            <span className="review-value">{personal?.email}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Teléfono:</span>
            <span className="review-value">{personal?.telefono}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Dirección:</span>
            <span className="review-value">
              {personal?.direccion}, {personal?.ciudad}, {personal?.region}
            </span>
          </div>
        </div>
      </div>

      {/* Información de Empresa */}
      <div className="review-section">
        <div className="review-header">
          <h3>Información de la Empresa</h3>
          <button
            type="button"
            className="btn-edit"
            onClick={() => onEdit("company")}
          >
            Editar
          </button>
        </div>
        <div className="review-grid">
          <div className="review-item">
            <span className="review-label">Razón Social:</span>
            <span className="review-value">{company?.razonSocial}</span>
          </div>
          <div className="review-item">
            <span className="review-label">RUT Empresa:</span>
            <span className="review-value">{company?.rutEmpresa}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Giro:</span>
            <span className="review-value">{company?.giro}</span>
          </div>
          <div className="review-item">
            <span className="review-label">Dirección:</span>
            <span className="review-value">
              {company?.direccionEmpresa}, {company?.ciudadEmpresa}
            </span>
          </div>
          <div className="review-item">
            <span className="review-label">Representante Legal:</span>
            <span className="review-value">
              {company?.representanteLegal} ({company?.cargoRepresentante})
            </span>
          </div>
        </div>
      </div>

      {/* Información del Contrato (Bloque Limpiado) */}
      <div className="review-section">
        <div className="review-header">
          <h3>Información del Contrato</h3>
          <button
            type="button"
            className="btn-edit"
            onClick={() => onEdit("contract")}
          >
            Editar
          </button>
        </div>
        <div className="review-grid">
          {/* Único campo de contrato restante */}
          <div className="review-item">
            <span className="review-label">Tipo de Contrato:</span>
            <span className="review-value">{contract?.tipoContrato}</span>
          </div>

          {contract?.terminosEspeciales && (
            <div className="review-item review-item-full">
              <span className="review-label">Términos Especiales:</span>
              <span className="review-value">{contract.terminosEspeciales}</span>
            </div>
          )}
        </div>
      </div>

      {/* Confirmación de Términos */}
      <div className="review-section">
        <div className="review-header">
          <h3>Términos Aceptados</h3>
          <button
            type="button"
            className="btn-edit"
            onClick={() => onEdit("terms")}
          >
            Editar
          </button>
        </div>
        <div className="review-checkmarks">
          <div className="review-check">
            <span className="check-icon">✓</span>
            <span>Términos y condiciones aceptados</span>
          </div>
          <div className="review-check">
            <span className="check-icon">✓</span>
            <span>Política de privacidad aceptada</span>
          </div>
          <div className="review-check">
            <span className="check-icon">✓</span>
            <span>Tratamiento de datos personales autorizado</span>
          </div>
        </div>
      </div>

      <div className="review-notice">
        <div className="notice-icon">ℹ️</div>
        <div>
          <strong>Declaración de Veracidad</strong>
          <p>
            Al enviar este formulario, declaro bajo juramento que toda la información
            proporcionada es verídica, completa y actualizada. Comprendo que cualquier
            falsedad u omisión puede tener consecuencias legales.
          </p>
        </div>
      </div>
    </div>
  );
}