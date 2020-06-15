import mongoose, {Types, Document, Model} from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  access: [String],
});

export interface IUserSchema extends Document {
  login: string;
  password: string;
  access: Types.Array<string>;
  validatePassword(password: string): boolean;
}
export interface IUserModel extends Model<IUserSchema> {}

UserSchema.pre<IUserSchema>('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.validatePassword = async function validatePassword(password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUserSchema>('User', UserSchema);
