/** Crisp dot field when WebGL is unavailable. No soft sun sprite. */
export function StaticSky() {
  const stars = Array.from({ length: 180 }, (_, i) => {
    const angle = i * 2.399;
    const radius = 4 + (i % 28) * 1.55;
    const core = i < 70;
    return {
      x: 50 + Math.cos(angle) * (core ? radius * 0.22 : radius * 0.34),
      y: 46 + Math.sin(angle) * (core ? radius * 0.22 : radius * 0.2),
      r: core ? 0.28 : 0.16,
    };
  });
  return (
    <div className="static-sky" aria-hidden>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {stars.map((star, index) => (
          <circle key={index} cx={star.x} cy={star.y} r={star.r} fill={index % 5 === 0 ? '#e4c99a' : '#f4f1ea'} />
        ))}
      </svg>
    </div>
  );
}
