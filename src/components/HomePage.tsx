import { useState, useEffect } from 'react';
import { apartments } from '../data/apartments';

interface HomePageProps {
  onStart: () => void;
}

export function HomePage({ onStart }: HomePageProps) {
  const [price, setPrice] = useState(500000);
  const [animated, setAnimated] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const galleryApartments = apartments.slice(0, 5);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setGalleryIndex(prev => (prev + 1) % galleryApartments.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [galleryApartments.length]);

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-6 overflow-y-auto">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#50256d] mb-2">
          🏠 Медиакоми
        </h1>
        <p className="text-sm text-[#50256d]/70 max-w-xs mx-auto leading-relaxed">
          Симулятор торгов за квартиры в Коми. Угадай стоимость недвижимости по фото и описанию!
        </p>
      </div>

      {/* Фотогалерея */}
      <div className="w-full max-w-sm mb-6 relative rounded-xl overflow-hidden shadow-lg bg-white aspect-[4/3]">
        {galleryApartments.map((apt, idx) => (
          <img
            key={apt.id}
            src={apt.photos[0]}
            alt={apt.description}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
              idx === galleryIndex ? 'opacity-100' : 'opacity-0'
            }`}
            loading={idx === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {galleryApartments.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === galleryIndex ? 'bg-white scale-125' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
        <div className="absolute top-2 left-2 bg-[#50256d]/80 text-white text-xs px-2 py-1 rounded">
          {galleryApartments[galleryIndex].description}
        </div>
      </div>

      {/* Бегунок цены */}
      <div className="w-full max-w-sm mb-6">
        <div className="text-center mb-2">
          <span className="text-xs text-[#50256d]/60 uppercase tracking-wide">Ваша цена</span>
          <div className="text-2xl font-bold text-[#50256d]">
            {price.toLocaleString('ru-RU')} ₽
          </div>
        </div>
        <div className="relative px-2">
          <input
            type="range"
            min={50000}
            max={2000000}
            step={10000}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className={`w-full h-2 rounded-full appearance-none cursor-pointer transition-all duration-500 ${
              animated ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            style={{
              background: `linear-gradient(to right, #50256d ${((price - 50000) / (2000000 - 50000)) * 100}%, #d4c9e0 ${((price - 50000) / (2000000 - 50000)) * 100}%)`
            }}
          />
          <div className="flex justify-between text-xs text-[#50256d]/50 mt-1">
            <span>50 000 ₽</span>
            <span>2 000 000 ₽</span>
          </div>
        </div>
      </div>

      {/* Кнопка запуска */}
      <button
        onClick={onStart}
        className="w-full max-w-sm bg-[#50256d] text-[#f1efea] font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:bg-[#50256d]/90 active:scale-95 transition-all"
      >
        🎮 Запустить игру
      </button>

      <p className="text-xs text-[#50256d]/50 mt-4 text-center">
        10 раундов • Угадай цену квартиры
      </p>
    </div>
  );
}
