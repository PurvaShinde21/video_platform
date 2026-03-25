import React, { useEffect, useState } from 'react';
import api from '../lib/api.ts';
import VideoCard from './VideoCard.tsx';

const VideoFeed: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
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
    fetchVideos();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading Feed...</div>;
  if (!Array.isArray(videos) || videos.length === 0) return <div className="h-screen flex items-center justify-center text-white">No videos yet. Be the first to upload!</div>;

  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default VideoFeed;
