import { useState } from "react";
import { Checkbox } from "./Checkbox";
import { Modal } from "./Modal";
import { TermsContent } from "./TermsContent";
import { PrivacyPolicyContent } from "./PrivacyPolicyContent";
import type { TermsInfo } from "@/types";

interface StepTermsProps {
  data: Partial<TermsInfo>;
  onChange: (data: Partial<TermsInfo>) => void;
  errors: Record<string, string>;
}

export function StepTerms({ data, onChange, errors }: StepTermsProps) {
  const [localData, setLocalData] = useState<Partial<TermsInfo>>(data);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleChange = <K extends keyof TermsInfo>(field: K, value: TermsInfo[K]) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const handleTermsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsTermsModalOpen(true);
  };

  const handlePrivacyClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsPrivacyModalOpen(true);
  };

  return (
    <>
      <div className="form-step">
        <h2 className="step-title">Términos y Condiciones</h2>
        <p className="step-description">
          Por favor lee y acepta los siguientes términos para continuar.
        </p>

        <div className="terms-container">
          <div className="terms-box">
            <h3 className="terms-title">Términos y Condiciones Generales</h3>
            <div className="terms-content">
              <p>
                Al aceptar estos términos, usted declara que:
              </p>
              <ul>
                <li>Toda la información proporcionada es veraz y actualizada</li>
                <li>Tiene la capacidad legal para celebrar este contrato</li>
                <li>Ha leído y comprendido todos los términos del contrato</li>
                <li>Acepta las condiciones comerciales establecidas</li>
                <li>Se compromete a cumplir con las obligaciones contractuales</li>
              </ul>
            </div>
          </div>

          <Checkbox
            name="aceptaTerminos"
            label={
              <>
                He leído y acepto los{" "}
                <a
                  href="/terminos"
                  onClick={handleTermsClick}
                  className="terms-link"
                  rel="noopener noreferrer"
                >
                  términos y condiciones
                </a>
              </>
            }
            checked={localData.aceptaTerminos || false}
            onChange={(checked) => handleChange("aceptaTerminos", checked)}
            error={errors.aceptaTerminos}
            required
          />

          <div className="terms-box">
            <h3 className="terms-title">Política de Privacidad</h3>
            <div className="terms-content">
              <p>
                Sus datos personales serán tratados conforme a la Ley 19.628 sobre
                Protección de Datos Personales de Chile. La información será utilizada
                exclusivamente para:
              </p>
              <ul>
                <li>Generación y gestión del contrato</li>
                <li>Comunicaciones relacionadas con el servicio contratado</li>
                <li>Cumplimiento de obligaciones legales y tributarias</li>
                <li>Estadísticas internas (datos anonimizados)</li>
              </ul>
              <p>
                Sus datos no serán compartidos con terceros sin su consentimiento
                expreso, salvo que sea requerido por ley.
              </p>
            </div>
          </div>

          <Checkbox
            name="aceptaPoliticaPrivacidad"
            label={
              <>
                He leído y acepto la{" "}
                <a
                  href="/privacidad"
                  onClick={handlePrivacyClick}
                  className="terms-link"
                  rel="noopener noreferrer"
                >
                  política de privacidad
                </a>
              </>
            }
            checked={localData.aceptaPoliticaPrivacidad || false}
            onChange={(checked) => handleChange("aceptaPoliticaPrivacidad", checked)}
            error={errors.aceptaPoliticaPrivacidad}
            required
          />

          <div className="terms-box">
            <h3 className="terms-title">Tratamiento de Datos Personales</h3>
            <div className="terms-content">
              <p>
                Autorizo expresamente el tratamiento de mis datos personales para los
                fines descritos en la política de privacidad. Reconozco mi derecho a:
              </p>
              <ul>
                <li>Acceder a mis datos personales</li>
                <li>Rectificar información incorrecta o desactualizada</li>
                <li>Cancelar el tratamiento de mis datos</li>
                <li>Oponerme al tratamiento en casos específicos</li>
              </ul>
              <p>
                Para ejercer estos derechos, puede contactarnos en{" "}
                <a href="mailto:px@procure-x.cl">px@procure-x.cl</a>
              </p>
            </div>
          </div>

          <Checkbox
            name="aceptaTratamientoDatos"
            label="Autorizo el tratamiento de mis datos personales según lo descrito"
            checked={localData.aceptaTratamientoDatos || false}
            onChange={(checked) => handleChange("aceptaTratamientoDatos", checked)}
            error={errors.aceptaTratamientoDatos}
            required
          />
        </div>

        <div className="security-notice">
          <div className="notice-icon">🔒</div>
          <div>
            <strong>Seguridad y Confidencialidad</strong>
            <p>
              Toda la información transmitida está protegida mediante encriptación SSL/TLS.
              Sus datos son tratados con los más altos estándares de seguridad.
            </p>
          </div>
        </div>
      </div>

      {/* Modales */}
      <Modal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        title="Términos y Condiciones"
        size="xl"
      >
        <TermsContent />
      </Modal>

      <Modal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        title="Política de Privacidad"
        size="xl"
      >
        <PrivacyPolicyContent />
      </Modal>
    </>
  );
}
