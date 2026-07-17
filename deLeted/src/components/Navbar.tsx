import { useState } from 'react';
import type { FormEvent } from 'react';
import { Search, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">deLeted</Link>
      
      <form className="search-bar" onSubmit={handleSearch}>
        <Search size={20} color="#a0a0a0" />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Search videos, actors, tags..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div style={{ cursor: 'pointer' }}>
        <Menu size={24} color="#ffffff" />
      </div>
    </nav>
  );
}
