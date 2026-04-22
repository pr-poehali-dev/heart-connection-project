import { Faction } from '@/types/game';
import { useState } from 'react';

interface Props {
  factions: Faction[];
  resources: { gold: number; influence: number };
  turn: number;
  onDiploAction: (factionId: string, action: 'gift' | 'threaten' | 'treaty' | 'war' | 'peace') => void;
}

const RELATION_LABEL: Record<string, string> = {
  ally: 'Союзник',
  neutral: 'Нейтрал',
  war: 'Война',
  vassal: 'Вассал',
};

const RELATION_COLOR: Record<string, string> = {
  ally: '#6aaa40',
  neutral: '#c9a84c',
  war: '#c04040',
  vassal: '#4a9fc4',
};

const RELATION_ICON: Record<string, string> = {
  ally: '🤝',
  neutral: '⚖️',
  war: '⚔️',
  vassal: '👑',
};

const WORLD_EVENTS = [
  { id: 1, turn: 42, text: 'Красный Орден захватил приграничную деревню', type: 'war' },
  { id: 2, turn: 44, text: 'Лазурная Гильдия предлагает торговый договор', type: 'diplomacy' },
  { id: 3, turn: 45, text: 'Лесной Пакт объявил о нейтралитете в войне', type: 'neutral' },
  { id: 4, turn: 47, text: 'Ваши шпионы доложили о планах наступления врага', type: 'intel' },
];

const EVENT_COLOR: Record<string, string> = {
  war: '#c04040',
  diplomacy: '#4a9fc4',
  neutral: '#c9a84c',
  intel: '#9b6fc4',
};

