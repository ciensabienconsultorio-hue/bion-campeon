// ============================================================
// BION MENTE DE CAMPEÓN — MVP Final v2.0
// Stack: React + Tailwind CSS + LocalStorage
// Preparado para migración a Supabase
// ============================================================

import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────
// 1. CONTENIDO DIARIO — Frases y Anécdotas
// ─────────────────────────────────────────────
const DAILY_CONTENT = [
  {
    type: "frase",
    text: "El dolor de hoy es la fuerza de mañana.",
    author: "Arnold Schwarzenegger",
  },
  {
    type: "anecdota",
    text: "Kobe Bryant llegaba al gimnasio a las 4am antes que cualquier compañero. Cuando le preguntaron por qué, respondió: \"¿Sabes cuántas canastas puedes meter en el tiempo que los demás duermen?\"",
    author: "Kobe Bryant — NBA",
  },
  {
    type: "frase",
    text: "No tengo miedo a fallar. Tengo miedo a no haberlo intentado.",
    author: "Michael Jordan",
  },
  {
    type: "anecdota",
    text: "Lionel Messi fue rechazado por su primer club europeo porque era 'demasiado pequeño'. Con 13 años, viajó solo a Barcelona con un contrato escrito en una servilleta. Ese rechazo fue su combustible.",
    author: "Lionel Messi — FC Barcelona",
  },
  {
    type: "frase",
    text: "Un campeón es alguien que se levanta cuando no puede.",
    author: "Jack Dempsey",
  },
  {
    type: "anecdota",
    text: "Usain Bolt perdió su primera final olímpica importante. En lugar de rendirse, analizó sus errores durante meses. En Beijing 2008 rompió el récord mundial y celebró antes de cruzar la meta. La confianza se entrena.",
    author: "Usain Bolt — Jamaica",
  },
  {
    type: "frase",
    text: "El talento gana partidos. El trabajo en equipo gana campeonatos.",
    author: "Michael Jordan",
  },
  {
    type: "anecdota",
    text: "Simone Biles cayó en su primera competencia juvenil importante. Su entrenadora le dijo: \"Caíste una vez. Eso no dice quién eres. Levantarte dice quién eres.\" Simone ganó 7 medallas olímpicas.",
    author: "Simone Biles — Gimnasia USA",
  },
  {
    type: "frase",
    text: "No cuentes los días. Haz que los días cuenten.",
    author: "Muhammad Ali",
  },
  {
    type: "anecdota",
    text: "Cristiano Ronaldo era el más delgado y el más pequeño de su academia. Los compañeros se reían de él. Decidió entrenar dos horas después que todos los demás. Hoy tiene más Balones de Oro que cualquiera de esos compañeros.",
    author: "Cristiano Ronaldo — Sporting Lisboa",
  },
  {
    type: "frase",
    text: "La diferencia entre lo posible y lo imposible está en la voluntad.",
    author: "Tommy Lasorda",
  },
  {
    type: "anecdota",
    text: "Roger Federer perdió en primera ronda de Wimbledon a los 19 años. Lloró en el vestuario. Su entrenador le dijo: \"Los mejores no son los que nunca pierden. Son los que aprenden más rápido de cada derrota.\"",
    author: "Roger Federer — Tenis",
  },
  {
    type: "frase",
    text: "Cada error que cometes es un paso hacia la versión que necesitas ser.",
    author: "BION Mente de Campeón",
  },
  {
    type: "anecdota",
    text: "Paolo Guerrero fue suspendido injustamente antes del Mundial 2018. Entrenó solo, sin equipo, sin certeza de jugar. Cuando le levantaron la suspensión, entró al campo y marcó. El coraje no depende de las circunstancias.",
    author: "Paolo Guerrero — Perú",
  },
  {
    type: "frase",
    text: "La presión no te rompe. Revela de qué estás hecho.",
    author: "BION Mente de Campeón",
  },
];

function getDailyContent() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  return DAILY_CONTENT[dayIndex % DAILY_CONTENT.length];
}

// ─────────────────────────────────────────────
// 2. DATOS: PREGUNTAS DE EVALUACIÓN
// ─────────────────────────────────────────────
const EVALUATION_QUESTIONS = [
  { id: "m1", dim: "miedo", label: "Me da miedo equivocarme durante un partido importante.", inverted: true },
  { id: "m2", dim: "miedo", label: "Cuando fallo, siento que el entrenador deja de confiar en mí.", inverted: true },
  { id: "m3", dim: "miedo", label: "Me intimida jugar contra rivales más fuertes.", inverted: true },
  { id: "p1", dim: "proposito", label: "Tengo claro por qué juego fútbol." },
  { id: "p2", dim: "proposito", label: "Estoy dispuesto a esforzarme aunque nadie me vea." },
  { id: "p3", dim: "proposito", label: "Mi sueño deportivo es más grande que mi miedo." },
  { id: "a1", dim: "autoeficacia", label: "Confío en que puedo recuperarme después de un error." },
  { id: "a2", dim: "autoeficacia", label: "Sé qué hacer cuando estoy nervioso." },
  { id: "a3", dim: "autoeficacia", label: "Creo que puedo mejorar si entreno con disciplina." },
  { id: "c1", dim: "compromiso", label: "Juego para ayudar al equipo, no solo para lucirme." },
  { id: "c2", dim: "compromiso", label: "Cuando un compañero falla, lo apoyo." },
  { id: "c3", dim: "compromiso", label: "Aunque tenga miedo, sigo luchando por mis compañeros." },
  { id: "t1", dim: "tolerancia", label: "Después de fallar, vuelvo a pedir la pelota." },
  { id: "t2", dim: "tolerancia", label: "No permito que un error arruine todo mi partido." },
  { id: "t3", dim: "tolerancia", label: "Aprendo de mis errores sin destruir mi confianza." },
];

