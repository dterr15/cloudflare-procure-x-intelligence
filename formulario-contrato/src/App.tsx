import { useEffect, useState, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useContractForm } from "@/hooks/useContractForm";
// 1. Carga inmediata para el primer paso
import { StepPersonal } from "@/components/StepPersonal";

// 🚀 Lazy Loading para Pasos 2 a 6
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

const LoadingFallback = () => <div style={{padding: '20px', textAlign: 'center'}}>Cargando paso...</div>;

import type { FormStep, ContractSubmissionResponse } from "@/types";
import {
  generateFormToken,
  storeFormToken,
  // 🛑 Eliminamos las funciones de seguridad no utilizadas en el frontend:
  // validateFormToken,
  // checkRateLimit,
  // generateHash,
  // createSecureTimestamp,
} from "@/utils/security";
// 🛑 Eliminamos la importación de Zod, ya que la validación estricta la hace la Función:
// import { fullContractFormSchema } from "@/types";

/* ==================== Configuración ==================== */
// 🛑 Eliminamos ENCRYPTION_KEY y la vieja N8N_ENDPOINT.
const API_ENDPOINT = "/api/contract"; // ✅ Solución al error TS2304

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

  // Nuevo y Simplificado handleSubmit en App.tsx
  const handleSubmit = async () => {
      // La validación Zod y Rate Limiting se hacen en la Cloudflare Function
  
      setSubmitting(true);
      setSubmitError(null);
  
      try {
          // El payload es la data del formulario (sin encriptación)
          const payload = {
              ...formState.data,
              _meta: { token: formToken, userAgent: navigator.userAgent, source: "contract-form-v1" },
          };
  
          // El fetch va al endpoint local de la Cloudflare Function
          const response = await fetch(API_ENDPOINT, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "X-CSRF-Token": formToken,
              },
              body: JSON.stringify(payload),
          });
  
          if (!response.ok) {
              // La función de Cloudflare devuelve un JSON de error si algo falla
              const errorData: any = await response.json(); 
              throw new Error(errorData.error || errorData.message || "Error al enviar el formulario");
          }
  
          const result: ContractSubmissionResponse = await response.json();
  
          if (result.ok) {
              setContractId(result.contractId); // Obtiene el ID del contrato generado por la Función
              setSuccess();
          } else {
              throw new Error(result.error || "Error desconocido");
          }
      } catch (error: any) {
          setSubmitError(`NetworkError when attempting to fetch resource: ${error.message}`);
      } finally {
          setSubmitting(false);
      }
  };

  // Renderizar paso actual
  const renderCurrentStep = () => {
    const { currentStep, data, errors } = formState;
// ... (resto del switch)

// ... (resto del componente App)
