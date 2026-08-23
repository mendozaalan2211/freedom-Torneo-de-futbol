import React, { useState } from 'react'
import { supabase, TABLE_NAME, MIN_JUGADORES } from './supabaseClient.js'

const CATEGORIAS = ['Varonil Libre', 'Varonil 35+', 'Femenil', 'Mixto']

const emptyPlayer = () => ({ nombre: '', edad: '' })

export default function RegistrationForm() {
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
    categoria: '',
    color_uniforme: '',
  })

  const [players, setPlayers] = useState([emptyPlayer(), emptyPlayer(), emptyPlayer()])
  const [acceptedRules, setAcceptedRules] = useState(false)

  // ---------- Validation ----------
  const captainValid = {
    nombre: captain.nombre.trim().length > 1,
    telefono: /^[\d\s()+-]{7,}$/.test(captain.telefono.trim()),
    edad: captain.edad !== '' && Number(captain.edad) >= 15 && Number(captain.edad) < 90,
    ciudad: captain.ciudad.trim().length > 1,
  }
  const step1Valid = Object.values(captainValid).every(Boolean)

  const teamValid = {
    nombre_equipo: team.nombre_equipo.trim().length > 1,
    categoria: team.categoria !== '',
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
        nombre_equipo: team.nombre_equipo.trim(),
        categoria: team.categoria,
        color_uniforme: team.color_uniforme.trim(),
        capitan_nombre: captain.nombre.trim(),
        capitan_telefono: captain.telefono.trim(),
        capitan_edad: Number(captain.edad),
        capitan_ciudad: captain.ciudad.trim(),
        jugadores: validPlayers.map((p) => ({
          nombre: p.nombre.trim(),
          edad: Number(p.edad),
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
        <div className="brand-badge">
          Freedom
          <br />
          En Español
        </div>

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
                onChange={(e) => setCaptain({ ...captain, telefono: e.target.value })}
                onBlur={() => markTouched('telefono')}
                placeholder="(562) 000-0000"
                inputMode="tel"
              />
              {touched.telefono && !captainValid.telefono && (
                <div className="field-error">Este campo es obligatorio</div>
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
              <label>Categoría</label>
              <select
                value={team.categoria}
                onChange={(e) => setTeam({ ...team, categoria: e.target.value })}
              >
                <option value="">Selecciona una categoría</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Color de uniforme</label>
              <input
                value={team.color_uniforme}
                onChange={(e) => setTeam({ ...team, color_uniforme: e.target.value })}
                placeholder="Ej. Negro y dorado"
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
              <div className="player-row" key={i}>
                <div className="player-num">{i + 1}</div>
                <div className="field">
                  <input
                    value={p.nombre}
                    onChange={(e) => updatePlayer(i, 'nombre', e.target.value)}
                    placeholder="Nombre del jugador"
                  />
                </div>
                <div className="field" style={{ maxWidth: 80 }}>
                  <input
                    value={p.edad}
                    onChange={(e) => updatePlayer(i, 'edad', e.target.value)}
                    type="number"
                    placeholder="Edad"
                  />
                </div>
                {players.length > 1 && (
                  <button className="remove-player" onClick={() => removePlayer(i)}>
                    ×
                  </button>
                )}
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
                {team.categoria} · Uniforme {team.color_uniforme}
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
