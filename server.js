import cors from "cors"; 
import express from "express"; 
import mongoose from "mongoose"; 
import bodyParser from "body-parser"; 
import authRoutes from "./routes/auth.js"; 
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
 

dotenv.config();

const app = express();
const PORT = process.env.PORT||8000;
app.use(cors()); 


app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI,)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error',err));

//Routes
app.use('/api/auth',authRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});  