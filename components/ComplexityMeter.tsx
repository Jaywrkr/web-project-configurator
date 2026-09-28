import type { ComplexityLevel } from "@/lib/types";

export function ComplexityMeter({ score, level, showScore = false }: { score: number; level: ComplexityLevel; showScore?: boolean }) {
  return <div className="meter"><div className="meter__header"><span>Complejidad del proyecto</span><strong>{showScore ? `${score} / 100 · ` : ""}{level}</strong></div><div className="meter__track"><div className="meter__fill" style={{ width: `${score}%` }} /></div></div>;
}
