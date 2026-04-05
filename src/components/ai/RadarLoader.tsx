/**
 * 3×3 radar sweep loading animation for AI responses.
 */

const RADAR_ORDER = [0, 1, 2, 5, 8, 7, 6, 3, 4];
const RADAR_DUR = 0.5;

export const radarKeyframes = `@keyframes ai-sq { 0%,100%{opacity:0.08;transform:scale(0.7)} 50%{opacity:1;transform:scale(1)} }`;

export default function RadarLoader() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 5px)", gap: 2.5 }}>
      {Array.from({ length: 9 }, (_, i) => {
        const step = RADAR_ORDER.indexOf(i);
        const delay = ((step / 9) * RADAR_DUR).toFixed(2);
        return (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: 1.5,
            background: "var(--text-dim)",
            animation: `ai-sq ${RADAR_DUR}s ${delay}s ease-in-out infinite`,
          }} />
        );
      })}
    </div>
  );
}
