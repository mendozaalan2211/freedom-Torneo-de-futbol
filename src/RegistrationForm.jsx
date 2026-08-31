import React, { useState } from 'react'
import TeamForm from './TeamForm.jsx'
import SoloForm from './SoloForm.jsx'

export default function RegistrationForm() {
  const [mode, setMode] = useState(null) // null | 'equipo' | 'individual'

  if (mode === 'equipo') return <TeamForm onBack={() => setMode(null)} />
  if (mode === 'individual') return <SoloForm onBack={() => setMode(null)} />

  return (
    <div className="app-shell">
      <div className="form-wrap">
        <div className="brand-text">FREEDOM EN ESPAÑOL</div>

        <h1 className="hero-title">REGISTRO</h1>
        <div className="hero-subtitle">
          FREEDOM EN ESPAÑOL
          <br />
          <span className="accent">TORNEO DE FÚTBOL</span>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h2 className="card-title" style={{ fontSize: 20, marginBottom: 8 }}>
            ¿Cómo quieres inscribirte?
          </h2>
          <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 22 }}>
            Elige la opción que te quede mejor.
          </p>

          <button className="btn-primary" onClick={() => setMode('equipo')}>
            Registrar mi equipo completo
          </button>
          <p style={{ color: 'var(--gray-dim)', fontSize: 12, marginTop: 8, marginBottom: 20 }}>
            Ya tienes jugadores listos, capitán y uniforme definidos.
          </p>

          <button className="btn-secondary" onClick={() => setMode('individual')}>
            Registrarme yo solo
          </button>
          <p style={{ color: 'var(--gray-dim)', fontSize: 12, marginTop: 8 }}>
            Quieres jugar pero no traes equipo — te asignamos a uno.
          </p>
        </div>
      </div>
    </div>
  )
}
