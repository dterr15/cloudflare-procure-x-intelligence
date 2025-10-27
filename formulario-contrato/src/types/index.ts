import { z } from "zod";

/* ==================== SCHEMAS DE VALIDACIÓN ==================== */

// Regex patterns seguros
export const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]{2,}\.)+[a-zA-Z]{2,}(?:\.[a-zA-Z]{2,})?$/, 
  phone: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  rut: /^[0-9]{1,2}\.[0-9]{3}\.[0-9]{3}-[0-9kK]$/,
  // Solo letras, números, espacios y algunos caracteres seguros
  safeText: /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\s.,\-\/#]{2,255}$/,
  // Números y separadores para montos
  currency: /^[0-9.,]+$/,
  // Patrón para campos que NO necesitan números (Nombre/Apellido)
  simpleText: /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s.\-]{2,100}$/,
};

// Validación de RUT chileno
export const rutSchema = z
  .string()
  .regex(PATTERNS.rut, "Formato de RUT inválido (ej: 12.345.678-9)")
  .refine((rut) => {
    // Validación del dígito verificador
    const cleanRut = rut.replace(/[.-]/g, "");
    const body = cleanRut.slice(0, -1);
    const dv = cleanRut.slice(-1).toLowerCase();
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = body.length - 1; i >= 0; i--) {
      sum += parseInt(body[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const expectedDv = 11 - (sum % 11);
    const calculatedDv = expectedDv === 11 ? "0" : expectedDv === 10 ? "k" : expectedDv.toString();
    
    return dv === calculatedDv;
  }, "RUT inválido");

// Schema para información personal
export const personalInfoSchema = z.object({
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre es demasiado largo")
    .regex(PATTERNS.simpleText, "El nombre solo debe contener letras, espacios y guiones"),
  
  apellido: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(100, "El apellido es demasiado largo")
    .regex(PATTERNS.simpleText, "El apellido solo debe contener letras, espacios y guiones"),
  
  rut: rutSchema,
  
  email: z
    .string()
    .email("Email inválido")
    .regex(PATTERNS.email, "El dominio debe tener al menos dos letras (ej: usuario@dominio.cl)")
    .max(254, "Email demasiado largo"),
  
  telefono: z
    .string()
    .regex(PATTERNS.phone, "Formato de teléfono inválido")
    .min(8, "Teléfono debe tener al menos 8 dígitos")
    .max(20, "Teléfono demasiado largo"),
  
  direccion: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección es demasiado larga")
    .regex(PATTERNS.safeText, "La dirección contiene caracteres no válidos"),
  
  ciudad: z
    .string()
    .min(3, "La ciudad es demasiado corta")
    .max(50, "La ciudad es demasiado larga")
    .regex(PATTERNS.safeText, "La ciudad contiene caracteres no válidos"),
  
  region: z.enum([
    "Arica y Parinacota",
    "Tarapacá",
    "Antofagasta",
    "Atacama",
    "Coquimbo",
    "Valparaíso",
    "Metropolitana",
    "O'Higgins",
    "Maule",
    "Ñuble",
    "Biobío",
    "Araucanía",
    "Los Ríos",
    "Los Lagos",
    "Aysén",
    "Magallanes"
  ], { errorMap: () => ({ message: "Selecciona una región válida" }) }),
});

// Schema para información de empresa
export const companyInfoSchema = z.object({
  razonSocial: z
    .string()
    .min(2, "La razón social debe tener al menos 2 caracteres")
    .max(200, "La razón social es demasiado larga")
    .regex(PATTERNS.safeText, "La razón social contiene caracteres no válidos"),
  
  rutEmpresa: rutSchema,
  
  giro: z
    .string()
    .min(3, "El giro debe tener al menos 3 caracteres")
    .max(200, "El giro es demasiado largo")
    .regex(PATTERNS.safeText, "El giro contiene caracteres no válidos"),
  
  direccionEmpresa: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(200, "La dirección es demasiado larga")
    .regex(PATTERNS.safeText, "La dirección contiene caracteres no válidos"),
  
  ciudadEmpresa: z
    .string()
    .min(2, "La ciudad debe tener al menos 2 caracteres")
    .max(100, "La ciudad es demasiado larga")
    .regex(PATTERNS.safeText, "La ciudad contiene caracteres no válidos"),
  
  representanteLegal: z
    .string()
    .min(2, "El nombre del representante debe tener al menos 2 caracteres")
    .max(100, "El nombre del representante es demasiado largo")
    .regex(PATTERNS.safeText, "El nombre contiene caracteres no válidos"),
  
  cargoRepresentante: z
    .string()
    .min(2, "El cargo debe tener al menos 2 caracteres")
    .max(100, "El cargo es demasiado largo")
    .regex(PATTERNS.safeText, "El cargo contiene caracteres no válidos"),
});

// Schema para información del contrato
export const contractInfoSchema = z.object({
  tipoContrato: z.enum([
    "Starter",
    "Basic",
    "Pro"
  ], { errorMap: () => ({ message: "Selecciona un tipo de contrato válido" }) }),

  terminosEspeciales: z
    .string()
    .max(2000, "Los términos especiales son demasiado largos")
    .regex(PATTERNS.safeText, "Los términos contienen caracteres no válidos")
    .optional(),
})

// Schema para términos y condiciones
export const termsSchema = z.object({
  aceptaTerminos: z
    .boolean()
    .refine((val) => val === true, "Debes aceptar los términos y condiciones"),
  
  aceptaPoliticaPrivacidad: z
    .boolean()
    .refine((val) => val === true, "Debes aceptar la política de privacidad"),
  
  aceptaTratamientoDatos: z
    .boolean()
    .refine((val) => val === true, "Debes aceptar el tratamiento de datos personales"),
});

// Schema completo del formulario
export const fullContractFormSchema = z.object({
  personal: personalInfoSchema,
  company: companyInfoSchema,
  contract: contractInfoSchema,
  terms: termsSchema,
});

/* ==================== TIPOS TYPESCRIPT ==================== */

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type CompanyInfo = z.infer<typeof companyInfoSchema>;
export type ContractInfo = z.infer<typeof contractInfoSchema>;
export type TermsInfo = z.infer<typeof termsSchema>;

export type FullContractForm = z.infer<typeof fullContractFormSchema>;

// Tipo para el estado del formulario multi-step
export type FormStep = "personal" | "company" | "contract" | "terms" | "review" | "success";

export interface FormState {
  currentStep: FormStep;
  data: Partial<FullContractForm>;
  errors: Record<string, string>;
  isSubmitting: boolean;
  submitError: string | null;
}

// Tipo para la respuesta del backend
export interface ContractSubmissionResponse {
  ok: boolean;
  contractId?: string;
  error?: string;
  detail?: string;
}