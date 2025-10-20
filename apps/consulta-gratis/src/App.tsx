import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ================== Tipos ================== */
type Answers = {
  volume: string;      // CLP (texto para permitir formateo)
  skus: string;        // número
  category: string;    // select
  pain: string;        // texto corto
  contact: { name: string; email: string; company: string; phone: string };
};

/* ================== Constantes UI ================== */
const steps = ["Perfil", "Operación", "Objetivo", "Contacto"];
const variants = {
  in:   { opacity: 0, y: 16, scale: 0.98 },
  live: { opacity: 1, y: 0,  scale: 1 },
  out:  { opacity: 0, y: -16, scale: 0.98 }
};

/* ================== App ================== */
export default function App() {
  // step: 0..3 = form, 4 = resumen, 5 = contacto final
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    volume: "",
    skus: "",
    category: "",
    pain: "",
    contact: { name: "", email: "", company: "", phone: "" }
  });

  const canNext = useMemo(() => {
    if (step === 0) return !!answers.volume && !!answers.skus;
    if (step === 1) return !!answers.category;
    if (step === 2) return !!answers.pain && answers.pain.trim().length >= 10;
    if (step === 3) {
      const c = answers.contact;
      return !!c.name && /\S+@\S+\.\S+/.test(c.email);
    }
    return true;
  }, [step, answers]);

  // Progreso visual (hasta el resumen)
  const progress = (Math.min(step, 4) + 1) / (steps.length + 1);

  function goNext() {
    if (!canNext) return;
    setStep((s) => Math.min(s + 1, 4)); // 4 = resumen
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="container">
      <div className="card">
        <span className="badge">Consulta gratis</span>
        <h1 className="h1">
          Agendemos tu <span style={{ color: "#20e6c4" }}>demo</span> + pre-calificación
        </h1>
        <p className="sub">
          Responde unas preguntas rápidas. Siempre obtendrás un reporte demo. Si calificas,
          seguimos al proceso de nurture.
        </p>

        {/* Progreso simple */}
        <div className="progress" aria-hidden>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`dot ${i < Math.ceil(progress * 5) ? "active" : ""}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step <= 3 ? (
            <motion.section
              key={step}
              initial="in"
              animate="live"
              exit="out"
              variants={variants}
              transition={{ duration: 0.22 }}
            >
              {step === 0 && <StepPerfil value={answers} onChange={setAnswers} />}
              {step === 1 && <StepOperacion value={answers} onChange={setAnswers} />}
              {step === 2 && <StepObjetivo value={answers} onChange={setAnswers} />}
              {step === 3 && <StepContacto value={answers} onChange={setAnswers} />}

              <div className="actions">
                <button
                  className="btn btn-ghost"
                  type="button"
                  onClick={goBack}
                  disabled={step === 0}
                >
                  Atrás
                </button>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={goNext}
                  disabled={!canNext}
                >
                  Siguiente
                </button>
              </div>
            </motion.section>
          ) : step === 4 ? (
            <motion.section
              key="summary"
              initial="in"
              animate="live"
              exit="out"
              variants={variants}
              transition={{ duration: 0.22 }}
            >
              <Resumen answers={answers} onContact={() => setStep(5)} />
            </motion.section>
          ) : (
            <motion.section
              key="contact"
              initial="in"
              animate="live"
              exit="out"
              variants={variants}
              transition={{ duration: 0.22 }}
            >
              <ContactFinal answers={answers} onBack={() => setStep(4)} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================== Pasos ================== */
function StepPerfil({
  value,
  onChange
}: {
  value: Answers;
  onChange: (v: Answers) => void;
}) {
  return (
    <div className="form">
      <div className="row">
        <div>
          <label>Volumen mensual aprox. (CLP)</label>
          <input
            className="input"
            inputMode="numeric"
            placeholder="p.ej. 20000000"
            value={value.volume}
            onChange={(e) =>
              onChange({ ...value, volume: e.target.value.replace(/[^\d]/g, "") })
            }
          />
          <div className="help">Solo números, sin puntos ni $.</div>
        </div>
        <div>
          <label># de SKUs activos</label>
          <input
            className="input"
            inputMode="numeric"
            placeholder="p.ej. 150"
            value={value.skus}
            onChange={(e) =>
              onChange({ ...value, skus: e.target.value.replace(/[^\d]/g, "") })
            }
          />
        </div>
      </div>
    </div>
  );
}

function StepOperacion({
  value,
  onChange
}: {
  value: Answers;
  onChange: (v: Answers) => void;
}) {
  return (
    <div className="form">
      <div>
        <label>Categoría predominante</label>
        <select
          className="input"
          value={value.category}
          onChange={(e) => onChange({ ...value, category: e.target.value })}
        >
          <option value="" disabled>
            Selecciona…
          </option>
          <option>Materiales / MRO</option>
          <option>TI · Equipamiento</option>
          <option>Servicios generales</option>
          <option>Retail / Consumo</option>
          <option>Industrial</option>
        </select>
      </div>
    </div>
  );
}

function StepObjetivo({
  value,
  onChange
}: {
  value: Answers;
  onChange: (v: Answers) => void;
}) {
  return (
    <div className="form">
      <div>
        <label>¿Cuál es el principal dolor u objetivo?</label>
        <input
          className="input"
          placeholder="Ej: bajar costo en X, normalizar plazos, etc."
          value={value.pain}
          onChange={(e) => onChange({ ...value, pain: e.target.value })}
        />
        <div className="help">En 10–140 caracteres aprox.</div>
      </div>
    </div>
  );
}

function StepContacto({
  value,
  onChange
}: {
  value: Answers;
  onChange: (v: Answers) => void;
}) {
  const c = value.contact;
  return (
    <div className="form">
      <div className="row">
        <div>
          <label>Nombre</label>
          <input
            className="input"
            value={c.name}
            onChange={(e) =>
              onChange({ ...value, contact: { ...c, name: e.target.value } })
            }
          />
        </div>
        <div>
          <label>Empresa</label>
          <input
            className="input"
            value={c.company}
            onChange={(e) =>
              onChange({ ...value, contact: { ...c, company: e.target.value } })
            }
          />
        </div>
      </div>
      <div className="row">
        <div>
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={c.email}
            onChange={(e) =>
              onChange({ ...value, contact: { ...c, email: e.target.value } })
            }
          />
        </div>
        <div>
          <label>Teléfono (opcional)</label>
          <input
            className="input"
            value={c.phone}
            onChange={(e) =>
              onChange({ ...value, contact: { ...c, phone: e.target.value } })
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ================== Resumen ================== */
function Resumen({
  answers,
  onContact
}: {
  answers: Answers;
  onContact: () => void;
}) {
  const vol = Number(answers.volume || 0);
  const skus = Number(answers.skus || 0);

  const qualifies = vol >= 15000000 && skus >= 40; // demo simple

  return (
    <div>
      <h2 className="h1" style={{ fontSize: 28, marginTop: 0 }}>
        ¡Listo! Enseguida recibirás tu{" "}
        <span style={{ color: "#20e6c4" }}>reporte demo</span>
      </h2>
      <p className="sub">
        Enviaremos un PDF con hallazgos base y recomendaciones.
      </p>

      <div className="result">
        <div className="kpi">
          <small>Volumen</small>
          <b>${vol.toLocaleString("es-CL")}</b>
        </div>
        <div className="kpi">
          <small>SKUs</small>
          <b>{skus.toLocaleString("es-CL")}</b>
        </div>
        <div className="kpi">
          <small>Categoría</small>
          <b>{answers.category || "—"}</b>
        </div>
        <div className="kpi">
          <small>Califica</small>
          <b>{qualifies ? "Sí" : "Revisar"}</b>
        </div>
      </div>

      <div className="actions" style={{ marginTop: 16 }}>
        <a className="btn" href="/">
          Volver al inicio
        </a>
        <button className="btn btn-primary" onClick={onContact}>
          Contactar
        </button>
      </div>
    </div>
  );
}

/* ================== Contacto Final (sin mailto) ================== */
function ContactFinal({
  answers,
  onBack
}: {
  answers: Answers;
  onBack: () => void;
}) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Añade tu clave de Web3Forms para envío directo
  const WEB3FORMS_KEY = "YOUR_WEB3FORMS_KEY";

  const volStr = Number(answers.volume || 0).toLocaleString("es-CL");
  const skusStr = Number(answers.skus || 0).toLocaleString("es-CL");

  const template = `Hola ProcureX,
Quiero coordinar la demo. Aquí mis datos:

• Nombre: ${answers.contact.name || "—"}
• Empresa: ${answers.contact.company || "—"}
• Email: ${answers.contact.email || "—"}
• Teléfono: ${answers.contact.phone || "—"}

• Volumen mensual (CLP): $${volStr}
• SKUs activos: ${skusStr}
• Categoría: ${answers.category || "—"}
• Objetivo/Dolor: ${answers.pain || "—"}

Gracias!`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!WEB3FORMS_KEY || WEB3FORMS_KEY === "YOUR_WEB3FORMS_KEY") return; // fallback

    setSending(true);
    setError(null);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "Demo ProcureX – Precalificación",
          from_name: answers.contact.name || "Formulario ProcureX",
          email: answers.contact.email || "no-email@procure-x.cl",
          message: template
        })
      });
      const json = await res.json();
      if (json.success) setSent(true);
      else setError("No pudimos enviar el formulario. Intenta otra vez.");
    } catch {
      setError("Hubo un problema de red. Intenta nuevamente.");
    } finally {
      setSending(false);
    }
  }

  function copyToClipboard() {
    navigator.clipboard?.writeText(template);
  }

  const waURL =
    "https://wa.me/56985960018?text=" + encodeURIComponent(template);

  return (
    <div className="form">
      <h2 className="h1" style={{ fontSize: 28, marginTop: 0 }}>
        Contacto
      </h2>
      <p className="sub">
        Envíanos tus datos y coordinamos la demo. Si prefieres, usa WhatsApp o
        copia el mensaje.
      </p>

      {!sent ? (
        <form
          onSubmit={handleSubmit}
          className="contact-card"
          style={{ display: "grid", gap: "12px" }}
        >
          <div className="result" style={{ marginBottom: 8 }}>
            <div className="kpi">
              <small>Volumen</small>
              <b>${volStr}</b>
            </div>
            <div className="kpi">
              <small>SKUs</small>
              <b>{skusStr}</b>
            </div>
            <div className="kpi">
              <small>Categoría</small>
              <b>{answers.category || "—"}</b>
            </div>
          </div>

          <label>Mensaje</label>
          <textarea className="input" rows={6} defaultValue={template} readOnly />

          {(!WEB3FORMS_KEY || WEB3FORMS_KEY === "YOUR_WEB3FORMS_KEY") ? (
            <>
              <div className="help">
                (Para envío directo, agrega tu <b>access_key</b> de Web3Forms en el
                código. Mientras tanto, usa una de estas opciones:)
              </div>
              <div
                className="actions"
                style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
              >
                <button type="button" className="btn" onClick={copyToClipboard}>
                  Copiar mensaje
                </button>
                <a
                  className="btn btn-primary"
                  href={waURL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Enviar por WhatsApp
                </a>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={onBack}
                >
                  Atrás
                </button>
              </div>
            </>
          ) : (
            <div
              className="actions"
              style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                onClick={onBack}
                disabled={sending}
              >
                Atrás
              </button>
              <button type="submit" className="btn btn-primary" disabled={sending}>
                {sending ? "Enviando…" : "Enviar"}
              </button>
              <a className="btn" href={waURL} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </div>
          )}

          {error && <div className="help" style={{ color: "#fca5a5" }}>{error}</div>}
        </form>
      ) : (
        <div className="card" style={{ textAlign: "center" }}>
          <h3 className="h1" style={{ fontSize: 24 }}>¡Gracias! ✅</h3>
          <p className="sub">
            Recibimos tu solicitud. Te contactaremos para coordinar la demo.
          </p>
          <div className="actions" style={{ justifyContent: "center" }}>
            <a className="btn btn-primary" href="/">Volver al inicio</a>
          </div>
        </div>
      )}
    </div>
  );
}
