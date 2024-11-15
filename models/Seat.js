import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
    seatNumber: {
        type : String,
    },
    Status: {
        type: String,
        enum:['empty', 'occupied', 'reserved'],
        default:'reserved',
    },
    price:{
        type: Number,
        require: true
    },
    section:  {
         type: String,
         required: true },
    status: {
        type: String,
        enum:['empty', 'occupied', 'reserved'],
        default:'empty',
    },
    bookedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       default: null
    },
     
});
const Seat = mongoose.model('Seat', SeatSchema)
export default Seat;
