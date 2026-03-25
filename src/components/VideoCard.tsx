import React, { useRef, useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext.tsx';
import api from '../lib/api.ts';
import CommentSection from './CommentSection.tsx';

interface VideoProps {
  video: {
    _id: string;
    videoUrl: string;
    title: string;
    description: string;
    hashtags: string[];
    userId: {
      _id: string;
      username: string;
      avatar: string;
    };
    likes: string[];
  };
}

const VideoCard: React.FC<VideoProps> = ({ video }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (user && Array.isArray(video.likes)) {
      setIsLiked(video.likes.includes(user.id));
    }
  }, [user, video.likes]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return alert('Please login to like');
    try {
      const res = await api.post(`/videos/${video._id}/like`);
      setIsLiked(res.data.isLiked);
      setLikesCount(res.data.likes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/video/${video._id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="relative h-screen w-full snap-start bg-black flex items-center justify-center overflow-hidden">
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="h-full w-full object-cover cursor-pointer"
        loop
        playsInline
        onClick={handleTogglePlay}
      />

      {/* Overlay Info */}
      <div className="absolute bottom-20 left-4 right-16 pointer-events-none">
        <h3 className="font-bold text-lg pointer-events-auto">{video.userId.username}</h3>
        <p className="text-sm mt-1 pointer-events-auto">{video.title}</p>
        <p className="text-sm text-gray-300 pointer-events-auto">{video.description}</p>
        <div className="flex flex-wrap gap-2 mt-2 pointer-events-auto">
          {Array.isArray(video.hashtags) && video.hashtags.map((tag, i) => (
            <span key={i} className="text-[#FE2C55] font-semibold">#{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm pointer-events-auto">
          <Music size={14} />
          <span className="truncate">Original Sound - {video.userId.username}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-1">
          <div className="relative">
            <img src={video.userId.avatar} alt={video.userId.username} className="w-12 h-12 rounded-full border-2 border-white" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FE2C55] rounded-full w-5 h-5 flex items-center justify-center text-white text-xs font-bold">+</div>
          </div>
        </div>

        <button onClick={handleLike} className="flex flex-col items-center gap-1">
          <motion.div whileTap={{ scale: 1.5 }}>
            <Heart size={36} fill={isLiked ? '#FE2C55' : 'none'} color={isLiked ? '#FE2C55' : 'white'} />
          </motion.div>
          <span className="text-xs font-semibold">{likesCount}</span>
        </button>

        <button onClick={() => setShowComments(true)} className="flex flex-col items-center gap-1">
          <MessageCircle size={36} />
          <span className="text-xs font-semibold">Comments</span>
        </button>

        <button onClick={handleShare} className="flex flex-col items-center gap-1">
          <Share2 size={36} />
          <span className="text-xs font-semibold">Share</span>
        </button>
      </div>

      {/* Comment Section Drawer */}
      <AnimatePresence>
        {showComments && (
          <CommentSection videoId={video._id} onClose={() => setShowComments(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoCard;
