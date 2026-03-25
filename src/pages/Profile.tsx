import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, Grid, Heart } from 'lucide-react';
import api from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';

const Profile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/${id}`);
        setProfileData(res.data);
        if (user) {
          setIsFollowing(res.data.user.followers.includes(user.id));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, user]);

  const handleFollow = async () => {
    if (!user) return alert('Please login to follow');
    try {
      const res = await api.post(`/users/${id}/follow`);
      setIsFollowing(res.data.isFollowing);
      setProfileData({
        ...profileData,
        user: {
          ...profileData.user,
          followers: res.data.followers,
          following: res.data.following
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading Profile...</div>;
  if (!profileData) return <div className="min-h-screen flex items-center justify-center text-white">User not found</div>;

  const { user: profileUser, videos } = profileData;

  return (
    <div className="max-w-4xl mx-auto p-4 pt-8">
      {/* Header */}
      <div className="flex items-start gap-6 mb-8">
        <img src={profileUser.avatar} alt={profileUser.username} className="w-24 h-24 rounded-full border border-gray-800" />
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">{profileUser.username}</h1>
            {user?.id === profileUser._id ? (
              <button className="bg-[#2F2F2F] px-4 py-1.5 rounded-md text-sm font-semibold flex items-center gap-2 hover:bg-gray-800 transition-colors">
                Edit Profile <Settings size={16} />
              </button>
            ) : (
              <button
                onClick={handleFollow}
                className={`px-8 py-1.5 rounded-md text-sm font-semibold transition-colors ${
                  isFollowing ? 'bg-[#2F2F2F] hover:bg-gray-800' : 'bg-[#FE2C55] hover:opacity-90'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>

          <div className="flex gap-6 text-sm">
            <div className="flex gap-1">
              <span className="font-bold">{profileUser.following?.length || 0}</span>
              <span className="text-gray-400">Following</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold">{profileUser.followers?.length || 0}</span>
              <span className="text-gray-400">Followers</span>
            </div>
            <div className="flex gap-1">
              <span className="font-bold">
                {Array.isArray(videos) ? videos.reduce((acc: number, v: any) => acc + (v.likes?.length || 0), 0) : 0}
              </span>
              <span className="text-gray-400">Likes</span>
            </div>
          </div>

          <p className="text-sm">{profileUser.bio || 'No bio yet.'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800 mb-4">
        <button className="flex-1 py-3 flex items-center justify-center gap-2 border-b-2 border-white">
          <Grid size={20} /> Videos
        </button>
        <button className="flex-1 py-3 flex items-center justify-center gap-2 text-gray-500">
          <Heart size={20} /> Liked
        </button>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-3 gap-1">
        {Array.isArray(videos) && videos.map((video: any) => (
          <div key={video._id} className="aspect-[3/4] bg-gray-900 relative group cursor-pointer overflow-hidden">
            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-bold">
              <Heart size={14} fill="white" /> {video.likes?.length || 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
