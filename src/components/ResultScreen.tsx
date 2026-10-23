import { Apartment } from '../data/apartments';

interface RoundResult {
  apartment: Apartment;
  userPrice: number;
  score: number;
  diff: number;
}

interface ResultScreenProps {
  results: RoundResult[];
  onRestart: () => void;
}

export function ResultScreen({ results, onRestart }: ResultScreenProps) {
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const maxScore = results.length * 100;
  const avgAccuracy = results.reduce((sum, r) => {
    const pct = Math.abs(r.diff) / r.apartment.price * 100;
    return sum + Math.max(0, 100 - pct);
  }, 0) / results.length;

  const totalOverpay = results.reduce((sum, r) => {
    return sum + Math.max(0, r.diff);
  }, 0);

  const totalUnderpay = results.reduce((sum, r) => {
    return sum + Math.max(0, -r.diff);
  }, 0);

  const getRank = () => {
    const percentage = (totalScore / maxScore) * 100;
    if (percentage >= 90) return { emoji: '🎯', title: 'Точный оценщик', desc: 'Вы прекрасно чувствуете рынок недвижимости!' };
    if (percentage >= 70) return { emoji: '📈', title: 'Опытный инвестор', desc: 'Отличное чутьё на цены, вы близки к эксперту.' };
    if (percentage >= 50) return { emoji: '🏠', title: 'Разумный покупатель', desc: 'Вы неплохо ориентируетесь в ценах.' };
    if (percentage >= 30) return { emoji: '💰', title: 'Щедрый инвестор', desc: 'Вы склонны переплачивать — будьте осторожнее!' };
    return { emoji: '🪙', title: 'Скряга', desc: 'Вы сильно занижаете цены — рынок суровее, чем кажется.' };
  };

  const rank = getRank();

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-6 overflow-y-auto">
      {/* Результат */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-2">{rank.emoji}</div>
        <h1 className="text-2xl font-bold text-[#50256d] mb-1">{rank.title}</h1>
        <p className="text-sm text-[#50256d]/70 max-w-xs mx-auto">{rank.desc}</p>
      </div>

      {/* Статистика */}
      <div className="w-full max-w-sm bg-white rounded-xl p-4 shadow-sm border border-[#50256d]/10 mb-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="text-center">
            <p className="text-xs text-[#50256d]/60">Баллы</p>
            <p className="text-xl font-bold text-[#50256d]">{totalScore}/{maxScore}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-[#50256d]/60">Средняя точность</p>
            <p className="text-xl font-bold text-[#50256d]">{avgAccuracy.toFixed(0)}%</p>
          </div>
        </div>

        {/* Переплата/недоплата */}
        {totalOverpay > 0 && (
          <div className="bg-red-50 rounded-lg p-3 mb-2 text-center">
            <p className="text-xs text-red-600/70 mb-1">Потенциальная переплата</p>
            <p className="text-lg font-bold text-red-600">
              +{totalOverpay.toLocaleString('ru-RU')} ₽
            </p>
            <p className="text-xs text-red-600/60 mt-1">
              «Я переплачиваю за недвижимость вот столько…»
            </p>
          </div>
        )}
        {totalUnderpay > 0 && (
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <p className="text-xs text-green-600/70 mb-1">Потенциальная экономия</p>
            <p className="text-lg font-bold text-green-600">
              −{totalUnderpay.toLocaleString('ru-RU')} ₽
            </p>
            <p className="text-xs text-green-600/60 mt-1">
              Вы торгуетесь как профессионал!
            </p>
          </div>
        )}
      </div>

      {/* Детализация по раундам */}
      <div className="w-full max-w-sm mb-4">
        <h3 className="text-sm font-semibold text-[#50256d] mb-2">Раунды:</h3>
        <div className="space-y-2">
          {results.map((r, idx) => {
            const pct = Math.abs(r.diff) / r.apartment.price * 100;
            return (
              <div key={idx} className="bg-white rounded-lg p-3 shadow-sm border border-[#50256d]/5">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-medium text-[#50256d]">
                    #{idx + 1} {r.apartment.description}
                  </span>
                  <span className={`text-xs font-bold ${pct <= 10 ? 'text-green-600' : pct <= 25 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {r.score}pts
                  </span>
                </div>
                <div className="flex justify-between text-xs text-[#50256d]/60">
                  <span>Вы: {r.userPrice.toLocaleString('ru-RU')} ₽</span>
                  <span>Цена: {r.apartment.price.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="mt-1 text-xs text-[#50256d]/50">
                  {r.diff > 0 ? `+${r.diff.toLocaleString('ru-RU')}` : r.diff < 0 ? `${r.diff.toLocaleString('ru-RU')}` : '±0'} ₽
                  <span className="ml-1">({pct.toFixed(1)}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Кнопка рестарта */}
      <button
        onClick={onRestart}
        className="w-full max-w-sm bg-[#50256d] text-[#f1efea] font-semibold py-4 px-8 rounded-xl text-lg shadow-lg hover:bg-[#50256d]/90 active:scale-95 transition-all"
      >
        🔄 Играть снова
      </button>
    </div>
  );
}
