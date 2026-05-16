const UrgencyBadge = ({ message, hook, compact = false, className = '' }) => (
  <div
    className={`urgency-glow inline-flex max-w-full flex-col rounded-sm border border-orange-200/80 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 ${compact ? 'px-3 py-1.5' : 'px-3.5 py-2'} ${className}`}
  >
    <span className="text-[10px] font-bold uppercase tracking-widest leading-tight">
      {message}
    </span>
    {hook && (
      <span className="mt-0.5 text-[10px] font-medium leading-tight text-white/90">
        {hook}
      </span>
    )}
  </div>
);

export default UrgencyBadge;
