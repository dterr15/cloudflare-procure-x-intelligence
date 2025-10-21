export interface Env {
  N8N_WEBHOOK: string;
  N8N_TOKEN: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const { request, env } = context;
    const body = await request.json();

    // Validaciones mínimas (ejemplo)
    if (
      !body?.contact?.email ||
      !/\S+@\S+\.\S+/.test(body.contact.email)
    ) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    // Reenvío a n8n con token privado
    const res = await fetch(env.N8N_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ProcureX-Token": env.N8N_TOKEN
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const txt = await res.text();
      return new Response(JSON.stringify({ ok: false, error: "n8n error", detail: txt }), {
        status: 502, headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: err?.message || "server error" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
};
