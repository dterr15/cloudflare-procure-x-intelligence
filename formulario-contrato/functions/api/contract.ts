// Archivo: functions/api/contract.ts (al inicio)

import { PagesFunction } from '@cloudflare/workers-types';
import { ZodError } from 'zod'; // Necesario para atrapar errores de Zod
import { fullContractFormSchema } from '../../src/types/index'; // 🎯 Importa el schema Zod centralizado
// Asumo que esta función existe en tu utils/security.ts
import { sanitizeObject } from '../../src/utils/security'; 
// ...

export interface Env {
  N8N_WEBHOOK: string; // URL del webhook de N8N
  N8N_TOKEN: string;   // Token de autenticación
  ALLOWED_ORIGINS?: string; // Orígenes permitidos para CORS (separados por coma)
}

interface ContractPayload {
  personal: {
    nombre: string;
    apellido: string;
    rut: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    region: string;
  };
  company: {
    razonSocial: string;
    rutEmpresa: string;
    giro: string;
    direccionEmpresa: string;
    ciudadEmpresa: string;
    representanteLegal: string;
    cargoRepresentante: string;
  };
  contract: {
    tipoContrato: string;
    terminosEspeciales?: string;
  };
  terms: {
    aceptaTerminos: boolean;
    aceptaPoliticaPrivacidad: boolean;
    aceptaTratamientoDatos: boolean;
  };
  _meta?: {
    timestamp: string;
    token: string;
    checksum: string;
    userAgent: string;
    source: string;
  };
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

  // 🛡️ [PULIDO 1] Validación de Tipo de Contenido (Content-Type)
const contentType = request.headers.get("content-type") || "";
if (!contentType.includes("application/json")) {
  return new Response(
    JSON.stringify({
      ok: false,
      message: "Invalid Content-Type. Must be application/json.",
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

    // 🚀 [PULIDO 3] Validación estricta Zod: Si falla, lanza ZodError
    const validatedData = fullContractFormSchema.parse(payload);

    // Sanitización centralizada
    // Asumo que tu función sanitizeObject en src/utils/security.ts es robusta
    const sanitizedPayload = sanitizeObject(validatedData);

    // Agregar metadata de servidor (usando los datos sanitizados)
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
            "X-ProcureX-Token": env.N8N_TOKEN,
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
          detail: "Please try again or contact support",
        }),
        {
          status: 502,
          headers: getSecurityHeaders(allowedOrigin),
        }
      );
    }

    // Generar ID de contrato (podrías usar UUID real en producción)
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
      // Manejo específico para errores de Zod
      if (e instanceof ZodError) {
          console.error("Zod Validation Error:", e.issues);
          return new Response(
              JSON.stringify({
                  ok: false,
                  error: "Payload validation failed",
                  // Retorna detalles útiles para debug del frontend/servidor
                  details: e.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`) 
              }),
              { status: 400, headers: getSecurityHeaders(allowedOrigin) }
          );
      }
      
      console.error("Contract submission error:", e);
      // ... (manejo de error 500)
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