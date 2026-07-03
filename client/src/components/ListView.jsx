import { useState } from 'react';

export default function ListView({ notes, onCreateNote, onSelectNote }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Get all unique categories from notes for the filter pills
  const categories = ['All', ...new Set(notes.map(note => note.category).filter(Boolean))];

  // Filter notes based on search query and category pill selection
  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'All' || 
      note.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-12">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            NOTORY
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Every note tells a story.</p>
        </div>
        <button
          onClick={onCreateNote}
          className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl shadow-lg hover:shadow-violet-500/25 active:scale-95 transition-all duration-200"
        >
          + New Note
        </button>
      </div>

      {/* Search and Filters */}
      <div className="max-w-5xl mx-auto space-y-4 mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search notes by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                selectedCategory === category
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-zinc-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Notes Grid */}
      <div className="max-w-5xl mx-auto">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500">No notes found. Create a new one to begin!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className="group flex flex-col justify-between bg-zinc-900 border border-zinc-800 hover:border-violet-500/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-300 rounded-2xl p-6 cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase rounded-md tracking-wider">
                      {note.category || 'General'}
                    </span>
                    <span className="text-[11px] text-zinc-500">{formatDate(note.createdAt)}</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-100 group-hover:text-violet-400 transition-colors mb-2 line-clamp-1">
                    {note.title}
                  </h3>
                  <p className="text-zinc-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {note.content || <span className="italic text-zinc-600">Empty note</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}