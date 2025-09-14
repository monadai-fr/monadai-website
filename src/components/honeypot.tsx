'use client'

/**
 * Honeypot - Piège invisible pour bots
 * Champ caché que seuls les bots remplissent
 */

interface HoneypotProps {
  value: string
  onChange: (value: string) => void
}

export default function Honeypot({ value, onChange }: HoneypotProps) {
  return (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        opacity: 0,
        pointerEvents: 'none'
      }}
      aria-hidden="true"
    >
      <label htmlFor="website-field">
        Site web (ne pas remplir)
      </label>
      <input
        id="website-field"
        name="website"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  )
}
