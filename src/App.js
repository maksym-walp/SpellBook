import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Імпорт компонентів та стилів
import SpellList from './components/SpellList';
import SpellDetail from './components/SpellDetail';
import SpellForm from './components/SpellForm';
import Traditions from './components/Traditions';
import './App.css';

// Головний компонент додатку
function App() {
  // Стан для зберігання повного списку заклинань
  const [spells, setSpells] = useState([]);
  // Стан для зберігання відфільтрованого списку заклинань для відображення
  const [filteredSpells, setFilteredSpells] = useState([]);
  // Стан для відстеження стану меню (відкрито/закрито)
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Ефект для завантаження заклинань з сервера при першому рендері
  useEffect(() => {
    fetch('/api/spells')
      .then(res => res.json())
      .then(data => {
        setSpells(data);
        setFilteredSpells(data);
      })
      .catch(err => console.error("Failed to fetch spells:", err));
  }, []);

  // Обробник для застосування фільтрів до списку заклинань
  const handleFilterChange = (filters) => {
    let tempSpells = [...spells];

    // Фільтрація за назвою
    if (filters.name) {
      tempSpells = tempSpells.filter(spell => spell.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    // Фільтрація за рівнем
    if (filters.levels.length > 0) {
      tempSpells = tempSpells.filter(spell => filters.levels.includes(spell.level.toString()));
    }
    // Фільтрація за традицією
    if (filters.traditions.length > 0) {
        tempSpells = tempSpells.filter(spell => 
            spell.traditions.some(tradition => filters.traditions.includes(tradition))
        );
    }
    setFilteredSpells(tempSpells);
  };

  // Обробник для додавання нового заклинання до списку
  const handleSpellAdded = (newSpell) => {
    const updatedSpells = [...spells, newSpell];
    setSpells(updatedSpells);
    setFilteredSpells(updatedSpells); // Оновлюємо відображуваний список
  };

  // Функція для перемикання стану меню
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="App">
        {/* Хедер з назвою та навігацією */}
        <header className="App-header">
          <h1>Spell Book</h1>
          <button className="burger-menu" onClick={toggleMenu}>
            <div />
            <div />
            <div />
          </button>
          {/* Навігація для десктопів залишається тут */}
          <nav className="desktop-nav">
            <Link to="/">Заклинання</Link>
            <Link to="/traditions">Про арканічні традиції</Link>
          </nav>
        </header>

        {/* Мобільне меню винесено окремо */}
        <nav className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={toggleMenu}>Заклинання</Link>
          <Link to="/traditions" onClick={toggleMenu}>Про арканічні традиції</Link>
        </nav>

        {/* Налаштування маршрутизації (роутінгу) */}
        <Routes>
          {/* Головна сторінка зі списком заклинань */}
          <Route path="/" element={
            <main>
              <SpellList 
                spells={filteredSpells} 
                onFilterChange={handleFilterChange}
              />
              <Link to="/add-spell" className="add-spell-button">+</Link>
            </main>
          } />
          {/* Сторінка з детальною інформацією про заклинання */}
          <Route path="/spells/:id" element={<SpellDetail />} />
          {/* Сторінка для додавання нового заклинання */}
          <Route path="/add-spell" element={<SpellForm onSpellAdded={handleSpellAdded} />} />
          {/* Сторінка з описом традицій */}
          <Route path="/traditions" element={<Traditions />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;