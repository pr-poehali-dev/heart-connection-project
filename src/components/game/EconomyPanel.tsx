import { Resources, Province } from '@/types/game';

interface Props {
  resources: Resources;
  delta: Resources;
  provinces: Province[];
  turn: number;
}

const RES_CONFIG = [
  { key: 'gold' as keyof Resources, label: 'Золото', icon: '🪙', color: '#c9a84c', desc: 'Основная валюта. Тратится на войска, постройки и дипломатию.' },
  { key: 'food' as keyof Resources, label: 'Пища', icon: '🌾', color: '#6aaa40', desc: 'Кормит население и армию. Нехватка вызывает бунты.' },
  { key: 'iron' as keyof Resources, label: 'Железо', icon: '⚒️', color: '#8899aa', desc: 'Необходимо для тяжёлых войск, укреплений и оружия.' },
  { key: 'wood' as keyof Resources, label: 'Лес', icon: '🪵', color: '#8a5a30', desc: 'Нужен для флота, осадных орудий и строительства.' },
  { key: 'faith' as keyof Resources, label: 'Вера', icon: '✝️', color: '#9b6fc4', desc: 'Повышает счастье, открывает религиозных юнитов и политику.' },
  { key: 'influence' as keyof Resources, label: 'Влияние', icon: '👁️', color: '#4a9fc4', desc: 'Дипломатия, союзы, подкуп и шпионаж.' },
];

const BUILDING_INCOME: Record<string, { icon: string; label: string; gold: number; food: number; iron: number; wood: number }> = {
  farm: { icon: '🌾', label: 'Ферма', gold: 5, food: 25, iron: 0, wood: 0 },
  mine: { icon: '⛏️', label: 'Шахта', gold: 15, food: 0, iron: 20, wood: 0 },
  market: { icon: '🏪', label: 'Рынок', gold: 30, food: 5, iron: 0, wood: 0 },
  barracks: { icon: '⚔️', label: 'Казармы', gold: -10, food: -8, iron: -5, wood: 0 },
  temple: { icon: '⛪', label: 'Храм', gold: 5, food: 2, iron: 0, wood: 0 },
  fortress: { icon: '🏰', label: 'Крепость', gold: -15, food: -5, iron: -10, wood: -5 },
  library: { icon: '📚', label: 'Библиотека', gold: -8, food: 0, iron: 0, wood: 0 },
};

