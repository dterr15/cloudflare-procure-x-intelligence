import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Swal from "sweetalert2";

/* ================== Tipos ================== */
type Answers = {
  volume: string;
  skus: string;
  category: string;
  pain: string;
  contact: { name: string; email: string; company: string; phone: string };
};

/* ================== Constantes UI ================== */
const steps = ["Perfil", "Operación", "Objetivo", "Contacto"];
const variants = {
  in: { opacity: 0, y: 16, scale: 0.98 },
  live: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -16, scale: 0.98 }
};

/* ================== Config envío a n8n ================== */
const N8N_WEBHOOK =
  (import.meta as any).env?.VITE_N8N_WEBHOOK || "https://<TU-N8N>/webhook/procurex-demo";
const N8N_TOKEN =
  (import.meta as any).env?.VITE_N8N_TOKEN || "<secreto-largo>";

/* ================== App ================== */
export default function App() {
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

  const progress = (Math.min(step, 4) + 1) / (steps.length + 1);

  function goNext() {
    if (!canNext) return;
    setStep((s) => Math.min(s + 1, 4));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  return (
    <div className="container">
      <div className="card">
        <span className="badge">Consulta gratis</span>
        <h1 className="h1">
          Agendemos tu <span style={{ color: "#20e6c4" }}>demo</span>
        </h1>
        <p className="sub">
          Responde unas preguntas rápidas. Luego obtendrás un reporte demo sin costo.
        </p>

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
              <Resumen answers={answers} onFinish={() => setStep(5)} />
            </motion.section>
          ) : (
            <motion.section
              key="final"
              initial="in"
              animate="live"
              exit="out"
              variants={variants}
              transition={{ duration: 0.22 }}
            >
              <FinalScreen />
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
        <label>¿Cuál es el principal problema a resolver u objetivo?</label>
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

/* ================== Resumen (envía a n8n) ================== */
function Resumen({
  answers,
  onFinish
}: {
  answers: Answers;
  onFinish: () => void;
}) {
  const vol = Number(answers.volume || 0);
  const skus = Number(answers.skus || 0);
  const qualifies = vol >= 15000000 && skus >= 40;

  const volStr = vol.toLocaleString("es-CL");
  const skusStr = skus.toLocaleString("es-CL");

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

  const handleFinish = async () => {
    // 1) Persistencia local (opcional)
    const completeData = {
      timestamp: new Date().toISOString(),
      profile: { volume: vol, volumeFormatted: volStr, skus, category: answers.category },
      objective: { pain: answers.pain },
      contact: { ...answers.contact },
      qualification: {
        qualifies,
        reason: qualifies
          ? "Cumple con volumen mínimo y SKUs requeridos"
          : "No cumple con los requisitos mínimos"
      }
    };
    localStorage.setItem("procurex_form_data", JSON.stringify(completeData));
    const history = JSON.parse(localStorage.getItem("procurex_form_history") || "[]");
    history.push(completeData);
    localStorage.setItem("procurex_form_history", JSON.stringify(history));

    // 2) Envío a n8n
    try {
      const payload = {
        source: "procurex-demo-form",
        subjectPrefix: "[ProcureX Demo]",          // n8n usará esto para el asunto/filtro
        volume: answers.volume,
        skus: answers.skus,
        category: answers.category,
        pain: answers.pain,
        contact: answers.contact,
        qualifies,
        preview_text: template                      // cuerpo legible para email
      };

      const res = await fetch(N8N_WEBHOOK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-ProcureX-Token": N8N_TOKEN            // verificación simple en n8n
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Webhook error");

      await Swal.fire({
        icon: "success",
        title: "¡Formulario enviado!",
        html: `
          <p style="margin: 16px 0;">Gracias por completar la evaluación.</p>
          <div style="text-align: left; background: #f3f4f6; padding: 16px; border-radius: 8px; margin-top: 16px;">
            <p style="margin: 8px 0;"><strong>Nombre:</strong> ${answers.contact.name}</p>
            <p style="margin: 8px 0;"><strong>Empresa:</strong> ${answers.contact.company}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${answers.contact.email}</p>
            <p style="margin: 8px 0;"><strong>Volumen:</strong> $${volStr}</p>
            <p style="margin: 8px 0;"><strong>SKUs:</strong> ${skusStr}</p>
            <p style="margin: 8px 0;"><strong>Califica:</strong> ${qualifies ? "✅ Sí" : "⚠️ Revisar"}</p>
          </div>
        `,
        confirmButtonText: "Finalizar",
        confirmButtonColor: "#20e6c4",
        customClass: { popup: "swal-custom", confirmButton: "swal-button" }
      });

      onFinish();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "No pudimos enviar tu formulario",
        text: "Intenta nuevamente en unos segundos."
      });
    }
  };

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
        <div className="kpi">
          <small>Califica</small>
          <b>{qualifies ? "Sí" : "Revisar"}</b>
        </div>
      </div>

      <div className="actions" style={{ marginTop: 16, justifyContent: "center" }}>
        <button className="btn btn-primary" onClick={handleFinish}>
          Finalizar
        </button>
      </div>
    </div>
  );
}

/* ================== Pantalla Final ================== */
function FinalScreen() {
  return (
    <div style={{ textAlign: "center", padding: "32px 0" }}>
      <div style={{ fontSize: "64px", marginBottom: "16px" }}>✅</div>
      <h2 className="h1" style={{ fontSize: 32, marginTop: 0 }}>
        ¡Gracias!
      </h2>
      <p className="sub" style={{ maxWidth: "400px", margin: "0 auto 24px" }}>
        Recibimos tu información correctamente. Te contactaremos pronto para coordinar tu demo personalizada.
      </p>
    </div>
  );
}
