import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { Video } from '../models/Video.ts';
import { Comment } from '../models/Comment.ts';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Cloudinary Config
if (!process.env.CLOUDINARY_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('CRITICAL: Cloudinary credentials missing from environment variables.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tiktok-replica',
    resource_type: 'video',
    allowed_formats: ['mp4', 'mov', 'avi'],
  } as any,
});

const upload = multer({ storage: storage });

// Get all videos (Feed)
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().populate('userId', 'username avatar').sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    console.error('Get Videos Error:', err);
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : String(err) });
  }
});

// Upload Video
router.post('/upload', authMiddleware, upload.single('video'), async (req: AuthRequest, res) => {
  try {
    const { title, description, hashtags } = req.body;
    const videoUrl = req.file?.path;

    if (!videoUrl) {
      return res.status(400).json({ message: 'Video upload failed' });
    }

    // Generate thumbnail (Cloudinary can do this automatically with transformations)
    const thumbnailUrl = videoUrl.replace(/\.[^/.]+$/, '.jpg');

    const video = new Video({
      userId: req.user?.id,
      title,
      description,
      videoUrl,
      thumbnailUrl,
      hashtags: hashtags ? hashtags.split(',').map((h: string) => h.trim()) : [],
    });

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Like/Unlike Video
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    const userId = req.user?.id as any;
    const index = video.likes.indexOf(userId);

    if (index === -1) {
      video.likes.push(userId);
    } else {
      video.likes.splice(index, 1);
    }

    await video.save();
    res.json({ likes: video.likes.length, isLiked: index === -1 });
  } catch (err) {
    console.error('Like Video Error:', err);
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : String(err) });
  }
});

// Get Comments
router.get('/:id/comments', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }
    const comments = await Comment.find({ videoId: req.params.id }).populate('userId', 'username avatar').sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error('Get Comments Error:', err);
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : String(err) });
  }
});

// Add Comment
router.post('/:id/comments', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid video ID' });
    }
    const { text } = req.body;
    const comment = new Comment({
      videoId: req.params.id,
      userId: req.user?.id,
      text,
    });
    await comment.save();
    const populatedComment = await comment.populate('userId', 'username avatar');
    res.json(populatedComment);
  } catch (err) {
    console.error('Add Comment Error:', err);
    res.status(500).json({ message: 'Server error', error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;
