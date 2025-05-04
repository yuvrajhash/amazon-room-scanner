'use client';

import { FC, useState } from 'react';

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = [
    'All',
    'Furniture',
    'Electronics',
    'Home & Kitchen',
    'Books',
    'Fashion',
    'Computers',
    'Toys & Games',
    'Beauty',
    'Sports & Outdoors'
  ];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Mock autocomplete functionality
    if (value.length > 0) {
      const mockSuggestions = [
        `${value} furniture`,
        `${value} desk`,
        `${value} chair`,
        `${value} lamp`,
        `${value} bookshelf`
      ];
      setSuggestions(mockSuggestions);
    } else {
      setSuggestions([]);
    }
  };
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        {/* Category Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="h-10 px-2 bg-gray-100 border border-gray-300 rounded-l-md text-xs text-gray-700 font-medium flex items-center justify-between hover:bg-gray-200"
            style={{ minWidth: '120px' }}
          >
            <span className="truncate">{selectedCategory}</span>
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {showCategoryDropdown && (
            <div className="absolute z-20 w-56 mt-1 bg-white border border-gray-300 rounded shadow-lg">
              {categories.map((category, index) => (
                <div 
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Search Input */}
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          className="w-full h-10 px-4 py-2 border-t border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-amazon-orange focus:border-transparent"
          placeholder={`Search in ${selectedCategory.toLowerCase() === 'all' ? 'Amazon' : selectedCategory}...`}
        />
        
        {/* Search Button */}
        <button 
          className="h-10 px-4 py-2 text-black rounded-r border border-gray-300" 
          style={{backgroundColor: '#febd69', borderColor: '#febd69'}}
        >
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </button>
      </div>
      
      {/* Autocomplete suggestions */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg">
          {suggestions.map((suggestion, index) => (
            <div 
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setSearchTerm(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;