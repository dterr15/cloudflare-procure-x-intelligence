// Archivo: functions/api/contract.ts
import { PagesFunction } from '@cloudflare/workers-types';

export interface Env {
  N8N_WEBHOOK: string;
  N8N_TOKEN: string;
  ALLOWED_ORIGINS?: string;
}

/* ==================== RATE LIMITING ==================== */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, maxRequests: number = 10, windowMs: number = 3600000): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count < maxRequests) {
    entry.count++;
    return true;
  }

  return false;
}

/* ==================== HEADERS DE SEGURIDAD ==================== */
function getSecurityHeaders(allowedOrigin?: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    ...(allowedOrigin && {
      "Access-Control-Allow-Origin": allowedOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-CSRF-Token",
      "Access-Control-Max-Age": "86400",
    }),
  };
}

/* ==================== VALIDACIÓN BÁSICA ==================== */
function validatePayload(payload: any): { valid: boolean; error?: string } {
  // Validación básica de estructura
  if (!payload.personal || !payload.company || !payload.contract || !payload.terms) {
    return { valid: false, error: "Missing required sections" };
  }

  // Validar personal
  const { personal } = payload;
  if (!personal.nombre || !personal.apellido || !personal.rut || !personal.email) {
    return { valid: false, error: "Missing required personal information" };
  }

  // Validar company
  const { company } = payload;
  if (!company.razonSocial || !company.rutEmpresa || !company.giro) {
    return { valid: false, error: "Missing required company information" };
  }

  // Validar terms
  const { terms } = payload;
  if (!terms.aceptaTerminos || !terms.aceptaPoliticaPrivacidad || !terms.aceptaTratamientoDatos) {
    return { valid: false, error: "All terms must be accepted" };
  }

  return { valid: true };
}

/* ==================== SANITIZACIÓN ==================== */
function sanitizeString(str: string): string {
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .trim();
}

function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  return obj;
}

/* ==================== HANDLER PRINCIPAL ==================== */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = env.ALLOWED_ORIGINS?.split(",") || [];
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : undefined;

  // Manejar OPTIONS para CORS
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: getSecurityHeaders(allowedOrigin),
    });
  }

  // Validación de Content-Type
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Invalid Content-Type. Must be application/json.",
      }),
      { status: 400, headers: getSecurityHeaders(allowedOrigin) }
    );
  }

  try {
    // Rate limiting
    if (!checkRateLimit(clientIP, 10, 3600000)) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: getSecurityHeaders(allowedOrigin),
        }
      );
    }

    // Parsear body
    const payload = await request.json();

    // Validación
    const validation = validatePayload(payload);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: validation.error,
        }),
        {
          status: 400,
          headers: getSecurityHeaders(allowedOrigin),
        }
      );
    }

    // Sanitización
    const sanitizedPayload = sanitizeObject(payload);

    // Agregar metadata de servidor
    const finalPayload = {
      ...sanitizedPayload,
      submittedAt: new Date().toISOString(),
      submittedFrom: clientIP,
    };

    // Enviar a N8N
    const n8nResponse = await fetch(env.N8N_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ProcureX-Token": env.N8N_TOKEN || "",
        "User-Agent": "ProcureX-ContractForm/1.0",
      },
      body: JSON.stringify(finalPayload),
    });

    if (!n8nResponse.ok) {
      const detail = await n8nResponse.text().catch(() => "Unknown error");
      console.error("N8N webhook error:", detail);

      return new Response(
        JSON.stringify({
          ok: false,
          error: "Failed to process contract submission",
        }),
        {
          status: 502,
          headers: getSecurityHeaders(allowedOrigin),
        }
      );
    }

    // Generar ID de contrato
    const contractId = `CONT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    return new Response(
      JSON.stringify({
        ok: true,
        contractId,
        message: "Contract submission received successfully",
      }),
      {
        status: 200,
        headers: getSecurityHeaders(allowedOrigin),
      }
    );
  } catch (e: any) {
    console.error("Contract submission error:", e);
    return new Response(
      JSON.stringify({
        ok: false,
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: getSecurityHeaders(allowedOrigin),
      }
    );
  }
};

// Handler para GET (informativo)
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = env.ALLOWED_ORIGINS?.split(",") || [];
  const allowedOrigin = allowedOrigins.includes(origin) ? origin : undefined;

  return new Response(
    JSON.stringify({
      service: "ProcureX Contract Form API",
      version: "1.0.0",
      methods: ["POST"],
      status: "operational",
    }),
    {
      status: 200,
      headers: getSecurityHeaders(allowedOrigin),
    }
  );
};
