import React, { useEffect, useState, lazy, Suspense } from "react"; // <-- Asegura que tienes lazy y Suspense aquí
import { AnimatePresence, motion } from "framer-motion";
import { useContractForm } from "@/hooks/useContractForm";
// 1. Carga inmediata para el primer paso
import { StepPersonal } from "@/components/StepPersonal";

// 🚀 Lazy Loading para Pasos 2 a 6 (CORREGIDO: Manejo de Named Exports)
const StepCompany = lazy(() => 
  import('@/components/StepCompany').then(module => ({ default: module.StepCompany }))
);
const StepContract = lazy(() => 
  import('@/components/StepContract').then(module => ({ default: module.StepContract }))
);
const StepTerms = lazy(() => 
  import('@/components/StepTerms').then(module => ({ default: module.StepTerms }))
);
const StepReview = lazy(() => 
  import('@/components/StepReview').then(module => ({ default: module.StepReview }))
);
const StepSuccess = lazy(() => 
  import('@/components/StepSuccess').then(module => ({ default: module.StepSuccess }))
);
// Necesitarás un componente simple de carga. Asumo que tienes un "LoadingSpinner.tsx" o similar.
// Si no lo tienes, puedes crear uno simple o usar un div.
const LoadingFallback = () => <div style={{padding: '20px', textAlign: 'center'}}>Cargando paso...</div>;

import type { FullContractForm, FormStep, ContractSubmissionResponse } from "@/types";
import {
  generateFormToken,
  storeFormToken,
  validateFormToken,
  checkRateLimit,
  generateHash,
  createSecureTimestamp,
} from "@/utils/security";
import { fullContractFormSchema } from "@/types";

/* ==================== Configuración ==================== */
const API_ENDPOINT = "/api/contract";

const STEP_LABELS: Record<FormStep, string> = {
  personal: "Información Personal",
  company: "Información de Empresa",
  contract: "Detalles del Contrato",
  terms: "Términos y Condiciones",
  review: "Revisión Final",
  success: "Confirmación",
};

const variants = {
  in: { opacity: 0, x: 20, scale: 0.98 },
  live: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: -20, scale: 0.98 },
};