// ─────────────────────────────────────────────
// 3. DATOS: MISIONES DIARIAS
// ─────────────────────────────────────────────
const MISSIONS = [
  { id: 1, icon: "⚡", title: "10 segundos de coraje", xp: 30,
    desc: "Hoy, si cometes un error en entrenamiento, pide la siguiente pelota en menos de 10 segundos. Al terminar, escribe qué pasó.", action: "Completar misión" },
  { id: 2, icon: "✍️", title: "¿Qué miedo enfrenté hoy?", xp: 40,
    desc: "Escribe en 2-3 líneas: ¿qué miedo apareciste hoy y cómo lo manejaste? Sé honesto.", action: "Guardar reflexión" },
  { id: 3, icon: "🔥", title: "Mi frase de reinicio", xp: 25,
    desc: "Escribe tu frase personal para usar después de un error. Algo que te recuerde quién eres cuando el partido se pone difícil.", action: "Guardar frase" },
  { id: 4, icon: "🧠", title: "Carta a mi yo nervioso", xp: 45,
    desc: "Escribe un mensaje corto para ti mismo cuando estés nervioso antes de un partido importante. ¿Qué necesitás escuchar en ese momento?", action: "Guardar carta" },
  { id: 5, icon: "🎯", title: "Propósito en una línea", xp: 30,
    desc: "Completa esta frase: 'Yo juego porque...' Escríbela como si se la explicaras a alguien que nunca te ha visto jugar.", action: "Guardar propósito" },
  { id: 6, icon: "🤝", title: "El compañero invisible", xp: 25,
    desc: "Piensa en un compañero que está pasando un momento difícil. Escribe qué harías hoy en el entrenamiento para apoyarlo sin que se note.", action: "Guardar reflexión" },
  { id: 7, icon: "💪", title: "Mi victoria de hoy", xp: 35,
    desc: "Escribe una victoria pequeña de hoy. No tiene que ser un gol. Puede ser haber pedido la pelota con miedo, haber apoyado a un compañero, haber entrenado con ganas.", action: "Guardar victoria" },
];

// ─────────────────────────────────────────────
// 4. DATOS: NIVELES E INSIGNIAS
// ─────────────────────────────────────────────
const LEVELS = [
  { name: "Recluta",    minXP: 0,    icon: "🎽", color: "#6b7280" },
  { name: "Competidor", minXP: 100,  icon: "⚔️", color: "#3b82f6" },
  { name: "Guerrero",   minXP: 300,  icon: "🛡️", color: "#8b5cf6" },
  { name: "Capitán",    minXP: 600,  icon: "⭐", color: "#f59e0b" },
  { name: "Leyenda",    minXP: 1000, icon: "👑", color: "#fbbf24" },
];

const BADGES = [
  { id: "primera_mision",      label: "Primera misión",          icon: "🔄", desc: "Completaste tu primera misión" },
  { id: "racha_3",             label: "3 días seguidos",         icon: "🔥", desc: "3 días de racha" },
  { id: "racha_7",             label: "Coraje bajo presión",     icon: "💎", desc: "7 días de racha" },
  { id: "reflexion_profunda",  label: "Mente de campeón",        icon: "🧠", desc: "Escribiste 5 reflexiones" },
  { id: "no_me_escondo",       label: "No me escondo",           icon: "🦁", desc: "Completaste misión de acción" },
  { id: "capitan_esfuerzo",    label: "Capitán del esfuerzo",    icon: "🏆", desc: "Alcanzaste nivel Capitán" },
];

// ─────────────────────────────────────────────
// 5. LÓGICA: CÁLCULO DE PUNTAJES
// ─────────────────────────────────────────────
const DIMS = [
  { key: "miedo",       label: "Gestión del Miedo",  inverted: true },
  { key: "proposito",   label: "Propósito" },
  { key: "autoeficacia",label: "Autoeficacia" },
  { key: "compromiso",  label: "Compromiso" },
  { key: "tolerancia",  label: "Tolerancia al Error" },
];

function calcDimScore(answers, dim) {
  const qs = EVALUATION_QUESTIONS.filter(q => q.dim === dim);
  const sum = qs.reduce((acc, q) => {
    const val = answers[q.id] || 3;
    return acc + (q.inverted ? (6 - val) : val);
  }, 0);
  return Math.round((sum / (qs.length * 5)) * 100);
}

function calcCoraje(answers) {
  const P = calcDimScore(answers, "proposito") / 100;
  const A = calcDimScore(answers, "autoeficacia") / 100;
  const C = calcDimScore(answers, "compromiso") / 100;
  const T = calcDimScore(answers, "tolerancia") / 100;
  const M = Math.max(calcDimScore(answers, "miedo") / 100, 0.1);
  return Math.min(100, Math.round((P * A * C * T) / M * 100));
}

function getLevel(xp) {
  let level = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.minXP) level = l; }
  return level;
}

function getLevelIndex(xp) {
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) { if (xp >= LEVELS[i].minXP) idx = i; }
  return idx;
}

function getTrafficLight(score) {
  if (score >= 70) return { label: "Alto",  color: "#22c55e", bg: "#052e16" };
  if (score >= 40) return { label: "Medio", color: "#f59e0b", bg: "#1c1a06" };
  return             { label: "Bajo",  color: "#ef4444", bg: "#1c0505" };
}

