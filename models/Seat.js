import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
    seatNumber: {
        type : String,
    },
    Status: {
        type: String,
        enum:['empty', 'occupird', 'reserved'],
        default:'reserved',
    },
    price:{
        type:Number,
    },
    bookedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }

});
const Seat = mongoose.model('Seat', SeatSchema)