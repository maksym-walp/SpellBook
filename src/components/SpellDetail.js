import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import spellConfig from '../config/spellConfig.json';
import './SpellDetail.css';

// Компонент для відображення детальної інформації про заклинання
const SpellDetail = () => {
  // Стан для зберігання даних про заклинання
  const [spell, setSpell] = useState(null);
  // Стан для відстеження вибраного рівня (для заклинань з ефектами вищих рівнів)
  const [selectedLevel, setSelectedLevel] = useState(null);
  // Отримання ID заклинання з URL
  const { id } = useParams();

  // Ефект для завантаження даних про конкретне заклинання з сервера
  useEffect(() => {
    fetch(`/api/spells/${id}`)
      .then(res => res.json())
      .then(data => {
        setSpell(data);
        // Встановлюємо початковий вибраний рівень на базовий рівень заклинання
        setSelectedLevel(data.level);
      })
      .catch(err => console.error("Failed to fetch spell details:", err));
  }, [id]); // Ефект виконується повторно, якщо змінюється id

  // Поки дані завантажуються, показуємо повідомлення
  if (!spell) {
    return <div className="loading">Завантаження...</div>;
  }

  // Функція для форматування тексту тривалості
  const getDurationText = (duration) => {
    if (duration.unit === 'moment') return 'Мить';
    const unit = spellConfig.durationUnits.find(u => u.value === duration.unit);
    if (!unit) return 'Невідомо';
    
    if (!unit.requiresValue) return unit.label;
    if (duration.unit === 'custom') return `${duration.value} ${duration.customUnit}`;
    return `${duration.value} ${unit.label.toLowerCase()}`;
  };

  // Визначаємо всі доступні рівні для заклинання
  const availableLevels = [spell.level];
  if (spell.hasHigherLevels) {
    Object.keys(spell.higherLevels).forEach(level => {
      availableLevels.push(parseInt(level));
    });
  }
  availableLevels.sort((a, b) => a - b); // Сортуємо рівні

  // Функція для отримання опису відповідно до вибраного рівня
  const getCurrentDescription = () => {
    if (selectedLevel === spell.level) {
      return {
        narrative: spell.narrativeDescription,
        mechanical: spell.mechanicalDescription
      };
    }
    return spell.higherLevels[selectedLevel] || {
      narrative: 'Немає опису для цього рівня',
      mechanical: 'Немає опису для цього рівня'
    };
  };

  const description = getCurrentDescription();

  return (
    <div className="spell-detail-container">
      <h1>{spell.name}</h1>

      {/* Мета-інформація про заклинання */}
      <div className="spell-meta">
        <span><strong>Рівень:</strong> {spell.level}</span>
        <span><strong>Арканічні традиції:</strong> {spell.traditions.join(', ')}</span>
      </div>

      {/* Основні властивості заклинання */}
      <div className="spell-properties">
        <p><strong>💠 Кількість дій:</strong> {spell.actions}</p>
        <p><strong>🚶 Відстань:</strong> {spell.range} {spellConfig.range.units}</p>
        <p><strong>⌛ Тривалість:</strong> {getDurationText(spell.duration)}</p>
        <p><strong>Компоненти:</strong> {spell.components.join(', ')}</p>
        <div className="spell-flags">
          <strong>Особливості:</strong>
          {spellConfig.flags.map(flag => (
            spell[flag.name] && (
              <span key={flag.name} className="flag">
                {flag.label}
              </span>
            )
          ))}
          {/* Повідомлення, якщо немає особливостей */}
          {!spellConfig.flags.some(flag => spell[flag.name]) && (
            <span> Без особливостей</span>
          )}
        </div>
      </div>

      {/* Вкладки для вибору рівня, якщо є ефекти вищих рівнів */}
      {availableLevels.length > 1 && (
        <div className="level-tabs">
          {availableLevels.map(level => (
            <button
              key={level}
              className={`level-tab ${selectedLevel === level ? 'active' : ''}`}
              onClick={() => setSelectedLevel(level)}
            >
              {level} рівень
            </button>
          ))}
        </div>
      )}

      {/* Повний опис заклинання */}
      <div className="spell-description-full">
        <div className="description-section">
          <h3>Наративний опис</h3>
          <p>{description.narrative}</p>
        </div>
        
        <div className="description-section">
          <h3>Механічний опис</h3>
          <p>{description.mechanical}</p>
        </div>
      </div>
    </div>
  );
};

export default SpellDetail;