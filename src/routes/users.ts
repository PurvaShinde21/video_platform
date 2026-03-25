import express from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.ts';
import { Video } from '../models/Video.ts';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';

const router = express.Router();

// Get User Profile
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const videos = await Video.find({ userId: req.params.id }).sort({ createdAt: -1 });
    res.json({ user, videos });
  } catch (err) {
    console.error('Get User Profile Error:', err);
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : String(err) });
  }
});

// Follow/Unfollow User
router.post('/:id/follow', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user?.id);

    if (!userToFollow || !currentUser) return res.status(404).json({ message: 'User not found' });

    const index = currentUser.following.indexOf(userToFollow._id as any);
    if (index === -1) {
      currentUser.following.push(userToFollow._id as any);
      userToFollow.followers.push(currentUser._id as any);
    } else {
      currentUser.following.splice(index, 1);
      const followerIndex = userToFollow.followers.indexOf(currentUser._id as any);
      userToFollow.followers.splice(followerIndex, 1);
    }

    await currentUser.save();
    await userToFollow.save();

    res.json({ following: currentUser.following.length, followers: userToFollow.followers.length, isFollowing: index === -1 });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Edit Profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { username, bio, avatar } = req.body;
    const user = await User.findById(req.user?.id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (username) user.username = username;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
