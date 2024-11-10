
import { mongoose } from "mongoose";
const userSchema = new mongoose.Schema({
    email : {
    type :  String,
    required: true,
    unique : true
},
password:{
    type: String,
},
role:{
    type : String,
    enum:['user','admin'],
    default:'user'
},
name:{
    type:String,
    required : true
    
},
bookedSeats:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seat'
}]
});

const User = mongoose.model('User', userSchema);
export default User; 
