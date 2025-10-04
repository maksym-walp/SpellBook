import React from 'react';
import { Link } from 'react-router-dom';
import spellConfig from '../config/spellConfig.json';
import './SpellCard.css';

// Компонент для відображення картки одного заклинання у списку
const SpellCard = ({ spell }) => {

  // Функція для форматування тексту тривалості заклинання
  const getDurationText = (duration) => {
    if (duration.unit === 'moment') return 'Мить';
    const unit = spellConfig.durationUnits.find(u => u.value === duration.unit);
    if (!unit) return 'Невідомо';
    
    // Якщо одиниця не потребує числового значення (наприклад, "До наступного ранку")
    if (!unit.requiresValue) return unit.label;
    // Для кастомних одиниць
    if (duration.unit === 'custom') return `${duration.value} ${duration.customUnit}`;
    // Стандартний випадок
    return `${duration.value} ${unit.label.toLowerCase()}`;
  };

  return (
    // Посилання на детальну сторінку заклинання
    <Link to={`/spells/${spell.id}`} className="spell-card-link">
      <div className="spell-card">
        {/* Назва заклинання */}
        <h3>{spell.name}</h3>

        {/* Мета-інформація: рівень та прапорці */}
        <div className="spell-card-meta">
          <span className="level">Рівень {spell.level}</span>
          <div className="flags">
            {spellConfig.flags.map(flag => (
              spell[flag.name] && (
                <span key={flag.name} className="flag">
                  {flag.label}
                </span>
              )
            ))}
          </div>
        </div>

        {/* Основні характеристики заклинання (не мають окремих стилів в CSS) */}
        <div className="spell-card-details">
          <p><strong>💠 Дії:</strong> {spell.actions}</p>
          <p><strong>🚶 Відстань:</strong> {spell.range} {spellConfig.range.units}</p>
          <p><strong>⌛ Тривалість:</strong> {getDurationText(spell.duration)}</p>
        </div>

        {/* Традиції, до яких належить заклинання */}
        <p className="traditions"><strong>Традиції:</strong> {spell.traditions.join(', ')}</p>

        {/* Короткий опис */}
        <p className="spell-description">{spell.narrativeDescription}</p>

        {/* Індикатор наявності ефектів вищих рівнів */}
        {spell.hasHigherLevels && (
          <div className="higher-levels-indicator">
            ✨ Має ефекти вищих рівнів
          </div>
        )}
      </div>
    </Link>
  );
};

export default SpellCard;