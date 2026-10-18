import React from 'react';

export function PSIconTriangle({ className = "w-4 h-4 text-emerald-400" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 3 22 20 2 20 12 3" />
    </svg>
  );
}

export function PSIconCircle({ className = "w-4 h-4 text-rose-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

export function PSIconCross({ className = "w-4 h-4 text-blue-400" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function PSIconSquare({ className = "w-4 h-4 text-pink-400" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}

export function PSControllerIcon({ className = "w-5 h-5 text-blue-400" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 12h4m-2-2v4" />
      <line x1="15" y1="11" x2="15.01" y2="11" />
      <line x1="18" y1="13" x2="18.01" y2="13" />
      <path d="M17.3 5H6.7C4.1 5 2 7.1 2 9.7v4.6C2 16.9 4.1 19 6.7 19h.6c.7 0 1.4-.4 1.7-1l1.5-3h3l1.5 3c.3.6 1 1 1.7 1h.6c2.6 0 4.7-2.1 4.7-4.7V9.7C22 7.1 19.9 5 17.3 5z" />
    </svg>
  );
}

export function PSPlusBadge({ tier = "Premium" }: { tier?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
      <span className="text-amber-400 font-bold">+</span>
      <span>PS Plus {tier}</span>
    </span>
  );
}
