/** Centered SVG illustrations for role cards (no external assets). */

export function HospitalRoleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="14" y="28" width="52" height="44" rx="5" fill="#F0F6FF" stroke="#B6CEF0" strokeWidth="2" />
      <rect x="32" y="16" width="16" height="18" rx="2" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
      <path d="M40 16V10" stroke="#1D4ED8" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="22" y="38" width="9" height="9" rx="1" fill="#fff" stroke="#B6CEF0" />
      <rect x="35.5" y="38" width="9" height="9" rx="1" fill="#fff" stroke="#B6CEF0" />
      <rect x="49" y="38" width="9" height="9" rx="1" fill="#fff" stroke="#B6CEF0" />
      <rect x="22" y="50" width="9" height="9" rx="1" fill="#fff" stroke="#B6CEF0" />
      <rect x="35.5" y="50" width="9" height="9" rx="1" fill="#fff" stroke="#B6CEF0" />
      <rect x="49" y="50" width="9" height="9" rx="1" fill="#fff" stroke="#B6CEF0" />
      <rect x="35" y="44" width="10" height="14" rx="1.5" fill="#DBEAFE" stroke="#3B82F6" />
      <rect x="37" y="32" width="6" height="6" rx="1" fill="#EF4444" />
    </svg>
  );
}

export function PatientRoleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="40" cy="24" r="11" fill="#E8C4A8" stroke="#C49A7A" strokeWidth="1.5" />
      <path
        d="M26 66V46c0-4 3-7 7-7h14c4 0 7 3 7 7v20"
        fill="#1E40AF"
        stroke="#172554"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M32 39h16v7H32z" fill="#2563EB" />
      <path d="M36 41h8v10H36z" fill="#BFDBFE" />
      <path d="M38 43h4v3h-4z" fill="#DC2626" />
    </svg>
  );
}
