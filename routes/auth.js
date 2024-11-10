import express from "express"; 
import bcrypt from "bcryptjs"; 
import jwt from "jsonwebtoken"; 
import User from '../models/User.js'; 

const router = express.Router();  

//generate token 
const generateAccessToken = (user) => {
    return jwt.sign(
        {id:user._id,},
        process.env.JWT_SECRET,
        {expiresIn: '15m'} 
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {id: user._id},
        process.env.JWT_SECRET,
        {expiresIn: '3d'}
    )
}

// Sign Up
router.post('/signup', async (req, res) => {
    const { email, password, name } = req.body;
    

    if (!email || !password || !name) {
        return res.status(400).json({
            error: 'Email, password and name are required.'
        });
    }
    
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        
        res.status(201).json({
            message: 'User created',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'User creation failed'
        });
    }
});

// Sign In
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
     if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid Details' });
     }

      if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: 'Server error' });
        }

        //generate tokens
       const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
//set access token 
        res.cookie('token', accessToken,{
        httpOnly:true,
         secure: true,
        maxAge:900000
        });

        res.json({
            message:'Signing successful',
            refreshToken: refreshToken,
            accessToken: accessToken,
            user: {
                id: user._id,
                name: user.name,    
                email: user.email,  
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signin failed' });
    }
    });    

    // refresh access token
    router.post('/token', async (req,res) => {
        const { refreshToken} = req.body;

        if(!refreshToken) {
            return res.status(401).json({error: 'Refresh token required'});
        }
        try{
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = await User.findById(decoded.id);

            if(!user) {
                return res.status(403).json({error: 'Invalid refresh token'});
            }

            const newAccessToken = generateAccessToken(user);

            res.cookie('token', newAccessToken,{
                httpOnly:true,
                secure:true,
                maxAge:'3600s'
            });

            res.json({message:'Access token refreshed'});
        }catch(err) {
            console.error(err);
            res.status(403).json({error: 'Invalid or expired refresh token'})
        }
    });


export default router; 