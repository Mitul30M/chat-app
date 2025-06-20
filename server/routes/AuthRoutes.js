import express from 'express';
import passport, { generateTokens, verifyRefreshToken } from '../auth/passportConfig.js';
import User from '../models/UserModel.js';
const authRouter = express.Router();
import multer from 'multer';
import cloudinary, { storage } from '../cloudinary/config.js';

const upload = multer({
    storage,
    limits: { fileSize: 1000000 },
});

// Local Authentication
authRouter.post('/signup', async (req, res) => {
    const { firstName, lastName, email, password, profileImg = '' } = req.body;
    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            profileImg,
            profileSetup: false
        });
        await newUser.save();

        // Generate tokens
        const tokens = generateTokens(newUser);

        // Return the user and tokens
        res.cookie("jwt", tokens.accessToken, {
            maxAge: 60 * 60 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "None",
        })

        return res.status(201).json({ user: newUser, tokens });
    } catch (error) {
        res.status(500).json({ message: 'Sign-up failed', error });
    }
});


authRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) return res.status(400).json({ message: 'Login failed', info });
        const tokens = generateTokens(user);
        // Return the user and tokens
        res.cookie("jwt", tokens.accessToken, {
            maxAge: 60 * 60 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "None",
        })
        res.status(200).json({ user, tokens });
    })(req, res, next);
});

// JWT Authentication
authRouter.post('/refresh-token', (req, res) => {
    const { refreshToken } = req.body;
    try {
        const decoded = verifyRefreshToken(refreshToken);
        const user = { _id: decoded.id };
        const tokens = generateTokens(user);
        res.cookie("jwt", tokens.accessToken, {
            maxAge: 60 * 60 * 1000,
            secure: true,
            httpOnly: true,
            sameSite: "None",
        })
        return res.status(200).json({ tokens });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token' });
    }
});

// Google OAuth
authRouter.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));


authRouter.get('/auth/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
    const tokens = generateTokens(req.user);
    res.cookie('accessToken', tokens.accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true });
    res.redirect('/');
});


authRouter.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const tokens = await generateTokens(req.user);
    res.cookie("jwt", tokens.accessToken, {
        maxAge: 60 * 60 * 1000,
        secure: true,
        httpOnly: true,
        sameSite: "None",
    })
    res.status(200).json(req.user);
});


authRouter.patch('/profile', passport.authenticate('jwt', { session: false }), upload.single("profileImg"), async (req, res) => {
    try {
        console.log(req.body, req.file)
        const { id: userId } = req.user;
        const { firstName, lastName, email } = req.body;
        let profileImg;
        if (req.file) {
            const { path: url, filename: fileName } = req.file;
            profileImg = { url, fileName };
        }
        const updatedData = {
            firstName,
            lastName,
            email,
            profileSetup: true,
        };
        // Only update the profileImg if a new image was uploaded
        if (profileImg) {
            updatedData.profileImg = profileImg;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updatedData,
            { runValidators: true, new: true }
        );

        await user.save();

        console.log(user);
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error. Error updating profile' });
    }
});

authRouter.delete('/profile-img', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        console.log(req.body)
        const { id: userId } = req.user;
        await cloudinary.uploader.destroy(req.user.profileImg.fileName);
        const user = await User.findByIdAndUpdate(
            userId,
            {
                profileImg: {
                    url: '',
                    fileName: ''
                }
            },
            { runValidators: true, new: true }
        );
        await user.save();
        console.log(user);
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error. Error updating profile' });
    }
});


authRouter.post('/logout', passport.authenticate('jwt', { session: false }), async (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 1,
        secure: true,
        httpOnly: true,
        sameSite: "None",
    });
    res.status(200).json({ message: 'Logged Out Successfully' });
});


export default authRouter;
