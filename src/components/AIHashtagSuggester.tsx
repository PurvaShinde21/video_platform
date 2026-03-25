import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { generateHashtags } from '../services/geminiService.ts';

interface AIHashtagSuggesterProps {
  title: string;
  description: string;
  onSelect: (hashtags: string) => void;
}

const AIHashtagSuggester: React.FC<AIHashtagSuggesterProps> = ({ title, description, onSelect }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!title) return alert('Please enter a title first');
    setLoading(true);
    try {
      const tags = await generateHashtags(title, description);
      setSuggestions(tags);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    onSelect(suggestions.join(', '));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-semibold text-gray-400">Hashtags</label>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading}
          className="text-xs text-[#FE2C55] flex items-center gap-1 hover:underline disabled:opacity-50"
        >
          <Sparkles size={12} /> {loading ? 'Generating...' : 'AI Suggest Hashtags'}
        </button>
      </div>
      
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {suggestions.map((tag, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onSelect(tag)}
              className="text-xs bg-[#2F2F2F] px-2 py-1 rounded-full text-gray-300 hover:bg-[#FE2C55] hover:text-white transition-colors"
            >
              #{tag}
            </button>
          ))}
          <button
            type="button"
            onClick={handleSelectAll}
            className="text-xs text-gray-500 hover:text-white underline"
          >
            Select All
          </button>
        </div>
      )}

      <input
        type="text"
        placeholder="e.g. dance, funny, tech"
        className="bg-[#2F2F2F] p-3 rounded-md outline-none focus:ring-1 focus:ring-[#FE2C55]"
        onChange={(e) => onSelect(e.target.value)}
      />
    </div>
  );
};

export default AIHashtagSuggester;
