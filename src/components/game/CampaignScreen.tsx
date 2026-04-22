import { Mission } from '@/types/game';
import { MISSIONS } from '@/data/gameData';
import { GameScreen } from '@/types/game';

interface Props {
  onNavigate: (screen: GameScreen) => void;
  onStartMission: (id: number) => void;
}

const DIFF_STARS = ['', '★☆☆☆☆', '★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★'];
const DIFF_COLOR = ['', '#5a9a40', '#a0a040', '#c9a84c', '#c07030', '#c04040'];

export default function CampaignScreen({ onNavigate, onStartMission }: Props) {
  const completedCount = MISSIONS.filter(m => m.completed).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'hsl(20,14%,4%)' }}>
      {/* Header */}
      <div className="relative border-b border-[#2a1e0e] bg-[rgba(15,10,5,0.95)] px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => onNavigate('main-menu')}
          className="text-[#7a6040] hover:text-[#c9a84c] transition-colors font-cinzel text-sm tracking-wider flex items-center gap-2"
        >
          ‹ Назад
        </button>
        <div className="flex-1 text-center">
          <h2 className="font-cinzel-deco text-2xl" style={{
            background: 'linear-gradient(135deg, #e8c96a, #c9a84c, #8b6914)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Кампания
          </h2>
          <p className="text-[#6a5030] font-cinzel text-xs tracking-widest mt-0.5">ЗАВОЕВАНИЕ КОНТИНЕНТА</p>
        </div>
        <div className="text-right">
          <p className="text-[#c9a84c] font-cinzel text-sm">{completedCount}/{MISSIONS.length}</p>
          <p className="text-[#5a4030] text-xs">завершено</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-6 py-3 bg-[rgba(10,7,3,0.8)] border-b border-[#1e1408]">
        <div className="flex items-center gap-3">
          <span className="text-[#6a5030] font-cinzel text-xs tracking-widest">ПРОГРЕСС</span>
          <div className="flex-1 h-1.5 bg-[#1e1408] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${(completedCount / MISSIONS.length) * 100}%`,
                background: 'linear-gradient(90deg, #8b6914, #c9a84c)',
              }}
            />
          </div>
          <span className="text-[#c9a84c] font-cinzel text-xs">{Math.round((completedCount / MISSIONS.length) * 100)}%</span>
        </div>
      </div>

      {/* Missions */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {MISSIONS.map((mission, idx) => (
          <MissionCard
            key={mission.id}
            mission={mission}
            index={idx + 1}
            diffStars={DIFF_STARS[mission.difficulty]}
            diffColor={DIFF_COLOR[mission.difficulty]}
            onStart={() => {
              onStartMission(mission.id);
              onNavigate('game');
            }}
          />
        ))}
      </div>
    </div>
  );
}

function MissionCard({
  mission,
  index,
  diffStars,
  diffColor,
  onStart,
}: {
  mission: Mission;
  index: number;
  diffStars: string;
  diffColor: string;
  onStart: () => void;
}) {
  const locked = !mission.unlocked;

  return (
    <div
      className={`
        relative parchment-card rounded-sm overflow-hidden transition-all duration-300
        ${locked ? 'opacity-50' : 'hover:border-[#7a6030] gold-glow'}
      `}
    >
      {/* Number badge */}
      <div
        className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center font-cinzel-deco font-bold text-sm"
        style={{
          background: locked ? '#1e1408' : 'linear-gradient(135deg, #8b6914, #c9a84c)',
          color: locked ? '#4a3820' : '#1a0e02',
          clipPath: 'polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)',
        }}
      >
        {index}
      </div>

      <div className="pl-16 pr-4 py-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-cinzel text-sm text-[#e8d098] tracking-wide">{mission.name}</h3>
              {mission.completed && (
                <span className="text-[#5a9a40] text-xs font-cinzel">✓ Завершено</span>
              )}
            </div>
            <p className="text-[#7a6040] text-xs mt-0.5 font-cinzel tracking-wider">{mission.era}</p>
            <p className="text-[#a08060] text-sm mt-2 font-cormorant leading-relaxed">{mission.description}</p>

            <div className="mt-3 flex flex-wrap gap-4">
              <div>
                <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-1">ЗАДАЧА</p>
                <p className="text-[#c9a84c] text-xs font-cormorant">{mission.objective}</p>
              </div>
              <div>
                <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-1">НАГРАДА</p>
                <p className="text-[#7ab070] text-xs font-cormorant">{mission.rewards}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="text-right">
              <p className="text-[#5a4030] text-xs font-cinzel tracking-widest">СЛОЖНОСТЬ</p>
              <p className="text-xs mt-0.5" style={{ color: diffColor }}>{diffStars}</p>
            </div>
            <button
              disabled={locked}
              onClick={onStart}
              className={`
                font-cinzel text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-300
                ${locked
                  ? 'bg-[#1e1408] text-[#3a2a18] cursor-not-allowed border border-[#2a1e0e]'
                  : 'border text-[#1a0e02] hover:opacity-90 active:scale-95'
                }
              `}
              style={!locked ? {
                background: 'linear-gradient(135deg, #8b6914, #c9a84c)',
                borderColor: '#e8c96a',
                clipPath: 'polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)',
              } : {}}
            >
              {locked ? '🔒 Закрыто' : mission.completed ? '↺ Повторить' : '▶ Начать'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
