import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

interface CommentSectionProps {
  videoId: string;
  onClose: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ videoId, onClose }) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/videos/${videoId}/comments`);
        if (Array.isArray(res.data)) {
          setComments(res.data);
        } else {
          console.error('Expected array of comments, got:', res.data);
          setComments([]);
        }
      } catch (err) {
        console.error(err);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [videoId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const res = await api.post(`/videos/${videoId}/comments`, { text: newComment });
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute bottom-0 left-0 right-0 h-[70vh] bg-[#121212] rounded-t-2xl z-[60] flex flex-col shadow-2xl"
    >
      <div className="p-4 border-b border-gray-800 flex justify-between items-center">
        <h3 className="font-bold text-center flex-1">{Array.isArray(comments) ? comments.length : 0} Comments</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading comments...</p>
        ) : !Array.isArray(comments) || comments.length === 0 ? (
          <p className="text-center text-gray-500">No comments yet. Be the first!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-3">
              <img src={comment.userId?.avatar || 'https://picsum.photos/seed/user/200'} alt={comment.userId?.username || 'User'} className="w-8 h-8 rounded-full" />
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-400">{comment.userId?.username || 'Anonymous'}</span>
                <p className="text-sm">{comment.text}</p>
                <span className="text-[10px] text-gray-500">{comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800 flex gap-2 items-center">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="bg-[#2F2F2F] flex-1 p-3 rounded-full text-sm outline-none focus:ring-1 focus:ring-[#FE2C55]"
        />
        <button type="submit" className="text-[#FE2C55] disabled:opacity-50" disabled={!newComment.trim()}>
          <Send size={24} />
        </button>
      </form>
    </motion.div>
  );
};

export default CommentSection;
