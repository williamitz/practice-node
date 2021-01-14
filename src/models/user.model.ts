import { model, Schema , Document} from 'mongoose';

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    birthDate: {
        type: Date,
        required: [true, 'El nombre es requerido']
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        required: [true, 'La dirección es requerida']
    }
});

interface IUser extends Document {
    name: string;
    birthDate: Date;
    address: Schema.Types.ObjectId;
}

export const User = model<IUser>( 'User', UserSchema );