:root {
  --bg: #0a0a0a;
  --bg-card: #141414;
  --border: #2a2a2a;
  --white: #ffffff;
  --gray: #9a9a9a;
  --gray-dim: #6b6b6b;
  --gold: #d4af37;
  --green: #34c759;
  --red: #ff453a;
  --radius: 14px;
}

* {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--white);
  font-family: 'Inter', -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, .display {
  font-family: 'Anton', sans-serif;
  font-weight: 400;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin: 0;
}

.label-heading {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

button {
  font-family: 'Montserrat', sans-serif;
  cursor: pointer;
}

input, select {
  font-family: 'Inter', sans-serif;
}

/* ---------- Layout ---------- */
.app-shell {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 20px 60px;
}

.form-wrap {
  width: 100%;
  max-width: 480px;
}

/* ---------- Header / brand ---------- */
.brand-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #111;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 10px;
  line-height: 1.15;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 52px;
  line-height: 0.95;
}

.hero-subtitle {
  font-size: 22px;
  line-height: 1.15;
  color: var(--white);
  margin-top: 10px;
}

.hero-subtitle .accent {
  color: var(--gold);
}

/* ---------- Stepper ---------- */
.step-meta {
  margin-top: 28px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 1.5px;
  color: var(--gray);
  text-transform: uppercase;
}

.stepper {
  display: flex;
  align-items: center;
  margin-top: 12px;
}

.step-dot {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 13px;
  color: var(--gray);
  background: transparent;
  flex-shrink: 0;
}

.step-dot.active {
  background: var(--white);
  color: #000;
  border-color: var(--white);
}

.step-dot.done {
  background: var(--gold);
  color: #000;
  border-color: var(--gold);
}

.step-line {
  flex: 1;
  height: 1px;
  background: var(--border);
  margin: 0 8px;
}

.step-line.done {
  background: var(--gold);
}

/* ---------- Card / fields ---------- */
.card {
  margin-top: 24px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 28px 22px;
}

.card-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.field {
  margin-bottom: 18px;
}

.field label {
  display: block;
  font-size: 14px;
  color: #d0d0d0;
  margin-bottom: 8px;
}

.field input,
.field select {
  width: 100%;
  background: #0e0e0e;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 14px;
  color: var(--white);
  font-size: 15px;
  outline: none;
  transition: border-color 0.15s ease;
}

.field input:focus,
.field select:focus {
  border-color: var(--gold);
}

.field input.valid {
  border-color: var(--green);
}

.field input.invalid {
  border-color: var(--red);
}

.field-error {
  color: var(--red);
  font-size: 13px;
  margin-top: 6px;
}

.field-hint {
  color: var(--gray-dim);
  font-size: 13px;
  margin-top: 6px;
}

/* ---------- Buttons ---------- */
.btn-primary {
  width: 100%;
  background: var(--white);
  color: #000;
  border: none;
  border-radius: 12px;
  padding: 17px;
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-secondary {
  width: 100%;
  background: transparent;
  color: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 16px;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-top: 12px;
}

.btn-row {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-row .btn-primary,
.btn-row .btn-secondary {
  margin-top: 0;
}

.btn-ghost-sm {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--gray);
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 13px;
}

/* ---------- Player rows (step 3) ---------- */
.player-row {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  margin-bottom: 12px;
}

.player-row .field {
  margin-bottom: 0;
  flex: 1;
}

.player-num {
  width: 30px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-dim);
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 13px;
  flex-shrink: 0;
}

.remove-player {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 10px;
  color: var(--red);
  font-size: 18px;
}

.player-progress {
  font-size: 13px;
  color: var(--gray);
  margin-bottom: 16px;
}

.player-progress .ok {
  color: var(--green);
}

/* ---------- Summary (step 4) ---------- */
.summary-block {
  border-bottom: 1px solid var(--border);
  padding-bottom: 16px;
  margin-bottom: 16px;
}

