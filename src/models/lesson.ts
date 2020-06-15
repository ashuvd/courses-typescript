import mongoose, { Document, Types } from 'mongoose';
import { ICourseSchema } from './course';

const LessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  video: {
    fieldName: String,
    fileMimeType: String,
    fileSizeInMegabytes: String,
    dir: String,
  },
  files: [
    {
      fieldName: String,
      fileMimeType: String,
      fileSizeInMegabytes: String,
      dir: String,
    },
  ],
  links: [String],
  courseId: {
    type: String,
    required: true,
    ref: 'Course',
  },
});

export type IVideo = {
  fieldName: string,
  fileMimeType: string,
  fileSizeInMegabytes: string,
  dir: string,
}

export interface ILessonSchema extends Document {
  title: string;
  desc: string;
  video: IVideo;
  files: IVideo[],
  links: Types.Array<string>,
  courseId: ICourseSchema['_id']
}

export default mongoose.model<ILessonSchema>('Lesson', LessonSchema);
