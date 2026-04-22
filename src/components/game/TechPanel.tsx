import { Technology } from '@/types/game';
import { useState } from 'react';

interface Props {
  technologies: Technology[];
  onResearch: (techId: string) => void;
  researchQueue: string | null;
}

const CATEGORY_LABEL: Record<string, string> = {
  military: '⚔️ Военные',
  economy: '🪙 Экономика',
  science: '📜 Наука',
  culture: '🎭 Культура',
  politics: '👑 Политика',
};

const CATEGORY_COLOR: Record<string, string> = {
  military: '#c04040',
  economy: '#c9a84c',
  science: '#4a9fc4',
  culture: '#9b6fc4',
  politics: '#6aaa40',
};

const ERA_LABEL: Record<number, string> = {
  1: 'Эра I — Древность',
  2: 'Эра II — Средневековье',
  3: 'Эра III — Ренессанс',
};

export default function TechPanel({ technologies, onResearch, researchQueue }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const categories = ['all', ...Array.from(new Set(technologies.map(t => t.category)))];

  const filtered = activeCategory === 'all'
    ? technologies
    : technologies.filter(t => t.category === activeCategory);

  const byEra = [1, 2, 3].map(era => ({
    era,
    techs: filtered.filter(t => t.era === era),
  })).filter(g => g.techs.length > 0);

  const inProgress = technologies.find(t => t.inProgress);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Research progress banner */}
      {inProgress && (
        <div
          className="px-4 py-2.5 flex items-center gap-3 border-b border-[#1e1408]"
          style={{ background: 'rgba(74,159,196,0.08)' }}
        >
          <span className="text-base">🔬</span>
          <div className="flex-1 min-w-0">
            <p className="font-cinzel text-xs text-[#4a9fc4]">Исследуется: {inProgress.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: '#1e1408' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${inProgress.progress}%`, background: 'linear-gradient(90deg, #2a6080, #4a9fc4)' }}
                />
              </div>
              <span className="text-[#4a9fc4] font-cinzel text-xs">{inProgress.progress}%</span>
            </div>
          </div>
          <span className="text-[#5a4030] font-cinzel text-xs">{inProgress.turns} ходов</span>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-1 px-3 py-2 border-b border-[#1e1408] overflow-x-auto flex-shrink-0" style={{ background: 'rgba(8,5,2,0.95)' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-3 py-1.5 font-cinzel text-xs tracking-wide whitespace-nowrap rounded-sm transition-all duration-200"
            style={{
              background: activeCategory === cat ? (cat === 'all' ? 'rgba(201,168,76,0.15)' : `${CATEGORY_COLOR[cat]}22`) : 'transparent',
              color: activeCategory === cat ? (cat === 'all' ? '#c9a84c' : CATEGORY_COLOR[cat]) : '#3a2a18',
              border: `1px solid ${activeCategory === cat ? (cat === 'all' ? '#c9a84c44' : `${CATEGORY_COLOR[cat]}44`) : '#1e1408'}`,
            }}
          >
            {cat === 'all' ? '📋 Все' : CATEGORY_LABEL[cat] || cat}
          </button>
        ))}
      </div>

      {/* Tech tree */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {byEra.map(({ era, techs }) => (
          <div key={era}>
            <div className="ornament-divider mb-4">
              <span className="font-cinzel text-xs text-[#5a4030] tracking-widest shrink-0">{ERA_LABEL[era as 1|2|3]}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {techs.map(tech => (
                <TechCard
                  key={tech.id}
                  tech={tech}
                  onResearch={onResearch}
                  isQueued={researchQueue === tech.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechCard({ tech, onResearch, isQueued }: { tech: Technology; onResearch: (id: string) => void; isQueued: boolean }) {
  const catColor = CATEGORY_COLOR[tech.category] || '#c9a84c';
  const canResearch = !tech.researched && !tech.inProgress;

  return (
    <div
      className="parchment-card rounded-sm overflow-hidden transition-all duration-300 flex flex-col"
      style={{
        borderColor: tech.researched ? '#3a5a2a' : tech.inProgress ? '#2a4a5a' : isQueued ? '#5a4a10' : '#2a1e0e',
        opacity: tech.researched ? 0.75 : 1,
      }}
    >
      {/* Status stripe */}
      <div
        className="h-0.5"
        style={{
          background: tech.researched ? '#3a8a2a' : tech.inProgress ? '#2a6a9a' : catColor + '44',
        }}
      />

      <div className="p-3 flex flex-col gap-2 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-cinzel text-xs leading-snug" style={{ color: tech.researched ? '#5a8a50' : tech.inProgress ? '#4a9fc4' : '#c9a84c' }}>
              {tech.name}
            </h4>
            <span
              className="text-[10px] font-cinzel mt-0.5 inline-block"
              style={{ color: catColor + 'aa' }}
            >
              {CATEGORY_LABEL[tech.category]}
            </span>
          </div>
          <div className="text-right shrink-0">
            {tech.researched ? (
              <span className="text-[#5a8a50] text-xs">✓</span>
            ) : tech.inProgress ? (
              <span className="text-[#4a9fc4] font-cinzel text-xs">{tech.progress}%</span>
            ) : (
              <span className="text-[#5a4030] font-cinzel text-xs">{tech.cost}📜</span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[#6a5040] text-xs font-cormorant leading-relaxed flex-1">{tech.description}</p>

        {/* Effect */}
        <div
          className="px-2 py-1 rounded-sm text-xs font-cinzel"
          style={{ background: `${catColor}11`, color: catColor + 'cc', border: `1px solid ${catColor}22` }}
        >
          {tech.effect}
        </div>

        {/* In progress bar */}
        {tech.inProgress && (
          <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1e1408' }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${tech.progress}%`, background: 'linear-gradient(90deg, #2a6080, #4a9fc4)' }}
            />
          </div>
        )}

        {/* Research button */}
        {canResearch && (
          <button
            onClick={() => onResearch(tech.id)}
            className="w-full font-cinzel text-xs tracking-widest uppercase py-1.5 transition-all duration-300 rounded-sm mt-auto"
            style={{
              background: isQueued ? `${catColor}22` : `${catColor}15`,
              color: catColor,
              border: `1px solid ${catColor}44`,
            }}
          >
            {isQueued ? '⏳ В очереди' : '🔬 Исследовать'}
          </button>
        )}
      </div>
    </div>
  );
}
