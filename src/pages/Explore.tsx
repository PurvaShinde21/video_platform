import React, { useEffect, useState } from 'react';
import { Search, TrendingUp } from 'lucide-react';
import api from '../lib/api.ts';
import VideoCard from '../components/VideoCard.tsx';

const Explore: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingTags, setTrendingTags] = useState<string[]>(['dance', 'funny', 'tech', 'music', 'food']);

  useEffect(() => {
    const fetchExplore = async () => {
      try {
        const res = await api.get('/videos');
        if (Array.isArray(res.data)) {
          setVideos(res.data);
        } else {
          console.error('Expected array of videos, got:', res.data);
          setVideos([]);
        }
      } catch (err) {
        console.error(err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchExplore();
  }, []);

  const filteredVideos = Array.isArray(videos) ? videos.filter(v => 
    v.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.hashtags?.some((h: string) => h.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  return (
    <div className="min-h-screen bg-black p-4">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search videos or hashtags"
          className="w-full bg-[#2F2F2F] p-3 pl-10 rounded-full outline-none focus:ring-1 focus:ring-[#FE2C55]"
        />
      </div>

      {/* Trending Tags */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-[#FE2C55]" />
          <h2 className="font-bold text-lg">Trending</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {trendingTags.map((tag, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(tag)}
              className="bg-[#121212] border border-gray-800 px-4 py-2 rounded-full text-sm whitespace-nowrap hover:bg-gray-800 transition-colors"
            >
              # {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-2">
        {loading ? (
          <p className="col-span-2 text-center text-gray-500">Loading explore...</p>
        ) : filteredVideos.length === 0 ? (
          <p className="col-span-2 text-center text-gray-500">No results found</p>
        ) : (
          filteredVideos.map((video) => (
            <div key={video._id} className="aspect-[3/4] bg-gray-900 rounded-lg overflow-hidden relative group cursor-pointer">
              <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-xs font-bold px-2 text-center">{video.title}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Explore;
