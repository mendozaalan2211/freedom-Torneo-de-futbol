import React, { useState } from 'react'
import { supabase, TABLE_NAME } from './supabaseClient.js'

function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  if (digits.length <= 3) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

function phoneDigits(value) {
  return value.replace(/\D/g, '')
}

export default function SoloForm({ onBack }) {
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [done, setDone] = useState(false)
  const [touched, setTouched] = useState({})

  const [player, setPlayer] = useState({
    nombre: '',
    telefono: '',
    edad: '',
    ciudad: '',
  })

  const valid = {
    nombre: player.nombre.trim().length > 1,
    telefono: phoneDigits(player.telefono).length === 10,
    edad: player.edad !== '' && Number(player.edad) >= 15 && Number(player.edad) < 90,
    ciudad: player.ciudad.trim().length > 1,
  }
  const formValid = Object.values(valid).every(Boolean)

  function markTouched(field) {
    setTouched((t) => ({ ...t, [field]: true }))
  }

  async function handleSubmit() {
    setTouched({ nombre: true, telefono: true, edad: true, ciudad: true })
    if (!formValid) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const { error } = await supabase.from(TABLE_NAME).insert({
        tipo: 'individual',
        nombre_equipo: null,
        capitan_nombre: player.nombre.trim(),
        capitan_telefono: player.telefono.trim(),
        capitan_edad: Number(player.edad),
        capitan_ciudad: player.ciudad.trim(),
        jugadores: [
          {
            nombre: player.nombre.trim(),
            edad: Number(player.edad),
            telefono: player.telefono.trim(),
          },
        ],
        estado: 'incompleto',
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
          <h2 className="hero-subtitle">¡Ya quedaste registrado!</h2>
          <p style={{ color: 'var(--gray)', marginTop: 12, fontSize: 15 }}>
            Te contactaremos por teléfono para asignarte a un equipo del Torneo de
            Fútbol de Freedom en Español.
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
          JUGADOR LIBRE
          <br />
          <span className="accent">TORNEO DE FÚTBOL</span>
        </div>

        <div className="card" style={{ marginTop: 24 }}>
          <h2 className="card-title">Tus datos</h2>
          <p style={{ color: 'var(--gray)', fontSize: 14, marginTop: -12, marginBottom: 20 }}>
            Te anotamos como jugador libre y te asignamos a un equipo que necesite
            jugadores.
          </p>

          <div className="field">
            <label>Nombre completo</label>
            <input
              className={touched.nombre ? (valid.nombre ? 'valid' : 'invalid') : ''}
              value={player.nombre}
              onChange={(e) => setPlayer({ ...player, nombre: e.target.value })}
              onBlur={() => markTouched('nombre')}
              placeholder="Ej. Carlos Hernández"
            />
            {touched.nombre && !valid.nombre && (
              <div className="field-error">Este campo es obligatorio</div>
            )}
          </div>

          <div className="field">
            <label>Número de teléfono</label>
            <input
              className={touched.telefono ? (valid.telefono ? 'valid' : 'invalid') : ''}
              value={player.telefono}
              onChange={(e) =>
                setPlayer({ ...player, telefono: formatPhone(e.target.value) })
              }
              onBlur={() => markTouched('telefono')}
              placeholder="(562) 555-1234"
              inputMode="tel"
            />
            {touched.telefono && !valid.telefono && (
              <div className="field-error">Ingresa un número de 10 dígitos</div>
            )}
          </div>

          <div className="field">
            <label>Edad</label>
            <input
              className={touched.edad ? (valid.edad ? 'valid' : 'invalid') : ''}
              value={player.edad}
              onChange={(e) => setPlayer({ ...player, edad: e.target.value })}
              onBlur={() => markTouched('edad')}
              type="number"
              placeholder="Ej. 28"
            />
            {touched.edad && !valid.edad && (
              <div className="field-error">Ingresa una edad válida</div>
            )}
          </div>

          <div className="field">
            <label>Ciudad</label>
            <input
              className={touched.ciudad ? (valid.ciudad ? 'valid' : 'invalid') : ''}
              value={player.ciudad}
              onChange={(e) => setPlayer({ ...player, ciudad: e.target.value })}
              onBlur={() => markTouched('ciudad')}
              placeholder="Ej. Whittier"
            />
            {touched.ciudad && !valid.ciudad && (
              <div className="field-error">Este campo es obligatorio</div>
            )}
          </div>

          {submitError && <div className="field-error" style={{ marginBottom: 14 }}>{submitError}</div>}

          <button className="btn-primary" disabled={submitting} onClick={handleSubmit}>
            {submitting ? 'Enviando...' : 'Enviar registro'}
          </button>
        </div>
      </div>
    </div>
  )
}
