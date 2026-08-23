import React, { useEffect, useMemo, useState } from 'react'
import { supabase, TABLE_NAME, MIN_JUGADORES, ADMIN_PIN } from './supabaseClient.js'

export default function AdminPanel() {
  const [unlocked, setUnlocked] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')

  const [view, setView] = useState('equipos') // equipos | jugadores
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!unlocked) return
    fetchTeams()
    const channel = supabase
      .channel('equipos_futbol_admin')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: TABLE_NAME },
        () => fetchTeams()
      )
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [unlocked])

  async function fetchTeams() {
    setLoading(true)
    setLoadError('')
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setLoadError('No se pudieron cargar los registros.')
    } else {
      setTeams(data || [])
    }
    setLoading(false)
  }

  function checkPin() {
    if (pinInput === ADMIN_PIN) {
      setUnlocked(true)
      setPinError('')
    } else {
      setPinError('PIN incorrecto')
    }
  }

  const totalJugadores = teams.reduce((sum, t) => sum + (t.jugadores?.length || 0), 0)
  const incompletos = teams.filter(
    (t) => (t.jugadores?.length || 0) < MIN_JUGADORES
  ).length

  const filteredTeams = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return teams
    return teams.filter(
      (t) =>
        t.nombre_equipo?.toLowerCase().includes(q) ||
        t.capitan_nombre?.toLowerCase().includes(q) ||
        t.capitan_telefono?.toLowerCase().includes(q)
    )
  }, [teams, search])

  const allPlayers = useMemo(() => {
    const rows = []
    teams.forEach((t) => {
      ;(t.jugadores || []).forEach((p) => {
        rows.push({ ...p, equipo: t.nombre_equipo, capitan: t.capitan_nombre })
      })
    })
    return rows
  }, [teams])

  function statusFor(team) {
    const count = team.jugadores?.length || 0
    if (team.estado === 'confirmado') return { text: 'Confirmado', cls: 'status-confirmado' }
    if (count >= MIN_JUGADORES) return { text: 'Completo', cls: 'status-completo' }
    return { text: 'Incompleto', cls: 'status-incompleto' }
  }

  function exportCSV() {
    const header = ['Equipo', 'Capitán', 'Teléfono', 'Ciudad', 'Categoría', 'Jugadores', 'Estado', 'Fecha']
    const rows = teams.map((t) => [
      t.nombre_equipo,
      t.capitan_nombre,
      t.capitan_telefono,
      t.capitan_ciudad,
      t.categoria,
      t.jugadores?.length || 0,
      statusFor(t).text,
      new Date(t.created_at).toLocaleDateString('es-MX'),
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'equipos_futbol.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!unlocked) {
    return (
      <div className="pin-overlay">
        <div className="pin-box">
          <h2 className="hero-subtitle" style={{ marginBottom: 16 }}>
            Panel de registros
          </h2>
          <div className="field">
            <input
              type="password"
              inputMode="numeric"
              placeholder="PIN de acceso"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkPin()}
            />
            {pinError && <div className="field-error">{pinError}</div>}
          </div>
          <button className="btn-primary" onClick={checkPin}>
            Entrar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-shell">
      <div className="admin-sidebar">
        <div className="brand-badge" style={{ marginBottom: 28 }}>
          Freedom
          <br />
          En Español
        </div>
        <button
          className={'admin-nav-item ' + (view === 'equipos' ? 'active' : '')}
          onClick={() => {
            setView('equipos')
            setSelected(null)
          }}
        >
          Equipos
        </button>
        <button
          className={'admin-nav-item ' + (view === 'jugadores' ? 'active' : '')}
          onClick={() => {
            setView('jugadores')
            setSelected(null)
          }}
        >
          Jugadores
        </button>
        <button className="admin-nav-item" onClick={exportCSV}>
          Exportar
        </button>
      </div>

      <div className="admin-main">
        <div className="admin-top">
          <div>
            <h1 className="admin-title">Panel de registros</h1>
            <div className="admin-subtitle">Torneo de fútbol · Freedom en Español</div>
          </div>
          <div className="admin-user">Admin</div>
        </div>

        <div className="stat-cards">
          <div className="stat-card">
            <div className="stat-num">{teams.length}</div>
            <div className="stat-label">Equipos</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{totalJugadores}</div>
            <div className="stat-label">Jugadores</div>
          </div>
          <div className="stat-card">
            <div className="stat-num">{incompletos}</div>
            <div className="stat-label">Incompletos</div>
          </div>
        </div>

        {view === 'equipos' && (
          <>
            <input
              className="search-box"
              placeholder="Buscar equipo, capitán o teléfono"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {loading && <div className="empty-state">Cargando registros…</div>}
            {loadError && <div className="empty-state">{loadError}</div>}
            {!loading && !loadError && filteredTeams.length === 0 && (
              <div className="empty-state">Todavía no hay equipos registrados.</div>
            )}

            {!loading && !loadError && filteredTeams.length > 0 && (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Equipo</th>
                    <th>Capitán</th>
                    <th>Ciudad</th>
                    <th>Jugadores</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((t) => {
                    const st = statusFor(t)
                    return (
                      <tr
                        key={t.id}
                        className={selected?.id === t.id ? 'selected' : ''}
                        onClick={() => setSelected(t)}
                      >
                        <td className="team-name-cell">{t.nombre_equipo}</td>
                        <td>{t.capitan_nombre}</td>
                        <td>{t.capitan_ciudad}</td>
                        <td>{t.jugadores?.length || 0}</td>
                        <td>
                          <span className={'status-pill ' + st.cls}>{st.text}</span>
                        </td>
                        <td>{new Date(t.created_at).toLocaleDateString('es-MX')}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </>
        )}

        {view === 'jugadores' && (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Jugador</th>
                <th>Edad</th>
                <th>Equipo</th>
                <th>Capitán</th>
              </tr>
            </thead>
            <tbody>
              {allPlayers.map((p, i) => (
                <tr key={i}>
                  <td>{p.nombre}</td>
                  <td>{p.edad}</td>
                  <td>{p.equipo}</td>
                  <td>{p.capitan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="admin-detail">
          <button className="detail-close" onClick={() => setSelected(null)}>
            ×
          </button>
          <div className="detail-eyebrow">Detalles del equipo</div>
          <h2 className="detail-title">{selected.nombre_equipo}</h2>

          <div className="detail-section">
            <div className="label">Capitán</div>
            <div className="value">{selected.capitan_nombre}</div>
          </div>
          <div className="detail-section">
            <div className="label">Teléfono</div>
            <div className="value">{selected.capitan_telefono}</div>
          </div>
          <div className="detail-section">
            <div className="label">Categoría</div>
            <div className="value">{selected.categoria}</div>
          </div>
          <div className="detail-section">
            <div className="label">Jugadores</div>
            <div className="value">{selected.jugadores?.length || 0} registrados</div>
            <div className="detail-player-list">
              {(selected.jugadores || []).map((p, i) => (
                <div className="detail-player-item" key={i}>
                  <span>{p.nombre}</span>
                  <span style={{ color: 'var(--gray)' }}>{p.edad} años</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
