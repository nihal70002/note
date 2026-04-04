import { useEffect, useState } from 'react';

const GlitterParticles = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate static array of particles to avoid hydration mismatches
    // and keep performance high
    const particleCount = 40;
    const newParticles = Array.from({ length: particleCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 4 + 4}s`,
      width: `${Math.random() * 3 + 2}px`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="dust-particle animate-float animate-pulse-glow"
          style={{
            left: p.left,
            top: p.top,
            animationDelay: p.animationDelay,
            animationDuration: p.animationDuration,
            width: p.width,
            height: p.width,
            opacity: Math.random() * 0.7 + 0.1,
            backgroundColor: '#fff4d2',
            boxShadow: '0 0 10px 2px rgba(255, 244, 210, 0.4)',
          }}
        />
      ))}
    </div>
  );
};

export default GlitterParticles;
