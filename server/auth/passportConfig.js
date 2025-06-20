import passport from 'passport';
import dotenv from "dotenv";
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js'; // Adjust the path as per your structure
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const JWT_REFRESH_SECRET = process.env.REFRESH_TOKEN_KEY;

// Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findUserAndValidate(email, password);
        if (!user) return done(null, false, { message: 'Invalid credentials' });
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// JWT Strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET
}, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (!user) return done(null, false);
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: 'your_google_client_id',
    clientSecret: 'your_google_client_secret',
    callbackURL: '/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ oauthProvider: 'google', oauthId: profile.id });
        if (!user) {
            console.log(profile);
            user = await User.create({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                oauthProvider: 'google',
                oauthId: profile.id,
                profileSetup: true,
                profileImg: profile.photos[0].value
            });
        }
        return done(null, user);
    } catch (error) {
        return done(error, false);
    }
}));

// Generate Access and Refresh Tokens
export const generateTokens = (user) => {
    const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
    // console.log({ accessToken, refreshToken });
    return { accessToken, refreshToken };
};

export const verifyRefreshToken = (refreshToken) => {
    return jwt.verify(refreshToken, JWT_REFRESH_SECRET);
};

// Serialize and Deserialize User
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

export default passport;
