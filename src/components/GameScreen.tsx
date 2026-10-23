import { useState, useEffect, useRef } from 'react';
import { Apartment } from '../data/apartments';

interface GameScreenProps {
  apartment: Apartment;
  roundNumber: number;
  totalRounds: number;
  onComplete: (apartment: Apartment, userPrice: number) => void;
  onNext: () => void;
}

export function GameScreen({ apartment, roundNumber, totalRounds, onComplete, onNext }: GameScreenProps) {
  const [userPrice, setUserPrice] = useState(300000);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sliderAnimated, setSliderAnimated] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUserPrice(300000);
    setPhotoIndex(0);
    setRevealed(false);
    setSliderAnimated(false);
    const timer = setTimeout(() => setSliderAnimated(true), 200);
    return () => clearTimeout(timer);
  }, [apartment.id]);

  const handleGuess = () => {
    setRevealed(true);
    onComplete(apartment, userPrice);
  };

  const diff = userPrice - apartment.price;
  const percentDiff = Math.abs(diff) / apartment.price * 100;

  const getDiffText = () => {
    if (diff > 0) return `Вы завысили на ${Math.abs(diff).toLocaleString('ru-RU')} ₽`;
    if (diff < 0) return `Вы занизили на ${Math.abs(diff).toLocaleString('ru-RU')} ₽`;
    return 'Точно в цель! 🎯';
  };

  const getScoreColor = () => {
    if (percentDiff <= 5) return 'text-green-600';
    if (percentDiff <= 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const progress = (roundNumber / totalRounds) * 100;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Прогресс-бар */}
      <div className="w-full bg-[#50256d]/10 h-1.5 shrink-0">
        <div
          className="h-full bg-[#50256d] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Номер раунда */}
      <div className="px-4 py-2 flex justify-between items-center shrink-0">
        <span className="text-xs font-medium text-[#50256d]/60">
          Раунд {roundNumber} из {totalRounds}
        </span>
        <span className="text-xs text-[#50256d]/60 truncate ml-2">
          📍 {apartment.address}
        </span>
      </div>

      {/* Контент карточки */}
      <div className="flex-1 flex flex-col px-4 overflow-y-auto pb-2">
        {/* Фото */}
        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 relative mb-3 shadow-md shrink-0">
          {apartment.photos.length > 0 ? (
            <>
              <img
                src={apartment.photos[photoIndex]}
                alt={apartment.description}
                className="w-full h-full object-cover"
                loading="eager"
              />
              {apartment.photos.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {apartment.photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setPhotoIndex(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        idx === photoIndex ? 'bg-white scale-110 shadow' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gradient-to-br from-[#50256d]/5 to-[#50256d]/10">
              <span>🏠 Фото не доступно</span>
            </div>
          )}
        </div>

        {/* Описание */}
        <div className="mb-3 shrink-0">
          <h2 className="text-base font-semibold text-[#50256d] leading-tight">{apartment.description}</h2>
          <p className="text-sm text-[#50256d]/60 mt-0.5">{apartment.address}</p>
        </div>

        {/* Бегунок */}
        {!revealed && (
          <div className="mb-4 shrink-0">
            <div className="text-center mb-2">
              <span className="text-xs text-[#50256d]/50 uppercase tracking-wider">Ваша оценка</span>
              <div className="text-2xl font-bold text-[#50256d] mt-0.5">
                {userPrice.toLocaleString('ru-RU')} ₽
              </div>
            </div>
            <div className="relative px-1">
              <input
                ref={sliderRef}
                type="range"
                min={50000}
                max={2000000}
                step={10000}
                value={userPrice}
                onChange={(e) => setUserPrice(Number(e.target.value))}
                className={`w-full h-3 rounded-full appearance-none cursor-pointer transition-all duration-500 ${
                  sliderAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{
                  background: `linear-gradient(to right, #50256d ${((userPrice - 50000) / (2000000 - 50000)) * 100}%, #d4c9e0 ${((userPrice - 50000) / (2000000 - 50000)) * 100}%)`
                }}
              />
              <div className="flex justify-between text-xs text-[#50256d]/40 mt-1">
                <span>50 тыс.</span>
                <span>2 млн ₽</span>
              </div>
            </div>
          </div>
        )}

        {/* Результат раунда */}
        {revealed && (
          <div className="mb-3 bg-white rounded-xl p-4 shadow-sm border border-[#50256d]/10 animate-fade-in shrink-0">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-xs text-[#50256d]/50">Правильная цена</p>
                <p className="text-xl font-bold text-[#50256d]">
                  {apartment.price.toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#50256d]/50">Ваша цена</p>
                <p className="text-lg font-medium text-[#50256d]/70">
                  {userPrice.toLocaleString('ru-RU')} ₽
                </p>
              </div>
            </div>
            <div className={`text-center text-sm font-medium ${getScoreColor()} bg-gray-50 rounded-lg py-2`}>
              {getDiffText()} ({percentDiff.toFixed(1)}%)
            </div>
          </div>
        )}

        {/* Кнопка */}
        {!revealed ? (
          <button
            onClick={handleGuess}
            className="w-full bg-[#50256d] text-[#f1efea] font-semibold py-3.5 px-6 rounded-xl text-base shadow-md hover:bg-[#50256d]/90 active:scale-[0.97] transition-all shrink-0"
          >
            Оценить
          </button>
        ) : (
          <button
            onClick={onNext}
            className="w-full bg-[#50256d] text-[#f1efea] font-semibold py-3.5 px-6 rounded-xl text-base shadow-md hover:bg-[#50256d]/90 active:scale-[0.97] transition-all shrink-0 animate-fade-in"
          >
            {roundNumber < totalRounds ? 'Далее →' : 'Показать результат 🏆'}
          </button>
        )}
      </div>
    </div>
  );
}
