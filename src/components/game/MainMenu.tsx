import { GameScreen } from '@/types/game';

const BG = "https://cdn.poehali.dev/projects/701d84b1-412c-4f74-9513-14e9ee4470cf/files/125ab655-f1ff-4517-815f-4d4c834b909b.jpg";

interface Props {
  onNavigate: (screen: GameScreen) => void;
}

export default function MainMenu({ onNavigate }: Props) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${BG})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0d0a07] via-[#0d0a07]/60 to-[#0d0a07]/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0a07]/50 via-transparent to-[#0d0a07]/50" />

      {/* Particle embers (CSS only) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: `hsl(${35 + i * 3}, 80%, ${55 + i * 2}%)`,
              left: `${8 + i * 7.5}%`,
              bottom: '0',
              animation: `float ${4 + i * 0.4}s ease-in-out ${i * 0.3}s infinite`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* Logo ornament */}
        <div className="flex items-center gap-3 animate-fade-in-up opacity-0 delay-100">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a84c]" />
          <span className="text-[#c9a84c] text-xs tracking-[0.4em] uppercase font-cinzel">Anno Domini 892</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a84c]" />
        </div>

        {/* Title */}
        <div className="text-center animate-fade-in-up opacity-0 delay-200">
          <h1
            className="font-cinzel-deco font-bold leading-none select-none"
            style={{
              fontSize: 'clamp(3.5rem, 10vw, 7rem)',
              background: 'linear-gradient(180deg, #f0d878 0%, #c9a84c 35%, #8b6914 65%, #c9a84c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
              filter: 'drop-shadow(0 0 30px rgba(201,168,76,0.4))',
            }}
          >
            IMPERIUM
          </h1>
          <p className="font-cinzel text-[#a08040] tracking-[0.6em] text-sm mt-2 uppercase">
            Стратегия завоевания
          </p>
        </div>

        {/* Divider */}
        <div className="ornament-divider w-64 animate-fade-in-up opacity-0 delay-300">
          <span className="text-[#c9a84c] text-lg">⚜</span>
        </div>

        {/* Menu buttons */}
        <div className="flex flex-col gap-3 w-72 animate-fade-in-up opacity-0 delay-400">
          <MenuButton
            label="Новая кампания"
            icon="⚔️"
            primary
            onClick={() => onNavigate('campaign')}
          />
          <MenuButton
            label="Продолжить поход"
            icon="📜"
            onClick={() => onNavigate('game')}
          />
          <MenuButton
            label="Настройки"
            icon="⚙️"
            onClick={() => {}}
          />
        </div>

        {/* Footer */}
        <p className="text-[#5a4a30] font-cinzel text-xs tracking-widest animate-fade-in opacity-0 delay-600">
          POEHALI.DEV — 2025
        </p>
      </div>
    </div>
  );
}

function MenuButton({
  label,
  icon,
  primary,
  onClick,
}: {
  label: string;
  icon: string;
  primary?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative group flex items-center gap-3 px-6 py-3.5 w-full
        font-cinzel text-sm tracking-wider uppercase transition-all duration-300
        border overflow-hidden
        ${primary
          ? 'bg-gradient-to-r from-[#7a5a10] via-[#c9a84c] to-[#7a5a10] border-[#e8c96a] text-[#1a0e02]'
          : 'bg-[rgba(20,14,8,0.7)] border-[#4a3810] text-[#c9a84c] hover:border-[#c9a84c] hover:bg-[rgba(40,28,10,0.8)]'
        }
      `}
      style={{
        clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)',
      }}
    >
      {/* Shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(105deg, transparent 30%, rgba(255,220,100,0.12) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
        }}
      />
      <span className="text-base">{icon}</span>
      <span className="relative z-10">{label}</span>
      {primary && (
        <span className="ml-auto text-[#7a5a10] group-hover:translate-x-1 transition-transform">›</span>
      )}
    </button>
  );
}