export default function EconomyPanel({ resources, delta, provinces, turn }: Props) {
  const playerProvinces = provinces.filter(p => p.owner === 'player');
  const totalPop = playerProvinces.reduce((s, p) => s + p.population, 0);
  const avgHappiness = Math.round(playerProvinces.reduce((s, p) => s + p.happiness, 0) / (playerProvinces.length || 1));
  const allBuildings = playerProvinces.flatMap(p => p.buildings);

  // Calculate projections
  const turnsToTarget = 10;
  const projectedGold = resources.gold + delta.gold * turnsToTarget;

  return (
    <div className="flex flex-col gap-0 h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-5 space-y-6">

        {/* Key metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <MetricCard icon="🏙️" label="Провинции" value={playerProvinces.length.toString()} sub="под контролем" color="#c9a84c" />
          <MetricCard icon="👥" label="Население" value={totalPop.toLocaleString('ru')} sub="жителей" color="#8899aa" />
          <MetricCard icon="😊" label="Счастье" value={`${avgHappiness}%`} sub="среднее" color={avgHappiness > 70 ? '#6aaa40' : avgHappiness > 40 ? '#c9a84c' : '#c04040'} />
          <MetricCard icon="📅" label="Ход" value={turn.toString()} sub="текущий" color="#c9a84c" />
          <MetricCard icon="🪙" label="Прогноз (+10)" value={projectedGold.toLocaleString('ru')} sub="золота через 10 ходов" color={projectedGold > resources.gold ? '#6aaa40' : '#c04040'} />
          <MetricCard icon="⚔️" label="Военные расходы" value={`${Math.abs(delta.gold < 0 ? delta.gold : 0)}🪙`} sub="в ход" color="#c04040" />
        </div>

        {/* Resources details */}
        <div>
          <SectionTitle>Ресурсы империи</SectionTitle>
          <div className="space-y-3">
            {RES_CONFIG.map(({ key, label, icon, color, desc }) => {
              const val = resources[key];
              const d = delta[key];
              const pct = Math.min(100, Math.round((val / Math.max(val, 1000)) * 100));
              return (
                <div key={key} className="parchment-card rounded-sm p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{icon}</span>
                      <span className="font-cinzel text-xs" style={{ color }}>{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-cinzel text-sm" style={{ color }}>{val.toLocaleString('ru')}</span>
                      <span
                        className="font-cinzel text-xs px-1.5 py-0.5 rounded-sm"
                        style={{
                          background: d > 0 ? 'rgba(90,160,60,0.15)' : d < 0 ? 'rgba(192,64,64,0.15)' : 'transparent',
                          color: d > 0 ? '#6aaa40' : d < 0 ? '#c04040' : '#5a4030',
                        }}
                      >
                        {d > 0 ? `+${d}` : d}/ход
                      </span>
                    </div>
                  </div>
                  <div className="h-1 rounded-full overflow-hidden mb-1.5" style={{ background: '#1e1408' }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <p className="text-[#4a3820] text-xs font-cormorant">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Building income */}
        <div>
          <SectionTitle>Доходы от построек</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-cinzel">
              <thead>
                <tr className="border-b border-[#2a1e0e]">
                  <th className="text-left py-2 px-2 text-[#5a4030] font-normal tracking-widest">ПОСТРОЙКА</th>
                  <th className="text-right py-2 px-2 text-[#c9a84c]">🪙</th>
                  <th className="text-right py-2 px-2 text-[#6aaa40]">🌾</th>
                  <th className="text-right py-2 px-2 text-[#8899aa]">⚒️</th>
                  <th className="text-right py-2 px-2 text-[#8a5a30]">🪵</th>
                  <th className="text-right py-2 px-2 text-[#5a4030]">Кол-во</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1208]">
                {Object.entries(BUILDING_INCOME).map(([key, b]) => {
                  const count = allBuildings.filter(ab => ab === key).length;
                  if (count === 0) return null;
                  return (
                    <tr key={key} className="hover:bg-[rgba(201,168,76,0.04)] transition-colors">
                      <td className="py-2 px-2">
                        <span className="mr-1.5">{b.icon}</span>
                        <span className="text-[#a08060]">{b.label}</span>
                      </td>
                      {[b.gold, b.food, b.iron, b.wood].map((v, i) => (
                        <td key={i} className="text-right py-2 px-2" style={{ color: v > 0 ? '#6aaa40' : v < 0 ? '#c04040' : '#3a2a18' }}>
                          {v !== 0 ? (v > 0 ? `+${v * count}` : v * count) : '—'}
                        </td>
                      ))}
                      <td className="text-right py-2 px-2 text-[#5a4030]">×{count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Province breakdown */}
        <div>
          <SectionTitle>Провинции</SectionTitle>
          <div className="space-y-2">
            {playerProvinces.map(p => (
              <div key={p.id} className="parchment-card rounded-sm p-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-cinzel text-xs text-[#c9a84c]">{p.name}</p>
                  <p className="text-[#5a4030] text-[10px] font-cinzel">{p.terrain}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#8899aa] text-xs">👥 {p.population.toLocaleString('ru')}</span>
                  <div
                    className="w-12 h-1.5 rounded-full overflow-hidden"
                    style={{ background: '#1e1408' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${p.happiness}%`,
                        background: p.happiness > 70 ? '#6aaa40' : p.happiness > 40 ? '#c9a84c' : '#c04040',
                      }}
                    />
                  </div>
                  <span className="text-xs" style={{ color: p.happiness > 70 ? '#6aaa40' : p.happiness > 40 ? '#c9a84c' : '#c04040' }}>
                    {p.happiness}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="parchment-card rounded-sm p-3 text-center">
      <span className="text-xl block mb-1">{icon}</span>
      <p className="font-cinzel text-lg font-bold leading-none" style={{ color }}>{value}</p>
      <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mt-1">{label}</p>
      <p className="text-[#3a2a18] text-[10px] font-cormorant">{sub}</p>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="ornament-divider mb-4">
      <span className="font-cinzel text-xs text-[#5a4030] tracking-widest shrink-0">{children}</span>
    </div>
  );
}