export default function PoliticsPanel({ factions, resources, turn, onDiploAction }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedFaction = factions.find(f => f.id === selected && !f.isPlayer);
  const otherFactions = factions.filter(f => !f.isPlayer);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-0">
      {/* Factions list */}
      <div className="w-full lg:w-64 shrink-0 border-r border-[#1e1408] overflow-y-auto" style={{ background: 'rgba(8,5,2,0.98)' }}>
        <div className="p-3 border-b border-[#1e1408]">
          <p className="text-[#5a4030] text-xs font-cinzel tracking-widest">ФРАКЦИИ</p>
        </div>
        <div className="divide-y divide-[#1e1408]">
          {otherFactions.map(faction => {
            const isSelected = selected === faction.id;
            const relColor = RELATION_COLOR[faction.relation] || '#c9a84c';
            return (
              <button
                key={faction.id}
                onClick={() => setSelected(isSelected ? null : faction.id)}
                className="w-full flex items-center gap-3 px-3 py-3 text-left transition-all duration-200"
                style={{
                  background: isSelected ? `${relColor}15` : 'transparent',
                  borderLeft: `2px solid ${isSelected ? relColor : 'transparent'}`,
                }}
              >
                <span className="text-xl">{faction.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-xs truncate" style={{ color: isSelected ? relColor : '#a08060' }}>
                    {faction.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs">{RELATION_ICON[faction.relation]}</span>
                    <span className="text-[10px] font-cinzel" style={{ color: relColor }}>
                      {RELATION_LABEL[faction.relation]}
                    </span>
                  </div>
                </div>
                {/* Strength bar */}
                <div className="shrink-0">
                  <div className="w-8 h-1 rounded-full overflow-hidden" style={{ background: '#1e1408' }}>
                    <div className="h-full rounded-full" style={{ width: `${faction.strength}%`, background: relColor }} />
                  </div>
                  <p className="text-[#3a2a18] text-[10px] font-cinzel text-right mt-0.5">{faction.strength}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* World events */}
        <div className="p-3 border-t border-[#1e1408] mt-2">
          <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-2">СОБЫТИЯ</p>
          <div className="space-y-2">
            {WORLD_EVENTS.filter(e => e.turn <= turn).slice(-4).reverse().map(event => (
              <div key={event.id} className="text-xs font-cormorant leading-snug" style={{ color: EVENT_COLOR[event.type] || '#c9a84c' }}>
                <span className="text-[#3a2a18] mr-1">Ход {event.turn}:</span>
                {event.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Faction detail */}
      <div className="flex-1 overflow-y-auto p-5">
        {selectedFaction ? (
          <FactionDetail faction={selectedFaction} resources={resources} onAction={onDiploAction} />
        ) : (
          <div className="space-y-5">
            {/* Player's faction overview */}
            <div>
              <div className="ornament-divider mb-4">
                <span className="font-cinzel text-xs text-[#5a4030] tracking-widest">Ваша фракция</span>
              </div>
              {factions.filter(f => f.isPlayer).map(f => (
                <div key={f.id} className="parchment-card rounded-sm p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{f.flag}</span>
                    <div>
                      <h3 className="font-cinzel text-base" style={{
                        background: 'linear-gradient(135deg, #e8c96a, #c9a84c)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}>{f.name}</h3>
                      <p className="text-[#5a4030] text-xs font-cinzel">{f.leader}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-1">МОЩЬ</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e1408' }}>
                          <div className="h-full rounded-full" style={{ width: `${f.strength}%`, background: '#c9a84c' }} />
                        </div>
                        <span className="text-[#c9a84c] font-cinzel text-xs">{f.strength}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-1">ПРОВИНЦИИ</p>
                      <p className="text-[#c9a84c] font-cinzel text-sm">{f.provinces}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Diplomatic summary */}
            <div>
              <div className="ornament-divider mb-4">
                <span className="font-cinzel text-xs text-[#5a4030] tracking-widest">Сводка отношений</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['ally', 'neutral', 'war', 'vassal'] as const).map(rel => {
                  const count = otherFactions.filter(f => f.relation === rel).length;
                  return (
                    <div key={rel} className="parchment-card rounded-sm p-3 flex items-center gap-2">
                      <span className="text-lg">{RELATION_ICON[rel]}</span>
                      <div>
                        <p className="font-cinzel text-sm" style={{ color: RELATION_COLOR[rel] }}>{count}</p>
                        <p className="text-[#5a4030] text-xs font-cinzel">{RELATION_LABEL[rel]}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[#3a2a18] text-sm font-cormorant text-center">← Выберите фракцию для переговоров</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FactionDetail({ faction, resources, onAction }: {
  faction: Faction;
  resources: { gold: number; influence: number };
  onAction: (id: string, action: 'gift' | 'threaten' | 'treaty' | 'war' | 'peace') => void;
}) {
  const relColor = RELATION_COLOR[faction.relation] || '#c9a84c';

  const ACTIONS: { id: 'gift' | 'threaten' | 'treaty' | 'war' | 'peace'; label: string; icon: string; cost: string; color: string; disabled?: boolean }[] = [
    { id: 'gift', label: 'Подарок', icon: '🎁', cost: '100🪙', color: '#6aaa40' },
    { id: 'treaty', label: 'Договор', icon: '📜', cost: '50👁️', color: '#4a9fc4', disabled: faction.relation === 'war' },
    { id: 'threaten', label: 'Угрозы', icon: '⚡', cost: '30👁️', color: '#c9a84c' },
    { id: faction.relation === 'war' ? 'peace' : 'war', label: faction.relation === 'war' ? 'Мир' : 'Война', icon: faction.relation === 'war' ? '🕊️' : '⚔️', cost: faction.relation === 'war' ? '200🪙' : '0', color: faction.relation === 'war' ? '#6aaa40' : '#c04040' },
  ];

  return (
    <div className="max-w-lg space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <span className="text-5xl">{faction.flag}</span>
        <div>
          <h2 className="font-cinzel text-xl" style={{ color: relColor }}>{faction.name}</h2>
          <p className="text-[#5a4030] font-cinzel text-xs mt-0.5">Лидер: <span className="text-[#a08060]">{faction.leader}</span></p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-base">{RELATION_ICON[faction.relation]}</span>
            <span className="font-cinzel text-sm" style={{ color: relColor }}>{RELATION_LABEL[faction.relation]}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="parchment-card rounded-sm p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[#5a4030] font-cinzel text-xs">Военная мощь</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e1408' }}>
              <div className="h-full rounded-full" style={{ width: `${faction.strength}%`, background: relColor }} />
            </div>
            <span className="font-cinzel text-xs" style={{ color: relColor }}>{faction.strength}/100</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#5a4030] font-cinzel text-xs">Отношение к вам</span>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full overflow-hidden" style={{ background: '#1e1408' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.abs(faction.attitude)}%`,
                  background: faction.attitude >= 0 ? '#6aaa40' : '#c04040',
                  marginLeft: faction.attitude < 0 ? `${100 - Math.abs(faction.attitude)}%` : '0',
                }}
              />
            </div>
            <span className="font-cinzel text-xs" style={{ color: faction.attitude >= 0 ? '#6aaa40' : '#c04040' }}>
              {faction.attitude > 0 ? `+${faction.attitude}` : faction.attitude}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[#5a4030] font-cinzel text-xs">Провинции</span>
          <span className="text-[#a08060] font-cinzel text-xs">{faction.provinces}</span>
        </div>
      </div>

      {/* Diplomatic actions */}
      <div>
        <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-3">ДИПЛОМАТИЧЕСКИЕ ДЕЙСТВИЯ</p>
        <div className="grid grid-cols-2 gap-2">
          {ACTIONS.map(action => (
            <button
              key={action.id}
              disabled={action.disabled}
              onClick={() => onAction(faction.id, action.id)}
              className="flex items-center gap-2 px-3 py-3 rounded-sm transition-all duration-200 font-cinzel text-xs text-left"
              style={{
                background: action.disabled ? 'rgba(255,255,255,0.02)' : `${action.color}12`,
                border: `1px solid ${action.disabled ? '#1e1408' : action.color + '44'}`,
                color: action.disabled ? '#3a2a18' : action.color,
                cursor: action.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              <span className="text-base">{action.icon}</span>
              <div>
                <p>{action.label}</p>
                <p className="text-[#3a2a18] text-[10px]">{action.cost}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
