import bcrypt from "bcryptjs"
import cors from "cors"; 
import express from "express"; 
import mongoose from "mongoose"; 
//import bodyParser from "body-parser"; 
import authRoutes from "./routes/auth.js"; 
import User from "./models/User.js";
import seatRoutes from "./routes/seat.js";
//import Seat from "./models/Seat.js";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import jwt from "jsonwebtoken";
 

dotenv.config();

const app = express();
const PORT = process.env.PORT||8000;
app.use(cors()); 
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;

const generateTokens = async (user) => {
    const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30d" });
    return { accessToken, refreshToken };
  };
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "https://seat-master-backendproject.vercel.app/auth/google/callback",
        scope:["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile._json.email });
          if (!user) {
            const lastSixDigitsId = profile.id.substring(profile.id.length - 6);
            const lastTwoDigitsId = profile._json.name.substring(profile._json.name.length - 2);
            const newPass = lastTwoDigitsId + lastSixDigitsId;
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashedPassword = await bcrypt.hash(newPass, salt);
  
            user = await User.create({
              name: profile._json.name,
              email: profile._json.email,
              is_verified: true,
              username: profile._json.email.split('@')[0],
              password: hashedPassword,
            });
          }
  
          const { accessToken, refreshToken } = await generateTokens(user);
          return done(null, { user, accessToken, refreshToken });
        } catch (error) {
          console.error("Error during authentication:", error);
          return done(error);
        }
      }
    )
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
  
  app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }));
  
  app.use(express.json({ limit: "16kb" }));
  app.use(express.urlencoded({ extended: true, limit: "16kb" }));
  app.use(express.static("public"));
  app.use(cookieParser());
  
  app.use(session({
      secret: process.env.SESSION_SECRET || 'your_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }
    }));
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  import { googleAuth, googleAuthCallback } from './controllers/user.controller.js';
  import userRouter from './routes/auth.js';
  
  app.get('/', (req, res) => {
    res.send("Server is live");
  });
  
  app.use("/api/v1/users", userRouter);
  
  app.get('/auth/google', googleAuth);
  app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleAuthCallback);

//app.use(bodyParser.json());
//app.use(cors());
//app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URI,)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error',err));

//Routes
app.use('/api/auth',authRoutes);
app.use('/api/seat',seatRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});  