import React, { useState } from 'react';
import { X, Upload, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import api from '../lib/api.ts';
import AIHashtagSuggester from './AIHashtagSuggester.tsx';
import { moderateContent, generateCaption } from '../services/geminiService.ts';

interface UploadModalProps {
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [hashtags, setHashtags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isModerating, setIsModerating] = useState(false);
  const [moderationResult, setModerationResult] = useState<{ safe: boolean; reason: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleModerate = async () => {
    if (!title) return alert('Please enter a title first');
    setIsModerating(true);
    try {
      const result = await moderateContent(title, description);
      setModerationResult(result);
      if (!result.safe) {
        alert(`Content Warning: ${result.reason}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsModerating(false);
    }
  };

  const handleGenerateCaption = async () => {
    if (!title) return alert('Please enter a title first');
    try {
      const caption = await generateCaption(title);
      if (caption) setDescription(caption);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return alert('Please select a file and enter a title');
    if (moderationResult && !moderationResult.safe) return alert('Cannot upload unsafe content');

    setIsUploading(true);
    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('hashtags', hashtags);

    try {
      await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Video uploaded successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#121212] w-full max-w-lg rounded-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold">Upload Video</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 flex flex-col items-center justify-center gap-4 hover:border-[#FE2C55] transition-colors cursor-pointer relative">
            <input type="file" accept="video/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <Upload size={48} className="text-gray-500" />
            <p className="text-center text-sm text-gray-400">
              {file ? `Selected: ${file.name}` : 'Drag & drop or click to select video'}
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-400">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#2F2F2F] p-3 rounded-md outline-none focus:ring-1 focus:ring-[#FE2C55]"
              placeholder="Give your video a title"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-400">Description</label>
              <button
                type="button"
                onClick={handleGenerateCaption}
                className="text-xs text-[#FE2C55] flex items-center gap-1 hover:underline"
              >
                <Sparkles size={12} /> AI Generate
              </button>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#2F2F2F] p-3 rounded-md outline-none focus:ring-1 focus:ring-[#FE2C55] h-24 resize-none"
              placeholder="Tell us about your video"
            />
          </div>

          <AIHashtagSuggester title={title} description={description} onSelect={(tags) => setHashtags(tags)} />

          <button
            type="button"
            onClick={handleModerate}
            disabled={isModerating}
            className="text-sm bg-gray-800 p-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
          >
            {isModerating ? 'Checking...' : 'Check Content Safety'}
          </button>

          <button
            type="submit"
            disabled={isUploading || (moderationResult && !moderationResult.safe)}
            className="bg-[#FE2C55] text-white font-bold p-4 rounded-md mt-4 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isUploading ? 'Uploading...' : 'Post Video'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UploadModal;
