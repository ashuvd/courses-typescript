import mongoose, {Document} from 'mongoose';
import {IUserSchema} from "./user";

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  img: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true,
    ref: 'User'
  }
});

export interface ICourseSchema extends Document {
  title: string;
  price: number;
  img: string;
  userId: IUserSchema['_id']
}

export default mongoose.model<ICourseSchema>('Course', CourseSchema);
