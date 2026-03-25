import { GoogleGenAI, Type } from "@google/genai";

// The API key is managed by the platform and available via import.meta.env.VITE_GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export const getRecommendations = async (userTags: string, watchedVideos: string, availableVideos: any[]) => {
  const prompt = `Based on user interests: ${userTags}, watch history: ${watchedVideos}, 
  recommend video IDs from this list: ${JSON.stringify(availableVideos.map(v => ({ _id: v._id, title: v.title, description: v.description, hashtags: v.hashtags })))}. 
  Return a JSON array of recommended video IDs ranked by relevance.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    const text = response.text?.trim() || '[]';
    const jsonStr = text.startsWith('```') ? text.replace(/^```json\n?/, '').replace(/\n?```$/, '') : text;
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Gemini Recommendation Parse Error:', err);
    return [];
  }
};

export const generateHashtags = async (title: string, description: string) => {
  const prompt = `Generate 10 trending and relevant TikTok-style hashtags for a video 
  titled '${title}' with description '${description}'. 
  Return as a JSON array of strings.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      }
    }
  });

  try {
    const text = response.text?.trim() || '[]';
    const jsonStr = text.startsWith('```') ? text.replace(/^```json\n?/, '').replace(/\n?```$/, '') : text;
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Gemini Hashtags Parse Error:', err);
    return [];
  }
};

export const generateCaption = async (topic: string) => {
  const prompt = `Write a short, catchy TikTok video caption (max 150 chars) 
  for a video about: '${topic}'. Make it engaging with emojis.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
  });

  return response.text;
};

export const moderateContent = async (title: string, description: string) => {
  const prompt = `Review this video title and description for inappropriate content: 
  Title: '${title}', Description: '${description}'. 
  Return JSON: { "safe": true/false, "reason": "string" }`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          safe: { type: Type.BOOLEAN },
          reason: { type: Type.STRING }
        },
        required: ['safe', 'reason']
      }
    }
  });

  try {
    const text = response.text?.trim() || '{"safe":true, "reason":""}';
    const jsonStr = text.startsWith('```') ? text.replace(/^```json\n?/, '').replace(/\n?```$/, '') : text;
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Gemini Moderation Parse Error:', err);
    return { safe: true, reason: 'AI parsing failed' };
  }
};
