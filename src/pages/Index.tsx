import { useState } from 'react';
import { GameScreen } from '@/types/game';
import MainMenu from '@/components/game/MainMenu';
import CampaignScreen from '@/components/game/CampaignScreen';
import GameScreenComponent from '@/components/game/GameScreen';

const Index = () => {
  const [screen, setScreen] = useState<GameScreen>('main-menu');
  const [currentMission, setCurrentMission] = useState<number>(1);

  function handleNavigate(s: GameScreen) {
    setScreen(s);
  }

  function handleStartMission(id: number) {
    setCurrentMission(id);
    setScreen('game');
  }

  return (
    <>
      {screen === 'main-menu' && (
        <MainMenu onNavigate={handleNavigate} />
      )}
      {screen === 'campaign' && (
        <CampaignScreen onNavigate={handleNavigate} onStartMission={handleStartMission} />
      )}
      {screen === 'game' && (
        <GameScreenComponent onNavigate={handleNavigate} missionId={currentMission} />
      )}
    </>
  );
};

export default Index;