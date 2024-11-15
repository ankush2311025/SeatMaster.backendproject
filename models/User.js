import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    is_verified: {
        type: Boolean
    },
    
});

const User = mongoose.model('User', userSchema);
export default User;

// import { mongoose } from "mongoose";
// const userSchema = new mongoose.Schema({
//     email : {
//     type :  String,
//     required: true,
//     unique : true
// },
// password:{
//     type: String,
// },
// name:{
//     type:String,
//     required : true
    
// },
// is_verified: {
//     type: Boolean
// },
// bookedSeats:{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Seat'
// }
// });

// const User = mongoose.model('User', userSchema);
// export default User; 
