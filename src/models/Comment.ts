import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  videoId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
