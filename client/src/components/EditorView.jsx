import { useState } from 'react'; // Removed React and useEffect

export default function EditorView({ note, onSave, onDelete, onBack }) {
  // Initialize state directly from props (No useEffect needed!)
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || 'General');
  
  // AI States
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [aiActionType, setAiActionType] = useState(''); // 'title', 'summary', 'enhance'

  const handleSave = () => {
    if (!title.trim()) {
      alert('Title is required!');
      return;
    }
    onSave({
      id: note?.id,
      title,
      content,
      category
    });
  };

     // Connect AI actions to our backend Groq endpoints
  const handleAIAction = async (actionType) => {
    if (!content.trim()) {
      alert('Write some content first before using AI tools!');
      return;
    }

    setAiLoading(true);
    setAiActionType(actionType);
    setAiResult('');

    try {
      let endpoint = '';
      let bodyData = {};

      if (actionType === 'title') {
        endpoint = 'http://localhost:5000/api/ai/title';
        bodyData = { content };
      } else if (actionType === 'summary') {
        endpoint = 'http://localhost:5000/api/ai/summarize';
        bodyData = { title, content };
      } else if (actionType === 'enhance') {
        endpoint = 'http://localhost:5000/api/ai/enhance';
        bodyData = { content };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      });

      if (!response.ok) {
        throw new Error('Failed to communicate with AI server');
      }

      const data = await response.json();

      // Set the clean result returned by our Groq backend
      if (actionType === 'title') {
        setAiResult(data.title);
      } else if (actionType === 'summary') {
        setAiResult(data.summary);
      } else if (actionType === 'enhance') {
        setAiResult(data.enhancedText);
      }
    } catch (error) {
      console.error(error);
      setAiResult('Error: Failed to reach AI helper. Make sure your server is running.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyTitle = () => {
    setTitle(aiResult); // Replaces the title with the AI title directly
  };

  const handleApplyContent = () => {
    setContent(aiResult); // Replaces the editor content with the enhanced version directly
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-zinc-900 bg-zinc-900/30 px-6 py-4 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Notes
          </button>
          <span className="text-zinc-650">|</span>
          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">
            {note ? 'Edit Note' : 'New Note'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {note && (
            <button
              onClick={() => onDelete(note.id)}
              className="px-4 py-2 text-sm font-semibold bg-rose-950/40 hover:bg-rose-900/40 text-rose-400 border border-rose-900/50 rounded-xl transition-all"
            >
              Delete
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl shadow-lg hover:shadow-violet-500/10 transition-all"
          >
            Save Note
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Writing Canvas */}
        <section className="lg:col-span-8 bg-zinc-900/40 border border-zinc-900 rounded-2xl p-6 flex flex-col gap-4">
          {/* Category Input */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Category:</span>
            <input
              type="text"
              placeholder="General, Work, Personal..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-zinc-800 border border-zinc-700/50 rounded-lg px-3 py-1 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>

          {/* Title Input */}
          <input
            type="text"
            placeholder="Untitled Note"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-extrabold bg-transparent border-none outline-none focus:ring-0 text-zinc-100 placeholder-zinc-800 w-full"
          />

          <hr className="border-zinc-900" />

          {/* Body Editor */}
          <textarea
            placeholder="Start writing your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 min-h-[400px] bg-transparent border-none outline-none focus:ring-0 text-zinc-300 placeholder-zinc-650 resize-none text-base leading-relaxed w-full"
          />
        </section>

        {/* Right Side: Gemini AI Assistant Panel */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-6 sticky top-24 shadow-xl">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔮</span>
              <h2 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                GROQ AI Helper
              </h2>
            </div>

            <p className="text-zinc-500 text-xs leading-relaxed">
              Use GROQ AI to quickly generate catchy titles, compile summaries, or enhance your writing style.
            </p>

            {/* AI Action Buttons */}
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => handleAIAction('title')}
                disabled={aiLoading}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-violet-500/30 text-zinc-300 hover:text-white rounded-xl text-sm transition-all"
              >
                🪄 Generate Title
              </button>
              <button
                onClick={() => handleAIAction('summary')}
                disabled={aiLoading}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-violet-500/30 text-zinc-300 hover:text-white rounded-xl text-sm transition-all"
              >
                📝 Summarize Note
              </button>
              <button
                onClick={() => handleAIAction('enhance')}
                disabled={aiLoading}
                className="flex items-center justify-center gap-2 py-2.5 px-4 bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 hover:border-violet-500/30 text-zinc-300 hover:text-white rounded-xl text-sm transition-all"
              >
                ✨ Enhance Writing
              </button>
            </div>

            {/* AI Output Area */}
            {(aiLoading || aiResult) && (
              <div className="mt-2 bg-zinc-950/80 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-3 min-h-[120px]">
                {aiLoading ? (
                  <div className="flex flex-col items-center justify-center gap-3 py-6">
                    <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs text-zinc-500">GROQ is thinking...</span>
                  </div>
                ) : (
                  <>
                    <pre className="text-xs text-zinc-300 font-sans whitespace-pre-wrap leading-relaxed">
                      {aiResult}
                    </pre>
                    <div className="flex gap-2 justify-end mt-2">
                      {aiActionType === 'title' && (
                        <button
                          onClick={handleApplyTitle}
                          className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold"
                        >
                          Apply Title
                        </button>
                      )}
                      {aiActionType === 'enhance' && (
                        <button
                          onClick={handleApplyContent}
                          className="px-3 py-1 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold"
                        >
                          Replace Body
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(aiResult);
                          alert('Copied to clipboard!');
                        }}
                        className="px-3 py-1 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-lg text-xs font-semibold"
                      >
                        Copy
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}