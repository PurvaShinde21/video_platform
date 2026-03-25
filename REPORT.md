# Project Report: TikTok Replica with Google AI Studio

## 1. Project Overview
**Project Name:** TikTok Replica (AI-Powered Short Video Platform)  
**Objective:** To build a high-performance, full-stack short-video application featuring a vertical scrolling feed, user interactions, and AI-driven content intelligence using Google AI Studio.

---

## 2. Core Features
- **Vertical Video Feed:** A smooth, full-screen scrolling experience optimized for mobile and desktop.
- **User Authentication:** Secure Sign Up and Login system using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Video Upload System:** Integrated with **Cloudinary** for high-speed video hosting and automatic thumbnail generation.
- **Social Interactions:** Real-time Like system and nested Comment sections for every video.
- **User Profiles:** Personalized profiles showing user-uploaded content and stats.
- **Explore Page:** Search and discover trending videos and hashtags.

---

## 3. AI Integration (Google AI Studio)
The application leverages the `gemini-3-flash-preview` model to power several intelligent features:
- **AI Recommendations:** Analyzes user interests and watch history to rank the most relevant videos in the feed.
- **Smart Hashtag Generation:** Automatically suggests 10 trending hashtags based on the video title and description during upload.
- **Content Moderation:** Real-time AI scanning of titles and descriptions to ensure a safe community environment.
- **Engagement Captions:** AI-generated catchy captions to help users boost their video reach.

---

## 4. Technical Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Lucide Icons, Framer Motion (for smooth TikTok-style animations).
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB Atlas (NoSQL) for scalable data storage.
- **Media Hosting:** Cloudinary (Video API).
- **AI Engine:** Google AI Studio SDK (`@google/genai`).
- **Deployment:** 
  - **Frontend/API:** Vercel (Serverless Architecture).
  - **Database:** MongoDB Atlas.

---

## 5. Deployment & Configuration
The application is optimized for modern cloud environments:
- **Serverless Compatibility:** Implemented a "Connect-on-Request" MongoDB pattern to handle Vercel's ephemeral serverless functions.
- **Environment Security:** 
  - `MONGODB_URI`: Secure connection to the cloud database.
  - `VITE_GEMINI_API_KEY`: Client-side AI access via Vite environment prefixing.
  - `CLOUDINARY_URL`: Secure media management.

---

## 6. Setup Instructions
1. **Clone the Repository.**
2. **Install Dependencies:** `npm install`.
3. **Configure Environment Variables:** Create a `.env` file with your MongoDB, Cloudinary, and Gemini API keys.
4. **Run Locally:** `npm run dev`.
5. **Build for Production:** `npm run build`.

---

## 7. Success Criteria Evaluation
- [x] **Smooth Video Scrolling:** Achieved using CSS Snap Points and optimized React rendering.
- [x] **Working Upload System:** Fully functional Cloudinary integration with progress handling.
- [x] **AI Recommendations:** Gemini-powered ranking engine implemented in `geminiService.ts`.
- [x] **Clean UI:** High-fidelity TikTok-inspired dark mode interface.

---

**WebApplication Link:** [https://video-platform-rust-five.vercel.app/](https://video-platform-rust-five.vercel.app/)
