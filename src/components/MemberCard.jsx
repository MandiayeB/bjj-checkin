import React from 'react'
import BeltBadge from './BeltBadge'

export default function MemberCard({ member, checkedIn, onCheckIn }) {
  return (
    <div className="h-full flex flex-col gap-3 p-4 rounded-2xl bg-zinc-900/60 ring-1 ring-zinc-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold leading-tight">{member.name}</h3>
          <div className="mt-1">
            <BeltBadge belt={member.belt} stripes={member.stripes} />
          </div>
        </div>
        {checkedIn && (
          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-emerald-900/40 text-emerald-300 ring-1 ring-emerald-800">
            Aujourd'hui ✓
          </span>
        )}
      </div>

      <button
        onClick={onCheckIn}
        disabled={checkedIn}
        className={`mt-auto w-full px-4 py-4 rounded-xl text-lg font-semibold transition
          ${checkedIn
            ? 'bg-zinc-800 text-zinc-400 ring-1 ring-zinc-700 cursor-not-allowed'
            : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white'
          }`}
      >
        {checkedIn ? 'Enregistré' : 'S\'enregistrer'}
      </button>
    </div>
  )
}