function getProfilePhrase(scores) {
  const sorted = Object.entries(scores).sort((a, b) => a[1] - b[1]);
  const weakest = sorted[0][0];
  return {
    miedo:        "Tu principal desafío es aprender a actuar con valentía incluso cuando el miedo aparece. El miedo no desaparece — aprendés a competir con él.",
    proposito:    "Conectá más profundo con tu razón de jugar. Cuando el propósito es claro, el miedo se achica.",
    autoeficacia: "Tu trabajo principal es construir confianza en vos mismo. Cada error bien manejado es un ladrillo de esa confianza.",
    compromiso:   "Tu equipo es tu fortaleza. Cuando jugás para ellos, encontrás coraje que no sabías que tenías.",
    tolerancia:   "Tu principal desafío no es la falta de talento. Es aprender a recuperarte más rápido después del error.",
  }[weakest];
}

function checkBadges(profile) {
  const badges = [...profile.earnedBadges];
  const add = (id) => { if (!badges.includes(id)) badges.push(id); };
  if (profile.completedMissions.length >= 1) add("primera_mision");
  if (profile.streak >= 3) add("racha_3");
  if (profile.streak >= 7) add("racha_7");
  if (profile.library.length >= 5) add("reflexion_profunda");
  if (profile.completedMissions.some(m => m.id === 1)) add("no_me_escondo");
  if (profile.xp >= 600) add("capitan_esfuerzo");
  return badges;
}

// ─────────────────────────────────────────────
// 6. STORAGE
// ─────────────────────────────────────────────
const STORAGE_KEY = "bion_player_v2";
const LEAD_KEY    = "bion_lead_v2";

function loadProfile() {
  try { const d = localStorage.getItem(STORAGE_KEY); return d ? JSON.parse(d) : null; }
  catch { return null; }
}

function saveProfile(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
}

function saveLead(lead) {
  // → Migración futura: supabase.from('leads').insert(lead)
  localStorage.setItem(LEAD_KEY, JSON.stringify(lead));
}

function createProfile(name, answers) {
  const scores = {};
  DIMS.forEach(d => { scores[d.key] = calcDimScore(answers, d.key); });
  return {
    name, answers, scores,
    coraje: calcCoraje(answers),
    xp: 0, streak: 0,
    lastMissionDate: null,
    completedMissions: [],
    earnedBadges: [],
    library: [],
  };
}

// ─────────────────────────────────────────────
// 7. COMPONENTES BASE
// ─────────────────────────────────────────────

function Card({ children, className = "", glow = false, style = {} }) {
  return (
    <div className={`rounded-2xl p-4 ${className}`}
      style={{
        background: "rgba(15,20,30,0.95)",
        border: "1px solid rgba(6,182,212,0.15)",
        boxShadow: glow ? "0 0 24px rgba(6,182,212,0.08)" : "none",
        ...style
      }}>
      {children}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", size = "md", disabled = false, fullWidth = true }) {
  const base = `font-bold rounded-xl transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${fullWidth ? "w-full" : ""}`;
  const sizes = { sm: "px-4 py-2 text-sm", md: "px-5 py-3 text-base", lg: "px-6 py-4 text-lg" };
  const styles = {
    primary: { background: "linear-gradient(135deg,#06b6d4,#0891b2)", color: "#000" },
    ghost:   { background: "transparent", border: "1.5px solid rgba(6,182,212,0.35)", color: "#06b6d4" },
    subtle:  { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#9ca3af" },
  };
  return (
    <button disabled={disabled} onClick={onClick}
      className={`${base} ${sizes[size]}`}
      style={styles[variant]}>
      {children}
    </button>
  );
}

function ProgressBar({ label, value, score, color }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{score}%</span>
      </div>
      <div style={{ background: "#1f2937", borderRadius: 99, height: 5 }}>
        <div style={{ width: `${value}%`, height: 5, borderRadius: 99, background: color, transition: "width .7s" }} />
      </div>
    </div>
  );
}

function TrafficBadge({ score }) {
  const tl = getTrafficLight(score);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700,
      background: tl.bg, color: tl.color, border: `1px solid ${tl.color}33`
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: tl.color, display: "inline-block" }} />
      {tl.label}
    </span>
  );
}

function Avatar({ xp, size = 52 }) {
  const idx = getLevelIndex(xp);
  const lv = LEVELS[idx];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", display: "flex",
      alignItems: "center", justifyContent: "center", fontSize: size * 0.42,
      border: `2px solid ${lv.color}55`,
      background: `radial-gradient(circle, ${lv.color}15, transparent)`
    }}>
      {lv.icon}
    </div>
  );
}