/* ==================== Componente Principal ==================== */
export default function App() {
  const {
    formState,
    updateStepData,
    validateCurrentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canProceed,
    setSubmitting,
    setSubmitError,
    setSuccess,
  } = useContractForm();

  const [formToken, setFormToken] = useState<string>("");
  const [contractId, setContractId] = useState<string | undefined>();

  // Generar token CSRF al montar
  useEffect(() => {
    const token = generateFormToken();
    setFormToken(token);
    storeFormToken(token);
  }, []);

  // Progreso visual
  const stepOrder: FormStep[] = ["personal", "company", "contract", "terms", "review"];
  const currentStepIndex = stepOrder.indexOf(formState.currentStep);
  const progress = ((currentStepIndex + 1) / stepOrder.length) * 100;

  // Handler para enviar formulario
  const handleSubmit = async () => {
    // Validar token CSRF
    if (!validateFormToken(formToken)) {
      setSubmitError("Token de seguridad inválido. Por favor recarga la página.");
      return;
    }

    // Rate limiting (máx 3 envíos por hora)
    if (!checkRateLimit("contract_submit", 3, 3600000)) {
      setSubmitError(
        "Has excedido el límite de envíos. Por favor intenta más tarde."
      );
      return;
    }

    // Validación final completa
    try {
      fullContractFormSchema.parse(formState.data);
    } catch (err: any) {
      setSubmitError("Por favor completa todos los campos correctamente.");
      console.error("Validation error:", err);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Preparar payload con metadatos de seguridad
      const timestamp = createSecureTimestamp();
      const payload = {
        ...formState.data,
        _meta: {
          timestamp,
          token: formToken,
          checksum: generateHash(JSON.stringify(formState.data) + timestamp),
          userAgent: navigator.userAgent,
          source: "contract-form-v1",
        },
      };

      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": formToken,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData: ContractSubmissionResponse = await response.json();
        throw new Error(errorData.error || "Error al enviar el formulario");
      }

      const result: ContractSubmissionResponse = await response.json();

      if (result.ok) {
        setContractId(result.contractId);
        setSuccess();
      } else {
        throw new Error(result.error || "Error desconocido");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitError(
        error.message || "Error al enviar el formulario. Por favor intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Renderizar paso actual
  const renderCurrentStep = () => {
    const { currentStep, data, errors } = formState;

    switch (currentStep) {
      case "personal":
        return (
          <StepPersonal
            data={data.personal || {}}
            onChange={(newData) => updateStepData("personal", newData)}
            errors={errors}
          />
        );
      case "company":
        return (
          <StepCompany
            data={data.company || {}}
            onChange={(newData) => updateStepData("company", newData)}
            errors={errors}
          />
        );
      case "contract":
        return (
          <StepContract
            data={data.contract || {}}
            onChange={(newData) => updateStepData("contract", newData)}
            errors={errors}
          />
        );
      case "terms":
        return (
          <StepTerms
            data={data.terms || {}}
            onChange={(newData) => updateStepData("terms", newData)}
            errors={errors}
          />
        );
      case "review":
        return (
          <StepReview
            data={data}
            onEdit={(step) => goToStep(step as FormStep)}
          />
        );
      case "success":
        return <StepSuccess contractId={contractId} />;
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <div className="card">
        {formState.currentStep !== "success" && (
          <>
            {/* 💡 NUEVO: Botón de Salida, posicionado absolutamente */}
            <a 
              href="https://procure-x.cl/inicio" 
              className="btn-exit-header"
              title="Volver a la página principal"
            >
              Salir
            </a>
            <div className="header">
              <span className="badge">Formulario Seguro</span>
              <h1 className="title">
                Formulario de <span className="highlight">Contrato</span>
              </h1>
              <p className="subtitle">
                Completa la información necesaria para generar tu contrato
              </p>
            </div>

            {/* Indicador de progreso */}
            <div className="progress-container">
              <div className="progress-bar" style={{ width: `${progress}%` }} />
            </div>

            {/* Navegación de pasos */}
            <div className="steps-nav">
              {stepOrder.map((step, index) => (
                <div
                  key={step}
                  className={`step-indicator ${
                    index <= currentStepIndex ? "active" : ""
                  } ${index === currentStepIndex ? "current" : ""}`}
                >
                  <div className="step-number">{index + 1}</div>
                  <div className="step-label">{STEP_LABELS[step]}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Contenido animado y Lazy Loaded */}
        <AnimatePresence mode="wait">
          <motion.div
            key={formState.currentStep}
            initial="in"
            animate="live"
            exit="out"
            variants={variants}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* 🚀 IMPLEMENTACIÓN DE SUSPENSE */}
            <Suspense fallback={<LoadingFallback />}>
              {renderCurrentStep()} 
            </Suspense>
          </motion.div>
        </AnimatePresence>

        {/* Botones de navegación */}
        {formState.currentStep !== "success" && (
          <div className="actions">
            {formState.currentStep !== "personal" && formState.currentStep !== "review" && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={goToPreviousStep}
                disabled={formState.isSubmitting}
              >
                ← Atrás
              </button>
            )}

            {formState.currentStep === "review" && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={goToPreviousStep}
                disabled={formState.isSubmitting}
              >
                ← Modificar
              </button>
            )}

            {formState.currentStep !== "review" ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (validateCurrentStep()) {
                    goToNextStep();
                  }
                }}
                disabled={!canProceed || formState.isSubmitting}
              >
                Continuar →
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={formState.isSubmitting}
              >
                {formState.isSubmitting ? "Enviando..." : "Enviar Formulario"}
              </button>
            )}
          </div>
        )}

        {/* Mensaje de error */}
        {formState.submitError && (
          <div className="error-banner" role="alert">
            <strong>Error:</strong> {formState.submitError}
          </div>
        )}

        {/* Footer de seguridad */}
        {formState.currentStep !== "success" && (
          <div className="security-footer">
            <div className="security-badge">🔒 Conexión Segura</div>
            <p>
              Tus datos están protegidos con encriptación SSL/TLS de grado bancario
            </p>
          </div>
        )}
      </div>
    </div>
  );
}