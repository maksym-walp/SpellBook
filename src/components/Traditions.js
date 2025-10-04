import React from 'react';
import traditions from '../config/traditions.json'; // Імпорт даних з JSON файлу
import './Traditions.css';

// Компонент для відображення сторінки з описом арканічних традицій
const Traditions = () => {
  return (
    <div className="traditions-container">
      <h1>Про арканічні традиції</h1>
      <div className="traditions-grid">
        {/* Ітерація по масиву традицій та відображення кожної в окремій картці */}
        {traditions.map(tradition => (
          <div key={tradition.name} className="tradition-card">
            <h2>{tradition.name}</h2>
            <p>{tradition.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Traditions;