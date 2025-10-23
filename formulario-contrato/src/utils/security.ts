import DOMPurify from "dompurify";
import CryptoJS from "crypto-js";

/* ==================== SANITIZACIÓN ==================== */

/**
 * Sanitiza inputs para prevenir XSS
 * @param input - String a sanitizar
 * @returns String sanitizado
 */
export function sanitizeInput(input: string): string {
  // Eliminar tags HTML y scripts
  const cleaned = DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  });
  
  // Trim y normalizar espacios
  return cleaned.trim().replace(/\s+/g, " ");
}

/**
 * Sanitiza objeto completo recursivamente
 * @param obj - Objeto a sanitizar
 * @returns Objeto sanitizado
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: any = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/* ==================== VALIDACIÓN ADICIONAL ==================== */

/**
 * Valida que no haya caracteres peligrosos en inputs
 * @param input - String a validar
 * @returns true si es seguro
 */
export function isSafeInput(input: string): boolean {
  // Lista negra de patrones peligrosos
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,  // event handlers: onclick=, onload=, etc.
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Valida longitud de campo
 * @param input - String a validar
 * @param min - Longitud mínima
 * @param max - Longitud máxima
 * @returns true si cumple con límites
 */
export function isValidLength(input: string, min: number, max: number): boolean {
  const length = input.trim().length;
  return length >= min && length <= max;
}

/* ==================== FORMATEO ==================== */

/**
 * Formatea RUT chileno (agrega puntos y guión)
 * @param rut - RUT sin formato
 * @returns RUT formateado
 */
export function formatRut(rut: string): string {
  // Eliminar todo excepto números y K
  const cleaned = rut.replace(/[^0-9kK]/g, "");
  
  if (cleaned.length < 2) return cleaned;
  
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  
  // Agregar puntos cada 3 dígitos desde la derecha
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
  return `${formatted}-${dv}`;
}

/**
 * Limpia RUT (elimina puntos y guión)
 * @param rut - RUT formateado
 * @returns RUT limpio
 */
export function cleanRut(rut: string): string {
  return rut.replace(/[.-]/g, "");
}

/**
 * Formatea número como moneda
 * @param amount - Monto numérico
 * @param currency - Moneda (CLP, USD, EUR)
 * @returns String formateado
 */
export function formatCurrency(amount: number, currency: string = "CLP"): string {
  const formatter = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  });
  
  return formatter.format(amount);
}

/**
 * Formatea teléfono chileno
 * @param phone - Teléfono sin formato
 * @returns Teléfono formateado
 */
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  
  // Formato móvil chileno: +56 9 XXXX XXXX
  if (cleaned.startsWith("569") && cleaned.length === 11) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 3)} ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
  
  // Formato fijo: +56 XX XXXX XXXX
  if (cleaned.startsWith("56") && cleaned.length === 10) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`;
  }
  
  return cleaned;
}

/* ==================== ENCRIPTACIÓN (solo para transmisión) ==================== */

/**
 * Genera un hash SHA256 para verificación de integridad
 * @param data - Datos a hashear
 * @returns Hash hexadecimal
 */
export function generateHash(data: string): string {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex);
}

/**
 * Crea un timestamp seguro para prevenir replay attacks
 * @returns ISO timestamp
 */
export function createSecureTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Valida que el timestamp no sea muy antiguo (max 5 minutos)
 * @param timestamp - ISO timestamp a validar
 * @returns true si es válido
 */
export function isValidTimestamp(timestamp: string): boolean {
  try {
    const time = new Date(timestamp).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    return (now - time) < fiveMinutes;
  } catch {
    return false;
  }
}

/* ==================== VALIDACIONES DE ARCHIVOS ==================== */

/**
 * Valida extensión de archivo
 * @param filename - Nombre del archivo
 * @param allowedExtensions - Extensiones permitidas
 * @returns true si la extensión es válida
 */
export function isValidFileExtension(
  filename: string, 
  allowedExtensions: string[]
): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? allowedExtensions.includes(ext) : false;
}

/**
 * Valida tamaño de archivo
 * @param fileSize - Tamaño en bytes
 * @param maxSizeMB - Tamaño máximo en MB
 * @returns true si el tamaño es válido
 */
export function isValidFileSize(fileSize: number, maxSizeMB: number): boolean {
  const maxBytes = maxSizeMB * 1024 * 1024;
  return fileSize > 0 && fileSize <= maxBytes;
}

/* ==================== RATE LIMITING (CLIENT SIDE) ==================== */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

/**
 * Verifica si una acción está siendo rate limited
 * @param key - Identificador de la acción
 * @param maxRequests - Máximo de requests permitidos
 * @param windowMs - Ventana de tiempo en milisegundos
 * @returns true si puede continuar, false si está limitado
 */
export function checkRateLimit(
  key: string, 
  maxRequests: number = 5, 
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  
  if (!entry || now > entry.resetTime) {
    // Nueva ventana de tiempo
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs
    });
    return true;
  }
  
  if (entry.count < maxRequests) {
    entry.count++;
    return true;
  }
  
  return false;
}

/**
 * Limpia entradas expiradas del rate limit
 */
export function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

/* ==================== GENERACIÓN DE TOKENS ==================== */

/**
 * Genera un token único para el formulario (CSRF protection)
 * @returns Token aleatorio
 */
export function generateFormToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * Almacena el form token en sessionStorage
 * @param token - Token a almacenar
 */
export function storeFormToken(token: string): void {
  sessionStorage.setItem("contract_form_token", token);
  sessionStorage.setItem("contract_form_token_time", Date.now().toString());
}

/**
 * Valida el form token
 * @param token - Token a validar
 * @returns true si es válido
 */
export function validateFormToken(token: string): boolean {
  const stored = sessionStorage.getItem("contract_form_token");
  const storedTime = sessionStorage.getItem("contract_form_token_time");
  
  if (!stored || !storedTime) return false;
  
  const age = Date.now() - parseInt(storedTime);
  const maxAge = 30 * 60 * 1000; // 30 minutos
  
  return stored === token && age < maxAge;
}