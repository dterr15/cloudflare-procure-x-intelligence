export interface Env {
  N8N_WEBHOOK: string; // ej. https://<tu-n8n>/webhook/<id>
  N8N_TOKEN: string;   // el secreto que definimos
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const body = await request.json();

    // Validación mínima
    if (!body?.contact?.email || !/\S+@\S+\.\S+/.test(body.contact.email)) {
      return new Response(JSON.stringify({ ok: false, error: "Invalid email" }), {
        status: 400, headers: { "Content-Type": "application/json" }
      });
    }

    // Proxy seguro hacia n8n
    const res = await fetch(env.N8N_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-ProcureX-Token": env.N8N_TOKEN
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return new Response(JSON.stringify({ ok: false, error: "n8n error", detail }), {
        status: 502, headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok: false, error: e?.message || "server error" }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
};