.summary-block:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.summary-label {
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 1px;
  color: var(--gray-dim);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.summary-value {
  font-size: 16px;
}

.summary-players {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.summary-chip {
  background: #1c1c1c;
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 13px;
}

.checkbox-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 20px;
  font-size: 14px;
  color: #d0d0d0;
}

.checkbox-row input {
  margin-top: 3px;
}

/* ---------- Success screen ---------- */
.success-wrap {
  text-align: center;
  padding: 60px 0;
}

.success-check {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--green);
  color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin: 0 auto 24px;
}

/* ---------- Admin panel ---------- */
.admin-shell {
  min-height: 100%;
  display: flex;
  background: var(--bg);
}

.admin-sidebar {
  width: 220px;
  border-right: 1px solid var(--border);
  padding: 28px 18px;
  flex-shrink: 0;
}

.admin-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 10px;
  color: var(--gray);
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 6px;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
}

.admin-nav-item.active {
  background: #1c1c1c;
  color: var(--white);
}

.admin-main {
  flex: 1;
  padding: 32px 36px;
  min-width: 0;
}

.admin-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.admin-title {
  font-size: 34px;
}

.admin-subtitle {
  color: var(--gray);
  font-size: 14px;
  margin-top: 6px;
  text-transform: uppercase;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.admin-user {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 700;
  color: var(--gray);
}

.stat-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 20px 24px;
  min-width: 140px;
}

.stat-num {
  font-size: 40px;
  font-family: 'Anton', sans-serif;
}

.stat-label {
  color: var(--gray);
  font-size: 12px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 4px;
}

.search-box {
  width: 100%;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  color: var(--white);
  font-size: 14px;
  margin-bottom: 20px;
  outline: none;
}

.search-box:focus {
  border-color: var(--gold);
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th {
  text-align: left;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--gray-dim);
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}

.admin-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--border);
  font-size: 14px;
}

.admin-table tr {
  cursor: pointer;
}

.admin-table tr:hover td {
  background: #121212;
}

.admin-table tr.selected td {
  background: #161616;
}

.team-name-cell {
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  letter-spacing: 0.3px;
}

.status-pill {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1px solid transparent;
}

.status-confirmado {
  color: var(--green);
  border-color: var(--green);
  background: rgba(52, 199, 89, 0.08);
}

.status-completo {
  color: var(--green);
  border-color: var(--green);
  background: rgba(52, 199, 89, 0.08);
}

.status-incompleto {
  color: var(--red);
  border-color: var(--red);
  background: rgba(255, 69, 58, 0.08);
}

.admin-detail {
  width: 320px;
  border-left: 1px solid var(--border);
  padding: 28px 24px;
  flex-shrink: 0;
}

.detail-close {
  background: transparent;
  border: none;
  color: var(--gray);
  font-size: 18px;
  float: right;
  cursor: pointer;
}

.detail-eyebrow {
  color: var(--gray-dim);
  font-size: 11px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.detail-title {
  font-size: 28px;
  margin-top: 6px;
  margin-bottom: 20px;
}

.detail-section {
  border-top: 1px solid var(--border);
  padding-top: 16px;
  margin-top: 16px;
}

.detail-section .label {
  color: var(--gray-dim);
  font-size: 11px;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.detail-section .value {
  font-size: 16px;
  font-weight: 600;
}

.detail-player-list {
  margin-top: 10px;
}

.detail-player-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #1c1c1c;
  font-size: 14px;
}

/* ---------- PIN modal ---------- */
.pin-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.pin-box {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 32px;
  width: 90%;
  max-width: 320px;
  text-align: center;
}

.empty-state {
  color: var(--gray-dim);
  text-align: center;
  padding: 60px 20px;
  font-size: 14px;
}

/* ---------- Responsive ---------- */
@media (max-width: 900px) {
  .admin-shell {
    flex-direction: column;
  }
  .admin-sidebar {
    width: 100%;
    display: flex;
    gap: 8px;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: 16px;
  }
  .admin-nav-item {
    margin-bottom: 0;
  }
  .admin-detail {
    width: 100%;
    border-left: none;
    border-top: 1px solid var(--border);
  }
  .stat-cards {
    flex-wrap: wrap;
  }
}

@media (max-width: 520px) {
  .hero-title {
    font-size: 40px;
  }
}
