import React, { useState } from 'react'
import { supabase, TABLE_NAME, MIN_JUGADORES } from './supabaseClient.js'

const emptyPlayer = () => ({ nombre: '', edad: '', telefono: '' })

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function phoneDigits(value) {
  return value.replace(/\D/g, '')
}

export default function TeamForm({ onBack }) {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [done, setDone] = useState(false)
  const [touched, setTouched] = useState({})

  const [captain, setCaptain] = useState({
    nombre: '',
    telefono: '',
    edad: '',
    ciudad: '',
  })

  const [team, setTeam] = useState({
    nombre_equipo: '',
    color_uniforme: '',
    color_alterno: '',
  })

  const [players, setPlayers] = useState([emptyPlayer(), emptyPlayer(), emptyPlayer()])
  const [acceptedRules, setAcceptedRules] = useState(false)

  // ---------- Validation ----------
  const captainValid = {
    nombre: captain.nombre.trim().length > 1,
    telefono: phoneDigits(captain.telefono).length === 10,
    edad: captain.edad !== '' && Number(captain.edad) >= 15 && Number(captain.edad) < 90,
    ciudad: captain.ciudad.trim().length > 1,
  }
  const step1Valid = Object.values(captainValid).every(Boolean)

  const teamValid = {
    nombre_equipo: team.nombre_equipo.trim().length > 1,
    color_uniforme: team.color_uniforme.trim().length > 1,
  }
  const step2Valid = Object.values(teamValid).every(Boolean)

  const validPlayers = players.filter((p) => p.nombre.trim().length > 1 && p.edad !== '')
  const step3Valid = validPlayers.length >= MIN_JUGADORES

  const step4Valid = acceptedRules

  function markTouched(field) {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  function updatePlayer(index, field, value) {
    setPlayers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function addPlayer() {
    setPlayers((prev) => [...prev, emptyPlayer()])
  }

  function removePlayer(index) {
    setPlayers((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit() {
    setSubmitting(true)
    setSubmitError('')
    try {
      const { error } = await supabase.from(TABLE_NAME).insert({
        tipo: 'equipo',
        nombre_equipo: team.nombre_equipo.trim(),
        color_uniforme: team.color_uniforme.trim(),
        color_alterno: team.color_alterno.trim(),
        capitan_nombre: captain.nombre.trim(),
        capitan_telefono: captain.telefono.trim(),
        capitan_edad: Number(captain.edad),
        capitan_ciudad: captain.ciudad.trim(),
        jugadores: validPlayers.map((p) => ({
          nombre: p.nombre.trim(),
          edad: Number(p.edad),
          telefono: p.telefono.trim(),
        })),
        estado: validPlayers.length >= MIN_JUGADORES ? 'completo' : 'incompleto',
      })
      if (error) throw error
      setDone(true)
    } catch (err) {
      console.error(err)
      setSubmitError(
        'No se pudo enviar el registro. Verifica tu conexión e intenta de nuevo.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="app-shell">
        <div className="form-wrap success-wrap">
          <div className="success-check">✓</div>
          <h2 className="hero-subtitle">¡Equipo registrado!</h2>
          <p style={{ color: 'var(--gray)', marginTop: 12, fontSize: 15 }}>
            {team.nombre_equipo} quedó inscrito para el Torneo de Fútbol de Freedom en
            Español. Nos pondremos en contacto con {captain.nombre.split(' ')[0]} por
            teléfono para confirmar los detalles.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="form-wrap">
        <button
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--gray)',
            fontSize: 13,
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 700,
            padding: 0,
            marginBottom: 16,
            cursor: 'pointer',
          }}
        >
          ← Volver
        </button>
        <div className="brand-text">FREEDOM EN ESPAÑOL</div>

        <h1 className="hero-title">REGISTRO</h1>
        <div className="hero-subtitle">
          FREEDOM EN ESPAÑOL
          <br />
          <span className="accent">TORNEO DE FÚTBOL</span>
        </div>

        <div className="step-meta">PASO {step} DE 4</div>
        <div className="stepper">
          {[1, 2, 3, 4].map((n, i) => (
            <React.Fragment key={n}>
              <div
                className={
                  'step-dot ' +
                  (n === step ? 'active' : n < step ? 'done' : '')
                }
              >
                {n < step ? '✓' : n}
              </div>
              {i < 3 && (
                <div className={'step-line ' + (n < step ? 'done' : '')} />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="card">
            <h2 className="card-title">Información del capitán</h2>

            <div className="field">
              <label>Nombre completo</label>
              <input
                className={
                  touched.nombre ? (captainValid.nombre ? 'valid' : 'invalid') : ''
                }
                value={captain.nombre}
                onChange={(e) => setCaptain({ ...captain, nombre: e.target.value })}
                onBlur={() => markTouched('nombre')}
                placeholder="Ej. Carlos Hernández"
              />
              {touched.nombre && !captainValid.nombre && (
                <div className="field-error">Este campo es obligatorio</div>
              )}
            </div>

            <div className="field">
              <label>Número de teléfono</label>
              <input
                className={
                  touched.telefono ? (captainValid.telefono ? 'valid' : 'invalid') : ''
                }
                value={captain.telefono}
                onChange={(e) =>
                  setCaptain({ ...captain, telefono: formatPhone(e.target.value) })
                }
                onBlur={() => markTouched('telefono')}
                placeholder="(562) 555-1234"
                inputMode="tel"
              />
              {touched.telefono && !captainValid.telefono && (
                <div className="field-error">Ingresa un número de 10 dígitos</div>
              )}
            </div>

            <div className="field">
              <label>Edad</label>
              <input
                className={touched.edad ? (captainValid.edad ? 'valid' : 'invalid') : ''}
                value={captain.edad}
                onChange={(e) => setCaptain({ ...captain, edad: e.target.value })}
                onBlur={() => markTouched('edad')}
                type="number"
                placeholder="Ej. 28"
              />
              {touched.edad && !captainValid.edad && (
                <div className="field-error">Ingresa una edad válida</div>
              )}
            </div>

            <div className="field">
              <label>Ciudad</label>
              <input
                className={touched.ciudad ? (captainValid.ciudad ? 'valid' : 'invalid') : ''}
                value={captain.ciudad}
                onChange={(e) => setCaptain({ ...captain, ciudad: e.target.value })}
                onBlur={() => markTouched('ciudad')}
                placeholder="Ej. Whittier"
              />
              {touched.ciudad && !captainValid.ciudad && (
                <div className="field-error">Este campo es obligatorio</div>
              )}
            </div>

            <button
              className="btn-primary"
              disabled={!step1Valid}
              onClick={() => {
                setTouched({
                  nombre: true,
                  telefono: true,
                  edad: true,
                  ciudad: true,
                })
                if (step1Valid) setStep(2)
              }}
            >
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <h2 className="card-title">Datos del equipo</h2>

            <div className="field">
              <label>Nombre del equipo</label>
              <input
                value={team.nombre_equipo}
                onChange={(e) => setTeam({ ...team, nombre_equipo: e.target.value })}
                placeholder="Ej. Los Halcones"
              />
            </div>

            <div className="field">
              <label>Color principal del uniforme</label>
              <input
                value={team.color_uniforme}
                onChange={(e) => setTeam({ ...team, color_uniforme: e.target.value })}
                placeholder="Ej. Negro"
              />
            </div>

            <div className="field">
              <label>Color alternativo del uniforme (opcional)</label>
              <input
                value={team.color_alterno}
                onChange={(e) => setTeam({ ...team, color_alterno: e.target.value })}
                placeholder="Ej. Dorado"
              />
            </div>

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(1)}>
                Atrás
              </button>
              <button
                className="btn-primary"
                disabled={!step2Valid}
                onClick={() => step2Valid && setStep(3)}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <h2 className="card-title">Lista de jugadores</h2>
            <div className="player-progress">
              {validPlayers.length >= MIN_JUGADORES ? (
                <span className="ok">
                  ✓ {validPlayers.length} jugadores registrados (mínimo {MIN_JUGADORES})
                </span>
              ) : (
                <span>
                  {validPlayers.length} de {MIN_JUGADORES} jugadores mínimos
                </span>
              )}
            </div>

            {players.map((p, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 700,
                      fontSize: 13,
                      color: 'var(--gray-dim)',
                    }}
                  >
                    Jugador {i + 1}
                  </span>
                  {players.length > 1 && (
                    <button
                      className="btn-ghost-sm"
                      style={{ marginLeft: 'auto', padding: '4px 10px', color: 'var(--red)' }}
                      onClick={() => removePlayer(i)}
                    >
                      Quitar
                    </button>
                  )}
                </div>
                <div className="field" style={{ marginBottom: 8 }}>
                  <input
                    value={p.nombre}
                    onChange={(e) => updatePlayer(i, 'nombre', e.target.value)}
                    placeholder="Nombre del jugador"
                  />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div className="field" style={{ marginBottom: 0, maxWidth: 90 }}>
                    <input
                      value={p.edad}
                      onChange={(e) => updatePlayer(i, 'edad', e.target.value)}
                      type="number"
                      placeholder="Edad"
                    />
                  </div>
                  <div className="field" style={{ marginBottom: 0, flex: 1 }}>
                    <input
                      value={p.telefono}
                      onChange={(e) => updatePlayer(i, 'telefono', formatPhone(e.target.value))}
                      placeholder="(562) 555-1234 (opcional)"
                      inputMode="tel"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button className="btn-ghost-sm" onClick={addPlayer} style={{ marginBottom: 18 }}>
              + Agregar jugador
            </button>

            <div className="btn-row">
              <button className="btn-secondary" onClick={() => setStep(2)}>
                Atrás
              </button>
              <button
                className="btn-primary"
                disabled={!step3Valid}
                onClick={() => step3Valid && setStep(4)}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="card">
            <h2 className="card-title">Confirmación</h2>

            <div className="summary-block">
              <div className="summary-label">Equipo</div>
              <div className="summary-value">{team.nombre_equipo}</div>
              <div style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>
                Uniforme {team.color_uniforme}
                {team.color_alterno ? ` · Alterno ${team.color_alterno}` : ''}
              </div>
            </div>

            <div className="summary-block">
              <div className="summary-label">Capitán</div>
              <div className="summary-value">{captain.nombre}</div>
              <div style={{ color: 'var(--gray)', fontSize: 14, marginTop: 4 }}>
                {captain.telefono} · {captain.ciudad}
              </div>
            </div>

            <div className="summary-block">
              <div className="summary-label">Jugadores ({validPlayers.length})</div>
              <div className="summary-players">
                {validPlayers.map((p, i) => (
                  <div className="summary-chip" key={i}>
                    {p.nombre} ({p.edad})
                  </div>
                ))}
              </div>
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={acceptedRules}
                onChange={(e) => setAcceptedRules(e.target.checked)}
              />
              <span>
                Confirmo que la información es correcta y acepto el reglamento del
                torneo de Freedom en Español.
              </span>
            </label>

            {submitError && <div className="field-error" style={{ marginTop: 14 }}>{submitError}</div>}

            <div className="btn-row" style={{ marginTop: 20 }}>
              <button className="btn-secondary" onClick={() => setStep(3)}>
                Atrás
              </button>
              <button
                className="btn-primary"
                disabled={!step4Valid || submitting}
                onClick={handleSubmit}
              >
                {submitting ? 'Enviando...' : 'Enviar registro'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
