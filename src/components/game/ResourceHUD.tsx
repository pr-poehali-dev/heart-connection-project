import { Resources } from '@/types/game';

interface Props {
  resources: Resources;
  delta: Resources;
  turn: number;
  year: number;
  season: string;
  onEndTurn: () => void;
}

const RESOURCE_CONFIG = [
  { key: 'gold' as keyof Resources, label: 'Золото', icon: '🪙', color: '#c9a84c' },
  { key: 'food' as keyof Resources, label: 'Пища', icon: '🌾', color: '#6aaa40' },
  { key: 'iron' as keyof Resources, label: 'Железо', icon: '⚒️', color: '#8899aa' },
  { key: 'wood' as keyof Resources, label: 'Лес', icon: '🪵', color: '#8a5a30' },
  { key: 'faith' as keyof Resources, label: 'Вера', icon: '✝️', color: '#9b6fc4' },
  { key: 'influence' as keyof Resources, label: 'Влияние', icon: '👁️', color: '#4a9fc4' },
];

const SEASONS = { spring: 'Весна', summer: 'Лето', autumn: 'Осень', winter: 'Зима' };
const SEASON_COLOR: Record<string, string> = {
  spring: '#6aaa40',
  summer: '#c9a84c',
  autumn: '#c07030',
  winter: '#7090c4',
};

export default function ResourceHUD({ resources, delta, turn, year, season, onEndTurn }: Props) {
  return (
    <div
      className="flex items-center justify-between px-3 py-1.5 border-b border-[#2a1e0e] select-none"
      style={{ background: 'rgba(8,5,2,0.97)', minHeight: '48px' }}
    >
      {/* Left: Title + turn info */}
      <div className="flex items-center gap-4 shrink-0">
        <span
          className="font-cinzel-deco text-base tracking-wider hidden sm:block"
          style={{
            background: 'linear-gradient(135deg, #e8c96a, #c9a84c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          IMPERIUM
        </span>
        <div className="h-6 w-px bg-[#2a1e0e] hidden sm:block" />
        <div className="text-center">
          <p className="text-[#c9a84c] font-cinzel text-xs leading-tight">Ход {turn}</p>
          <p className="text-[#5a4030] font-cinzel text-[10px] leading-tight">{year} г.</p>
        </div>
        <div className="text-center">
          <p className="font-cinzel text-xs leading-tight" style={{ color: SEASON_COLOR[season] || '#c9a84c' }}>
            {(SEASONS as Record<string, string>)[season] || season}
          </p>
          <p className="text-[#5a4030] font-cinzel text-[10px] leading-tight">Сезон</p>
        </div>
      </div>

      {/* Center: Resources */}
      <div className="flex items-center gap-2 flex-wrap justify-center flex-1 px-2">
        {RESOURCE_CONFIG.map(({ key, icon, color }) => {
          const val = resources[key];
          const d = delta[key];
          return (
            <div key={key} className="flex items-center gap-1 px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.03)' }}>
              <span className="text-sm">{icon}</span>
              <span className="font-cinzel text-xs font-semibold" style={{ color }}>
                {val.toLocaleString('ru')}
              </span>
              {d !== 0 && (
                <span
                  className="font-cinzel text-[10px]"
                  style={{ color: d > 0 ? '#5aaa40' : '#c04040' }}
                >
                  {d > 0 ? `+${d}` : d}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Right: End turn button */}
      <button
        onClick={onEndTurn}
        className="shrink-0 font-cinzel text-xs tracking-widest uppercase px-4 py-2 transition-all duration-300 hover:opacity-90 active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #6b4a10, #c9a84c)',
          color: '#1a0e02',
          clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
          border: '1px solid #8b6914',
          minWidth: '100px',
        }}
      >
        ⚡ Ход →
      </button>
    </div>
  );
}
