import mongoose from "mongoose";

const SeatSchema = new mongoose.Schema({
    seatNumber: {
        type : String,
    },
<<<<<<< HEAD
=======
    Status: {
        type: String,
        enum:['empty', 'occupied', 'reserved'],
        default:'reserved',
    },
>>>>>>> ee553fac462682d1435573af417f65d36d472b20
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
<<<<<<< HEAD
export default Seat;
=======
>>>>>>> ee553fac462682d1435573af417f65d36d472b20
