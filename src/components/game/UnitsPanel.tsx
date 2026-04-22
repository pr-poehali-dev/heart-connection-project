import { Unit, Resources } from '@/types/game';
import { UNITS } from '@/data/gameData';
import { useState } from 'react';

const UNITS_IMAGE = "https://cdn.poehali.dev/projects/701d84b1-412c-4f74-9513-14e9ee4470cf/files/4c26e0f5-3fec-4b6b-91e0-0bdf1ea11c9a.jpg";

interface Props {
  units: Unit[];
  resources: Resources;
  onRecruit: (unitId: string) => void;
}

export default function UnitsPanel({ units, resources, onRecruit }: Props) {
  const [selected, setSelected] = useState<string | null>(units[0]?.id || null);
  const selectedUnit = [...units, ...UNITS.filter(u => !units.find(eu => eu.id === u.id))].find(u => u.id === selected);
  const hasUnit = units.find(u => u.id === selected);

  function canAfford(cost: Partial<Resources>): boolean {
    return Object.entries(cost).every(([k, v]) => resources[k as keyof Resources] >= (v ?? 0));
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-0">
      {/* Units list */}
      <div className="w-full lg:w-64 shrink-0 border-r border-[#1e1408] overflow-y-auto" style={{ background: 'rgba(8,5,2,0.98)' }}>
        <div className="p-3 border-b border-[#1e1408]">
          <p className="text-[#5a4030] text-xs font-cinzel tracking-widest">БОЕВЫЕ ОТРЯДЫ</p>
        </div>
        <div className="divide-y divide-[#1e1408]">
          {UNITS.map(unit => {
            const owned = units.find(u => u.id === unit.id);
            const isSelected = selected === unit.id;
            return (
              <button
                key={unit.id}
                onClick={() => setSelected(unit.id)}
                className="w-full flex items-center gap-3 px-3 py-3 text-left transition-all duration-200"
                style={{
                  background: isSelected ? 'rgba(201,168,76,0.1)' : 'transparent',
                  borderLeft: isSelected ? '2px solid #c9a84c' : '2px solid transparent',
                }}
              >
                <span className="text-2xl">{unit.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-xs truncate" style={{ color: isSelected ? '#c9a84c' : '#a08060' }}>
                    {unit.name}
                  </p>
                  {owned ? (
                    <p className="text-[#5a9a40] text-[10px] font-cinzel">×{owned.count} в армии</p>
                  ) : (
                    <p className="text-[#3a2a18] text-[10px] font-cinzel">Не завербован</p>
                  )}
                </div>
                {/* Mini stat bars */}
                <div className="flex flex-col gap-0.5">
                  <MiniBar value={unit.attack} max={50} color="#c04040" />
                  <MiniBar value={unit.defense} max={50} color="#4080c0" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Unit detail */}
      <div className="flex-1 overflow-y-auto p-5">
        {selectedUnit ? (
          <div className="max-w-lg">
            {/* Header */}
            <div className="flex items-start gap-4 mb-5">
              <div
                className="w-20 h-20 flex items-center justify-center text-5xl rounded-sm shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #1a1208, #2a1e0e)',
                  border: '1px solid #3a2a10',
                  boxShadow: '0 0 20px rgba(201,168,76,0.1)',
                }}
              >
                {selectedUnit.emoji}
              </div>
              <div>
                <h2 className="font-cinzel text-xl" style={{
                  background: 'linear-gradient(135deg, #e8c96a, #c9a84c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  {selectedUnit.name}
                </h2>
                <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mt-1">
                  {selectedUnit.type.toUpperCase()}
                </p>
                {hasUnit && (
                  <p className="text-[#5a9a40] text-sm font-cinzel mt-1">
                    ✓ {hasUnit.count} отрядов в армии
                  </p>
                )}
              </div>
            </div>

            {/* Combat stats */}
            <div className="mb-5">
              <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-3">БОЕВЫЕ ХАРАКТЕРИСТИКИ</p>
              <div className="space-y-2.5">
                <StatBar label="Атака" value={selectedUnit.attack} max={50} color="#c04040" icon="⚔️" />
                <StatBar label="Защита" value={selectedUnit.defense} max={50} color="#4080c0" icon="🛡️" />
                <StatBar label="Здоровье" value={selectedUnit.hp} max={200} color="#5a9a40" icon="❤️" />
                <StatBar label="Движение" value={selectedUnit.movement} max={5} color="#c9a84c" icon="👟" />
              </div>
            </div>

            {/* Cost */}
            <div className="mb-5 parchment-card rounded-sm p-4">
              <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-3">СТОИМОСТЬ НАЙМА</p>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(selectedUnit.cost).map(([key, val]) => {
                  const canAff = resources[key as keyof Resources] >= (val ?? 0);
                  return (
                    <div key={key} className="flex items-center gap-1.5">
                      <span className="text-sm">{getResourceIcon(key)}</span>
                      <span className="font-cinzel text-sm" style={{ color: canAff ? '#c9a84c' : '#c04040' }}>
                        {val}
                      </span>
                      {!canAff && <span className="text-[#c04040] text-xs">!</span>}
                    </div>
                  );
                })}
              </div>
              <p className="text-[#5a4030] text-xs font-cinzel mt-2">
                Содержание: <span className="text-[#c9a84c]">{selectedUnit.upkeep}🪙/ход</span>
              </p>
            </div>

            {/* Recruit button */}
            <button
              onClick={() => onRecruit(selectedUnit.id)}
              disabled={!canAfford(selectedUnit.cost)}
              className="w-full font-cinzel text-sm tracking-widest uppercase py-3 px-6 transition-all duration-300"
              style={canAfford(selectedUnit.cost) ? {
                background: 'linear-gradient(135deg, #6b4a10, #c9a84c)',
                color: '#1a0e02',
                border: '1px solid #8b6914',
                clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
              } : {
                background: '#1a1208',
                color: '#3a2a18',
                border: '1px solid #2a1e0e',
                cursor: 'not-allowed',
              }}
            >
              {canAfford(selectedUnit.cost) ? `⚔️ Завербовать ${selectedUnit.name}` : '🔒 Недостаточно ресурсов'}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-[#3a2a18] font-cinzel text-sm">
            Выберите отряд
          </div>
        )}
      </div>
    </div>
  );
}

function StatBar({ label, value, max, color, icon }: { label: string; value: number; max: number; color: string; icon: string }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs w-4">{icon}</span>
      <span className="text-[#5a4030] font-cinzel text-xs w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e1408' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-cinzel text-xs w-6 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="w-10 h-1 rounded-full overflow-hidden" style={{ background: '#1e1408' }}>
      <div className="h-full rounded-full" style={{ width: `${(value / max) * 100}%`, background: color }} />
    </div>
  );
}

function getResourceIcon(key: string): string {
  const map: Record<string, string> = { gold: '🪙', food: '🌾', iron: '⚒️', wood: '🪵', faith: '✝️', influence: '👁️' };
  return map[key] || '◆';
}
