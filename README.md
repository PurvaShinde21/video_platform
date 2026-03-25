# TikTok Replica

A full-stack TikTok clone with AI-powered features using Google Gemini.

## Features
- **Vertical Feed**: Snap-scrolling video feed with auto-play.
- **AI Recommendations**: Personalized feed based on user interests.
- **AI Hashtag Generator**: Smart hashtag suggestions for your uploads.
- **AI Content Moderation**: Automatic safety check for titles and descriptions.
- **AI Caption Generator**: Catchy captions generated from your video topic.
- **Engagement**: Like, comment, share, and follow features.
- **Profile**: User profiles with video grids and follower counts.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Motion, Lucide React.
- **Backend**: Node.js, Express, MongoDB (Mongoose).
- **Storage**: Cloudinary for video and image hosting.
- **AI**: Google Gemini API.

## Setup Instructions
1. **Clone the repository**.
2. **Install dependencies**: `npm install`.
3. **Configure Environment Variables**:
   Create a `.env` file with the following:
   ```env
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   GEMINI_API_KEY=your_gemini_api_key
   ```
4. **Run the development server**: `npm run dev`.
5. **Build for production**: `npm run build`.

## AI Integration Details
This app uses the `gemini-1.5-flash` model for:
- **Recommendation Engine**: Analyzes user history to rank videos.
- **Hashtag Generator**: Suggests trending tags for new uploads.
- **Caption Generator**: Writes engaging captions for videos.
- **Content Moderation**: Ensures safe and appropriate content.

## Deployment
- **Frontend**: Vercel.
- **Backend**: Render or Cloud Run.
