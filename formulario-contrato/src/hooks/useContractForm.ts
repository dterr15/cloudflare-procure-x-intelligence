import { useState, useCallback, useEffect } from "react";
import type { FormState, FormStep, FullContractForm } from "@/types";
import { 
  personalInfoSchema, 
  companyInfoSchema, 
  contractInfoSchema, 
  termsSchema 
} from "@/types";
import { sanitizeObject } from "@/utils/security";

const STORAGE_KEY = "contract_form_draft";

export function useContractForm() {
  const [formState, setFormState] = useState<FormState>({
    currentStep: "personal",
    data: {},
    errors: {},
    isSubmitting: false,
    submitError: null,
  });

  // Cargar draft al montar (solo si no está en review/success)
  useEffect(() => {
    const savedDraft = sessionStorage.getItem(STORAGE_KEY);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        setFormState(prev => ({
          ...prev,
          data: parsed.data || {},
          currentStep: parsed.currentStep || "personal",
        }));
      } catch (err) {
        console.error("Error loading draft:", err);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Guardar draft en cada cambio (excepto en review/success)
  useEffect(() => {
    if (formState.currentStep !== "review" && formState.currentStep !== "success") {
      const draft = {
        data: formState.data,
        currentStep: formState.currentStep,
        timestamp: new Date().toISOString(),
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    }
  }, [formState.data, formState.currentStep]);

  // Actualizar datos de un paso específico
  const updateStepData = useCallback((step: keyof FullContractForm, data: any) => {
    setFormState(prev => ({
      ...prev,
      data: {
        ...prev.data,
        [step]: sanitizeObject(data),
      },
      errors: {}, // Limpiar errores al actualizar
    }));
  }, []);

  // Validar paso actual
  const validateCurrentStep = useCallback((): boolean => {
    const { currentStep, data } = formState;
    
    try {
      switch (currentStep) {
        case "personal":
          personalInfoSchema.parse(data.personal);
          break;
        case "company":
          companyInfoSchema.parse(data.company);
          break;
        case "contract":
          contractInfoSchema.parse(data.contract);
          break;
        case "terms":
          termsSchema.parse(data.terms);
          break;
        case "review":
        case "success":
          return true;
      }
      
      setFormState(prev => ({ ...prev, errors: {} }));
      return true;
    } catch (err: any) {
      const errors: Record<string, string> = {};
      
      if (err.errors) {
        err.errors.forEach((error: any) => {
          const path = error.path.join(".");
          errors[path] = error.message;
        });
      }
      
      setFormState(prev => ({ ...prev, errors }));
      return false;
    }
  }, [formState]);

  // Navegar al siguiente paso
  const goToNextStep = useCallback(() => {
    if (!validateCurrentStep()) {
      return;
    }

    const steps: FormStep[] = ["personal", "company", "contract", "terms", "review"];
    const currentIndex = steps.indexOf(formState.currentStep);
    
    if (currentIndex < steps.length - 1) {
      setFormState(prev => ({
        ...prev,
        currentStep: steps[currentIndex + 1],
        errors: {},
      }));
    }
  }, [formState.currentStep, validateCurrentStep]);

  // Navegar al paso anterior
  const goToPreviousStep = useCallback(() => {
    const steps: FormStep[] = ["personal", "company", "contract", "terms", "review"];
    const currentIndex = steps.indexOf(formState.currentStep);
    
    if (currentIndex > 0) {
      setFormState(prev => ({
        ...prev,
        currentStep: steps[currentIndex - 1],
        errors: {},
      }));
    }
  }, [formState.currentStep]);

  // Ir a un paso específico (solo si ya fue completado)
  const goToStep = useCallback((step: FormStep) => {
    setFormState(prev => ({
      ...prev,
      currentStep: step,
      errors: {},
    }));
  }, []);

// Verificar si puede avanzar
  const canProceed = useCallback((): boolean => {
    const { currentStep, data } = formState;
    
    switch (currentStep) {
      case "personal":
        return !!data.personal?.nombre && !!data.personal?.email;
      case "company":
        return !!data.company?.razonSocial && !!data.company?.rutEmpresa;
      case "contract":
        // 💡 CAMBIO AQUÍ: Solo requerimos tipoContrato, ya que montoContrato fue eliminado.
        return !!data.contract?.tipoContrato; 
      case "terms":
        return !!data.terms?.aceptaTerminos;
      case "review":
        return true;
      default:
        return false;
    }
  }, [formState]);

  // Limpiar formulario
  const resetForm = useCallback(() => {
    setFormState({
      currentStep: "personal",
      data: {},
      errors: {},
      isSubmitting: false,
      submitError: null,
    });
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  // Marcar como enviando
  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState(prev => ({ ...prev, isSubmitting }));
  }, []);

  // Establecer error de envío
  const setSubmitError = useCallback((error: string | null) => {
    setFormState(prev => ({ ...prev, submitError: error }));
  }, []);

  // Marcar como exitoso
  const setSuccess = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      currentStep: "success",
      isSubmitting: false,
      submitError: null,
    }));
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    formState,
    updateStepData,
    validateCurrentStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canProceed: canProceed(),
    resetForm,
    setSubmitting,
    setSubmitError,
    setSuccess,
  };
}