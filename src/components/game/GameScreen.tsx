import { useState } from 'react';
import { GamePanel, GameScreen as GS } from '@/types/game';
import { INITIAL_RESOURCES, INITIAL_DELTA, UNITS, TECHNOLOGIES, PROVINCES, FACTIONS } from '@/data/gameData';
import { Unit, Technology, Province, Faction, Resources } from '@/types/game';
import ResourceHUD from './ResourceHUD';
import MapPanel from './MapPanel';
import UnitsPanel from './UnitsPanel';
import TechPanel from './TechPanel';
import EconomyPanel from './EconomyPanel';
import PoliticsPanel from './PoliticsPanel';
import Icon from '@/components/ui/icon';

interface Props {
  onNavigate: (screen: GS) => void;
  missionId?: number;
}

const PANEL_TABS: { id: GamePanel; label: string; icon: string }[] = [
  { id: 'map', label: 'Карта', icon: 'Map' },
  { id: 'economy', label: 'Казна', icon: 'Coins' },
  { id: 'tech', label: 'Науки', icon: 'FlaskConical' },
  { id: 'units', label: 'Войска', icon: 'Swords' },
  { id: 'politics', label: 'Двор', icon: 'Crown' },
];

const SEASONS: Array<'spring' | 'summer' | 'autumn' | 'winter'> = ['spring', 'summer', 'autumn', 'winter'];