function BackBtn({ onClick }) {
  return (
    <button onClick={onClick}
      style={{ background: "none", border: "none", color: "#6b7280", fontSize: 13, cursor: "pointer", marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
      ← Volver
    </button>
  );
}

// ─────────────────────────────────────────────
// 8. COMPONENTE: CONTENIDO DIARIO
// ─────────────────────────────────────────────
function DailyContentCard() {
  const content = getDailyContent();
  const isFrase = content.type === "frase";
  return (
    <Card style={{ borderColor: "rgba(251,191,36,0.2)", marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>{isFrase ? "⚡" : "📖"}</span>
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
            {isFrase ? "Frase de poder" : "Anécdota del día"}
          </p>
          <p style={{ color: "#e2e8f0", fontSize: 13, lineHeight: 1.65, fontStyle: "italic", marginBottom: 6 }}>
            "{content.text}"
          </p>
          <p style={{ color: "#6b7280", fontSize: 11, fontWeight: 600 }}>— {content.author}</p>
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────
// 9. PANTALLA: HOME
// ─────────────────────────────────────────────
function HomeScreen({ hasProfile, onStart, onMission }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "space-between",
      padding: "60px 24px 40px",
      background: "radial-gradient(ellipse at top, #0a1628 0%, #060a10 60%, #000 100%)"
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 72, height: 72, borderRadius: 20, fontSize: 32,
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
          background: "rgba(6,182,212,0.15)", border: "2px solid #06b6d4"
        }}>⚡</div>
        <p style={{ color: "#06b6d4", fontSize: 10, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: 6 }}>BION</p>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "#fff", lineHeight: 1.2 }}>
          Mente de<br />
          <span style={{ background: "linear-gradient(135deg,#06b6d4,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Campeón
          </span>
        </h1>
      </div>

      <div style={{ textAlign: "center", maxWidth: 280, padding: "24px 0" }}>
        <div style={{ width: 36, height: 1, background: "rgba(6,182,212,0.4)", margin: "0 auto 18px" }} />
        <p style={{ color: "#d1d5db", fontSize: 14, lineHeight: 1.75, fontStyle: "italic" }}>
          "No entrenamos chicos sin miedo.<br />
          <span style={{ color: "#67e8f9", fontWeight: 700, fontStyle: "normal" }}>
            Entrenamos campeones que compiten con miedo.
          </span>"
        </p>
        <div style={{ width: 36, height: 1, background: "rgba(6,182,212,0.4)", margin: "18px auto 0" }} />
      </div>

      <div style={{ width: "100%", maxWidth: 320 }}>
        {hasProfile ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Btn onClick={onMission} size="lg">🎯 Misión de hoy</Btn>
            <Btn onClick={onStart} variant="ghost" size="lg">📊 Mi dashboard</Btn>
          </div>
        ) : (
          <>
            <Btn onClick={onStart} size="lg">🚀 Comenzar evaluación</Btn>
            <p style={{ textAlign: "center", color: "#4b5563", fontSize: 12, marginTop: 10 }}>Evaluación inicial · 5 min</p>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 10. PANTALLA: EVALUACIÓN
// ─────────────────────────────────────────────
const DIM_META = {
  miedo:        { name: "Miedo Competitivo",   icon: "😰" },
  proposito:    { name: "Propósito Deportivo",  icon: "🎯" },
  autoeficacia: { name: "Autoeficacia",         icon: "💪" },
  compromiso:   { name: "Compromiso de Equipo", icon: "🤝" },
  tolerancia:   { name: "Tolerancia al Error",  icon: "🔄" },
};
const DIM_KEYS = ["miedo", "proposito", "autoeficacia", "compromiso", "tolerancia"];

function EvaluationScreen({ onComplete }) {
  const [step, setStep] = useState(-1);
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({});

  if (step === -1) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", background: "#060a10" }}>
        <div style={{ maxWidth: 360, margin: "0 auto", width: "100%" }}>
          <p style={{ color: "#06b6d4", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Evaluación inicial</p>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 6 }}>¿Cómo te llamamos, campeón?</h2>
          <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 24 }}>Tu nombre aparecerá en tu perfil mental.</p>
          <input
            style={{ width: "100%", background: "#111827", border: "1.5px solid rgba(6,182,212,0.25)", borderRadius: 12, padding: "12px 16px", color: "#fff", fontSize: 16, fontWeight: 600, outline: "none", marginBottom: 16 }}
            placeholder="Tu nombre o apodo..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && name.trim() && setStep(0)}
          />
          <Btn onClick={() => setStep(0)} size="lg" disabled={!name.trim()}>Comenzar →</Btn>
        </div>
      </div>
    );
  }

  const dimKey = DIM_KEYS[step];
  const dimQs  = EVALUATION_QUESTIONS.filter(q => q.dim === dimKey);
  const allAnswered = dimQs.every(q => answers[q.id]);
  const meta = DIM_META[dimKey];
  const pct  = Math.round(((step + 1) / DIM_KEYS.length) * 100);

  const handleNext = () => {
    if (step < DIM_KEYS.length - 1) setStep(s => s + 1);
    else onComplete(name.trim(), answers);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "28px 20px 32px", background: "#060a10" }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>
        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 11, color: "#6b7280" }}>{step + 1} / {DIM_KEYS.length}</span>
          <span style={{ fontSize: 11, color: "#06b6d4", fontWeight: 700 }}>{pct}%</span>
        </div>
        <div style={{ background: "#1f2937", borderRadius: 99, height: 4, marginBottom: 24 }}>
          <div style={{ width: `${pct}%`, height: 4, borderRadius: 99, background: "#06b6d4", transition: "width .5s" }} />
        </div>

        {/* Dimensión header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <span style={{ fontSize: 34 }}>{meta.icon}</span>
          <div>
            <p style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.1em" }}>Dimensión {step + 1}</p>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{meta.name}</h2>
          </div>
        </div>

        {/* Preguntas */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {dimQs.map(q => (
            <Card key={q.id}>
              <p style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 500, lineHeight: 1.6, marginBottom: 12 }}>{q.label}</p>
              <div style={{ display: "flex", gap: 6 }}>
                {[1, 2, 3, 4, 5].map(val => (
                  <button key={val}
                    onClick={() => setAnswers(a => ({ ...a, [q.id]: val }))}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all .15s",
                      background: answers[q.id] === val ? "linear-gradient(135deg,#06b6d4,#0891b2)" : "#111827",
                      color: answers[q.id] === val ? "#000" : "#6b7280",
                      border: answers[q.id] === val ? "none" : "1px solid #1f2937"
                    }}>
                    {val}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                <span style={{ fontSize: 10, color: "#4b5563" }}>Nunca</span>
                <span style={{ fontSize: 10, color: "#4b5563" }}>Siempre</span>
              </div>
            </Card>
          ))}
        </div>

        <Btn onClick={handleNext} size="lg" disabled={!allAnswered}>
          {step < DIM_KEYS.length - 1 ? "Siguiente dimensión →" : "Ver mi perfil mental →"}
        </Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 11. PANTALLA: RESULTADO
// ─────────────────────────────────────────────
function ResultScreen({ profile, onContinue }) {
  const { scores, coraje, name } = profile;
  return (
    <div style={{ minHeight: "100vh", padding: "28px 20px 40px", background: "#060a10" }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 10, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Tu perfil mental</p>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 4 }}>Hola, {name} 👋</h2>
          <p style={{ color: "#6b7280", fontSize: 13 }}>Tu diagnóstico inicial de Coraje Deportivo</p>
        </div>

        <Card glow style={{ textAlign: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Coraje Deportivo Total</p>
          <div style={{ fontSize: 60, fontWeight: 900, background: "linear-gradient(135deg,#06b6d4,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
            {coraje}
          </div>
          <p style={{ color: "#6b7280", fontSize: 11, margin: "4px 0 10px" }}>sobre 100</p>
          <TrafficBadge score={coraje} />
        </Card>

        <Card style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Por dimensión</p>
          {DIMS.map(d => {
            const tl = getTrafficLight(scores[d.key]);
            return <ProgressBar key={d.key} label={d.label} value={scores[d.key]} score={scores[d.key]} color={tl.color} />;
          })}
        </Card>

        <Card style={{ marginBottom: 24, borderColor: "rgba(6,182,212,0.25)" }}>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
            <div>
              <p style={{ fontSize: 10, color: "#06b6d4", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Tu reto principal</p>
              <p style={{ color: "#d1d5db", fontSize: 13, lineHeight: 1.65, fontStyle: "italic" }}>"{getProfilePhrase(scores)}"</p>
            </div>
          </div>
        </Card>

        <Btn onClick={onContinue} size="lg">Continuar →</Btn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 12. PANTALLA: CAPTURA DE LEAD
// ─────────────────────────────────────────────
function LeadCaptureScreen({ profile, onComplete, onSkip }) {
  const [age,   setAge]   = useState("");
  const [club,  setClub]  = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const inputStyle = {
    width: "100%", background: "#111827", border: "1.5px solid rgba(6,182,212,0.2)",
    borderRadius: 12, padding: "12px 14px", color: "#fff", fontSize: 15, outline: "none",
    fontFamily: "inherit",
  };

  const handleSave = () => {
    if (!phone.trim()) { setError("El teléfono es necesario para enviarte las misiones."); return; }
    setError("");
    const lead = {
      name:  profile.name,
      age:   age  || null,
      club:  club || null,
      phone: phone.trim(),
      coraje: profile.coraje,
      scores: profile.scores,
      registeredAt: new Date().toISOString(),
      source: "post_evaluation",
    };
    saveLead(lead);
    onComplete();
  };

  return (
    <div style={{ minHeight: "100vh", padding: "28px 20px 40px", background: "#060a10" }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>

        {/* Resultado resumido */}
        <Card glow style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div style={{ fontSize: 36, fontWeight: 900, background: "linear-gradient(135deg,#06b6d4,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
              {profile.coraje}
            </div>
            <p style={{ fontSize: 10, color: "#6b7280" }}>coraje</p>
          </div>
          <div>
            <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Perfil de</p>
            <p style={{ fontSize: 17, fontWeight: 900, color: "#fff", marginBottom: 6 }}>{profile.name}</p>
            <TrafficBadge score={profile.coraje} />
          </div>
        </Card>

        <p style={{ fontSize: 10, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Siguiente paso</p>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Guarda tu perfil</h2>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20, lineHeight: 1.6 }}>
          Completa estos datos para recibir recordatorios de misiones y ver tu evolución completa.
        </p>

        {/* Beneficios */}
        <Card style={{ marginBottom: 20 }}>
          {[
            { icon: "📈", text: "Seguimiento de tu evolución por temporada" },
            { icon: "🔔", text: "Alertas de misiones diarias por WhatsApp" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i === 0 ? 10 : 0 }}>
              <span style={{ fontSize: 18 }}>{b.icon}</span>
              <p style={{ color: "#d1d5db", fontSize: 13 }}>{b.text}</p>
            </div>
          ))}
        </Card>

        {/* Campos */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Teléfono de contacto *</p>
            <input style={{ ...inputStyle, borderColor: error ? "#ef4444" : "rgba(6,182,212,0.2)" }}
              type="tel" placeholder="+51 999 999 999"
              value={phone} onChange={e => { setPhone(e.target.value); setError(""); }} />
            {error && <p style={{ color: "#ef4444", fontSize: 11, marginTop: 4 }}>{error}</p>}
            <p style={{ color: "#4b5563", fontSize: 11, marginTop: 4 }}>🔒 Solo para envío de misiones. No se comparte.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Edad</p>
              <input style={inputStyle} type="number" placeholder="15" min="10" max="25"
                value={age} onChange={e => setAge(e.target.value)} />
            </div>
            <div>
              <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Categoría</p>
              <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }}
                value={age} onChange={e => setAge(e.target.value)}>
                <option value="">Seleccionar</option>
                {["Sub-10","Sub-12","Sub-14","Sub-16","Sub-18","Sub-20","Senior"].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Club o academia</p>
            <input style={inputStyle} type="text" placeholder="Ej. Academia XYZ, Club Sporting..."
              value={club} onChange={e => setClub(e.target.value)} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Btn onClick={handleSave} size="lg">Guardar y comenzar →</Btn>
          <Btn onClick={onSkip} variant="subtle" size="md">Ahora no, saltar este paso</Btn>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 13. PANTALLA: DASHBOARD
// ─────────────────────────────────────────────
function DashboardScreen({ profile, onMission, onLibrary, onCoach, onParents }) {
  const li    = getLevelIndex(profile.xp);
  const lv    = LEVELS[li];
  const next  = LEVELS[li + 1];
  const todayMission = MISSIONS[profile.completedMissions.length % MISSIONS.length];
  const todayDone    = profile.lastMissionDate === new Date().toDateString();
  const xpToNext     = next ? next.minXP - profile.xp : null;
  const lvPct        = next ? Math.round(((profile.xp - lv.minXP) / (next.minXP - lv.minXP)) * 100) : 100;

  return (
    <div style={{ minHeight: "100vh", padding: "24px 20px 90px", background: "#060a10" }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
          <Avatar xp={profile.xp} size={52} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>{lv.name}</p>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff" }}>{profile.name}</h2>
            <p style={{ fontSize: 12, color: "#06b6d4" }}>{profile.xp} XP · Racha 🔥 {profile.streak} días</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 26, fontWeight: 900, background: "linear-gradient(135deg,#06b6d4,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
              {profile.coraje}
            </div>
            <p style={{ fontSize: 10, color: "#6b7280" }}>coraje</p>
          </div>
        </div>

        {/* Nivel progress */}
        {next && (
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "#9ca3af" }}>Hacia {next.icon} {next.name}</span>
              <span style={{ fontSize: 11, color: "#06b6d4" }}>{xpToNext} XP</span>
            </div>
            <div style={{ background: "#1f2937", borderRadius: 99, height: 4 }}>
              <div style={{ width: `${lvPct}%`, height: 4, borderRadius: 99, background: "linear-gradient(90deg,#06b6d4,#fbbf24)", transition: "width .7s" }} />
            </div>
          </Card>
        )}

        {/* Contenido diario */}
        <DailyContentCard />

        {/* Misión del día */}
        <p style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Misión de hoy</p>
        <Card glow style={{ marginBottom: 16, opacity: todayDone ? 0.65 : 1 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 28 }}>{todayMission.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{todayMission.title}</p>
              <p style={{ color: "#9ca3af", fontSize: 12, lineHeight: 1.6, marginBottom: 10 }}>{todayMission.desc}</p>
              {todayDone
                ? <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 700 }}>✅ Completada hoy</span>
                : <Btn onClick={onMission} size="sm" fullWidth={false}>+{todayMission.xp} XP →</Btn>
              }
            </div>
          </div>
        </Card>

        {/* Dimensiones */}
        <p style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Mi coraje deportivo</p>
        <Card style={{ marginBottom: 16 }}>
          {DIMS.map(d => {
            const tl = getTrafficLight(profile.scores[d.key]);
            return <ProgressBar key={d.key} label={d.label} value={profile.scores[d.key]} score={profile.scores[d.key]} color={tl.color} />;
          })}
        </Card>

        {/* Insignias */}
        <p style={{ fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>Mis insignias</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
          {BADGES.map(b => {
            const earned = profile.earnedBadges.includes(b.id);
            return (
              <div key={b.id} style={{
                borderRadius: 14, padding: "12px 8px", textAlign: "center",
                background: earned ? "rgba(6,182,212,0.08)" : "rgba(15,20,30,0.6)",
                border: `1px solid ${earned ? "rgba(6,182,212,0.25)" : "#1f2937"}`,
                opacity: earned ? 1 : 0.35,
              }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{b.icon}</div>
                <p style={{ fontSize: 10, fontWeight: 700, color: earned ? "#e2e8f0" : "#4b5563", lineHeight: 1.3 }}>{b.label}</p>
              </div>
            );
          })}
        </div>

        {/* Accesos */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "📚", label: "Biblioteca", sub: "Mis reflexiones", onClick: onLibrary },
            { icon: "🎽", label: "Panel Entrenador", sub: "Vista técnica", onClick: onCoach },
            { icon: "👨‍👩‍👦", label: "Panel Padres", sub: "Vista familiar", onClick: onParents, span: true },
          ].map((item, i) => (
            <button key={i}
              onClick={item.onClick}
              style={{
                gridColumn: item.span ? "1 / -1" : "auto",
                background: "rgba(15,20,30,0.9)", border: "1px solid rgba(6,182,212,0.12)",
                borderRadius: 16, padding: 14, textAlign: "left", cursor: "pointer", color: "#fff",
                display: "flex", alignItems: "center", gap: item.span ? 12 : 0,
                flexDirection: item.span ? "row" : "column",
              }}>
              <span style={{ fontSize: 22, marginBottom: item.span ? 0 : 6 }}>{item.icon}</span>
              <div>
                <p style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{item.label}</p>
                <p style={{ fontSize: 11, color: "#6b7280" }}>{item.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 14. PANTALLA: MISIÓN
// ─────────────────────────────────────────────
function MissionScreen({ profile, onComplete, onBack }) {
  const [text, setText] = useState("");
  const [done, setDone] = useState(false);
  const todayDone = profile.lastMissionDate === new Date().toDateString();
  const mission   = MISSIONS[profile.completedMissions.length % MISSIONS.length];

  const handleComplete = () => {
    if (done) return;
    setDone(true);
    setTimeout(() => onComplete(mission, text), 1000);
  };

  if (todayDone) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "0 24px", textAlign: "center", background: "#060a10" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 8 }}>¡Misión completada!</h2>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 28 }}>Ya completaste tu misión de hoy. Volvé mañana.</p>
        <Btn onClick={onBack} variant="ghost">← Volver al dashboard</Btn>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "28px 20px 40px", background: "#060a10" }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>
        <BackBtn onClick={onBack} />
        <p style={{ fontSize: 10, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Misión de hoy</p>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 20 }}>{mission.title}</h2>

        <Card glow style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 42, marginBottom: 14 }}>{mission.icon}</div>
          <p style={{ color: "#e2e8f0", fontSize: 14, lineHeight: 1.7, fontWeight: 500 }}>{mission.desc}</p>
        </Card>

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Tu reflexión</p>
          <textarea
            style={{ width: "100%", background: "#111827", border: "1.5px solid rgba(6,182,212,0.2)", borderRadius: 12, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.6 }}
            rows={4}
            placeholder="Escribe tu reflexión aquí... (se guardará en tu biblioteca)"
            value={text}
            onChange={e => setText(e.target.value)}
          />
        </div>

        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🏆</div>
            <p style={{ color: "#06b6d4", fontWeight: 700, fontSize: 16 }}>+{mission.xp} XP ganados</p>
          </div>
        ) : (
          <Btn onClick={handleComplete} size="lg">✅ {mission.action} · +{mission.xp} XP</Btn>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 15. PANTALLA: BIBLIOTECA
// ─────────────────────────────────────────────
function LibraryScreen({ profile, onBack }) {
  return (
    <div style={{ minHeight: "100vh", padding: "28px 20px 40px", background: "#060a10" }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>
        <BackBtn onClick={onBack} />
        <p style={{ fontSize: 10, color: "#06b6d4", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>Historial</p>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 6 }}>Biblioteca de Coraje</h2>
        <p style={{ color: "#6b7280", fontSize: 13, marginBottom: 20 }}>{profile.library.length} reflexiones guardadas</p>

        {profile.library.length === 0 ? (
          <Card style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📚</div>
            <p style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>
              Aquí aparecerán tus reflexiones.<br />Completa misiones y escribe algo para llenar tu biblioteca.
            </p>
          </Card>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[...profile.library].reverse().map((item, i) => (
              <Card key={i}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>
                    {MISSIONS.find(m => m.id === item.missionId)?.icon || "📌"}
                  </span>
                  <div>
                    <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{item.title}</p>
                    <p style={{ color: "#6b7280", fontSize: 11, marginBottom: 6 }}>
                      {new Date(item.date).toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short" })}
                    </p>
                    <p style={{ color: "#d1d5db", fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>"{item.text}"</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 16. PANTALLA: PANEL ENTRENADOR
// ─────────────────────────────────────────────
function CoachScreen({ profile, onBack }) {
  const alerts = [];
  if (profile.scores.miedo      < 40) alerts.push("⚠️ Miedo competitivo alto — necesita trabajo de gestión emocional antes del partido.");
  if (profile.scores.tolerancia < 40) alerts.push("⚠️ Tolerancia al error baja — reforzar la mentalidad de siguiente jugada.");
  if (profile.scores.compromiso < 40) alerts.push("⚠️ Compromiso de equipo bajo — actividades grupales de confianza recomendadas.");
  if (profile.streak === 0)           alerts.push("ℹ️ Sin racha activa — hacer seguimiento de constancia.");

  return (
    <div style={{ minHeight: "100vh", padding: "28px 20px 40px", background: "#060a10" }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>
        <BackBtn onClick={onBack} />
        <p style={{ fontSize: 10, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>🎽 Panel</p>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 20 }}>Vista del Entrenador</h2>

        {/* Resumen jugador */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{profile.name}</p>
            <TrafficBadge score={profile.coraje} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            {[
              { label: "Racha",    value: `🔥 ${profile.streak}d` },
              { label: "Misiones", value: `✅ ${profile.completedMissions.length}` },
              { label: "XP Total", value: profile.xp },
            ].map((s, i) => (
              <div key={i} style={{ background: "#0d1117", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <p style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{s.value}</p>
                <p style={{ color: "#6b7280", fontSize: 10 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Semáforo por dimensión */}
        <Card style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>Estado mental por área</p>
          {DIMS.map(d => (
            <div key={d.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ color: "#d1d5db", fontSize: 13 }}>{d.label}</span>
              <TrafficBadge score={profile.scores[d.key]} />
            </div>
          ))}
        </Card>

        {/* Alertas */}
        {alerts.length > 0 && (
          <Card style={{ marginBottom: 12, borderColor: "rgba(245,158,11,0.25)" }}>
            <p style={{ fontSize: 10, color: "#fbbf24", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Alertas y recomendaciones</p>
            {alerts.map((a, i) => (
              <p key={i} style={{ color: "#d1d5db", fontSize: 13, marginBottom: i < alerts.length - 1 ? 8 : 0, lineHeight: 1.5 }}>{a}</p>
            ))}
          </Card>
        )}

        {/* Reflexiones recientes */}
        <Card>
          <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
            Reflexiones recientes ({profile.library.length})
          </p>
          {profile.library.length === 0
            ? <p style={{ color: "#4b5563", fontSize: 13 }}>Sin reflexiones aún.</p>
            : [...profile.library].slice(-3).reverse().map((item, i) => (
              <div key={i} style={{ borderBottom: i < 2 ? "1px solid #1f2937" : "none", paddingBottom: 10, marginBottom: 10 }}>
                <p style={{ color: "#fff", fontSize: 12, fontWeight: 700, marginBottom: 2 }}>{item.title}</p>
                {item.text && <p style={{ color: "#6b7280", fontSize: 11, fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{item.text}"</p>}
              </div>
            ))
          }
        </Card>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 17. PANTALLA: PANEL PADRES
// ─────────────────────────────────────────────
function ParentsScreen({ profile, onBack }) {
  const tips = [
    { icon: "✅", title: "Qué decir después de un mal partido",
      text: `"Te vi esforzarte. Eso es lo que más me importa. ¿Qué aprendiste hoy?"` },
    { icon: "🚫", title: "Qué NO decir",
      text: "Evitá: \"¿Por qué fallaste ese gol?\" o comparaciones con otros jugadores. Eso destruye la tolerancia al error." },
    { icon: "💬", title: "Pregunta de conexión esta semana",
      text: "Preguntale: \"¿Qué fue lo más difícil del entrenamiento?\" Escuchá sin dar consejos. Solo acompañá." },
    { icon: "🎯", title: "Tu rol como padre",
      text: "Tu trabajo no es ser su técnico. Es ser la persona con quien puede hablar cuando las cosas salen mal." },
  ];

  return (
    <div style={{ minHeight: "100vh", padding: "28px 20px 40px", background: "#060a10" }}>
      <div style={{ maxWidth: 380, margin: "0 auto" }}>
        <BackBtn onClick={onBack} />
        <p style={{ fontSize: 10, color: "#f472b6", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 4 }}>👨‍👩‍👦 Panel</p>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginBottom: 2 }}>Para los padres de</h2>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#06b6d4", marginBottom: 20 }}>{profile.name}</h3>

        <Card glow style={{ textAlign: "center", marginBottom: 20 }}>
          <p style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Coraje deportivo actual</p>
          <div style={{ fontSize: 48, fontWeight: 900, background: "linear-gradient(135deg,#06b6d4,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: 6 }}>
            {profile.coraje}
          </div>
          <TrafficBadge score={profile.coraje} />
          <div style={{ display: "flex", justifyContent: "center", gap: 28, marginTop: 14 }}>
            <div>
              <p style={{ color: "#fff", fontWeight: 700 }}>🔥 {profile.streak}</p>
              <p style={{ color: "#6b7280", fontSize: 10 }}>días racha</p>
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700 }}>✅ {profile.completedMissions.length}</p>
              <p style={{ color: "#6b7280", fontSize: 10 }}>misiones</p>
            </div>
            <div>
              <p style={{ color: "#fff", fontWeight: 700 }}>📚 {profile.library.length}</p>
              <p style={{ color: "#6b7280", fontSize: 10 }}>reflexiones</p>
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tips.map((t, i) => (
            <Card key={i}>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{t.icon}</span>
                <div>
                  <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{t.title}</p>
                  <p style={{ color: "#9ca3af", fontSize: 12, lineHeight: 1.6 }}>{t.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// 18. APP PRINCIPAL
// ─────────────────────────────────────────────
export default function App() {
  const [view,    setView]    = useState("home");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const saved = loadProfile();
    if (saved) setProfile(saved);
  }, []);

  const handleEvalComplete = useCallback((name, answers) => {
    const p = createProfile(name, answers);
    saveProfile(p);
    setProfile(p);
    setView("result");
  }, []);

  const handleLeadComplete = useCallback(() => {
    setView("dashboard");
  }, []);

  const handleMissionComplete = useCallback((mission, text) => {
    setProfile(prev => {
      const today   = new Date().toDateString();
      const isNewDay = prev.lastMissionDate !== today;
      const updated = {
        ...prev,
        xp:     prev.xp + mission.xp,
        streak: isNewDay ? prev.streak + 1 : prev.streak,
        lastMissionDate: today,
        completedMissions: [...prev.completedMissions, { ...mission, date: new Date().toISOString() }],
        library: text.trim()
          ? [...prev.library, { missionId: mission.id, title: mission.title, text: text.trim(), date: new Date().toISOString() }]
          : prev.library,
      };
      updated.earnedBadges = checkBadges(updated);
      saveProfile(updated);
      return updated;
    });
    setView("dashboard");
  }, []);

  const BG = { background: "#060a10", minHeight: "100vh" };

  return (
    <div style={BG}>
      {view === "home" && (
        <HomeScreen hasProfile={!!profile}
          onStart={() => setView(profile ? "dashboard" : "eval")}
          onMission={() => setView("mission")} />
      )}
      {view === "eval" && (
        <EvaluationScreen onComplete={handleEvalComplete} />
      )}
      {view === "result" && profile && (
        <ResultScreen profile={profile} onContinue={() => setView("lead")} />
      )}
      {view === "lead" && profile && (
        <LeadCaptureScreen profile={profile}
          onComplete={handleLeadComplete}
          onSkip={() => setView("dashboard")} />
      )}
      {view === "dashboard" && profile && (
        <DashboardScreen profile={profile}
          onMission={() => setView("mission")}
          onLibrary={() => setView("library")}
          onCoach={() => setView("coach")}
          onParents={() => setView("parents")} />
      )}
      {view === "mission" && profile && (
        <MissionScreen profile={profile}
          onComplete={handleMissionComplete}
          onBack={() => setView("dashboard")} />
      )}
      {view === "library" && profile && (
        <LibraryScreen profile={profile} onBack={() => setView("dashboard")} />
      )}
      {view === "coach" && profile && (
        <CoachScreen profile={profile} onBack={() => setView("dashboard")} />
      )}
      {view === "parents" && profile && (
        <ParentsScreen profile={profile} onBack={() => setView("dashboard")} />
      )}
    </div>
  );
}
