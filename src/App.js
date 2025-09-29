import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import SpellList from './components/SpellList';
import SpellDetail from './components/SpellDetail';
import SpellForm from './components/SpellForm';
import './App.css';

function App() {
  const [spells, setSpells] = useState([]);
  const [filteredSpells, setFilteredSpells] = useState([]);

  useEffect(() => {
    fetch('/api/spells')
      .then(res => res.json())
      .then(data => {
        setSpells(data);
        setFilteredSpells(data);
      })
      .catch(err => console.error("Failed to fetch spells:", err));
  }, []);

  const handleFilterChange = (filters) => {
    let tempSpells = [...spells];
    if (filters.name) {
      tempSpells = tempSpells.filter(spell => spell.name.toLowerCase().includes(filters.name.toLowerCase()));
    }
    if (filters.levels.length > 0) {
      tempSpells = tempSpells.filter(spell => filters.levels.includes(spell.level.toString()));
    }
    if (filters.traditions.length > 0) {
        tempSpells = tempSpells.filter(spell => 
            spell.traditions.some(tradition => filters.traditions.includes(tradition))
        );
    }
    setFilteredSpells(tempSpells);
  };

  const handleSpellAdded = (newSpell) => {
    const updatedSpells = [...spells, newSpell];
    setSpells(updatedSpells);
    setFilteredSpells(updatedSpells); // Or re-apply filters
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            <h1>Spell Book</h1>
          </Link>
        </header>
        <Routes>
          <Route path="/" element={
            <main>
              <SpellList 
                spells={filteredSpells} 
                onFilterChange={handleFilterChange}
              />
              <Link to="/add-spell" className="add-spell-button">+</Link>
            </main>
          } />
          <Route path="/spells/:id" element={<SpellDetail />} />
          <Route path="/add-spell" element={<SpellForm onSpellAdded={handleSpellAdded} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
