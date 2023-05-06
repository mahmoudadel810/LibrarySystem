
import { mongoose ,Schema, model } from "mongoose";


const bookSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true


    },
    title: {
        type: String,
        required: true
    },
    author: String,

    addedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['issued', 'not-issued'],
        default: 'not-issued'
    },

    issuedDate: {
        type: Date,
        default: Date.now,
    },

    returnedDate: {
        type: Date
    }, 
    late: {
        type: Boolean,
        default : false 
    },
    fine: {
        type: Number,
        default : 0
    }, 
    cover_pic: {
        type :String
    },
    Book_Pictures: {
        type: Array
    }

}, {
    timestamps: true 
});

mongoose.set('strictQuery', false);

export const bookModel = model('book', bookSchema);