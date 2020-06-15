import mongoose, { Document } from 'mongoose';
import { IUserSchema } from './user';
import { ILessonSchema } from './lesson';

const CommentSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  lessonId: {
    type: String,
    required: true,
    ref: 'Lesson',
  },
});

export interface ICommentSchema extends Document {
  message: string;
  date: string;
  userId: IUserSchema['_id'];
  lessonId: ILessonSchema['_id'];
}

export default mongoose.model<ICommentSchema>('Comment', CommentSchema);
