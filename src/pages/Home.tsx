import React, { useEffect, useState } from 'react';
import VideoFeed from '../components/VideoFeed.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../lib/api.ts';
import VideoCard from '../components/VideoCard.tsx';
import { getRecommendations } from '../services/geminiService.ts';

const Home: React.FC = () => {
  const { user } = useAuth();
  const [recommendedVideos, setRecommendedVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // Fetch available videos from the backend
        const res = await api.get('/videos');
        const videos = Array.isArray(res.data) ? res.data : [];
        
        if (videos.length === 0) {
          setRecommendedVideos([]);
          return;
        }

        // Use Gemini on the frontend to get recommendations
        const recommendedIds = await getRecommendations(
          'dance, funny, tech', // In a real app, use user.interests
          '[]', // In a real app, use user.watchHistory
          videos
        );

        if (Array.isArray(recommendedIds)) {
          const filtered = videos.filter(v => recommendedIds.includes(v._id));
          // Sort by the order returned by Gemini
          const sorted = filtered.sort((a, b) => 
            recommendedIds.indexOf(a._id) - recommendedIds.indexOf(b._id)
          );
          setRecommendedVideos(sorted);
        } else {
          setRecommendedVideos([]);
        }
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setRecommendedVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (user && recommendedVideos.length > 0) {
    return (
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {recommendedVideos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-black">
      <VideoFeed />
    </div>
  );
};

export default Home;
