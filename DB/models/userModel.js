

import { mongoose, Schema, model } from "mongoose";



const userSchema = new Schema({
    name: String,
    email: {
        type: String,
        unique: true,

    },

    phone: String, 

    password: {
        type: String,
        required: true
    },
    isLoggedIn: {
        type: Boolean,
        default: false

    }
    ,
    status: {
        type: String,
        enum: ['Active', 'In-Active'],
        default: 'Active'
    },

    confirmed: {
        type: Boolean,
        default: false
    },
    code: String, 

    registerDate: {
        type: Date
    },
    profilePic: {
        type: String
    }

}, {
    timestamps: false
});
mongoose.set('strictQuery', false);
export const userModel = model('User', userSchema);