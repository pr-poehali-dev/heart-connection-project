import { Province, Faction } from '@/types/game';

const MAP_IMAGE = "https://cdn.poehali.dev/projects/701d84b1-412c-4f74-9513-14e9ee4470cf/files/417b2734-957f-43f8-864f-29f469315c13.jpg";

interface Props {
  provinces: Province[];
  factions: Faction[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

const TERRAIN_COLOR: Record<string, string> = {
  plains: 'rgba(180,160,80,0.7)',
  forest: 'rgba(60,120,50,0.75)',
  mountain: 'rgba(120,110,100,0.7)',
  coast: 'rgba(50,100,160,0.7)',
  desert: 'rgba(200,170,80,0.7)',
  swamp: 'rgba(80,100,60,0.7)',
};

const OWNER_BORDER: Record<string, string> = {
  player: '#c9a84c',
  'enemy-red': '#c04040',
  neutral: '#5a5040',
};

const TERRAIN_ICON: Record<string, string> = {
  plains: '🏰',
  forest: '🌲',
  mountain: '⛰️',
  coast: '⚓',
  desert: '🏜️',
  swamp: '🌿',
};

export default function MapPanel({ provinces, factions, selected, onSelect }: Props) {
  const selectedProv = provinces.find(p => p.id === selected);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-0">
      {/* Map */}
      <div className="relative flex-1 overflow-hidden min-h-[300px]" style={{ background: '#0a0805' }}>
        <img
          src={MAP_IMAGE}
          alt="Карта мира"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        {/* Map overlay grid effect */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, rgba(8,5,2,0.6) 100%)',
        }} />