export default function GameScreen({ onNavigate }: Props) {
  const [activePanel, setActivePanel] = useState<GamePanel>('map');
  const [turn, setTurn] = useState(1);
  const [year, setYear] = useState(892);
  const [seasonIdx, setSeasonIdx] = useState(0);
  const [resources, setResources] = useState<Resources>({ ...INITIAL_RESOURCES });
  const [delta] = useState<Resources>({ ...INITIAL_DELTA });
  const [units, setUnits] = useState<Unit[]>(UNITS.filter(u => u.count > 0));
  const [technologies, setTechnologies] = useState<Technology[]>(TECHNOLOGIES);
  const [provinces] = useState<Province[]>(PROVINCES);
  const [factions, setFactions] = useState<Faction[]>(FACTIONS);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [researchQueue, setResearchQueue] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  function showNotification(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }

  function handleEndTurn() {
    // Apply resource delta
    setResources(prev => ({
      gold: Math.max(0, prev.gold + delta.gold),
      food: Math.max(0, prev.food + delta.food),
      iron: Math.max(0, prev.iron + delta.iron),
      wood: Math.max(0, prev.wood + delta.wood),
      faith: Math.max(0, prev.faith + delta.faith),
      influence: Math.max(0, prev.influence + delta.influence),
    }));

    // Advance tech research
    if (researchQueue) {
      setTechnologies(prev => prev.map(t => {
        if (t.id === researchQueue) {
          const newProgress = Math.min(100, t.progress + Math.round(100 / t.turns));
          if (newProgress >= 100) {
            setResearchQueue(null);
            showNotification(`✅ Исследование "${t.name}" завершено!`);
            return { ...t, progress: 100, researched: true, inProgress: false };
          }
          return { ...t, progress: newProgress, inProgress: true };
        }
        return t;
      }));
    }

    // Advance turn / season / year
    const newSeasonIdx = (seasonIdx + 1) % 4;
    setSeasonIdx(newSeasonIdx);
    if (newSeasonIdx === 0) setYear(prev => prev + 1);
    setTurn(prev => prev + 1);

    showNotification(`⏱ Ход ${turn + 1}. ${['Весна', 'Лето', 'Осень', 'Зима'][newSeasonIdx]} ${newSeasonIdx === 0 ? year + 1 : year} г.`);
  }

  function handleRecruit(unitId: string) {
    const template = UNITS.find(u => u.id === unitId);
    if (!template) return;

    // Check cost
    for (const [k, v] of Object.entries(template.cost)) {
      if (resources[k as keyof Resources] < (v ?? 0)) {
        showNotification('❌ Недостаточно ресурсов для найма');
        return;
      }
    }

    // Deduct cost
    setResources(prev => {
      const next = { ...prev };
      for (const [k, v] of Object.entries(template.cost)) {
        (next[k as keyof Resources] as number) -= (v ?? 0);
      }
      return next;
    });

    // Add unit
    setUnits(prev => {
      const existing = prev.find(u => u.id === unitId);
      if (existing) {
        return prev.map(u => u.id === unitId ? { ...u, count: u.count + 1 } : u);
      }
      return [...prev, { ...template, count: 1 }];
    });

    showNotification(`⚔️ ${template.name} завербованы!`);
  }

  function handleResearch(techId: string) {
    const tech = technologies.find(t => t.id === techId);
    if (!tech || tech.researched) return;

    if (researchQueue === techId) {
      setResearchQueue(null);
      setTechnologies(prev => prev.map(t => t.id === techId ? { ...t, inProgress: false } : t));
      showNotification('❌ Исследование отменено');
      return;
    }

    // Cancel previous
    setTechnologies(prev => prev.map(t => t.inProgress ? { ...t, inProgress: false } : t));
    setResearchQueue(techId);
    setTechnologies(prev => prev.map(t => t.id === techId ? { ...t, inProgress: true } : t));
    showNotification(`🔬 Начато исследование: ${tech.name}`);
  }

  function handleDiploAction(factionId: string, action: 'gift' | 'threaten' | 'treaty' | 'war' | 'peace') {
    const faction = factions.find(f => f.id === factionId);
    if (!faction) return;

    const msgs: Record<string, string> = {
      gift: `🎁 Подарок отправлен ${faction.name}`,
      threaten: `⚡ Угрозы высказаны ${faction.name}`,
      treaty: `📜 Договор предложен ${faction.name}`,
      war: `⚔️ Война объявлена ${faction.name}!`,
      peace: `🕊️ Мир заключён с ${faction.name}`,
    };

    const attitudeChange: Record<string, number> = {
      gift: 20,
      threaten: -15,
      treaty: 10,
      war: -80,
      peace: 30,
    };

    const relChange: Record<string, 'ally' | 'neutral' | 'war' | 'vassal'> = {
      gift: faction.relation,
      threaten: faction.relation,
      treaty: 'neutral',
      war: 'war',
      peace: 'neutral',
    };

    setFactions(prev => prev.map(f =>
      f.id === factionId
        ? {
            ...f,
            attitude: Math.max(-100, Math.min(100, f.attitude + attitudeChange[action])),
            relation: relChange[action],
          }
        : f
    ));

    if (action === 'gift') {
      setResources(prev => ({ ...prev, gold: Math.max(0, prev.gold - 100) }));
    }

    showNotification(msgs[action] || 'Действие выполнено');
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'hsl(20,14%,4%)' }}>
      {/* HUD */}
      <ResourceHUD
        resources={resources}
        delta={delta}
        turn={turn}
        year={year}
        season={SEASONS[seasonIdx]}
        onEndTurn={handleEndTurn}
      />

      {/* Notification toast */}
      {notification && (
        <div
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-sm font-cinzel text-xs tracking-wider shadow-2xl"
          style={{
            background: 'rgba(10,7,3,0.96)',
            border: '1px solid #c9a84c44',
            color: '#c9a84c',
            animation: 'fade-in-up 0.3s ease forwards',
          }}
        >
          {notification}
        </div>
      )}

      {/* Panel tabs */}
      <div
        className="flex items-center border-b border-[#1e1408] overflow-x-auto flex-shrink-0"
        style={{ background: 'rgba(8,5,2,0.97)' }}
      >
        {PANEL_TABS.map(tab => {
          const isActive = activePanel === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActivePanel(tab.id)}
              className="flex items-center gap-2 px-4 py-2.5 font-cinzel text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-200 relative"
              style={{
                color: isActive ? '#c9a84c' : '#3a2a18',
                borderBottom: isActive ? '2px solid #c9a84c' : '2px solid transparent',
                background: isActive ? 'rgba(201,168,76,0.06)' : 'transparent',
              }}
            >
              <Icon name={tab.icon} size={14} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}

        <div className="ml-auto flex items-center border-l border-[#1e1408]">
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="px-4 py-2.5 text-[#3a2a18] hover:text-[#c9a84c] transition-colors"
          >
            <Icon name="Menu" size={14} />
          </button>
        </div>

        {/* Dropdown menu */}
        {menuOpen && (
          <div
            className="absolute right-0 top-20 z-50 py-1 rounded-sm shadow-2xl min-w-36"
            style={{
              background: 'rgba(10,7,3,0.98)',
              border: '1px solid #2a1e0e',
              top: '88px',
            }}
          >
            {[
              { label: 'Кампания', icon: '📜', action: () => { onNavigate('campaign'); setMenuOpen(false); } },
              { label: 'Главное меню', icon: '🏰', action: () => { onNavigate('main-menu'); setMenuOpen(false); } },
            ].map(item => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full flex items-center gap-2 px-4 py-2 font-cinzel text-xs text-left hover:bg-[rgba(201,168,76,0.08)] transition-colors"
                style={{ color: '#a08060' }}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden relative">
        {activePanel === 'map' && (
          <MapPanel
            provinces={provinces}
            factions={factions}
            selected={selectedProvince}
            onSelect={setSelectedProvince}
          />
        )}
        {activePanel === 'economy' && (
          <EconomyPanel
            resources={resources}
            delta={delta}
            provinces={provinces}
            turn={turn}
          />
        )}
        {activePanel === 'tech' && (
          <TechPanel
            technologies={technologies}
            onResearch={handleResearch}
            researchQueue={researchQueue}
          />
        )}
        {activePanel === 'units' && (
          <UnitsPanel
            units={units}
            resources={resources}
            onRecruit={handleRecruit}
          />
        )}
        {activePanel === 'politics' && (
          <PoliticsPanel
            factions={factions}
            resources={{ gold: resources.gold, influence: resources.influence }}
            turn={turn}
            onDiploAction={handleDiploAction}
          />
        )}
      </div>
    </div>
  );
}
