import React, { useState } from 'react'

export default function CoachLogin({ expectedPassword = 'bjj', onSuccess, onCancel }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (pw === expectedPassword) {
      setErr('')
      onSuccess?.()
    } else {
      setErr('Mot de passe incorrect. Réessayez.')
    }
  }

  return (
    <div className="p-6 rounded-2xl bg-zinc-900/60 ring-1 ring-zinc-800">
      <h2 className="text-2xl font-semibold mb-2">Espace Coach</h2>
      <p className="text-zinc-400 mb-6">Entrez le mot de passe pour voir les présences.</p>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Mot de passe"
          className="w-full px-4 py-3 rounded-xl bg-zinc-900 text-zinc-100 placeholder-zinc-500 ring-1 ring-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold"
          >
            Valider
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