        {/* Province markers */}
        {provinces.map(prov => {
          const isSelected = selected === prov.id;
          const borderColor = OWNER_BORDER[prov.owner] || '#5a5040';

          return (
            <div
              key={prov.id}
              className="absolute cursor-pointer group"
              style={{
                left: `${prov.x}%`,
                top: `${prov.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => onSelect(isSelected ? null : prov.id)}
            >
              {/* Pulse ring for selected */}
              {isSelected && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: `2px solid ${borderColor}`,
                    transform: 'scale(2.5)',
                    opacity: 0.4,
                    animation: 'map-ping 1.5s ease-in-out infinite',
                  }}
                />
              )}

              {/* Main marker */}
              <div
                className="relative flex flex-col items-center transition-all duration-200 group-hover:scale-110"
              >
                <div
                  className="w-8 h-8 rounded-sm flex items-center justify-center text-sm shadow-lg"
                  style={{
                    background: TERRAIN_COLOR[prov.terrain],
                    border: `2px solid ${isSelected ? borderColor : borderColor + '88'}`,
                    boxShadow: isSelected ? `0 0 12px ${borderColor}66` : 'none',
                  }}
                >
                  {TERRAIN_ICON[prov.terrain]}
                </div>
                <div
                  className="mt-1 px-1.5 py-0.5 text-[10px] font-cinzel whitespace-nowrap rounded-sm backdrop-blur-sm"
                  style={{
                    background: 'rgba(8,5,2,0.85)',
                    color: borderColor,
                    border: `1px solid ${borderColor}44`,
                    maxWidth: '90px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {prov.name}
                </div>
              </div>
            </div>
          );
        })}

        {/* Map legend */}
        <div
          className="absolute bottom-3 left-3 p-2 rounded-sm text-xs font-cinzel space-y-1"
          style={{ background: 'rgba(8,5,2,0.85)', border: '1px solid #2a1e0e' }}
        >
          <p className="text-[#5a4030] tracking-widest text-[10px] mb-1">ЛЕГЕНДА</p>
          {[
            { color: '#c9a84c', label: 'Ваши провинции' },
            { color: '#c04040', label: 'Враг' },
            { color: '#5a5040', label: 'Нейтральные' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              <span style={{ color }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Province Detail Panel */}
      <div
        className="w-full lg:w-72 shrink-0 overflow-y-auto"
        style={{ background: 'rgba(10,7,3,0.98)', borderLeft: '1px solid #2a1e0e' }}
      >
        {selectedProv ? (
          <ProvinceDetail province={selectedProv} factions={factions} />
        ) : (
          <ProvinceListPanel provinces={provinces} onSelect={onSelect} />
        )}
      </div>
    </div>
  );
}

function ProvinceDetail({ province, factions }: { province: Province; factions: Faction[] }) {
  const faction = factions.find(f => f.id === province.owner);
  const ownerColor = OWNER_BORDER[province.owner] || '#5a5040';

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">{TERRAIN_ICON[province.terrain]}</span>
          <h3 className="font-cinzel text-base" style={{ color: ownerColor }}>{province.name}</h3>
        </div>
        <p className="text-[#5a4030] text-xs font-cinzel tracking-widest">
          {faction?.name || 'Нейтральная территория'}
        </p>
      </div>

      <div className="space-y-2">
        <StatRow label="Население" value={province.population.toLocaleString('ru')} icon="👥" />
        <StatRow label="Счастье" value={`${province.happiness}%`} icon="😊" color={province.happiness > 70 ? '#6aaa40' : province.happiness > 40 ? '#c9a84c' : '#c04040'} />
        <StatRow label="Оборона" value={`${province.defense}%`} icon="🛡️" color="#8899aa" />
        <StatRow label="Рельеф" value={province.terrain} icon="🗺️" />
      </div>

      {Object.keys(province.resources).length > 0 && (
        <div>
          <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-2">РЕСУРСЫ</p>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.entries(province.resources).map(([key, val]) => (
              <div key={key} className="flex items-center gap-1.5 px-2 py-1 rounded-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid #1e1408' }}>
                <span className="text-xs">{getResourceIcon(key)}</span>
                <span className="text-[#c9a84c] font-cinzel text-xs">+{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {province.buildings.length > 0 && (
        <div>
          <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-2">ПОСТРОЙКИ</p>
          <div className="flex flex-wrap gap-1.5">
            {province.buildings.map((b, i) => (
              <span key={i} className="px-2 py-0.5 text-xs font-cinzel rounded-sm" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid #3a2a10', color: '#a08040' }}>
                {getBuildingLabel(b)}
              </span>
            ))}
          </div>
        </div>
      )}

      {province.units.length > 0 && (
        <div>
          <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-2">ВОЙСКА</p>
          <div className="flex flex-wrap gap-1">
            {province.units.map((u, i) => (
              <span key={i} className="text-sm" title={u}>{getUnitEmoji(u)}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProvinceListPanel({ provinces, onSelect }: { provinces: Province[]; onSelect: (id: string) => void }) {
  return (
    <div className="p-4">
      <p className="text-[#5a4030] text-xs font-cinzel tracking-widest mb-3">ПРОВИНЦИИ</p>
      <p className="text-[#3a2a18] text-xs font-cormorant mb-4">Выберите провинцию на карте</p>
      <div className="space-y-1.5">
        {provinces.map(p => (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-sm text-left transition-all hover:bg-[rgba(201,168,76,0.08)]"
            style={{ border: '1px solid #1e1408' }}
          >
            <span className="text-sm">{TERRAIN_ICON[p.terrain]}</span>
            <div className="flex-1 min-w-0">
              <p className="font-cinzel text-xs truncate" style={{ color: OWNER_BORDER[p.owner] || '#5a5040' }}>{p.name}</p>
              <p className="text-[#3a2a18] text-[10px]">{p.terrain}</p>
            </div>
            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: OWNER_BORDER[p.owner] || '#5a5040' }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function StatRow({ label, value, icon, color }: { label: string; value: string; icon: string; color?: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-xs">{icon}</span>
        <span className="text-[#5a4030] text-xs font-cinzel">{label}</span>
      </div>
      <span className="text-xs font-cinzel" style={{ color: color || '#a08060' }}>{value}</span>
    </div>
  );
}

function getResourceIcon(key: string): string {
  const map: Record<string, string> = { gold: '🪙', food: '🌾', iron: '⚒️', wood: '🪵', faith: '✝️', influence: '👁️' };
  return map[key] || '◆';
}

function getBuildingLabel(b: string): string {
  const map: Record<string, string> = { farm: 'Ферма', mine: 'Шахта', barracks: 'Казармы', market: 'Рынок', temple: 'Храм', fortress: 'Крепость', library: 'Библиотека' };
  return map[b] || b;
}

function getUnitEmoji(u: string): string {
  const map: Record<string, string> = { infantry: '⚔️', archer: '🏹', cavalry: '🐴', siege: '💣', mage: '🔮', navy: '⚓' };
  return map[u] || '🗡️';
}
