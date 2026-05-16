import { useMemo } from 'react';
import { createCartUrgencyMessage } from '../utils/urgency';

const UrgencyBanner = ({ className = '' }) => {
  const message = useMemo(() => createCartUrgencyMessage(), []);

  return (
    <div className={`urgency-glow rounded-sm border border-orange-200 bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 p-3 shadow-sm ${className}`}>
      <p className="text-xs font-bold uppercase tracking-widest text-red-700">
        {message}
      </p>
      <p className="mt-1 text-xs text-ink/70">
        Secure your picks while the offer is active.
      </p>
    </div>
  );
};

export default UrgencyBanner;
