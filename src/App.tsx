import { useState, useCallback } from 'react';
import { HomePage } from './components/HomePage';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { getRandomApartments, Apartment } from './data/apartments';

type Screen = 'home' | 'game' | 'result';

interface RoundResult {
  apartment: Apartment;
  userPrice: number;
  score: number;
  diff: number;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [rounds, setRounds] = useState<Apartment[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [results, setResults] = useState<RoundResult[]>([]);

  const startGame = useCallback(() => {
    const selected = getRandomApartments(10);
    setRounds(selected);
    setCurrentRound(0);
    setResults([]);
    setScreen('game');
  }, []);

  const handleRoundComplete = useCallback((apartment: Apartment, userPrice: number) => {
    const diff = userPrice - apartment.price;
    const percentDiff = Math.abs(diff) / apartment.price;

    let score: number;
    if (percentDiff <= 0.05) score = 100;
    else if (percentDiff <= 0.1) score = 80;
    else if (percentDiff <= 0.15) score = 65;
    else if (percentDiff <= 0.2) score = 50;
    else if (percentDiff <= 0.3) score = 35;
    else if (percentDiff <= 0.5) score = 15;
    else score = 0;

    const result: RoundResult = { apartment, userPrice, score, diff };
    setResults(prev => [...prev, result]);
  }, []);

  const handleNextRound = useCallback(() => {
    if (currentRound + 1 >= rounds.length) {
      setScreen('result');
    } else {
      setCurrentRound(prev => prev + 1);
    }
  }, [currentRound, rounds.length]);

  const resetGame = useCallback(() => {
    setScreen('home');
    setRounds([]);
    setCurrentRound(0);
    setResults([]);
  }, []);

  return (
    <div className="min-h-screen bg-[#f1efea] flex flex-col">
      <main className="flex-1 flex flex-col">
        {screen === 'home' && <HomePage onStart={startGame} />}
        {screen === 'game' && rounds.length > 0 && (
          <GameScreen
            apartment={rounds[currentRound]}
            roundNumber={currentRound + 1}
            totalRounds={rounds.length}
            onComplete={handleRoundComplete}
            onNext={handleNextRound}
          />
        )}
        {screen === 'result' && (
          <ResultScreen results={results} onRestart={resetGame} />
        )}
      </main>
      <footer className="bg-[#50256d] text-[#f1efea] py-3 px-4 text-center text-xs shrink-0">
        <div className="flex justify-center gap-4">
          <a href="https://mediakomi.ru" className="hover:underline">mediakomi.ru</a>
          <span>•</span>
          <a href="https://t.me/mediakomi" className="hover:underline">Telegram</a>
          <span>•</span>
          <a href="mailto:info@mediakomi.ru" className="hover:underline">Контакты</a>
        </div>
      </footer>
    </div>
  );
}
