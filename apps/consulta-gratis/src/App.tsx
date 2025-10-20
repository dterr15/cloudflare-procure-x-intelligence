import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type Answers = {
  volume: string;      // CLP (texto para permitir formateo)
  skus: string;        // número
  category: string;    // select
  pain: string;        // texto corto
  contact: { name: string; email: string; company: string; phone: string };
};

const steps = ["Perfil", "Operación", "Objetivo", "Contacto"];

const variants = {
  in:   { opacity: 0, y: 16, scale: .98 },
  live: { opacity: 1, y: 0,  scale: 1   },
  out:  { opacity: 0, y: -16, scale: .98 }
};

export default function App(){
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    volume: "",
    skus: "",
    category: "",
    pain: "",
    contact: { name:"", email:"", company:"", phone:"" }
  });

  const canNext = useMemo(() => {
    if(step === 0) return !!answers.volume && !!answers.skus;
    if(step === 1) return !!answers.category;
    if(step === 2) return !!answers.pain && answers.pain.trim().length >= 10;
    if(step === 3) {
      const c = answers.contact;
      return c.name && /\S+@\S+\.\S+/.test(c.email);
    }
    return true;
  }, [step, answers]);

  const progress = (step+1) / (steps.length + 1); // +1 para el resumen

  function goNext(){
    if(!canNext) return;
    setStep(s => Math.min(s+1, steps.length));
  }
  function goBack(){
    setStep(s => Math.max(s-1, 0));
  }

  return (
    <div className="container">
      <div className="card">
        <span className="badge">Consulta gratis</span>
        <h1 className="h1">Agendemos tu <span style={{color:"#20e6c4"}}>demo</span> + pre-calificación</h1>
        <p className="sub">Responde unas preguntas rápidas. Siempre obtendrás un reporte demo. Si calificas, seguimos al proceso de nurture.</p>

        {/* progreso */}
        <div className="progress" aria-hidden>
          {Array.from({length:5}).map((_,i)=>(
            <div key={i} className={`dot ${i < Math.ceil(progress*5) ? "active":""}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step <= 3 ? (
            <motion.section
              key={step}
              initial="in" animate="live" exit="out" variants={variants} transition={{duration:.22}}
            >
              {step === 0 && (
                <StepPerfil
                  value={answers}
                  onChange={setAnswers}
                />
              )}
              {step === 1 && (
                <StepOperacion
                  value={answers}
                  onChange={setAnswers}
                />
              )}
              {step === 2 && (
                <StepObjetivo
                  value={answers}
                  onChange={setAnswers}
                />
              )}
              {step === 3 && (
                <StepContacto
                  value={answers}
                  onChange={setAnswers}
                />
              )}

              <div className="actions">
                <button className="btn btn-ghost" type="button" onClick={goBack} disabled={step===0}>Atrás</button>
                <button className="btn btn-primary" type="button" onClick={goNext} disabled={!canNext}>Siguiente</button>
              </div>
            </motion.section>
          ) : (
            <motion.section
              key="summary"
              initial="in" animate="live" exit="out" variants={variants} transition={{duration:.22}}
            >
              <Resumen answers={answers} />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ========== PASOS ========== */
function StepPerfil({ value, onChange }: {
  value: Answers; onChange: (v: Answers)=>void;
}){
  return (
    <div className="form">
      <div className="row">
        <div>
          <label>Volumen mensual aprox. (CLP)</label>
          <input
            className="input" inputMode="numeric" placeholder="p.ej. 20000000"
            value={value.volume}
            onChange={e=> onChange({...value, volume: e.target.value.replace(/[^\d]/g,"")})}
          />
          <div className="help">Solo números, sin puntos.</div>
        </div>
        <div>
          <label># de SKUs activos</label>
          <input
            className="input" inputMode="numeric" placeholder="p.ej. 150"
            value={value.skus}
            onChange={e=> onChange({...value, skus: e.target.value.replace(/[^\d]/g,"")})}
          />
        </div>
      </div>
    </div>
  );
}

function StepOperacion({ value, onChange }: {
  value: Answers; onChange: (v: Answers)=>void;
}){
  return (
    <div className="form">
      <div>
        <label>Categoría predominante</label>
        <select
          className="input"
          value={value.category}
          onChange={e=> onChange({...value, category: e.target.value})}
        >
          <option value="" disabled>Selecciona…</option>
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

function StepObjetivo({ value, onChange }: {
  value: Answers; onChange: (v: Answers)=>void;
}){
  return (
    <div className="form">
      <div>
        <label>¿Cuál es el principal dolor u objetivo?</label>
        <input
          className="input" placeholder="Ej: bajar costo en X, normalizar plazos, etc."
          value={value.pain}
          onChange={e=> onChange({...value, pain: e.target.value})}
        />
        <div className="help">En 10–140 caracteres aprox.</div>
      </div>
    </div>
  );
}

function StepContacto({ value, onChange }: {
  value: Answers; onChange: (v: Answers)=>void;
}){
  const c = value.contact;
  return (
    <div className="form">
      <div className="row">
        <div>
          <label>Nombre</label>
          <input className="input" value={c.name} onChange={e=> onChange({...value, contact:{...c, name:e.target.value}})} />
        </div>
        <div>
          <label>Empresa</label>
          <input className="input" value={c.company} onChange={e=> onChange({...value, contact:{...c, company:e.target.value}})} />
        </div>
      </div>
      <div className="row">
        <div>
          <label>Email</label>
          <input className="input" type="email" value={c.email} onChange={e=> onChange({...value, contact:{...c, email:e.target.value}})} />
        </div>
        <div>
          <label>Teléfono (opcional)</label>
          <input className="input" value={c.phone} onChange={e=> onChange({...value, contact:{...c, phone:e.target.value}})} />
        </div>
      </div>
    </div>
  );
}

/* ========== RESUMEN / DEMO ========== */
function Resumen({ answers }: { answers: Answers }){
  const vol = Number(answers.volume || 0);
  const skus = Number(answers.skus || 0);

  // demo: decisión simple para “califica”
  const qualifies = vol >= 15000000 && skus >= 40;

  return (
    <div>
      <h2 className="h1" style={{fontSize:28, marginTop:0}}>¡Listo! Generaremos tu <span style={{color:"#20e6c4"}}>reporte demo</span></h2>
      <p className="sub">
        Enviaremos un PDF con hallazgos base y recomendaciones. 
        {qualifies ? " Además, pasas a la etapa de nurture para coordinar la demo completa.": " Si deseas contratar, verás las condiciones en el anexo del reporte."}
      </p>

      <div className="result">
        <div className="kpi"><small>Volumen</small><b>${vol.toLocaleString("es-CL")}</b></div>
        <div className="kpi"><small>SKUs</small><b>{skus.toLocaleString("es-CL")}</b></div>
        <div className="kpi"><small>Categoría</small><b>{answers.category || "—"}</b></div>
        <div className="kpi"><small>Califica</small><b>{qualifies ? "Sí" : "Demo / condiciones"}</b></div>
      </div>

      <div className="actions" style={{marginTop:16}}>
        <a className="btn" href="/">Volver al inicio</a>
        <a className="btn btn-primary" href="mailto:px@procure-x.cl?subject=Demo%20ProcureX%20–%20Precalificado">Contactar por correo</a>
      </div>
    </div>
  );
}
