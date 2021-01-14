import { Schema, model, Document } from 'mongoose';

const AddressSchema = new Schema({
    
    street: {
        type: String,
        required: [true, 'La calle es requerida']
    },
    state: {
        type: String,
        required: [true, 'El estado es requerido']
    },
    city: {
        type: String,
        required: [true, 'La ciudad es requerida']
    },
    country: {
        type: String,
        required: [true, 'El país es requerido']
    },
    zip: {
        type: String,
        required: [true, 'El código zip es requerido']
    }

});

interface IAddress extends Document {
    street: string;
    state: string;
    city: string;
    country: string;
    zip: string;
}

export const Address = model<IAddress>( 'Address', AddressSchema ); 