import { useMemo, useState } from 'react'

type ResourcePageProps = { active: string; query: string; notify: (message: string) => void }

const rows = {
  Produits: [
    ['KB-2048', 'Clavier mécanique K2', 'Périphériques', '148', 'En stock'],
    ['MS-1092', 'Souris sans fil MX', 'Périphériques', '36', 'Stock faible'],
    ['MN-7731', 'Écran 27” UltraWide', 'Moniteurs', '24', 'En stock'],
    ['DK-4401', 'Station USB-C Pro', 'Accessoires', '0', 'Rupture'],
  ],
  Catégories: [['CAT-01', 'Périphériques', 'Claviers, souris et accessoires', '24', 'Active'], ['CAT-02', 'Moniteurs', 'Écrans et supports', '12', 'Active'], ['CAT-03', 'Visio', 'Webcams et audio', '8', 'Active']],
  Fournisseurs: [['SUP-01', 'Tech Distribution', 'Amina Nguema', 'contact@tech-distribution.example', 'Actif'], ['SUP-02', 'Digital Supply', 'Paul Martin', 'contact@digital-supply.example', 'Actif'], ['SUP-03', 'Office Partners', 'Sonia Bello', 'hello@office-partners.example', 'Actif']],
  Mouvements: [['MV-1042', '23 sept. 2026 · 10:42', 'Clavier mécanique K2', '+12', 'Entrée'], ['MV-1041', '23 sept. 2026 · 09:18', 'Souris sans fil MX', '-4', 'Sortie'], ['MV-1040', '22 sept. 2026 · 16:02', 'Webcam Full HD', '+20', 'Entrée']],
} as const

export function ResourcePage({ active, query, notify }: ResourcePageProps) {
  const [showForm, setShowForm] = useState(false)
  const [items, setItems] = useState<readonly (readonly string[])[]>(rows[active as keyof typeof rows] ?? rows.Produits)
  const [form, setForm] = useState({ name: '', reference: '', description: '' })
  const [error, setError] = useState('')
  const filtered = useMemo(() => items.filter(row => row.join(' ').toLowerCase().includes(query.toLowerCase())), [items, query])
  const headers = active === 'Produits' ? ['SKU', 'NOM', 'CATÉGORIE', 'STOCK', 'ÉTAT'] : active === 'Catégories' ? ['ID', 'NOM', 'DESCRIPTION', 'PRODUITS', 'STATUT'] : active === 'Fournisseurs' ? ['ID', 'NOM', 'CONTACT', 'EMAIL', 'STATUT'] : ['RÉFÉRENCE', 'DATE', 'PRODUIT', 'VARIATION', 'TYPE']
  return <section className="resource-page">
    <div className="resource-heading"><div><p className="eyebrow">GESTION DE L’INVENTAIRE</p><h1>{active}</h1><p className="subtitle">Consultez et gérez vos données de {active.toLowerCase()}.</p></div><button className="primary-button" onClick={() => setShowForm(v => !v)}><span>＋</span> {active === 'Mouvements' ? 'Nouveau mouvement' : `Ajouter ${active.slice(0, -1).toLowerCase()}`}</button></div>
    {showForm && <div className="resource-form"><strong>{active === 'Mouvements' ? 'Nouveau mouvement' : `Nouveau ${active.slice(0, -1).toLowerCase()}`}</strong>{error && <p className="form-error" role="alert">{error}</p>}<div className="form-grid"><label>Nom<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Saisir une valeur" aria-invalid={Boolean(error)} /></label><label>Référence<input value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })} placeholder="Optionnel" /></label><label>Description<input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Ajouter une description" /></label></div><div className="form-actions"><button className="filter-button" onClick={() => { setShowForm(false); setError('') }}>Annuler</button><button className="primary-button" onClick={() => { if (!form.name.trim()) { setError('Le nom est obligatoire.'); return } const next = [`NEW-${items.length + 1}`, form.name.trim(), form.description.trim() || '—', '0', 'Active'] as const; setItems([next, ...items]); setForm({ name: '', reference: '', description: '' }); setError(''); setShowForm(false); notify(`${active.slice(0, -1)} créé avec succès`) }}>Enregistrer</button></div></div>}
    <div className="panel resource-panel"><div className="resource-toolbar"><strong>{filtered.length} résultat{filtered.length > 1 ? 's' : ''}</strong><button className="filter-button" onClick={() => notify('Filtres ouverts')}>☷ Filtrer</button></div><div className="table-wrap"><table><thead><tr>{headers.map(header => <th key={header}>{header}</th>)}<th></th></tr></thead><tbody>{filtered.map(row => <tr key={row[0]}>{row.map((cell, index) => <td key={`${row[0]}-${index}`} className={index === 0 ? 'value' : index === row.length - 1 ? 'resource-status' : ''}>{cell}</td>)}<td><button className="more-button" aria-label={`Actions ${row[1]}`} onClick={() => notify(`${row[1]} sélectionné`)}>•••</button></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty">Aucun résultat pour cette recherche.</div>}</div></div>
  </section>
}
