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
  const [editingPlayers, setEditingPlayers] = useState(false)
  const [draftPlayers, setDraftPlayers] = useState([])
  const [savingPlayers, setSavingPlayers] = useState(false)
  const [deletingTeam, setDeletingTeam] = useState(false)

  // Mantener "selected" sincronizado si llegan cambios en tiempo real
  useEffect(() => {
    if (!selected) return
    const fresh = teams.find((t) => t.id === selected.id)
    if (fresh && fresh !== selected) setSelected(fresh)
    if (!fresh) setSelected(null)
  }, [teams])

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

  async function deleteTeam(team) {
    const ok = window.confirm(
      `¿Eliminar el equipo "${team.nombre_equipo}"? Esta acción no se puede deshacer.`
    )
    if (!ok) return
    setDeletingTeam(true)
    const { error } = await supabase.from(TABLE_NAME).delete().eq('id', team.id)
    setDeletingTeam(false)
    if (error) {
      alert('No se pudo eliminar el equipo. Intenta de nuevo.')
      return
    }
    setSelected(null)
  }

  function startEditingPlayers() {
    setDraftPlayers((selected.jugadores || []).map((p) => ({ ...p })))
    setEditingPlayers(true)
  }

  function cancelEditingPlayers() {
    setEditingPlayers(false)
    setDraftPlayers([])
  }

  function updateDraftPlayer(index, field, value) {
    setDraftPlayers((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  function removeDraftPlayer(index) {
    setDraftPlayers((prev) => prev.filter((_, i) => i !== index))
  }

  function addDraftPlayer() {
    setDraftPlayers((prev) => [...prev, { nombre: '', edad: '', telefono: '' }])
  }

  async function savePlayers() {
    const cleaned = draftPlayers
      .filter((p) => p.nombre && p.nombre.trim().length > 1)
      .map((p) => ({
        nombre: p.nombre.trim(),
        edad: Number(p.edad) || '',
        telefono: p.telefono ? p.telefono.trim() : '',
      }))
    setSavingPlayers(true)
    const { error } = await supabase
      .from(TABLE_NAME)
      .update({
        jugadores: cleaned,
        estado: cleaned.length >= MIN_JUGADORES ? 'completo' : 'incompleto',
      })
      .eq('id', selected.id)
    setSavingPlayers(false)
    if (error) {
      alert('No se pudieron guardar los cambios. Intenta de nuevo.')
      return
    }
    setEditingPlayers(false)
    setDraftPlayers([])
  }

  function exportCSV() {
    const header = ['Equipo', 'Capitán', 'Teléfono', 'Ciudad', 'Jugadores', 'Estado', 'Fecha']
    const rows = teams.map((t) => [
      t.nombre_equipo,
      t.capitan_nombre,
      t.capitan_telefono,
      t.capitan_ciudad,
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
        <div className="brand-text compact" style={{ marginBottom: 28 }}>FREEDOM EN ESPAÑOL</div>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((t) => {
                    const st = statusFor(t)
                    return (
                      <tr
                        key={t.id}
                        className={selected?.id === t.id ? 'selected' : ''}
                        onClick={() => {
                          setSelected(t)
                          setEditingPlayers(false)
                        }}
                      >
                        <td className="team-name-cell">{t.nombre_equipo}</td>
                        <td>{t.capitan_nombre}</td>
                        <td>{t.capitan_ciudad}</td>
                        <td>{t.jugadores?.length || 0}</td>
                        <td>
                          <span className={'status-pill ' + st.cls}>{st.text}</span>
                        </td>
                        <td>{new Date(t.created_at).toLocaleDateString('es-MX')}</td>
                        <td>
                          <button
                            className="btn-ghost-sm"
                            style={{ color: 'var(--red)' }}
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteTeam(t)
                            }}
                          >
                            Eliminar
                          </button>
                        </td>
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
                <th>Teléfono</th>
                <th>Equipo</th>
                <th>Capitán</th>
              </tr>
            </thead>
            <tbody>
              {allPlayers.map((p, i) => (
                <tr key={i}>
                  <td>{p.nombre}</td>
                  <td>{p.edad}</td>
                  <td>{p.telefono || '—'}</td>
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
          <button
            className="detail-close"
            onClick={() => {
              setSelected(null)
              setEditingPlayers(false)
            }}
          >
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
            <div className="label">Color de uniforme</div>
            <div className="value">
              {selected.color_uniforme}
              {selected.color_alterno ? ` / ${selected.color_alterno}` : ''}
            </div>
          </div>

          <div className="detail-section">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div className="label" style={{ marginBottom: 0 }}>
                Jugadores
              </div>
              {!editingPlayers && (
                <button className="btn-ghost-sm" onClick={startEditingPlayers}>
                  Editar
                </button>
              )}
            </div>

            {!editingPlayers && (
              <>
                <div className="value" style={{ marginTop: 6 }}>
                  {selected.jugadores?.length || 0} registrados
                </div>
                <div className="detail-player-list">
                  {(selected.jugadores || []).map((p, i) => (
                    <div className="detail-player-item" key={i}>
                      <span>{p.nombre}</span>
                      <span style={{ color: 'var(--gray)' }}>
                        {p.edad} años{p.telefono ? ' · ' + p.telefono : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}

            {editingPlayers && (
              <div style={{ marginTop: 10 }}>
                {draftPlayers.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 10,
                    }}
                  >
                    <input
                      value={p.nombre}
                      onChange={(e) => updateDraftPlayer(i, 'nombre', e.target.value)}
                      placeholder="Nombre"
                      style={{ marginBottom: 6 }}
                    />
                    <div style={{ display: 'flex', gap: 6 }}>
                      <input
                        value={p.edad}
                        onChange={(e) => updateDraftPlayer(i, 'edad', e.target.value)}
                        placeholder="Edad"
                        type="number"
                        style={{ maxWidth: 70 }}
                      />
                      <input
                        value={p.telefono || ''}
                        onChange={(e) => updateDraftPlayer(i, 'telefono', e.target.value)}
                        placeholder="Teléfono"
                        style={{ flex: 1 }}
                      />
                    </div>
                    <button
                      className="btn-ghost-sm"
                      style={{ marginTop: 8, color: 'var(--red)' }}
                      onClick={() => removeDraftPlayer(i)}
                    >
                      Quitar jugador
                    </button>
                  </div>
                ))}

                <button
                  className="btn-ghost-sm"
                  onClick={addDraftPlayer}
                  style={{ marginBottom: 16 }}
                >
                  + Agregar jugador
                </button>

                <div className="btn-row">
                  <button className="btn-secondary" onClick={cancelEditingPlayers}>
                    Cancelar
                  </button>
                  <button
                    className="btn-primary"
                    onClick={savePlayers}
                    disabled={savingPlayers}
                  >
                    {savingPlayers ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {!editingPlayers && (
            <div className="detail-section">
              <button
                className="btn-secondary"
                style={{ borderColor: 'var(--red)', color: 'var(--red)' }}
                onClick={() => deleteTeam(selected)}
                disabled={deletingTeam}
              >
                {deletingTeam ? 'Eliminando...' : 'Eliminar equipo'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
